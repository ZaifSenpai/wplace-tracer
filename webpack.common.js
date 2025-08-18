const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const browser = env.browser || "chrome";
  const outputDir = "dist/" + browser;

  const getBrowserSpecificObj = (content) => {
    const result = {};

    Object.keys(content).forEach((key) => {
      const value =
        typeof content[key] === "object" && !Array.isArray(content[key])
          ? getBrowserSpecificObj(content[key])
          : content[key];
      const newKey = key.replaceAll(/\+\w+\+/g, "");

      if (key.match(new RegExp(`\\+${browser}\\+`, "")) || key === newKey) {
        result[newKey] = value;
      }
    });

    return result;
  };

  return {
    entry: {
      popup: path.resolve("src/popup/popup.tsx"),
      welcome: path.resolve("src/welcome/welcome.tsx"),
      contentScript: path.resolve("src/content/contentScript.ts"),
      background: path.resolve("src/background/background.ts"),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(jpg|jpeg|png|svg)$/,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext][query]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve("src/static"),
            to: path.resolve(outputDir),
          },
          {
            from: path.resolve("src/content/contentStyle.css"),
            to: path.resolve(outputDir),
          },
          {
            from: path.resolve("src/manifest/manifest.json"),
            to: path.resolve(outputDir),
            transform(data) {
              const content = getBrowserSpecificObj(
                JSON.parse(data.toString())
              );

              return JSON.stringify(content, null, 2);
            },
          },
        ],
      }),
      new NodePolyfillPlugin(),

      new webpack.DefinePlugin({
        "process.env.BROWSER": JSON.stringify(browser),
      }),

      ...getHtmlPlugins(["popup", "welcome"]),
    ],
    output: {
      filename: "[name].js",
      path: path.resolve(outputDir),
    },
    optimization: {
      splitChunks: {
        chunks(chunk) {
          return chunk.name !== "contentScript" && chunk.name !== "background";
        },
      },
    },
  };
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}

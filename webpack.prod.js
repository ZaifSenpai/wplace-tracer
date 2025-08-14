const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    // Use minimizers when minification is enabled
    minimizer: [
      // Use TerserPlugin for JavaScript minification and mangling names
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true, // Remove 'console.*' calls
            drop_debugger: true, // Remove 'debugger' statements
          },
          format: {
            comments: false, // Remove comments
          },
        },
      }),
      // Use CssMinimizerPlugin for CSS minification
      new CssMinimizerPlugin(),
      // Use HtmlMinimizerPlugin for HTML minification
      new HtmlMinimizerPlugin({
        minimizerOptions: { removeComments: false },
      }),
    ],
  },
  plugins: [
    new (require("webpack").DefinePlugin)({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
});

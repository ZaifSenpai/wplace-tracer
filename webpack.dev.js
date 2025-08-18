const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (env) => {
  return merge(common(env), {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
      new (require("webpack").DefinePlugin)({
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
    ],
  });
};

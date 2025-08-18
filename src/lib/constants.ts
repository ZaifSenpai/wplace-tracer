// @ts-ignore: process is not defined. `process.env.NODE_ENV` is replaced by webpack at build time
export const DEBUG_MODE = process.env.NODE_ENV === "development";
export const BROWSER: Browser = (process.env.BROWSER ?? "chrome") as Browser;

export const SupportEmail = "escbutt@gmail.com";
export const GithubRepoUrl = "https://github.com/ZaifSenpai/wplace-tracer";

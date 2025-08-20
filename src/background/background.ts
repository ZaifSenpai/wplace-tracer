import { runtimeApi, tabsApi } from "../lib/chromeApi";

(() => {
  runtimeApi.onInstalled.addListener((details) => {
    if (details.previousVersion !== "1.1.0") {
      tabsApi.create({ url: runtimeApi.getURL("welcome.html") });
    }
  });
})();

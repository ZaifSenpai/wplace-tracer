import { runtimeApi, tabsApi, actionApi, sidePanelApi } from "../lib/chromeApi";
import { BROWSER } from "../lib/constants";

(() => {
  runtimeApi.onInstalled.addListener((details) => {
    if (details.previousVersion !== "1.1.0") {
      tabsApi.create({ url: runtimeApi.getURL("welcome.html") });
    }

    if (BROWSER === "chrome") {
      sidePanelApi.setPanelBehavior({ openPanelOnActionClick: true });
    }
  });

  if (BROWSER === "firefox" && typeof browser !== "undefined") {
    actionApi.onClicked.addListener(() => {
      browser.sidebarAction.toggle();
    });
  }
})();

import * as Constants from "../lib/constants";

((chrome) => {
  const { storage: storageApi, runtime: runtimeApi } = chrome;

  const { local: Storage } = storageApi;

  const manifest = runtimeApi.getManifest();

  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === runtimeApi.OnInstalledReason.INSTALL) {
      // TODO: on First install
    } else if (details.reason === runtimeApi.OnInstalledReason.UPDATE) {
      // TODO: on Update
    }
  });

  storageApi.onChanged.addListener((changes, namespace) => {
    // TODO: Handle storage changes if required
  });

  runtimeApi.onMessage.addListener((message, sender, sendResponse) => {
    if (message.m === Constants.REQUEST_PING) {
      sendResponse({ m: Constants.RESPONSE_PONG });
    }

    // TODO: Handle other messages if required
  });
})(chrome);

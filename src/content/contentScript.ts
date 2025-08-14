import "arrive";
import $ from "jquery";
import * as Constants from "../lib/constants";

// Should not directly import contentStyle.css because it will be injected into the page

// Anonymous function so minifiers can rename local variables for better compression
((context) => {
  const { window, document, chrome } = context;

  const { storage: storageApi, runtime: runtimeApi } = chrome;

  const { local: Storage } = storageApi;

  const manifest = runtimeApi.getManifest();

  $(() => {
    // TODO: Init when document is ready

    Storage.get(["key", "some-key"]).then(({ key, "some-key": someKey }) => {
      console.log("key", key);
      console.log("someKey", someKey);
      // TODO
    });
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

  document.arrive(
    ".css-selector",
    {
      // onceOnly: false,
      // existing: true,
      // fireOnAttributesModification: false,
    },
    (element) => {
      // TODO: Element was added
    }
  );

  document.leave(".css-selector", (element) => {
    // TODO: Element was removed
  });
})(window);

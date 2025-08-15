import "arrive";
import $ from "jquery";
import { storageApi } from "../lib/chromeApi";

const overlayHtml = `
<div id="wplace-ext-overlay"></div>
`;

((context) => {
  const { window, document, chrome } = context;

  $(() => {
    $("body").append(overlayHtml);

    reloadImage();

    setImagePosition();

    storageApi.onChanged.addListener((changes, namespace) => {
      if ("offset" in changes) {
        setImagePosition(changes.offset.newValue ?? null);
      } else {
        reloadImage();
        setImagePosition();
      }
    });
  });

  function reloadImage() {
    console.log("🚀 ~ reloadImage ~ reloadImage:", reloadImage);
    storageApi.local
      .get(["status", "selectedImage", "overlayWidth", "overlayHeight"])
      .then((data) =>
        updateImage({
          show: data.status ?? true,
          width: data.overlayWidth ?? 200,
          height: data.overlayHeight ?? 200,
          data: data.selectedImage ?? null,
        })
      );
  }

  function updateImage(imageInfo: OverlayImageInfo) {
    const $overlay = $("#wplace-ext-overlay");

    if (!imageInfo.data || !imageInfo.show) {
      $overlay.empty();
      return;
    }

    let $img = $overlay.find("img");

    if (!$img.length) {
      $img = $("<img/>");
    }

    $img.attr("src", imageInfo.data);
    $img.css("--width", imageInfo.width + "px");
    $img.css("--height", imageInfo.height + "px");
    $overlay.append($img);
  }

  async function setImagePosition(pos?: { top: number; left: number } | null) {
    if (typeof pos === "undefined") {
      pos = await storageApi.local
        .get(["offset"])
        .then((data) => data.offset ?? null);
    }

    const $img = $("#wplace-ext-overlay > img");

    pos ??= { top: 0, left: 0 };

    $img.css("--img-top", pos.top + "px");
    $img.css("--img-left", pos.left + "px");
  }
})(window);

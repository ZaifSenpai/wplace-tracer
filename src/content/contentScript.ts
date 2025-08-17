import "arrive";
import $ from "jquery";
import { storageApi } from "../lib/chromeApi";

const overlayHtml = `
<div id="wplace-ext-overlay"></div>
`;

const imageReloadKeys = ["status", "selectedImage", "overlayWidth"];

((context) => {
  const { window, document, chrome } = context;

  $(() => {
    $("body").append(overlayHtml);

    reloadImage();

    setImagePosition();

    storageApi.onChanged.addListener((changes, namespace) => {
      if (imageReloadKeys.some((key) => key in changes)) {
        reloadImage();
        setImagePosition();
      }
    });

    $(document).on("keydown", (e) => {
      if (e.key === "Shift") {
        $("#wplace-ext-overlay").addClass("active");
      }
    });

    $(document).on("keyup", (e) => {
      if (e.key === "Shift") {
        $("#wplace-ext-overlay").removeClass("active");
      }
    });
  });

  function reloadImage() {
    storageApi.local.get(imageReloadKeys).then((data) =>
      updateImage({
        show: data.status ?? true,
        width: data.overlayWidth ?? 200,
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
    $overlay.append($img);
    makeDraggable($overlay.find("img"));
  }

  function saveFramePosition(pos: ImagePosition) {
    storageApi.local.set({
      framePosition: {
        top: pos.top,
        left: pos.left,
      },
    });
  }

  async function setImagePosition(pos?: ImagePosition | null) {
    if (typeof pos === "undefined") {
      pos = await storageApi.local
        .get(["framePosition"])
        .then((data) => data.framePosition ?? null);
    }

    const $img = $("#wplace-ext-overlay > img");

    if (pos) {
      $img.css("--img-top", pos.top + "px");
      $img.css("--img-left", pos.left + "px");
      $img.removeClass("centered");
    } else {
      $img.css("--img-top", "");
      $img.css("--img-left", "");
      $img.addClass("centered");
    }
  }

  function makeDraggable($element: JQuery<HTMLElement>) {
    $element.on("mousedown", (event) => {
      const offset = $element.offset();
      const mouseX = event.pageX;
      const mouseY = event.pageY;
      $element.addClass("dragging");

      $(document).on("mousemove", (moveEvent) => {
        const newLeft = offset!.left + moveEvent.pageX - mouseX;
        const newTop = offset!.top + moveEvent.pageY - mouseY;

        setImagePosition({ top: newTop, left: newLeft });
        saveFramePosition({ top: newTop, left: newLeft });
      });

      const stopDragging = () => {
        $(document).off("mousemove");
        $(document).off("mouseup");
        $element.removeClass("dragging");
      };

      $(document).on("mouseup", () => {
        stopDragging();
      });
      $(document).on("mouseleave", () => {
        stopDragging();
      });

      return false; // Prevent text selection
    });
  }
})(window);

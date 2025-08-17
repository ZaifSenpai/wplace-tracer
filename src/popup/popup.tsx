import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import { runtimeApi, storageApi } from "../lib/chromeApi";

const App: React.FC<{}> = () => {
  const [status, setStatus] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [overlayWidth, setOverlayWidth] = useState(200);
  const [overlayHeight, setOverlayHeight] = useState(200);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    storageApi.local.get(
      [
        "status",
        "selectedImage",
        "overlayWidth",
        "overlayHeight",
        "maintainAspectRatio",
      ],
      ({
        status,
        selectedImage,
        overlayWidth,
        overlayHeight,
        maintainAspectRatio,
      }) => {
        setStatus(status ?? true);
        setSelectedImage(selectedImage || null);
        setOverlayWidth(overlayWidth || 200);
        setOverlayHeight(overlayHeight || 200);
        setMaintainAspectRatio(maintainAspectRatio ?? true);
      }
    );
  }, []);

  const imageSelected = useCallback(() => {
    if (!inputRef.current) return;

    const file = inputRef.current.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target!.result as string;
        setSelectedImage(fileData);
        storageApi.local.set({ selectedImage: fileData });
      };
      reader.readAsDataURL(file);
      inputRef.current.value = ""; // Reset the input value
    }
  }, []);

  const updateStatus = useCallback((status: boolean) => {
    setStatus(status);
    storageApi.local.set({ status });
  }, []);

  function updateOverlayWidth(
    newOverlayWidth: number,
    ignoreAspectRatio = false
  ) {
    if (newOverlayWidth === overlayWidth) return;

    const aspectRatio = overlayWidth / overlayHeight;

    setOverlayWidth(newOverlayWidth);
    storageApi.local.set({ overlayWidth: newOverlayWidth });

    if (maintainAspectRatio && !ignoreAspectRatio) {
      updateOverlayHeight(Math.round(newOverlayWidth / aspectRatio), true);
    }
  }

  function updateOverlayHeight(
    newOverlayHeight: number,
    ignoreAspectRatio = false
  ) {
    if (newOverlayHeight === overlayHeight) return;

    const aspectRatio = overlayWidth / overlayHeight;

    setOverlayHeight(newOverlayHeight);
    storageApi.local.set({ overlayHeight: newOverlayHeight });

    if (maintainAspectRatio && !ignoreAspectRatio) {
      updateOverlayWidth(Math.round(aspectRatio * newOverlayHeight), true);
    }
  }

  const toggleMaintainAspectRatio = useCallback(() => {
    setMaintainAspectRatio((v) => {
      storageApi.local.set({ maintainAspectRatio: !v });
      return !v;
    });
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    storageApi.local.get(["offset"], (data) => {
      const offset = data.offset ?? { top: 0, left: 0 };

      offset.top += y;
      offset.left += x;

      storageApi.local.set({ offset });
    });
  }, []);

  const resetPosition = useCallback(() => {
    storageApi.local.remove(["offset"]);
  }, []);

  return (
    <div className="w-full h-full bg-cyan-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50">
      <div className="p-2 flex flex-col items-stretch justify-center gap-3">
        <div className="flex justify-between items-center w-full">
          <p className="text-2xl font-bold">{runtimeApi.getManifest().name}</p>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={status}
              onChange={(e) => updateStatus(e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="w-auto max-w-full h-auto max-h-[200px] object-contain cursor-pointer border-dotted border-transparent border-4 hover:opacity-70 hover:border-red-500"
            onClick={() => inputRef.current?.click()}
          />
        )}

        {!selectedImage && (
          <button
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            Choose Image
          </button>
        )}

        <p className="block text-sm font-medium text-gray-900 dark:text-white">
          Size:
        </p>

        <div className="flex max-w-sm mx-auto w-full justify-stretch gap-2">
          <input
            type="number"
            aria-describedby="helper-text-explanation"
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="400"
            title="Width"
            value={overlayWidth}
            min={10}
            max={2000}
            onChange={(e) => updateOverlayWidth(e.target.valueAsNumber)}
          />
          <button
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm p-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer"
            title="Maintain Aspect Ratio"
            onClick={() => toggleMaintainAspectRatio()}
            tabIndex={-1}
          >
            <img
              src={
                maintainAspectRatio
                  ? "assets/link.png"
                  : "assets/link-broken.png"
              }
              width={30}
              height={30}
            />
          </button>
          <input
            type="number"
            aria-describedby="helper-text-explanation"
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="400"
            title="Height"
            value={overlayHeight}
            min={10}
            max={2000}
            onChange={(e) => updateOverlayHeight(e.target.valueAsNumber)}
          />
        </div>

        <p className="block text-sm font-medium text-gray-900 dark:text-white">
          Position:
        </p>

        <div className="grid gap-2 grid-rows-3 grid-cols-3">
          <span></span>
          <button
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm p-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer justify-items-center"
            title="Move Up"
            onClick={() => updatePosition(0, -10)}
          >
            <img src="assets/arrow.svg" width={20} height={20} />
          </button>
          <span></span>
          <button
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm p-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer justify-items-center"
            title="Move Left"
            onClick={() => updatePosition(-10, 0)}
          >
            <img
              src="assets/arrow.svg"
              width={20}
              height={20}
              className="-rotate-90"
            />
          </button>
          <button
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm p-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer justify-items-center"
            title="Reset position"
            onClick={() => resetPosition()}
          >
            <img
              src="assets/reset.svg"
              width={20}
              height={20}
              className="-rotate-90"
            />
          </button>
          <button
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm p-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer justify-items-center"
            title="Move Right"
            onClick={() => updatePosition(10, 0)}
          >
            <img
              src="assets/arrow.svg"
              width={20}
              height={20}
              className="rotate-90"
            />
          </button>
          <span></span>
          <button
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm p-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer justify-items-center"
            title="Move Down"
            onClick={() => updatePosition(0, 10)}
          >
            <img
              src="assets/arrow.svg"
              width={20}
              height={20}
              className="rotate-180"
            />
          </button>
          <span></span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={imageSelected}
      />
    </div>
  );
};

const container = document.createElement("div");
document.title = "Popup | " + runtimeApi.getManifest().name;
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import { runtimeApi, storageApi } from "../lib/chromeApi";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

const App: React.FC<{}> = () => {
  const [status, setStatus] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [overlayWidth, setOverlayWidth] = useState(200);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    storageApi.local.get(
      ["status", "selectedImage", "overlayWidth", "overlayHeight"],
      ({ status, selectedImage, overlayWidth, overlayHeight }) => {
        setStatus(status ?? true);
        setSelectedImage(selectedImage || null);
        setOverlayWidth(overlayWidth || 200);
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
        storageApi.local.set({
          selectedImage: fileData,
          framePosition: undefined,
        });
      };
      reader.readAsDataURL(file);
      inputRef.current.value = ""; // Reset the input value
    }
  }, []);

  const updateStatus = useCallback((status: boolean) => {
    setStatus(status);
    storageApi.local.set({ status });
  }, []);

  function updateOverlayWidth(newOverlayWidth: number) {
    if (newOverlayWidth === overlayWidth) return;

    setOverlayWidth(newOverlayWidth);
    storageApi.local.set({ overlayWidth: newOverlayWidth });
  }

  return (
    <div className="w-full h-full bg-cyan-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50">
      <div className="p-4 flex flex-col items-stretch justify-center gap-3">
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
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
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
          Tracer Size:
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
            max={20000}
            onChange={(e) => updateOverlayWidth(e.target.valueAsNumber)}
          />
          <p className="m-2 size-[30px] content-center text-center">X</p>
          <span
            aria-describedby="helper-text-explanation"
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-0.5"
            title="Height"
          >
            (auto)
          </span>
        </div>

        <p className="text-sm font-normal">
          <InformationCircleIcon width={18} height={18} className="inline" /> By
          holding 'Shift' to reposition image
        </p>
        <p className="text-sm font-normal">
          <InformationCircleIcon width={18} height={18} className="inline" /> By
          holding 'Shift + Tab' to see image with 100% opacity
        </p>
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

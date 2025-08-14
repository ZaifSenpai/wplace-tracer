import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import { runtimeApi, storageApi } from "../lib/chromeApi";

const App: React.FC<{}> = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    storageApi.local.get(["selectedImage"], ({ selectedImage }) => {
      setSelectedImage(selectedImage || null);
    });
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

  return (
    <div>
      <div className="m-2 flex flex-col items-center justify-center gap-3">
        <p className="text-2xl font-bold">{runtimeApi.getManifest().name}</p>
        {selectedImage && <img src={selectedImage} alt="Selected" />}

        <button
          className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {selectedImage ? "Change Image" : "Choose Image"}
        </button>
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
document.title = "Popup";
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

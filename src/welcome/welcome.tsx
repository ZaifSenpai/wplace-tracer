import { createRoot } from "react-dom/client";
import "./welcome.css";
import { runtimeApi } from "../lib/chromeApi";

const manifest = runtimeApi.getManifest();

const App: React.FC<{}> = () => {
  return (
    <div className="w-full h-full bg-cyan-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 flex flex-col items-center p-4">
      <p className="flex gap-2 items-baseline">
        <span className="text-2xl">Welcome to {manifest.name}</span>
        <span>v{manifest.version}</span>
      </p>
    </div>
  );
};

const container = document.createElement("div");
document.title = "Welcome | " + manifest.name;
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

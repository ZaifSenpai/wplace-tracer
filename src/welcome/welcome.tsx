import { createRoot } from "react-dom/client";
import "./welcome.css";
import { runtimeApi, tabsApi } from "../lib/chromeApi";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import BtnIcon from "../components/btn-icon";
import { GithubRepoUrl, SupportEmail } from "../lib/constants";

const manifest = runtimeApi.getManifest();

const App: React.FC<{}> = () => {
  return (
    <div className="w-full h-full bg-cyan-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 flex flex-col items-center p-18">
      <div className="absolute top-0 right-0 invert-100 dark:invert-0">
        <a href={GithubRepoUrl} target="_blank">
          <img src="assets/github-corner-right.svg" className="size-24" />
        </a>
      </div>
      <div className="flex flex-col gap-8">
        <p className="flex gap-2 items-baseline">
          <span className="text-3xl">
            Thank you for installing {manifest.name}
          </span>
          <span>v{manifest.version}</span>
        </p>

        <div>
          <ul className="list-disc text-lg">
            <li>Please reload wplace.live</li>
            <li>Select image from side panel</li>
            <li>
              Hold 'Shift' while on wplace.live and drag image to reposition
            </li>
            <li>Resize overlay image from sidepanel</li>
            <li>
              For queries, email me at{" "}
              <a
                href={`mailto:${SupportEmail}`}
                className="text-blue-300 underline hover:text-blue-800"
              >
                {SupportEmail}
              </a>
              <BtnIcon
                title="Copy email address"
                className="text-white"
                onClick={() => {
                  navigator.clipboard.writeText(SupportEmail);
                  toast.success("Email address copied to clipboard!");
                }}
              >
                <DocumentDuplicateIcon />
              </BtnIcon>
            </li>
            <li>
              You can report issues on GitHub repository
              <BtnIcon
                title="Open in new tab"
                className="text-white"
                onClick={() => {
                  tabsApi.create({ url: GithubRepoUrl + "/issues" });
                }}
              >
                <ArrowTopRightOnSquareIcon />
              </BtnIcon>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl mb-2">Demo</p>

          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/hyqb2DRc5kY"
            title=""
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="border-0"
          ></iframe>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

const container = document.createElement("div");
document.title = "Welcome | " + manifest.name;
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

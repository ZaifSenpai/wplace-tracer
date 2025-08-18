declare type Browser = "chrome" | "firefox";

declare interface OverlayImageInfo {
  show: boolean;
  width: number;
  data: string | null;
}

declare interface ImagePosition {
  top: number;
  left: number;
}

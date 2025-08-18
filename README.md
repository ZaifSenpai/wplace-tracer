
# Wplace Tracer

Available on webstore:

[![Wplace Tracer](https://img.shields.io/badge/Wplace%20Tracer-8A2BE2?logo=googlechrome&logoColor=ffffff)](https://chromewebstore.google.com/detail/efkjkoigpkglbkknnfcbdmfipbcdopao)

## Demo

[![Demo | Wplace Tracer](https://markdown-videos-api.jorgenkh.no/url?url=https%3A%2F%2Fyoutu.be%2Fhyqb2DRc5kY)](https://youtu.be/hyqb2DRc5kY)

# Development Guide

## Building

1. `git clone https://github.com/ZaifSenpai/wplace-tracer.git`
2. `cd wplace-tracer`
3. `npm i` to install dependancies
4. Run a build command:
   * `npm run start-chrome` - Build for Google Chrome in Dev mode (Watch changes)
   * `npm run start-firefox` - Build for Mozilla Firefox in Dev mode (Watch changes)
   * `npm run dev-chrome` - Build for Google Chrome in Dev mode
   * `npm run dev-firefox` - Build for Mozilla Firefox in Dev mode
   * `npm run dev-all` - Build for both browsers in Dev mode
   * `npm run build-chrome` - Build for Google Chrome in Prod mode
   * `npm run build-firefox` - Build for Mozilla Firefox in Prod mode
   * `npm run build-all` - Build for both browsers in Prod mode

## Loading into the browser

### Google Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle on `Developer mode` in the top right corner
3. Click `Load unpacked`
4. Select the entire `dist/chrome` folder

### Mozilla Firefox

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Expand the `Temporary Extensions` section
3. Click `Load Temporary Add-on...` button
4. Select the `dist/firefox/manifest.json` file

## Production Build

`npm run build-all` to generate a minimized production builds for chrome and firefox in the `dist` folder

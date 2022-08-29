# MV3 Iframe

This repository showcases different methods of (not) loading external code to a MV3 Chrome extension.

It creates an iframe and loads it into Gmail page with two-way binding on the search bar:

https://user-images.githubusercontent.com/11169832/177357273-0b25cc3e-bf1c-40e0-add6-9e8ed4a54eb0.mp4

Check [./gmail](./src/gmail.js) for more info.

## Get started

This project kickstarts a server on `http://localhost:8080` to serve as an external domain:

> npm start

You also need to run the build at least one time:

> npm run build

Then, you can "Load unpacked" the root folder as a Chrome Extension.

To test the MV2, rename the `manifest-v2.json` to `manifest.json`.

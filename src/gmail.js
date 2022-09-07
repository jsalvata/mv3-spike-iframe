class Channel {
  constructor(frame, origin) {
    this.frame = frame;
    this.origin = origin;

    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== this.origin) {
          return;
        }

        if (
          typeof event.data !== "object" &&
          typeof event.data.method !== "string"
        ) {
          // throw new Error("Malformed message from outside script");
          return;
        }

        if (this.listener) {
          this.listener(event.data.method, event.data.payload, event);
        }
      },
      false
    );
  }

  on(listener) {
    this.listener = listener;
  }

  send(method, payload) {
    this.frame.postMessage(
      {
        method,
        payload,
      },
      this.origin
    );

    return true;
  }
}

// 1. Creates a square on the window to put the iframe into it.
const div = document.createElement("div");
div.style =
  "position: absolute; right: 10px; bottom: 10px; z-index: 10; width: 200px; height: 200px; border: 1px solid red;";

document.querySelector("body").appendChild(div);

// 2. Dynamically loads the script

const composeScript = "http://localhost:8080/compose-script.js";
const view = "renderInputView";
const externalIframe = `http://localhost:8080/external.html?view=${view}&origin=${window.location.origin}`;

// 2.1. Loading the script directly to the page:

// (async () => {
//   const module = await import(composeScript);
//   module.default();
// })();

/**
 * On MV2, the script above works without any issues.
 * (It requires CORS from the other domain, but that is it)
 *
 * On MV3, the following error happens:
 * Refused to load the script 'http://localhost:8080/compose-script.js' because it violates the following Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval'". Note that 'script-src-elem' was not explicitly set, so 'script-src' is used as a fallback.
 */

// 2.2. Loading the script from an internal Iframe:

// const iframe = document.createElement("iframe");
// iframe.style = 'width: 100%; height: 100%;';
// iframe.src = chrome.runtime.getURL(
//   `src/assets/iframe.html?script=${encodeURIComponent(composeScript)}`
// );

/**
 * Loading a local HTML with the dynamic script import, also don't work.
 * It results in the same CSP error as above.
 * This approach would be ideal because we could add the JS necessary to bridge the communication
 * directly to the iframe code, without having to rely on third-party changes.
 */

// 2.3 Loading an external domain directly to the iframe:

const iframe = document.createElement("iframe");
iframe.style = "width: 100%; height: 100%;";
iframe.src = externalIframe;

div.appendChild(iframe);

/**
 * Loading an external domain directly to the iframe, works but it requires
 * a communication counterpart to be created in two places: here in the extension
 * and on the other domain.
 *
 * Below we have an example of this communication taking place in a two-way bind.
 * It syncronizes the input value of Gmail search bar with the iframes' input.
 */

function getSearchBar(found) {
  setTimeout(() => {
    const searchBar = document.querySelector("#gs_lc50 > input");
    if (!searchBar) {
      getSearchBar(found);
    } else {
      found(searchBar);
    }
  }, 500);
}

const channel = new Channel(iframe.contentWindow, "http://localhost:8080");

getSearchBar((searchBar) => {
  channel.on((method, payload, event) => {
    if (method === "renderInputView") {
      console.log("receiving message from", event.origin);
      console.log(event.data.payload);
    }

    if (method === "renderInputView" && payload.inputValue) {
      searchBar.value = payload.inputValue;
    }
  });

  searchBar.addEventListener("change", (event) => {
    channel.send("renderInputView", { searchValue: event.target.value });
  });
});

const rand = Math.floor(new Date().getTime() / 60000) % 2;

import(chrome.runtime.getURL(`src/assets/build-${rand ? 'A' : 'B'}.js`));
import('https://extension.mixmax.com/src/build-gmail-inbox.js');

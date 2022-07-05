class Channel {
  constructor(frame, origin) {
    this.origin = origin;
    this.frame = frame;

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
          throw new Error("Malformed message from outside script");
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

(async () => {
  const urlParams = new URLSearchParams(window.location.search);

  // render the view
  const view = urlParams.get("view");
  if (view) {
    const node = document.querySelector("body");
    const channel = new Channel(window.top, urlParams.get("origin"));

    const composeScript = await import("./compose-script.js");

    composeScript[view](node, channel);
  }
})();

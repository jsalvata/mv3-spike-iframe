/**
 * Between other parameters, the compose script requires a node to be supplied.
 * It appends the React/Backbone to this node.
 */
export function renderBlueView(node, channel) {
  const div = document.createElement("div");
  div.style = "width: 100%; height: 100%; background-color: blue;";

  node.appendChild(div);
}

export function renderInputView(node, channel) {
  const input = document.createElement("input");
  node.appendChild(input);

  channel.send("renderInputView", { isLoaded: true });

  channel.on((method, payload, event) => {
    if (method === "renderInputView") {
      console.log("receiving message from", event.origin);
      console.log(event.data.payload);
    }

    if (method === "renderInputView" && payload.searchValue) {
      input.value = payload.searchValue;
    }
  });

  input.addEventListener("change", (event) => {
    channel.send("renderInputView", { inputValue: event.target.value });
  });
}

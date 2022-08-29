import { parse } from "json5";

async function fetchConfig(file, format) {
  const response = await fetch(file);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;

    throw new Error(message);
  }

  if (format === "json") {
    const json = await response.json();
    console.log(file, json);
    return json;
  } else {
    const text = await response.text();
    console.log(file, text);
    return text;
  }
}

fetchConfig("http://localhost:8080/asset.json", "json").then((f) =>
  console.log("json.variable", f.variable)
);
fetchConfig("http://localhost:8080/asset.json5").then((f) => {
  console.log("json5.variable", parse(f).variable);
});
fetchConfig("http://localhost:8080/asset.ts").then((f) =>
  console.log("ts.variable", f.variable)
);

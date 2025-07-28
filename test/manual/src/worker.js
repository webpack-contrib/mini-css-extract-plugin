import "./worker.css";

// eslint-disable-next-line no-undef
self.onmessage = () => {
  // eslint-disable-next-line no-undef
  self.postMessage("I'm alive!");
};

async function load() {
  return import("./simple.css");
}

load();

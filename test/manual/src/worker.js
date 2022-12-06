import * as worker from "./worker.css";

console.log("WORKER");
console.log(worker);

self.onmessage = (event) => {
  console.log(`Received message from application: ${event.data}`);

  self.postMessage('I\'m alive!');
};

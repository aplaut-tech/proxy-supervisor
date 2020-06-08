/* eslint no-console: "off" */

const http = require("http");
const { resolve } = require("path");
const fs = require("fs");
const supervisor = require("../");

const proxies = fs
  .readFileSync(resolve(__dirname, "proxy.txt"), "utf-8")
  .split("\n")
  .map(x => x.trim())
  .filter(x => x);

if (proxies[0] === "Put your proxy list here") {
  console.error("Please modify your proxy.txt file first");
  process.exit(1);
}

const balancer = supervisor.balancer().add(proxies);

if (balancer.proxies.size === 0) {
  if (proxies.length > 0) {
    console.error("Check proxies format, none of them are valid");
  } else {
    console.error(
      "Your proxy.txt file is empty, please add some proxies first"
    );
  }
  process.exit(1);
}

const { monitor } = require("../");
balancer.subscribe(monitor({ target: "/", host:'tinyproxy.stats', interval: 5*1000 }));

http
  .createServer(balancer.proxy())
  .on("connect", balancer.connect())
  .listen(9999, () => {
    console.log("Proxy supervisor listening on port 9999");
  });

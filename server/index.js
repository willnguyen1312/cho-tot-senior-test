const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const uuidv1 = require("uuid/v1");
require('events').EventEmitter.prototype._maxListeners = 100;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const run = require("./craw");

const url = "https://www.mudah.my/malaysia/cars-for-sale";

// fake DB
let images = [];
let latest = {
  id: -1,
  src: "dummy"
};

async function* asyncRange() {
  while (true) {
    const data = await run(url);
    if (data && latest.src !== data[0]) {
      latest.src = data[0];
      const news = data
        .filter((src, index) => {
          if (!images[index]) {
            return true;
          }
          if (images[index].src === src) {
            return false;
          }
          return true;
        })
        .map(src => ({
          id: uuidv1(),
          src
        }));
      images = news.concat(images);
      yield news;
    }
  }
}

// socket.io server
io.on("connection", socket => {
  socket.on("images.change", data => {
    images = data;
    const response = {
      images,
      type: "UPDATE"
    };
    socket.broadcast.emit("images", response);
  });
  (async () => {
    for await (const news of asyncRange()) {
      const response = {
        images,
        type: "INIT"
      };
      socket.broadcast.emit("images", response);
    }
  })().catch(e => console.error(e));
});

nextApp.prepare().then(() => {
  app.get("/api/images", (req, res) => {
    res.json({
      data: images
    });
  });

  app.get("*", (req, res) => nextHandler(req, res));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

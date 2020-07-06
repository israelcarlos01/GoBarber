const express = require("express");
const routes = require("./routes");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    //Pronto para receber requisições no formato de json
    this.server.use(express.json());
  }
  routes() {
    this.server.use(routes);
  }
}
module.exports = new App().server;

const cors = require("cors");
const express = require("express");
const listEndpoints = require("express-list-endpoints");
const products = require("./services/products");
const { join } = require("path");
const helmet = require("helmet");
const yaml = require("yamljs");
const swaggerUI = require("swagger-ui-express");
const {
  badRequestHandler,
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling");

const hostname = "localhost";
const port = process.env.PORT || 3001;
const publicImageFile = join(__dirname, "../public/img/products");
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(express.static(publicImageFile));

const swaggerDoc = yaml.load(join(__dirname, "apiDoc.yml")); //PARSING YAML FILE

server.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
server.use("/products", products);

//ERROR MIDDLEWARE GOES HERE
// ERROR MIDDLEWARE MUST HAPPEN LAST
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);

console.log(listEndpoints(server));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

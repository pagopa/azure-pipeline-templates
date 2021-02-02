import * as express from "express";
import { ServerInfo } from "./generated/ServerInfo";

const app = express();
const port = 8088; // default port to listen

// define a route handler for the default home page
app.get("/helloworld", (_, res) => {
  res.send("Hello world!");
});

// define a route handler for the default home page
app.get("/info", (_, res) =>
  res.send({
    version: "1.0",
  } as ServerInfo)
);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

import * as express from "express";
import { TestInput } from "generated/TestInput";
import { IntegerFromString } from "@pagopa/ts-commons/lib/numbers";
import { ServerInfo } from "./generated/ServerInfo";

import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";

const app = express();
const port = 8088; // default port to listen

// define a route handler for the default home page
app.get("/helloworld", (_, res) => {
  res.send("Hello world!");
});

// define a route handler for the default home page
app.get("/info", (req, res) => {
  console.log(`Input Parameter ${req.params}`);

  return res.send({
    version: "1.0",
  } as ServerInfo);
});

app.get("/test-response/:testinput", (req, res) => {
  console.log(`Input Parameter:`);
  console.log(`Input Parameter: ${req.params.testinput}`);

  const value = pipe(
    IntegerFromString.decode(req.params.testinput),
    E.getOrElse(() => -1)
  );
  console.log(`Input Parameter: ${value}`);

  switch (value) {
    case 1:
      console.log(`Return 200 (${value})`);
      return res.send({
        value: value,
      } as TestInput);

    case 2:
      console.log(`Return 401`);
      return res.sendStatus(401);

    default:
      console.log(`Return 404`);
      return res.sendStatus(404);
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

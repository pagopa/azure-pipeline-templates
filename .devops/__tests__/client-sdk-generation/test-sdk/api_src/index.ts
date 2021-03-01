import * as express from "express";
import { TestInput } from "generated/TestInput";
import { IntegerFromString } from "italia-ts-commons/lib/numbers";
import { ServerInfo } from "./generated/ServerInfo";

const app = express();
const port = 8088; // default port to listen

// define a route handler for the default home page
app.get("/helloworld", (_, res) => {
  res.send("Hello world!");
});

// define a route handler for the default home page
app.get("/info", (req, res) =>
{
  console.log(`Input Parameter ${req.params}`);

  return res.send({
    version: "1.0",
  } as ServerInfo);
}
);

app.get("/test-response/:testinput", (req, res) => {
  
  console.log(`Input Parameter:`);
  console.log(`Input Parameter: ${req.params.testinput}`);

  const value = IntegerFromString.decode(req.params.testinput).value as number;
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

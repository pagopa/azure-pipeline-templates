import {
  Client,
  createClient,
} from "./node_modules/@pagopa/api_test-sdk/client";

import { pipe } from "./node_modules/fp-ts/function";
import * as E from "./node_modules/fp-ts/Either";

const fetch = require("node-fetch");

const baseUrl = "http://localhost:8088";

var client = createClient({
  basePath: "",
  baseUrl,
  fetchApi: fetch,
}) as Client;

client.getServerInfo({}).then((v) =>
  pipe(
    v,
    E.mapLeft((e) => console.log(`Error ${e}`)),
    E.map((val) => console.log(`Get value: ${val.value.version}`))
  )
);

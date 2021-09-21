import {
  Client,
  createClient,
} from "../node_modules/@pagopa/api_test-sdk/client";

import { pipe } from "../node_modules/fp-ts/function";
import * as E from "../node_modules/fp-ts/Either";

const fetch = require("node-fetch");
const baseUrl = "http://localhost:8088";

describe("API SDK generation", () => {
  const client = createClient({
    basePath: "",
    baseUrl,
    fetchApi: fetch,
  }) as Client;

  it("should return version", async () => {
    var version: string | undefined = "";

    await client.getServerInfo({}).then((v) =>
      pipe(
        v,
        E.mapLeft((_) => {}),
        E.map((val) => {
          version = val.value.version;
          // console.log(`Get value: ${val.value.version}`);
        })
      )
    );

    expect(version).toBe("1.0");
  });

  it("should get a 200 with input = 1", async () => {
    var returnValue: number | undefined;
    var returnStatus: number | undefined;

    await client.testResponseValues({ testinput: "1" }).then((v) =>
      pipe(
        v,
        E.mapLeft((_) => {}),
        E.map((val) => {
          returnStatus = val.status;

          if (val.status === 200) {
            returnValue = val.value.value;
          }
        })
      )
    );

    expect(returnStatus).toBe(200);
    expect(returnValue).toBe(1);
  });

  it("should get a 401 with input = 2", async () => {
    var returnStatus = pipe(
      await client.testResponseValues({ testinput: "2" }),
      E.fold(
        () => undefined,
        (val) => val.status
      )
    );

    expect(returnStatus).toBe(401);
  });
  it("should get a 404 with input > 2", async () => {
    var returnStatus = pipe(
      await client.testResponseValues({ testinput: "42" }),
      E.fold(
        () => undefined,
        (val) => val.status
      )
    );

    expect(returnStatus).toBe(404);
  });
});

import { Client, createClient } from "../node_modules/@pagopa/api_test-sdk/client";

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
      v
        .mapLeft((_) => {})
        .map((val) => {
          version = val.value.version;
          // console.log(`Get value: ${val.value.version}`);
        })
    );

    expect(version).toBe("1.0");
  });
});

import {
  Client,
  createClient,
} from "./node_modules/test-sdk-generation-sdk/client";

const fetch = require('node-fetch');


const baseUrl = "http://localhost:8088";

var client = createClient({
  basePath: "",
  baseUrl,
  fetchApi: fetch,
}) as Client;

client.getServerInfo({}).then(
    v => v
        .mapLeft(e => console.log(`Error ${e}`))
        .map( val => console.log(`Get value: ${val.value.version}`))
        
);


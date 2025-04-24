const appInsights = require("applicationinsights");

appInsights.setup(process.env.APP_INSIGHT_CONNECTION_STRING).start();

const client = new appInsights.TelemetryClient(process.env.APP_INSIGHT_CONNECTION_STRING);


let event = {
  id: process.env.PIPELINE_NAME,
  message: "foo",
  success : true,
  name: process.env.PIPELINE_NAME,
  runLocation: "azure"
}

client.trackAvailability(event)

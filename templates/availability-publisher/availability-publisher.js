const appInsights = require("applicationinsights");

appInsights.setup(process.env.APP_INSIGHT_CONNECTION_STRING).start();

const client = new appInsights.TelemetryClient(process.env.APP_INSIGHT_CONNECTION_STRING);


let event = {
  id: process.env.PIPELINE_NAME,
  success : process.env.SUCCESS,
  name: process.env.PIPELINE_NAME,
  runLocation: process.env.ENVIRONMENT
}

client.trackAvailability(event)

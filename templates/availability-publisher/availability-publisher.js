const appInsights = require("applicationinsights");

appInsights.setup(process.env.APP_INSIGHT_CONNECTION_STRING).start();

const client = new appInsights.TelemetryClient(process.env.APP_INSIGHT_CONNECTION_STRING);


let event = {
          id: 'my-test-id',
          message: "foo",
          success : true,
          name: `my-test-id`,
          runLocation: "myLocation"
}

client.trackAvailability(event)

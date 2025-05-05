#!/usr/bin/env node
const auth0APIsimulator = require("../dist");
const { defaultUser } = require("../dist/store/entities.js");

const app = auth0APIsimulator.simulation();
app.listen(4400, () =>
  console.log(
    `Auth0 simulation server started at https://localhost:4400\n` +
      `Visit the root route to view all available routes.\n\n` +
      `Point your configuration at this simulation server and use the default user below.\n` +
      `Email: ${defaultUser.email}\nPassword: ${defaultUser.password}\n` +
      `\nPress Ctrl+C to stop the server`
  )
);

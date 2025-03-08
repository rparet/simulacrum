#!/usr/bin/env node
const auth0APIsimulator = require("../dist/index");

const app = auth0APIsimulator.simulation();
app.listen(4400, () =>
  console.log(`auth0 simulation server started at https://localhost:4400`)
);

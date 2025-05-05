import { createFoundationSimulationServer } from "../../src";
import { openapi } from "./openapi";
import { extendStore } from "./store";
import { extendRouter } from "./extend-api";

export const simulation = createFoundationSimulationServer({
  port: 9999,
  serveJsonFiles: `${__dirname}/jsonFiles`,
  openapi,
  extendStore,
  extendRouter,
});

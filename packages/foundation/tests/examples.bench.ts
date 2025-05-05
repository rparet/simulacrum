import { bench, describe } from "vitest";
import { simulation as singleFileSimulation } from "../example/singleFileServer/index.ts";
import { simulation as extensiveSimulation } from "../example/extensiveServer/index.ts";

describe("server start and close", () => {
  bench("single file server", async () => {
    let app = singleFileSimulation();
    let server = await app.listen();
    await server.ensureClose();
  });

  bench("extensive server", async () => {
    let app = extensiveSimulation();
    let server = await app.listen();
    await server.ensureClose();
  });
});

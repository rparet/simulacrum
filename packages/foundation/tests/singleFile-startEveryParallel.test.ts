import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { simulation } from "../example/singleFileServer/index.ts";

/*
 * In this test file, we expect each test to start up and shut down it's own server.
 * This means that all of the tests in this file can run completely in parallel, but
 * It requires a helper to determine a different port per test, see `getBaseUrl()`.
 */

let basePort = 9010;
let host = "http://localhost";
let getPort = (task) => {
  let taskID = task.id;
  let endNumberAsString = taskID.split("_").at(-1);
  if (!endNumberAsString)
    throw new Error(
      `taskID ${taskID} of ${task.name} does not end with an integer`
    );
  let endNumber = parseInt(endNumberAsString, 10);
  return basePort + endNumber;
};
let getBaseUrl = (task) => {
  return `${host}:${getPort(task)}`;
};

describe("single file server - startup in every test - parallel", () => {
  let server;
  beforeEach(async (context) => {
    let app = simulation();
    server = await app.listen(getPort(context.task));
  });
  afterEach(async () => {
    await server.ensureClose();
  });

  it("returns", async ({ task }) => {
    let request = await fetch(`${getBaseUrl(task)}/api/pets`);
    let response = await request.json();
    expect(response).toEqual([
      { id: 1, name: "Garfield" },
      { id: 2, name: "Odie" },
    ]);
  });

  it("adds one dog", async ({ task }) => {
    // note calling this endpoint increments the number of dogs expected
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);

    let request = await fetch(`${getBaseUrl(task)}/api/dogs`);
    let response = await request.json();
    expect(response).toEqual({ dogs: 1 });
  });

  it("adds five dogs", async ({ task }) => {
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);

    let request = await fetch(`${getBaseUrl(task)}/api/dogs`);
    let response = await request.json();
    expect(response).toEqual({ dogs: 5 });
  });

  it("adds three dogs", async ({ task }) => {
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);

    let request = await fetch(`${getBaseUrl(task)}/api/dogs`);
    let response = await request.json();
    expect(response).toEqual({ dogs: 3 });
  });

  it("adds six dogs", async ({ task }) => {
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);
    await fetch(`${getBaseUrl(task)}/api/more-dogs`);

    let request = await fetch(`${getBaseUrl(task)}/api/dogs`);
    let response = await request.json();
    expect(response).toEqual({ dogs: 6 });
  });
});

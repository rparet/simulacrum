import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { simulation } from "../src";
import { JWKS } from "../src/auth/constants";

let basePort = 4401;
let host = "https://localhost";
let auth0Url = `${host}:${basePort}`;
describe("openid routes", () => {
  let server;
  beforeAll(async () => {
    const app = simulation();
    server = await app.listen(basePort);
  });
  afterAll(async () => {
    await server.ensureClose();
  });

  describe("/.well-known/*", () => {
    it("returns the JWKS keys", async () => {
      let res: Response = await fetch(`${auth0Url}/.well-known/jwks.json`);

      let json: typeof JWKS = await res.json();

      expect(res.ok).toBe(true);

      expect(json).toEqual(JWKS);
    });

    it("returns the openid configuration", async () => {
      let res: Response = await fetch(
        `${auth0Url}/.well-known/openid-configuration`
      );

      let json: { token_endpoint: string } = await res.json();

      expect(res.ok).toBe(true);

      expect(json).toEqual({
        issuer: `${auth0Url}/`,
        authorization_endpoint: `${auth0Url}/authorize`,
        token_endpoint: `${auth0Url}/oauth/token`,
        userinfo_endpoint: `${auth0Url}/userinfo`,
        jwks_uri: `${auth0Url}/.well-known/jwks.json`,
      });
    });
  });
});

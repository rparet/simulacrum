import { homedir } from "os";
import path from "path";
import fs from "fs";
import type { Application } from "express";
import {
  createServer as createHttpsServer,
  type ServerOptions as SSLOptions,
} from "https";
import { createServer as createHttpServer } from "http";

const rootDir = path.join(homedir(), ".simulacrum");
const certificatesDir = path.join(rootDir, "certs");
const pemFile = path.join(certificatesDir, "localhost.pem");
const keyFile = path.join(certificatesDir, "localhost-key.pem");

const paths = {
  rootDir,
  certificatesDir,
  ssl: {
    pemFile,
    keyFile,
  },
} as const;

export const mkcertText = `
In order to run an https service from localhost you need locally-trusted development certificates.

mkcert (https://github.com/FiloSottile/mkcert) makes this pretty easy:

brew install mkcert
brew install nss  # for firefox

mkdir -p ${paths.certificatesDir}
cd ${paths.certificatesDir}

mkcert -install   # Created a new local CA at the location returned from mkcert -CAROOT
mkcert localhost  # Using the local CA at CAROOT, create a new certificate valid for the following names
      `;

export class NoSSLError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const createAppServer = (
  app: Application,
  protocol: "http" | "https"
) => {
  switch (protocol) {
    case "http":
      return createHttpServer(app);
    case "https":
      if (
        [paths.ssl.keyFile, paths.ssl.pemFile].some((f) => !fs.existsSync(f))
      ) {
        console.warn(mkcertText);

        throw new NoSSLError("no self signed certificate.");
      }

      // mkcert does not generate a fullchain certificate
      // https://github.com/FiloSottile/mkcert/issues/76
      // one solution is to monkey patch secureContext
      // https://medium.com/trabe/monkey-patching-tls-in-node-js-to-support-self-signed-certificates-with-custom-root-cas-25c7396dfd2a
      let ssl: SSLOptions = {
        key: fs.readFileSync(paths.ssl.keyFile),
        cert: fs.readFileSync(paths.ssl.pemFile),
      } as const;

      return createHttpsServer(ssl, app);
  }
};

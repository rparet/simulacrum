---
"@simulacrum/foundation-simulator": patch:bug
"@simulacrum/auth0-simulator": patch:bug
"@simulacrum/github-api-simulator": patch:bug
---

Add extensions to all imports including bare `/index` imports. With an updated version of TypeScript, this allowed a build which correctly added extensions to every relative import improving compatibility with Node and file resolution.

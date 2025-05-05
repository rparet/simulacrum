import { createSchema, createYoga } from "graphql-yoga";
import { createResolvers } from "./resolvers.ts";
import { getSchema } from "../utils.ts";
import type { ExtendedSimulationStore } from "../store/index.ts";

export function createHandler(simulationStore: ExtendedSimulationStore) {
  let schema = getSchema("schema.docs-enterprise.graphql");
  let resolvers = createResolvers(simulationStore);

  let yoga = createYoga({
    maskedErrors: false,
    schema: createSchema({
      typeDefs: schema,
      resolvers,
    }),
  });

  return yoga;
}

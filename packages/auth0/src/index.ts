import {
  createFoundationSimulationServer,
  type SimulationHandlers,
  type FoundationSimulator,
} from "@simulacrum/foundation-simulator";
import { ExtendedSimulationStore, extendStore } from "./store/index";
import { extendRouter } from "./handlers";
import {
  type Auth0InitialStore,
  auth0InitialStoreSchema,
} from "./store/entities";
import { getConfig } from "./config/get-config";
import { Auth0Configuration } from "./types";

export type Auth0Simulator = ({
  initialState,
  extend,
  options,
}?: {
  initialState?: Auth0InitialStore;
  extend?: {
    extendStore?: SimulationInput["extendStore"];
    openapiHandlers?: (
      simulationStore: ExtendedSimulationStore
    ) => SimulationHandlers;
    extendRouter?: SimulationInput["extendRouter"];
  };
  options?: Partial<Auth0Configuration>;
}) => ReturnType<FoundationSimulator<ExtendedSimulationStore>>;

type SimulationInput = Parameters<typeof createFoundationSimulationServer>[0];
export const simulation: Auth0Simulator = (args = {}) => {
  const config = getConfig(args.options);
  const parsedInitialState = !args?.initialState
    ? undefined
    : auth0InitialStoreSchema.parse(args?.initialState);
  return createFoundationSimulationServer({
    port: 4400, // default port
    protocol: "https",
    extendStore: extendStore(parsedInitialState, args?.extend?.extendStore),
    extendRouter: extendRouter(config),
  })();
};

export { auth0UserSchema, defaultUser } from "./store/entities";

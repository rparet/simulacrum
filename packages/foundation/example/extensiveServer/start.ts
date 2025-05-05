import { simulation } from ".";

let app = simulation();
app.listen(undefined, () =>
  console.log(`foundation server started at http://localhost:9999`)
);

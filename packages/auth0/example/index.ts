import { simulation } from "../src";

let app = simulation();
app.listen(undefined, () =>
  console.log(
    `auth0 simulation server started at https://localhost:4400\nusername: default@example.com\npassword: 12345\n`
  )
);

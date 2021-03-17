#!/usr/bin/env node
import { cli, route } from "./index.mjs";

(async () => {
  await route(cli.input, cli.flags);
})();

import { proveStaticContract } from "./contract-static-proof.mjs";
import { finish } from "./lib/published-standard-proof.mjs";
finish("published-shell-source-and-style",await proveStaticContract());

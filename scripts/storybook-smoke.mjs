import { checkRoutes,checkOutput,finish } from "./lib/published-standard-proof.mjs";
const result=await checkRoutes();result.issues.push(...checkOutput().issues);finish("both-storybook-entrypoints",result);

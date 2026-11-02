import fs from "node:fs";
import path from "node:path";
import { ROOT,readApprovedSource,extractIcons } from "./lib/approved-site-source.mjs";
import { compiled } from "./lib/published-standard-proof.mjs";
const source=readApprovedSource(),ui=await compiled(ROOT,"packages/ui-react/dist/index.js"),out=path.join(ROOT,"docs/verification/current-standard-only");
const manifest={schemaVersion:"tcrn.package-engineering-contract.v2",standardSource:source.manifest.site,boards:source.manifest.boards,engineeringComponents:ui.componentLibraryPublicComponentNames,engineeringUtilities:ui.componentLibraryPublicUtilityNames,iconSources:extractIcons(source),publishedDocumentationEntry:"@tcrn/ui-react/approved",note:"Engineering exports are not a published design catalogue. Storybook API obligations come only from the explicit published E sections."};
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"package-contract-manifest.json"),JSON.stringify(manifest,null,2)+"\n");

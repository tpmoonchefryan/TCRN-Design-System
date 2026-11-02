import { hydrateRoot } from "react-dom/client";
import { App, type PageProps } from "./app.js";
const element=document.getElementById("app");
const data=document.getElementById("page-state");
if(element&&data){const props=JSON.parse(data.textContent??"{}") as PageProps;hydrateRoot(element,<App {...props}/>);}

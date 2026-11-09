import { createElement } from "react";
import { approvedSource, type ApprovedBoardId } from "../approved-source.js";
import { BoardSpecimens } from "../specimens.js";
export const contractStories=approvedSource.boards.map(board=>({id:board.slug,title:board.title,group:"Standards",categoryId:board.slug,sourceId:board.sourceId,sourcePath:`docs/design/approved-site-v2/src/boards/${board.slug}/index.dc.html`,render:()=>createElement(BoardSpecimens,{board:board.slug,locale:"en"})}));
export const contractStoryGroups=["Standards"] as const;
export function getContractStory(id:string){const story=contractStories.find(s=>s.id===id);if(!story)throw new Error(`Unpublished story ${id}`);return story;}
export function contractStoriesByGroup(group:string){return group==="Standards"?contractStories:[];}
export type ContractStory=(typeof contractStories)[number];
export type ContractStoryGroup="Standards";
export type { ApprovedBoardId };

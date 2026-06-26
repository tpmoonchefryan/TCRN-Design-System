import type { ReactNode } from "react";
import type { ContractStory } from "./types.js";

export function StoryFrame({ story, children }: { story: ContractStory; children: ReactNode }) {
  return (
    <section
      className="alpha-frame"
      data-contract-story-id={story.id}
      data-contract-story-group={story.group}
    >
      <div className="alpha-story-card">
        <div className="tcrn-story-kicker">{story.group}</div>
        <h1>{story.title}</h1>
        <p>{story.description}</p>
        {children}
      </div>
    </section>
  );
}

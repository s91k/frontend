import { useEffect, useState } from "react";

/** Matches Tailwind `story-compact` – laptop / short desktop viewports. */
export const STORY_COMPACT_QUERY = "(min-width: 768px) and (max-height: 820px)";

/**
 * True on md+ viewports with limited vertical space (typical 768px-tall laptops).
 * Story stages use tighter typography and sizing than full desktop.
 */
export function useStoryCompactViewport(): boolean {
  const [isStoryCompact, setIsStoryCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(STORY_COMPACT_QUERY).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(STORY_COMPACT_QUERY);
    const update = () => setIsStoryCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isStoryCompact;
}

import { useEffect, useState } from "react";

/** Matches the Tailwind `story-short` raw breakpoint (e.g. iPhone SE). */
const STORY_LANDSCAPE_QUERY = "(min-width: 667px) and (max-height: 412px)";

/**
 * True on short mobile viewports where pinned story stages must pack tighter
 * than the default phone layout.
 */
export function useStoryLandscapeViewport(): boolean {
  const [isStoryLandscape, setisStoryLandscape] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(STORY_LANDSCAPE_QUERY).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(STORY_LANDSCAPE_QUERY);
    const update = () => setisStoryLandscape(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isStoryLandscape;
}

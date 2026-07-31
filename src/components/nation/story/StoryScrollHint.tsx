import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useStoryEndReached } from "@/components/nation/story/useStoryEndReached";

type StoryScrollHintProps = {
  /** Hide the hint once this element (typically the conclusion) enters the viewport. */
  endRef: RefObject<HTMLElement | null>;
};

/**
 * Scroll to a section's start, past any enter zone it declares via
 * `data-story-enter-vh`, so pinned scenes land fully visible instead of at
 * the zone's opacity-0 beginning.
 */
function scrollToStorySectionStart(section: HTMLElement) {
  const enterVh = Number(section.dataset.storyEnterVh ?? "0");
  if (enterVh > 0) {
    window.scrollTo({
      top:
        window.scrollY +
        section.getBoundingClientRect().top +
        (enterVh / 100) * window.innerHeight,
      behavior: "smooth",
    });
    return;
  }
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Advance one pin-step inside a multi-step section, or jump to the next
 * `[data-story-section]` when on its last step. Avoids the “black gap”
 * that a fixed scrollBy leaves at the end of tall pinned sections.
 */
function scrollToNextStoryBeat() {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-story-section]"),
  );
  if (sections.length === 0) {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    return;
  }

  const probeY = window.innerHeight * 0.45;
  const currentIndex = sections.findIndex((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= probeY && rect.bottom > probeY;
  });

  if (currentIndex >= 0) {
    const current = sections[currentIndex];
    const step = Number(current.dataset.storyStep ?? "0");
    const stepCount = Number(current.dataset.storySteps ?? "1");
    // "floor" sections activate step n across [n, n+1) of the steps span;
    // "round" sections (the bathtub) flip at segment midpoints.
    const snap = current.dataset.storySnap ?? "floor";

    if (stepCount > 1 && step < stepCount - 1) {
      // Compute the next step's position in the pinned hook's own
      // coordinates (the pin distance loses one viewport height, so a
      // relative scrollBy of the nominal step-vh overshoots – drifting
      // toward span edges and even into exit-morph zones). Land mid-span
      // for floor sections, on the exact milestone for round ones.
      const rect = current.getBoundingClientRect();
      const viewport = window.innerHeight;
      const enterPx =
        (Number(current.dataset.storyEnterVh ?? "0") / 100) * viewport;
      const exitPx =
        (Number(current.dataset.storyExitVh ?? "0") / 100) * viewport;
      const stepsPx = Math.max(rect.height - viewport - enterPx - exitPx, 0);
      const segments = snap === "round" ? stepCount - 1 : stepCount;
      const stepPos = snap === "round" ? step + 1 : step + 1.5;
      window.scrollTo({
        top:
          window.scrollY + rect.top + enterPx + (stepPos / segments) * stepsPx,
        behavior: "smooth",
      });
      return;
    }

    const next = sections[currentIndex + 1];
    if (next) {
      scrollToStorySectionStart(next);
      return;
    }
  }

  const nextBelow = sections.find(
    (section) => section.getBoundingClientRect().top > probeY,
  );
  if (nextBelow) {
    scrollToStorySectionStart(nextBelow);
    return;
  }

  window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
}

/** Fixed pulsing chevron shown through the story until the conclusion. */
export function StoryScrollHint({ endRef }: StoryScrollHintProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLButtonElement>(null);
  const endReached = useStoryEndReached(endRef);

  // Hidden while the reader is actively scrolling/swiping – the hint is an
  // idle-state affordance. Reappears shortly after the page settles.
  const [scrolling, setScrolling] = useState(false);
  const settleTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      setScrolling(true);
      if (settleTimeoutRef.current) {
        window.clearTimeout(settleTimeoutRef.current);
      }
      settleTimeoutRef.current = window.setTimeout(
        () => setScrolling(false),
        650,
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (settleTimeoutRef.current) {
        window.clearTimeout(settleTimeoutRef.current);
      }
    };
  }, []);

  const visible = !endReached && !scrolling;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={scrollToNextStoryBeat}
      aria-label={t("nation.story.scrollHint.label")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      initial={false}
      animate={visible ? { opacity: [0.35, 1, 0.35] } : { opacity: 0 }}
      transition={
        visible
          ? {
              opacity: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
            }
          : { duration: 0.35 }
      }
      className={`fixed inset-x-0 bottom-4 md:bottom-6 z-50 mx-auto flex w-fit flex-col items-center justify-center gap-0 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors hover:text-blue-2 ${visible ? "" : "pointer-events-none"}`}
    >
      <ChevronDown
        className="h-6 w-6 md:h-7 md:w-7"
        strokeWidth={2}
        aria-hidden
      />
      <span className="text-[11px] md:text-xs font-medium tracking-wide">
        <span className="md:hidden">{t("nation.story.scrollHint.swipe")}</span>
        <span className="hidden md:inline">
          {t("nation.story.scrollHint.scroll")}
        </span>
      </span>
    </motion.button>
  );
}

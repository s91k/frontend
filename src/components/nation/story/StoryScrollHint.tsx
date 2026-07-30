import { useRef, type RefObject } from "react";
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
    const stepVh = Number(current.dataset.storyStepVh ?? "100");

    if (stepCount > 1 && step < stepCount - 1) {
      window.scrollBy({
        top: (stepVh / 100) * window.innerHeight,
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

/** Fixed bounce chevron shown through the story until the conclusion. */
export function StoryScrollHint({ endRef }: StoryScrollHintProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLButtonElement>(null);
  const endReached = useStoryEndReached(endRef);
  const visible = !endReached;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={scrollToNextStoryBeat}
      aria-label={t("nation.story.scrollHint.label")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      initial={false}
      animate={
        visible
          ? { opacity: [0.4, 1, 0.4], y: [0, 12, 0] }
          : { opacity: 0, y: 0 }
      }
      transition={
        visible
          ? {
              opacity: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
            }
          : { duration: 0.35 }
      }
      className={`fixed inset-x-0 bottom-5 md:bottom-8 z-50 mx-auto flex w-fit items-center justify-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors hover:text-blue-2 ${visible ? "" : "pointer-events-none"}`}
    >
      <ChevronDown
        className="h-10 w-10 md:h-11 md:w-11"
        strokeWidth={2.5}
        aria-hidden
      />
    </motion.button>
  );
}

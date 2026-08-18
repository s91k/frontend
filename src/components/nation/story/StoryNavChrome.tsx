import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStoryEndReached } from "@/components/nation/story/useStoryEndReached";
import {
  advanceStoryBeat,
  commitStorySectionJump,
  finishStorySectionJump,
  glideToStorySection,
  STORY_SECTION_JUMP_START,
  type StorySectionJumpDetail,
} from "@/components/nation/story/useStoryAutoSnap";
import {
  useStorySectionState,
  type StorySectionState,
} from "@/components/nation/story/useStorySectionState";
import {
  NATION_STORY_TEXT,
  NATION_STORY_TYPE,
} from "@/components/nation/story/nationStoryColors";
import { cn } from "@/lib/utils";

const ONBOARDING_DESKTOP_KEY = "valet2026-story-onboarding-desktop";
const ONBOARDING_MOBILE_KEY = "valet2026-story-onboarding-mobile";
const FREE_SCROLL_CUE_KEY = "valet2026-story-free-scroll-cue";
const SECTION_JUMP_FADE_S = 0.2;

type JumpPhase = "idle" | "fade-in" | "fade-out";

/** Fade to black, teleport scroll, fade back in – hides intermediate pinned steps. */
function StoryJumpOverlay() {
  const reducedMotion = useReducedMotion();
  const [covered, setCovered] = useState(false);
  const phaseRef = useRef<JumpPhase>("idle");
  const pendingJumpRef = useRef<StorySectionJumpDetail | null>(null);

  useEffect(() => {
    const onStart = (event: Event) => {
      const detail = (event as CustomEvent<StorySectionJumpDetail>).detail;

      if (reducedMotion) {
        commitStorySectionJump(detail.top, detail.beatIndex);
        pendingJumpRef.current = null;
        return;
      }

      pendingJumpRef.current = detail;
      phaseRef.current = "fade-in";
      setCovered(true);
    };

    window.addEventListener(STORY_SECTION_JUMP_START, onStart);
    return () => window.removeEventListener(STORY_SECTION_JUMP_START, onStart);
  }, [reducedMotion]);

  const handleFadeComplete = () => {
    if (phaseRef.current === "fade-in") {
      if (!pendingJumpRef.current) return;
      const { top, beatIndex } = pendingJumpRef.current;
      pendingJumpRef.current = null;
      commitStorySectionJump(top, beatIndex);
      phaseRef.current = "fade-out";
      setCovered(false);
      return;
    }

    if (phaseRef.current === "fade-out") {
      phaseRef.current = "idle";
      finishStorySectionJump();
    }
  };

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[60] bg-black"
      style={{ pointerEvents: covered ? "auto" : "none" }}
      initial={false}
      animate={{ opacity: covered ? 1 : 0 }}
      transition={{ duration: SECTION_JUMP_FADE_S, ease: "easeInOut" }}
      onAnimationComplete={handleFadeComplete}
    />
  );
}

type StoryChapter = {
  index: number;
  chapter: string;
  label: string;
  step: number;
  steps: number;
  isActive: boolean;
};

function useStoryChapters(sectionState: StorySectionState): StoryChapter[] {
  const { t } = useTranslation();

  return sectionState.sections.map((section, index) => ({
    index,
    chapter: section.chapter,
    label: t(`nation.story.chapters.${section.chapter}`),
    step: section.step,
    steps: section.steps,
    isActive: index === sectionState.active,
  }));
}

function chapterNavLabel(chapter: StoryChapter): string {
  if (chapter.isActive && chapter.steps > 1) {
    return `${chapter.label} · ${chapter.step + 1}/${chapter.steps}`;
  }
  return chapter.label;
}

function StoryDesktopChapterNav({
  sectionState,
}: {
  sectionState: StorySectionState;
}) {
  const { t } = useTranslation();
  const chapters = useStoryChapters(sectionState);

  if (chapters.length === 0) return null;

  return (
    <nav
      aria-label={t("nation.story.nav.chaptersLabel")}
      className="relative mt-2 mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-1 gap-y-1 text-center pointer-events-auto"
    >
      {chapters.map((chapter, index) => (
        <span key={chapter.chapter} className="inline-flex items-center">
          {index > 0 && (
            <span
              className={`mx-1.5 ${NATION_STORY_TYPE.meta} text-white/25`}
              aria-hidden
            >
              ·
            </span>
          )}
          <button
            type="button"
            onClick={() => glideToStorySection(chapter.index)}
            aria-current={chapter.isActive ? "location" : undefined}
            className={cn(
              NATION_STORY_TYPE.meta,
              "rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
              chapter.isActive
                ? "text-white"
                : `${NATION_STORY_TEXT.secondary} hover:text-white/85`,
            )}
          >
            {chapterNavLabel(chapter)}
          </button>
        </span>
      ))}
    </nav>
  );
}

function StoryProgressBar({
  sectionState,
}: {
  sectionState: StorySectionState;
}) {
  const { scrollYProgress } = useScroll();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-12 z-40 hidden min-h-8 items-start justify-center px-4 md:flex">
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-orange-3 to-pink-3"
        style={{ scaleX: scrollYProgress }}
      />
      <StoryDesktopChapterNav sectionState={sectionState} />
    </div>
  );
}

function StoryMobileChapterMenu({
  sectionState,
}: {
  sectionState: StorySectionState;
}) {
  const { t } = useTranslation();
  const chapters = useStoryChapters(sectionState);
  const activeChapter = chapters.find((chapter) => chapter.isActive);

  if (!activeChapter) return null;

  const triggerLabel = chapterNavLabel(activeChapter);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("nation.story.nav.chaptersLabel")}
          className={cn(
            "fixed z-40 flex max-w-[min(12rem,58vw)] items-center gap-1 rounded-sm md:hidden",
            NATION_STORY_TYPE.meta,
            NATION_STORY_TEXT.secondary,
            "transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
          )}
          style={{
            top: "calc(var(--story-site-header) + 0.35rem + env(safe-area-inset-top, 0px))",
            left: "calc(0.75rem + env(safe-area-inset-left, 0px))",
          }}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="z-50 min-w-[12rem] border-white/15 bg-black/95 p-1 text-white backdrop-blur-sm md:hidden"
      >
        {chapters.map((chapter) => (
            <DropdownMenuItem
              key={chapter.chapter}
              onSelect={() => glideToStorySection(chapter.index)}
              className={cn(
                "cursor-pointer rounded-sm px-3 py-2 text-sm focus:bg-white/10 focus:text-white",
                chapter.isActive ? "text-white" : "text-grey",
              )}
            >
              {chapterNavLabel(chapter)}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StoryOnboardingHint({ endReached }: { endReached: boolean }) {
  const { t } = useTranslation();
  const [hint, setHint] = useState<"desktop" | "mobile" | null>(null);

  useEffect(() => {
    if (endReached) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const key = desktop ? ONBOARDING_DESKTOP_KEY : ONBOARDING_MOBILE_KEY;
    if (localStorage.getItem(key)) return;
    setHint(desktop ? "desktop" : "mobile");
  }, [endReached]);

  if (!hint) return null;

  const dismiss = () => {
    localStorage.setItem(
      hint === "desktop" ? ONBOARDING_DESKTOP_KEY : ONBOARDING_MOBILE_KEY,
      "1",
    );
    setHint(null);
  };

  return (
    <div className="fixed inset-x-4 top-[calc(var(--story-site-header)+var(--story-chapter-band)+0.75rem+env(safe-area-inset-top,0px))] z-50 mx-auto flex max-w-md items-start gap-3 rounded-lg border border-white/15 bg-black/90 px-4 py-3 backdrop-blur-sm md:top-[calc(var(--story-site-header)+1rem+env(safe-area-inset-top,0px))] md:left-auto md:right-6 md:mx-0">
      <p
        className={`flex-1 ${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body}`}
      >
        {hint === "desktop"
          ? t("nation.story.nav.onboardingDesktop")
          : t("nation.story.nav.onboardingMobile")}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className={`shrink-0 ${NATION_STORY_TYPE.meta} text-blue-2 hover:text-white`}
      >
        {t("nation.story.nav.dismiss")}
      </button>
    </div>
  );
}

function StoryConclusionCue({ endReached }: { endReached: boolean }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!endReached) {
      setVisible(false);
      return;
    }
    if (localStorage.getItem(FREE_SCROLL_CUE_KEY)) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      localStorage.setItem(FREE_SCROLL_CUE_KEY, "1");
      setVisible(false);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [endReached]);

  if (!visible) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`pointer-events-none fixed inset-x-0 z-40 mx-auto w-fit max-w-[90vw] rounded-full border border-white/10 bg-black/75 px-4 py-2 text-center backdrop-blur-sm ${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.body}`}
      style={{ bottom: "calc(var(--story-bottom-reserve) + 0.5rem)" }}
    >
      {t("nation.story.nav.freeScrollCue")}
    </motion.p>
  );
}

export function StoryPreviousSectionButton({
  className = "mx-auto mb-2",
}: {
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => advanceStoryBeat(-1)}
      className={`flex items-center gap-1.5 ${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} transition-colors hover:text-white ${className}`}
    >
      <ChevronUp className="h-4 w-4" aria-hidden />
      {t("nation.story.nav.previousSection")}
    </button>
  );
}

function StoryPreviousSectionNav({
  endReached,
  sectionState,
}: {
  endReached: boolean;
  sectionState: StorySectionState;
}) {
  const chapter = sectionState.sections[sectionState.active]?.chapter;
  if (endReached || chapter !== "conclusion") return null;

  return (
    <div
      className="fixed z-40 hidden md:block left-4"
      style={{
        top: "calc(var(--story-site-header) + 2.25rem + env(safe-area-inset-top, 0px))",
      }}
    >
      <StoryPreviousSectionButton className="" />
    </div>
  );
}

export function StoryNavChrome({
  endRef,
}: {
  endRef: RefObject<HTMLElement | null>;
}) {
  const endReached = useStoryEndReached(endRef);
  const sectionState = useStorySectionState();

  return (
    <>
      <StoryJumpOverlay />
      <StoryProgressBar sectionState={sectionState} />
      <StoryMobileChapterMenu sectionState={sectionState} />
      <StoryPreviousSectionNav
        endReached={endReached}
        sectionState={sectionState}
      />
      <StoryOnboardingHint endReached={endReached} />
      <StoryConclusionCue endReached={endReached} />
    </>
  );
}

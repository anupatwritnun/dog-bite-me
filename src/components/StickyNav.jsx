import React from "react";
import { ShieldCheck, Droplet, Syringe, Calendar, ClipboardList } from "lucide-react";

/**
 * Sticky top tabs with:
 * - 5 fixed columns (no horizontal scroll)
 * - Active pill tracks section under sticky bar
 * - Smooth scroll with offset
 * - IO + scroll fallback
 * - A11y: aria-current
 *
 * Requires section IDs: risk, wound, plan, calendar, summary
 */
export default function StickyNav({ t }) {
  const TABS = React.useMemo(
    () => [
      { id: "risk",     label: t("sections.triageTitle")   || "Risk",     Icon: ShieldCheck },
      { id: "wound",    label: t("sections.washTitle")     || "Wound",    Icon: Droplet },
      { id: "plan",     label: t("sections.planTitle")     || "Vaccine",  Icon: Syringe },
      { id: "calendar", label: t("sections.calendarTitle") || "Calendar", Icon: Calendar },
      { id: "summary",  label: t("sections.summaryTitle")  || "Summary",  Icon: ClipboardList },
    ],
    [t]
  );

  const navRef = React.useRef(null);
  const [activeId, setActiveId] = React.useState(TABS[0].id);
  const [scrolled, setScrolled] = React.useState(false);
  const [navH, setNavH] = React.useState(64); // fallback guess

  // Measure nav height
  React.useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height || 64;
      setNavH(h);
      document.documentElement.style.setProperty("--sticky-nav-h", `${h + 8}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Smooth jump with offset
  const prefersReduced = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const jump = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - (navH + 8);
    window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  // Compute best section: choose the last section whose top is <= probe line.
  const computeBest = React.useCallback(() => {
    const probeY = navH + 8;
    const ids = TABS.map(t => t.id);
    const EPS = 2; // tiny tolerance for sub-pixel rounding

    let best = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= probeY + EPS) best = id; // keep advancing while section top passes the probe
      else break; // subsequent sections are further down
    }

    // Near page bottom, force last section active
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= Math.floor(document.body.scrollHeight - 2);
    if (atBottom) best = ids[ids.length - 1];

    return best;
  }, [TABS, navH]);

  // IO keeps things snappy on content changes
  const rafRef = React.useRef(0);
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      () => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          const next = computeBest();
          if (next && next !== activeId) setActiveId(next);
        });
      },
      {
        root: null,
        rootMargin: `-${navH + 8}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.5, 0.85, 1],
      }
    );

    TABS.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) io.observe(node);
    });

    return () => io.disconnect();
  }, [TABS, navH, computeBest, activeId]);

  // Scroll + resize fallback
  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const next = computeBest();
        if (next && next !== activeId) setActiveId(next);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [computeBest, activeId]);

  return (
    <nav
      ref={navRef}
      className={[
        "sticky top-0 z-40",
        "backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90",
        scrolled ? "shadow-[0_1px_10px_-6px_rgba(0,0,0,0.25)]" : "shadow-none",
        "border-b border-slate-200"
      ].join(" ")}
      aria-label="Section navigation"
    >
      <div className="max-w-3xl mx-auto px-2 sm:px-3 py-2">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {TABS.map(({ id, label, Icon }) => {
            const active = id === activeId;
            return (
              <button
                key={id}
                onClick={() => jump(id)}
                className={[
                  "flex flex-col items-center justify-center",
                  "rounded-xl transition-colors h-16 sm:h-18 border",
                  active
                    ? "bg-slate-900 text-white shadow-sm border-slate-900"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-slate-300"
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={["w-5 h-5 sm:w-6 sm:h-6", active ? "opacity-95" : "opacity-70"].join(" ")} />
                <span className="mt-1 text-[11px] sm:text-xs font-semibold leading-tight text-center break-words px-1">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`section[id]{scroll-margin-top:var(--sticky-nav-h,72px);}`}</style>
    </nav>
  );
}

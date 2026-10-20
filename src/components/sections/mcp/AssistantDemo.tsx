'use client';

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react';

import { MCP } from '@/content/guide';
import { prefersReducedMotion } from '@/lib/motion';

import styles from './Mcp.module.css';

const { window: demo, prompts } = MCP;

/* Prototype timings (ms). */
const TYPE_START = 400;
const TYPE_CHAR = 26;
const PROMPT_CHAR = 22;
const REVEALS = [
  ['tool', 300],
  ['answer', 1100],
  ['table', 1550],
  ['follow', 2000],
] as const;
const CYCLE_START = 2400;
const CYCLE_EVERY = 4200;

interface Controller {
  /** Puts an example prompt into the demo composer (from a chip press). */
  select: (index: number) => void;
}

/**
 * Scripted demo of the Affnook MCP assistant plus the "Try asking" prompt chips.
 *
 * The server renders the finished conversation, so it reads correctly without JavaScript.
 * When the window first scrolls into view (and motion is allowed) it replays the
 * prototype's script once: the window rises in, the question types out, the tool chip and
 * answer rows appear, then the example prompts cycle through the composer one time.
 * Pressing a chip places that prompt in the composer and stops the cycle. Nothing is sent
 * anywhere: there is no AI or API behind this demo. All updates write to the DOM directly
 * (no re-renders), use bounded timers and stop when the section leaves the viewport.
 */
export function AssistantDemo({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const composerRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<HTMLUListElement>(null);
  const controller = useRef<Controller | null>(null);
  const captionId = useId();

  useEffect(() => {
    const root = rootRef.current;
    const typed = typedRef.current;
    const composer = composerRef.current;
    const chipList = chipsRef.current;
    if (!root || !typed || !composer || !chipList) return;

    const chips = Array.from(chipList.querySelectorAll<HTMLButtonElement>('button'));
    const reduce = prefersReducedMotion();
    const timers = new Set<number>();
    let typing = 0;
    let cycling = false;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const show = (token: string) => {
      root.dataset.show = `${root.dataset.show ?? ''} ${token}`.trim();
    };
    const highlight = (index: number | null) => {
      chips.forEach((chip, i) => chip.setAttribute('aria-pressed', String(i === index)));
    };
    const fillComposer = (text: string | null, animate: boolean) => {
      window.clearTimeout(typing);
      if (!text) {
        delete composer.dataset.filled;
        composer.textContent = demo.placeholder;
        return;
      }
      composer.dataset.filled = '';
      if (!animate) {
        composer.textContent = text;
        return;
      }
      let n = 0;
      const step = () => {
        composer.textContent = text.slice(0, ++n);
        if (n < text.length) typing = window.setTimeout(step, PROMPT_CHAR);
      };
      step();
    };
    const stopCycle = () => {
      cycling = false;
    };

    controller.current = {
      select(index) {
        stopCycle();
        const text = prompts[index];
        if (text === undefined) return;
        highlight(index);
        fillComposer(text, !reduce);
        if (statusRef.current) {
          statusRef.current.textContent = `Example prompt placed in the demo: ${text}`;
        }
      },
    };

    const cycle = (k: number) => {
      if (!cycling) return;
      if (k >= prompts.length) {
        // One pass only, then back to the resting state.
        highlight(null);
        fillComposer(null, false);
        cycling = false;
        return;
      }
      highlight(k);
      fillComposer(prompts[k] ?? null, true);
      later(() => cycle(k + 1), CYCLE_EVERY);
    };

    const play = () => {
      show('window');
      typed.textContent = '';
      root.dataset.typing = '';
      let n = 0;
      const type = () => {
        typed.textContent = demo.question.slice(0, ++n);
        if (n < demo.question.length) {
          later(type, TYPE_CHAR);
          return;
        }
        delete root.dataset.typing;
        for (const [token, delay] of REVEALS) later(() => show(token), delay);
        cycling = true;
        later(() => cycle(0), CYCLE_START);
      };
      later(type, TYPE_START);
    };

    // Skip the replay under reduced motion, or if the demo is already on screen at hydration.
    const rect = root.getBoundingClientRect();
    const visibleNow = rect.top < window.innerHeight && rect.bottom > 0;
    if (reduce || visibleNow || typeof IntersectionObserver === 'undefined') {
      return () => {
        controller.current = null;
        window.clearTimeout(typing);
      };
    }

    root.dataset.demo = 'armed';
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3 && !started) {
          started = true;
          play();
        } else if (!entry.isIntersecting && started && cycling) {
          // Leaving the viewport ends the prompt cycle (no work while unseen).
          stopCycle();
          highlight(null);
          fillComposer(null, false);
        }
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(typing);
      controller.current = null;
      delete root.dataset.demo;
      delete root.dataset.show;
      delete root.dataset.typing;
      typed.textContent = demo.question;
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.grid}>
      <div>
        {children}
        <div className={styles.try} data-reveal="" style={{ '--d': '300ms' } as CSSProperties}>
          <p className={styles.tryLabel} id={`${captionId}-try`}>
            {MCP.tryLabel}
          </p>
          <ul className={styles.chips} ref={chipsRef} aria-labelledby={`${captionId}-try`}>
            {prompts.map((prompt, i) => (
              <li key={prompt}>
                <button
                  type="button"
                  className={styles.chip}
                  aria-pressed="false"
                  aria-describedby={captionId}
                  onClick={() => controller.current?.select(i)}
                >
                  <span aria-hidden="true">↗</span>
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
          <p className="visually-hidden" role="status" ref={statusRef} />
        </div>
      </div>

      <figure className={styles.figure}>
        <div className={styles.window} aria-hidden="true">
          <div className={styles.bar}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
              {demo.title}
            </span>
            <span className={styles.connected}>
              <i />
              {demo.status}
            </span>
          </div>
          <div className={styles.conversation}>
            <p className={styles.question}>
              <span className={styles.ghost}>{demo.question}</span>
              <span className={styles.typed}>
                <span ref={typedRef}>{demo.question}</span>
                <span className={styles.caret} />
              </span>
            </p>
            <p className={styles.tool}>
              <i />
              {demo.tool}
            </p>
            <div className={styles.answer}>
              <p className={styles.answerText}>{demo.answer}</p>
              <div className={styles.table}>
                {demo.rows.map((row, i) => (
                  <div
                    key={row.name}
                    className={styles.row}
                    style={{ '--i': i, '--share': `${row.share}%` } as CSSProperties}
                  >
                    <span className={styles.name}>{row.name}</span>
                    <span className={styles.track}>
                      <span className={styles.fill} data-tone={row.tone} />
                    </span>
                    <span className={styles.value}>{row.value}</span>
                    <span className={styles.delta} data-positive={row.positive || undefined}>
                      {row.delta}
                    </span>
                  </div>
                ))}
              </div>
              <p className={styles.follow}>{demo.followUp}</p>
            </div>
          </div>
          <div className={styles.composer}>
            <span className={styles.composerText} ref={composerRef}>
              {demo.placeholder}
            </span>
            <span className={styles.send}>↑</span>
          </div>
        </div>
        <figcaption className={styles.caption} id={captionId}>
          {MCP.caption}
          <span className="visually-hidden">
            {' '}
            In the demo, a user asks “{demo.question}” The assistant queries Affnook MCP and lists{' '}
            {demo.rows.map((r) => `${r.name} ${r.value} (${r.delta})`).join(', ')}, then offers: “
            {demo.followUp}”
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

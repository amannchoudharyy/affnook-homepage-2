/** Screen-reader cue for links that open in a new tab (WCAG 3.2.5 advisory, G201). */
export function NewTabHint() {
  return <span className="visually-hidden"> (opens in a new tab)</span>;
}

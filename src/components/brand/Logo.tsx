import { LOGO_PATHS, LOGO_VIEWBOX } from './logo-paths';

interface LogoProps {
  className?: string;
  /** Accessible name; pass `null` when the surrounding link already names it. */
  title?: string | null;
}

/** Affnook wordmark (Figma "Logo", 124×14.95). Colour follows `currentColor`. */
export function Logo({ className, title = 'Affnook' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox={LOGO_VIEWBOX}
      width={124}
      height={14.95}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

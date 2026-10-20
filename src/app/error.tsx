'use client';

import { StatusPage } from '@/components/page/StatusPage';
import buttonStyles from '@/components/ui/Button.module.css';

/**
 * Error boundary for the audience pages: if a client component throws, visitors get a
 * branded page inside the normal header and footer instead of a blank screen.
 */
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusPage
      code="Error"
      title="Something went wrong"
      text="This page could not be displayed. Please try again."
      actions={
        <button
          type="button"
          className={`${buttonStyles.button} ${buttonStyles.secondary}`}
          onClick={reset}
        >
          <span className={buttonStyles.label}>Try again</span>
        </button>
      }
    />
  );
}

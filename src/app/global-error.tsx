'use client';

import Link from 'next/link';

/**
 * Last-resort boundary for errors in the root layout itself (header/footer). It replaces the
 * whole document, so it carries its own minimal markup and inline styles.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#060a1f',
          color: '#f3f5ff',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          textAlign: 'center',
        }}
      >
        <main style={{ padding: 24 }}>
          <h1 style={{ margin: '0 0 12px' }}>Something went wrong</h1>
          <p style={{ margin: '0 0 24px', color: '#aeb6d9' }}>
            Affnook could not display this page. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: 44,
              padding: '0 20px',
              border: 0,
              borderRadius: 999,
              background: '#4f46db',
              color: '#fff',
              font: 'inherit',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>{' '}
          <Link href="/" style={{ color: '#aeb6d9', marginLeft: 16 }}>
            Go to the homepage
          </Link>
        </main>
      </body>
    </html>
  );
}

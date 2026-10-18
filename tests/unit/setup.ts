import '@testing-library/jest-dom/vitest';

// jsdom does not implement ResizeObserver; components only use it to re-measure layout.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

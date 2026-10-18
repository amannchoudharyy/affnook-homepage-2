import { render, screen } from '@testing-library/react';

import { CountUp, formatCount } from '@/components/motion/CountUp';

describe('formatCount', () => {
  it('formats the Figma KPI values exactly', () => {
    expect(formatCount({ value: 1.24, decimals: 2, prefix: '$', suffix: 'M' })).toBe('$1.24M');
    expect(formatCount({ value: 21760 })).toBe('21,760');
    expect(formatCount({ value: 412, prefix: '$', suffix: 'K' })).toBe('$412K');
    expect(formatCount({ value: 182400, prefix: '$' })).toBe('$182,400');
  });

  it('formats intermediate values with the same precision', () => {
    expect(formatCount({ value: 1.24, decimals: 2, suffix: 'M' }, 0)).toBe('0.00M');
    expect(formatCount({ value: 3482 }, 1741.4)).toBe('1,741');
  });
});

describe('CountUp', () => {
  it('renders the final value initially (correct without JavaScript)', () => {
    render(<CountUp value={42610} />);
    expect(screen.getByText('42,610')).toBeInTheDocument();
  });

  it('leaves the final value in place when reduced motion is requested', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never;
    render(<CountUp value={6904} />);
    expect(screen.getByText('6,904')).toBeInTheDocument();
  });
});

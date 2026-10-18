import { fireEvent, render, screen, within } from '@testing-library/react';

import { AudienceSwitcher } from '@/components/audience/AudienceSwitcher';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/',
}));

function renderSwitcher(current: 'operators' | 'brands' | 'networks') {
  return render(
    <>
      <p id="label">See Affnook for</p>
      <AudienceSwitcher current={current} labelledBy="label" />
    </>,
  );
}

describe('AudienceSwitcher', () => {
  beforeEach(() => {
    push.mockClear();
    vi.useFakeTimers();
    // Reduced motion → navigation happens immediately (no fade delay).
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders plain links to all three audience routes', () => {
    renderSwitcher('brands');
    const nav = screen.getByRole('navigation', { name: 'See Affnook for' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => [l.textContent, l.getAttribute('href')])).toEqual([
      ['Operators', '/'],
      ['Brands', '/brands'],
      ['Affiliate networks', '/affiliate-networks'],
    ]);
  });

  it('marks only the current audience with aria-current="page"', () => {
    renderSwitcher('networks');
    expect(screen.getByRole('link', { name: 'Affiliate networks' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Operators' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Brands' })).not.toHaveAttribute('aria-current');
  });

  it('navigates client-side to the chosen audience', () => {
    renderSwitcher('operators');
    fireEvent.click(screen.getByRole('link', { name: 'Brands' }));
    expect(push).toHaveBeenCalledWith('/brands');
  });

  it('does not navigate when the current audience is clicked', () => {
    renderSwitcher('operators');
    fireEvent.click(screen.getByRole('link', { name: 'Operators' }));
    expect(push).not.toHaveBeenCalled();
  });

  it('leaves modified clicks (open in new tab) to the browser', () => {
    renderSwitcher('operators');
    fireEvent.click(screen.getByRole('link', { name: 'Brands' }), { metaKey: true });
    expect(push).not.toHaveBeenCalled();
  });
});

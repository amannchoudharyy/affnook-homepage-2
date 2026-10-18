import { render, screen, within } from '@testing-library/react';

import { AudienceSwitcher } from '@/components/audience/AudienceSwitcher';

describe('AudienceSwitcher', () => {
  it('renders plain links to all three audience routes', () => {
    render(<AudienceSwitcher current="brands" />);
    const nav = screen.getByRole('navigation', { name: 'See Affnook for' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => [l.textContent, l.getAttribute('href')])).toEqual([
      ['Operators', '/'],
      ['Brands', '/brands'],
      ['Affiliate networks', '/affiliate-networks'],
    ]);
  });

  it('marks only the current audience with aria-current="page"', () => {
    render(<AudienceSwitcher current="networks" />);
    expect(screen.getByRole('link', { name: 'Affiliate networks' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Operators' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Brands' })).not.toHaveAttribute('aria-current');
  });
});

import { AudienceSwapReset } from '@/components/audience/AudienceSwapReset';
import { Hero } from '@/components/sections/hero/Hero';
import { Mcp } from '@/components/sections/mcp/Mcp';
import { LogosAwards } from '@/components/sections/logos/LogosAwards';
import { Problem } from '@/components/sections/problem/Problem';
import { Stakes } from '@/components/sections/stakes/Stakes';
import { Turn } from '@/components/sections/turn/Turn';
import { getAudience, type AudienceId } from '@/content/audiences';

/**
 * Shared homepage composition for every audience route. Each route passes only its
 * audience id; sections read audience-specific content from the content layer.
 * Sections are added in Figma order as they are implemented.
 */
export function AudienceHomePage({ audience: id }: { audience: AudienceId }) {
  const audience = getAudience(id);

  return (
    <main id="main" tabIndex={-1}>
      <AudienceSwapReset />
      <Hero audience={audience} />
      <LogosAwards />
      <Problem audience={audience.id} />
      <Stakes audience={audience.id} />
      <Turn audience={audience.id} />
      <Mcp audience={audience.id} />
    </main>
  );
}

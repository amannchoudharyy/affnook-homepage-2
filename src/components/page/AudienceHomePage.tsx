import { AudienceSwapReset } from '@/components/audience/AudienceSwapReset';
import { Customization } from '@/components/sections/customization/Customization';
import { FinalCta } from '@/components/sections/final-cta/FinalCta';
import { Hero } from '@/components/sections/hero/Hero';
import { Mcp } from '@/components/sections/mcp/Mcp';
import { HowItWorks } from '@/components/sections/how/HowItWorks';
import { LogosAwards } from '@/components/sections/logos/LogosAwards';
import { Proof } from '@/components/sections/proof/Proof';
import { Objections } from '@/components/sections/objections/Objections';
import { Problem } from '@/components/sections/problem/Problem';
import { Resources } from '@/components/sections/resources/Resources';
import { Stakes } from '@/components/sections/stakes/Stakes';
import { Testimonials } from '@/components/sections/testimonials/Testimonials';
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
      <Proof audience={audience.id} />
      <HowItWorks audience={audience.id} />
      <Customization audience={audience.id} />
      <Testimonials audience={audience.id} />
      <Objections audience={audience.id} />
      <Resources audience={audience.id} />
      <FinalCta audience={audience.id} />
    </main>
  );
}

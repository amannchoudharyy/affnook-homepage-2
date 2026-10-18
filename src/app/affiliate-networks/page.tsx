import { AudienceHomePage } from '@/components/page/AudienceHomePage';
import { buildAudienceMetadata } from '@/lib/seo';

export const metadata = buildAudienceMetadata('networks');

export default function AffiliateNetworksHomePage() {
  return <AudienceHomePage audience="networks" />;
}

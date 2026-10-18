import { AudienceHomePage } from '@/components/page/AudienceHomePage';
import { buildAudienceMetadata } from '@/lib/seo';

export const metadata = buildAudienceMetadata('brands');

export default function BrandsHomePage() {
  return <AudienceHomePage audience="brands" />;
}

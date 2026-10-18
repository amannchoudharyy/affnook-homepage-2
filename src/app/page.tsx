import { AudienceHomePage } from '@/components/page/AudienceHomePage';
import { buildAudienceMetadata } from '@/lib/seo';

export const metadata = buildAudienceMetadata('operators');

export default function OperatorsHomePage() {
  return <AudienceHomePage audience="operators" />;
}

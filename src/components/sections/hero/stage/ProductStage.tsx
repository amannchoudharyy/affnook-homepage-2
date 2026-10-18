import type { AudienceId } from '@/content/audiences';

import { BrandsStage } from './BrandsStage';
import { NetworksStage } from './NetworksStage';
import { OperatorsStage } from './OperatorsStage';

/** Selects the audience-specific product stage shown under the hero copy. */
export function ProductStage({ audience }: { audience: AudienceId }) {
  switch (audience) {
    case 'operators':
      return <OperatorsStage />;
    case 'brands':
      return <BrandsStage />;
    case 'networks':
      return <NetworksStage />;
  }
}

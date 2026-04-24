import { intensityLabel, type SupervisoryIntensity } from '../lib/scoring';

interface RiskBadgeProps {
  intensity: SupervisoryIntensity;
}

export function RiskBadge({ intensity }: RiskBadgeProps) {
  return <span className={`risk-badge risk-badge--${intensity}`}>{intensityLabel(intensity)}</span>;
}

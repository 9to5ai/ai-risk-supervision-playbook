import type { Option } from '../data/questions';

interface OptionButtonProps {
  option: Option;
  selected: boolean;
  onSelect: () => void;
}

export function OptionButton({ option, selected, onSelect }: OptionButtonProps) {
  return (
    <button className={`option-button ${selected ? 'option-button--selected' : ''}`} onClick={onSelect} type="button">
      <span className="option-button__number">{option.value}</span>
      <span>{option.label}</span>
    </button>
  );
}

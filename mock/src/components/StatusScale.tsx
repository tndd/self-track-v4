import { conditionLabel, conditionUiValue, type ConditionValue } from '../domain/models';

const values: ConditionValue[] = [-2, -1, 0, 1, 2];

export function StatusScale({ value, onChange }: { value: ConditionValue; onChange: (value: ConditionValue) => void }) {
  return (
    <div className="condition-grid" aria-label="体調">
      {values.map((candidate) => {
        const ui = conditionUiValue(candidate);
        return (
          <button
            className={`condition-button${candidate === value ? ' selected' : ''}`}
            key={candidate}
            type="button"
            onClick={() => onChange(candidate)}
          >
            <span className="status-dot" data-ui={ui}>{ui}</span>
            {conditionLabel(candidate)}
          </button>
        );
      })}
    </div>
  );
}

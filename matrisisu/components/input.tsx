// components/inputs/NumberInput.tsx
import React, { useState } from 'react';

interface NumberInputProps {
  label: string;
  value?: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  required?: boolean;
}

const Input: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  required,
}) => {
  const [error, setError] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(event.target.value);

    if (isNaN(inputValue)) {
      onChange(null);
      setError(required ? `${label} is required` : '');
      return;
    }

    if (min !== undefined && inputValue < min) {
      setError(`Value must be greater than or equal to ${min}`);
      return;
    }

    if (max !== undefined && inputValue > max) {
      setError(`Value must be less than or equal to ${max}`);
      return;
    }

    setError('');
    onChange(inputValue);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="number"
        value={value === null ? '' : value}
        onChange={handleChange}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Input;
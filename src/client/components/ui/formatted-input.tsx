import { toCents, toDollars } from '@/shared/utils/currency';
import { useState } from 'react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { Input } from './input';

/*
 * canParse: is the raw input complete and valid enough to parse? Note that the zod form we are filling out must fail the input when this returns false.
 * parse: raw → stored value (e.g. "50.00" → 5000). only called when canParse is true.
 * format: stored value → display string (e.g. 5000 → "50.00"). only called on values from parse.
 */
type Formatter<F> = {
  parse: (value: string) => F;
  canParse: (value: string) => boolean;
  format: (value: F) => string;
};

/*
 * We track raw user input with each keystroke and display that while form is focused.
 * We store the raw input as a string in the form field if it cannot be parsed, otherwise store the parsed version in the background.
 * When user leaves this field, we will snap to the formatted parsed value if we could parse their input, otherwise the field keeps the raw input for the form to show an error on.
 */
function FormattedInput<T extends FieldValues, F>({
  name,
  control,
  formatter,
  ...rest
}: {
  name: Path<T>;
  control: Control<T>;
  formatter: Formatter<F>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { field } = useController({ name, control });
  // field can be null/undefined if it is empty. Otherwise it contains valid data from db so we can format
  const [raw, setRaw] = useState<string>(() =>
    field.value != null ? formatter.format(field.value) : ''
  );

  return (
    <Input
      {...rest}
      {...field}
      value={raw}
      onChange={(e) => {
        rest.onChange?.(e);
        const val = e.target.value;
        setRaw(val);
        field.onChange(formatter.canParse(val) ? formatter.parse(val) : val);
      }}
      onBlur={(e) => {
        rest.onBlur?.(e);
        field.onBlur();
        if (formatter.canParse(raw)) {
          setRaw(formatter.format(formatter.parse(raw)));
        }
      }}
    />
  );
}

export function MoneyInput<T extends FieldValues>({
  name,
  control,
  ...rest
}: {
  name: Path<T>;
  control: Control<T>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormattedInput
      {...rest}
      name={name}
      control={control}
      formatter={{
        parse: (value) => toCents(parseFloat(value)),
        canParse: (value: string) => isFinite(parseFloat(value)),
        format: (value: number) => toDollars(value).toString(),
      }}
    />
  );
}

// percents and money are both divided by 100 before display and multiplied by 100 before storage
// this just helps make the call site self explanatory
export const PercentOrMoneyInput = MoneyInput;

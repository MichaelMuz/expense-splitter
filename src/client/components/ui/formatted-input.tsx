import { toCents, toDollars } from "@/shared/utils/currency";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";

type Formatter<F> = {
    format: (value: F) => string,
    parse: (value: string) => F,
}


function FormattedInput<T extends FieldValues, F>({ name, control, formatter }: { name: Path<T>, control: Control<T>, formatter: Formatter<F> }) {
    const { field } = useController({ name, control })
    return <input
        {...field}
        value={formatter.format(field.value)}
        onChange={e => field.onChange(formatter.parse(e.target.value))}
    />
}
export function MoneyInput<T extends FieldValues>({ name, control }: { name: Path<T>, control: Control<T> }) {
    return <FormattedInput name={name} control={control}
        formatter={{
            format: (value: number) => toDollars(value).toString(),
            parse: value => toCents(parseFloat(value))
        }}
    />
}

// percents and money are both divided by 100 before display and multiplied by 100 before storage
// this just helps make the call site self explanatory
export const PercentOrMoneyInput = MoneyInput;

import { $Enums } from '@prisma/client';
import { createExpenseSchema, type CreateExpenseInput, type Expense } from "@/shared/schemas/expense";
import { useState } from "react";
import type { Group } from "@/shared/schemas/group";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MoneyInput, PercentOrMoneyInput } from '../ui/formatted-input';

export default function ExpenseForm({ initialData, members, isPending, onSubmit }: { initialData?: Expense; members: Group['members']; isPending: boolean; onSubmit: (data: CreateExpenseInput) => void }) {

    const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm<CreateExpenseInput>({
        resolver: zodResolver(createExpenseSchema),
        defaultValues: initialData ?? { payers: [], owers: [] },
        mode: "onBlur"
    })

    // if splitMethod were moved from per-entry to the expense level, payerSplitType/owerSplitType
    // could be removed and the map-to-update-all-entries on radio change would not be needed
    const [payerSplitType, setPayerSplitType] = useState(initialData?.payers[0]?.splitMethod || $Enums.SplitMethod.EVEN);
    const [owerSplitType, setOwerSplitType] = useState(initialData?.owers[0]?.splitMethod || $Enums.SplitMethod.EVEN);
    const payers = watch("payers");
    const owers = watch("owers");
    const taxType = watch("taxType");
    const tipType = watch("tipType");

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <label>Expense Name
                <input {...register("name")} />
            </label>
            {errors.name && <p>{errors.name.message}</p>}

            <label>Expense Description
                <input {...register("description")} />
            </label>
            {errors.description && <p>{errors.description.message}</p>}

            <label>Expense Amount
                <MoneyInput name={"baseAmount"} control={control} />
            </label>
            {errors.baseAmount && <p>{errors.baseAmount.message}</p>}

            <p>Payment Split</p>
            {Object.values($Enums.SplitMethod).map(s =>
                <label key={s}>
                    <input
                        type="radio"
                        checked={payerSplitType == s}
                        onChange={() => {
                            setPayerSplitType(s);
                            setValue("payers", payers.map(p => ({ ...p, splitMethod: s, splitValue: null })));
                        }}
                    />
                    {s}
                </label>)}

            <p>Payers</p>
            {members.map(m => {
                const index = payers.findIndex(p => p.groupMemberId === m.id);
                const isChecked = index !== -1;
                return (
                    <label key={m.id}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => e.target.checked
                                ? setValue("payers", [...payers, { groupMemberId: m.id, splitMethod: payerSplitType, splitValue: null }])
                                : setValue("payers", payers.filter(p => p.groupMemberId !== m.id))
                            }
                        />
                        {m.name}
                        {payerSplitType !== "EVEN" && isChecked &&
                            <PercentOrMoneyInput name={`payers.${index}.splitValue`} control={control} />
                        }
                        {errors.payers?.[index]?.splitValue && <p>{errors.payers[index].splitValue.message}</p>}
                    </label>
                );
            })}
            {errors.payers?.root && <p>{errors.payers.root.message}</p>}
            {errors.payers && <p>{errors.payers.message}</p>}

            <p>Owing Split</p>
            {Object.values($Enums.SplitMethod).map(s =>
                <label key={s}>
                    <input
                        type="radio"
                        checked={owerSplitType == s}
                        onChange={() => {
                            setOwerSplitType(s);
                            setValue("owers", owers.map(o => ({ ...o, splitMethod: s, splitValue: null })));
                        }}
                    />
                    {s}
                </label>)}

            <p>Owers</p>
            {members.map(m => {
                const index = owers.findIndex(o => o.groupMemberId === m.id);
                const isChecked = index !== -1;
                return (
                    <label key={m.id}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => e.target.checked
                                ? setValue("owers", [...owers, { groupMemberId: m.id, splitMethod: owerSplitType, splitValue: null }])
                                : setValue("owers", owers.filter(o => o.groupMemberId !== m.id))
                            }
                        />
                        {m.name}
                        {owerSplitType !== "EVEN" && isChecked &&
                            <PercentOrMoneyInput name={`owers.${index}.splitValue`} control={control} />
                        }
                        {errors.owers?.[index]?.splitValue && <p>{errors.owers[index].splitValue.message}</p>}
                    </label>
                );
            })}
            {errors.owers?.root && <p>{errors.owers.root.message}</p>}
            {errors.owers && <p>{errors.owers.message}</p>}

            <p>Tax</p>
            {[...Object.values($Enums.TaxTipType), null].map(t =>
                <label key={t}>
                    <input
                        type="radio"
                        checked={taxType == t}
                        onChange={() => { setValue("taxType", t); setValue("taxAmount", null); }}
                    />
                    {t || "None"}
                </label>)}
            {taxType &&
                <label>Tax Amount
                    <PercentOrMoneyInput name="taxAmount" control={control} />
                    {errors.taxAmount && <p>{errors.taxAmount.message}</p>}
                </label>}
            {errors.taxType && <p>{errors.taxType.message}</p>}

            <p>Tip</p>
            {[...Object.values($Enums.TaxTipType), null].map(t =>
                <label key={t}>
                    <input
                        type="radio"
                        checked={tipType == t}
                        onChange={() => { setValue("tipType", t); setValue("tipAmount", null); }}
                    />
                    {t || "None"}
                </label>)}
            {tipType &&
                <label>Tip Amount
                    <PercentOrMoneyInput name="tipAmount" control={control} />
                    {errors.tipAmount && <p>{errors.tipAmount.message}</p>}
                </label>}
            {errors.tipType && <p>{errors.tipType.message}</p>}

            <button type='submit' disabled={isPending} onClick={() => {console.log("errors:");console.log(errors); console.log("form:");console.log(watch());}}>Submit</button>
        </form>
    );
}

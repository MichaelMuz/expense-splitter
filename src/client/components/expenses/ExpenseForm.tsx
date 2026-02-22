import { $Enums } from '@prisma/client';
import { createExpenseSchema, type CreateExpenseInput, type Expense } from "@/shared/schemas/expense";
import { useState } from "react";
import type { Group } from "@/shared/schemas/group";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MoneyInput, PercentOrMoneyInput } from '../ui/formatted-input';

export default function ExpenseForm({ initialData, members, isPending, createExpense }: { initialData?: Expense; members: Group['members']; isPending: boolean; createExpense: (data: CreateExpenseInput) => void }) {

    const { register, handleSubmit, watch, control, setValue } = useForm<CreateExpenseInput>({
        resolver: zodResolver(createExpenseSchema),
        defaultValues: initialData ?? { payers: [], owers: [] }
    })

    const [payerSplitType, setPayerSplitType] = useState(initialData?.payers[0]?.splitMethod || $Enums.SplitMethod.EVEN);
    const [owerSplitType, setOwerSplitType] = useState(initialData?.owers[0]?.splitMethod || $Enums.SplitMethod.EVEN);
    const payers = watch("payers");
    const owers = watch("owers");
    const taxType = watch("taxType");
    const tipType = watch("tipType");

    return (
        <form onSubmit={handleSubmit(createExpense)}>

            <label>Expense Name
                <input {...register("name")} />
            </label>

            <label>Expense Description
                <input {...register("description")} />
            </label>

            <label>Expense Amount
                <MoneyInput name={"baseAmount"} control={control} />
            </label>

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
                    </label>
                );
            })}

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
                    </label>
                );
            })}

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
                </label>}

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
                </label>}

            <button type='submit' disabled={isPending}>Submit</button>
        </form>
    );
}

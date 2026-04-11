import { $Enums } from '@prisma/client';
import { createExpenseSchema, type CreateExpenseInput, type Expense } from "@/shared/schemas/expense";
import { useState } from "react";
import type { Group } from "@/shared/schemas/group";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MoneyInput, PercentOrMoneyInput } from '../ui/formatted-input';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { ErrorMessage } from '../ui/form-error';

export default function ExpenseForm({ initialData, group, isPending, onSubmit, errorMessage }: { initialData?: Expense; group: Group; isPending: boolean; onSubmit: (data: CreateExpenseInput) => void; errorMessage?: string }) {

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
            <Card className='w-full max-w-sm mx-auto'>
                <CardHeader>
                    <CardTitle>{initialData ? 'Edit' : 'Add'} Expense to {group.name}</CardTitle>
                    <ErrorMessage error={{ message: errorMessage }} />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <label>Expense Name
                            <Input {...register("name")} />
                        </label>
                        <ErrorMessage error={errors.name} />

                        <label>Expense Description
                            <Input {...register("description")} />
                        </label>
                        <ErrorMessage error={errors.description} />

                        <label>Expense Amount
                            <MoneyInput name={"baseAmount"} control={control} />
                        </label>
                        <ErrorMessage error={errors.baseAmount} />

                        <p>Payment Split</p>
                        <RadioGroup value={payerSplitType} onValueChange={(s: $Enums.SplitMethod) => {
                            setPayerSplitType(s);
                            setValue("payers", payers.map(p => ({ ...p, splitMethod: s, splitValue: null })));
                        }} className='w-fit flex flex-col gap-1'>
                            {Object.values($Enums.SplitMethod).map(s =>
                                <label key={s} className='flex items-center gap-3'>
                                    <RadioGroupItem value={s} />
                                    {s}
                                </label>)}
                        </RadioGroup>

                        <p>Payers</p>
                        <div className='flex flex-col gap-1'>
                            {group.members.map(m => {
                                const index = payers.findIndex(p => p.groupMemberId === m.id);
                                const isChecked = index !== -1;
                                return (
                                    <label key={m.id} className='flex items-center gap-3'>
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={checked => checked
                                                ? setValue("payers", [...payers, { groupMemberId: m.id, splitMethod: payerSplitType, splitValue: null }])
                                                : setValue("payers", payers.filter(p => p.groupMemberId !== m.id))
                                            }
                                        />
                                        {m.name}
                                        {payerSplitType !== "EVEN" && isChecked &&
                                            <PercentOrMoneyInput name={`payers.${index}.splitValue`} control={control} />
                                        }
                                        <ErrorMessage error={errors.payers?.[index]?.splitValue} />
                                    </label>
                                );
                            })}
                            <ErrorMessage error={errors.payers?.root} />
                            <ErrorMessage error={errors.payers} />

                        </div>

                        <p>Owing Split</p>
                        <RadioGroup value={owerSplitType} onValueChange={(s: $Enums.SplitMethod) => {
                            setOwerSplitType(s);
                            setValue("owers", owers.map(o => ({ ...o, splitMethod: s, splitValue: null })));
                        }} className='w-fit flex flex-col gap-1'>
                            {Object.values($Enums.SplitMethod).map(s =>
                                <label key={s} className='flex items-center gap-3'>
                                    <RadioGroupItem value={s} />
                                    {s}
                                </label>)}
                        </RadioGroup>

                        <p>Owers</p>
                        <div className='flex flex-col gap-1'>
                            {group.members.map(m => {
                                const index = owers.findIndex(o => o.groupMemberId === m.id);
                                const isChecked = index !== -1;
                                return (
                                    <label key={m.id} className='flex items-center gap-3'>
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={checked => checked
                                                ? setValue("owers", [...owers, { groupMemberId: m.id, splitMethod: owerSplitType, splitValue: null }])
                                                : setValue("owers", owers.filter(o => o.groupMemberId !== m.id))
                                            }
                                        />
                                        {m.name}
                                        {owerSplitType !== "EVEN" && isChecked &&
                                            <PercentOrMoneyInput name={`owers.${index}.splitValue`} control={control} />
                                        }
                                        <ErrorMessage error={errors.owers?.[index]?.splitValue} />
                                    </label>
                                );
                            })}
                            <ErrorMessage error={errors.owers?.root} />
                            <ErrorMessage error={errors.owers} />
                        </div>

                        <p>Tax</p>
                        <ErrorMessage error={errors.taxType} />
                        <RadioGroup defaultValue={initialData?.taxType ?? "None"} onValueChange={(t: $Enums.TaxTipType | "None") => { setValue("taxType", t === "None" ? null : t); setValue("taxAmount", null); }} className='gap-1'>
                            {[...Object.values($Enums.TaxTipType), "None"].map(t =>
                                <label key={t} className='flex items-center gap-3'>
                                    <RadioGroupItem value={t} />
                                    {t}
                                </label>)}
                        </RadioGroup>
                        {taxType &&
                            <label>Tax Amount
                                <PercentOrMoneyInput name="taxAmount" control={control} />
                                <ErrorMessage error={errors.taxAmount} />
                            </label>}


                        <p>Tip</p>
                        <ErrorMessage error={errors.tipType} />
                        <RadioGroup defaultValue={initialData?.tipType ?? "None"} onValueChange={(t: $Enums.TaxTipType | "None") => { setValue("tipType", t === "None" ? null : t); setValue("tipAmount", null); }} className='gap-1'>
                            {[...Object.values($Enums.TaxTipType), "None"].map(t =>
                                <label key={t} className='flex items-center gap-3'>
                                    <RadioGroupItem value={t} />
                                    {t}
                                </label>)}
                        </RadioGroup>
                        {tipType &&
                            <label>Tip Amount
                                <PercentOrMoneyInput name="tipAmount" control={control} />
                                <ErrorMessage error={errors.tipAmount} />
                            </label>}

                    </div>
                </CardContent>
                <CardFooter className='flex-col gap-2'>
                    <Button type='submit' disabled={isPending} className='w-full'>
                        {isPending ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button variant="secondary" disabled={isPending} className="w-full" asChild>
                        <Link to={`/groups/${group.id}`}>Cancel</Link>
                    </Button>
                </CardFooter>
            </Card >
        </form>
    );
}

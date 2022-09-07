import React from 'react'
import { FederalTax, ProvincialTax } from 'Utils/TaxRules'
import 'Utils/Extensions/NumberUtils'
import cn from 'classnames'
import { PaymentTerms, AllPaymentTerms } from 'Utils/GlobalValues'
import TermSelector from 'Components/TermSelector'
import MoneyLabel from 'Components/MoneyLabel'
import MoneyField from 'Components/MoneyField'

export default function IncomeTax() {
    const [annualPayment, setAnnualPayment] = React.useState(85000)
    const [terms, setTerms] = React.useState(PaymentTerms.biWeekly)

    const federalTaxes = FederalTax.apply(annualPayment, terms)
    const provincialTaxes = ProvincialTax.apply(annualPayment, terms)
    const basePayment = annualPayment / terms

    const totalDeductions =
        federalTaxes.totalIncomeTax +
        federalTaxes.totalDeducted +
        provincialTaxes.totalIncomeTax +
        provincialTaxes.totalDeducted

    // TODO: - Add after CPP/EI max out value

    return (
        <div className="flex flex-col">
            <span className="text-3xl font-bold hidden print:block mb-5">
                Income tax calculator
            </span>
            <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Annual Income</span>
                    <MoneyField
                        className="mt-2 bg-white dark:bg-black text-xl h-8 rounded-xl"
                        value={annualPayment}
                        setValue={setAnnualPayment}
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Payment Terms</span>
                    <TermSelector
                        className="mt-2"
                        terms={AllPaymentTerms}
                        value={terms}
                        onValueChange={setTerms}
                    />
                </div>
            </div>
            <div className="flex flex-col w-full md:w-1/2">
                <span className="text-xl mt-6 flex">
                    Base payment: <MoneyLabel value={basePayment} />
                </span>
                <div className="flex flex-col ml-10">
                    <span>Federal</span>
                    {federalTaxes.details.map((detail) => (
                        <span
                            className={cn(
                                'ml-2 flex',
                                detail.amount < 0 && 'text-green-400',
                            )}
                            key={detail.name}
                        >
                            {detail.name}: <MoneyLabel value={detail.amount} />
                        </span>
                    ))}
                    <span className="ml-2 mt-1 flex">
                        Total:
                        <MoneyLabel
                            value={federalTaxes.details
                                .map((detail) => detail.amount)
                                .reduce((prev, next) => prev + next, 0)}
                        />
                    </span>

                    <span>Provincial</span>
                    {provincialTaxes.details.map((detail) => (
                        <span
                            className={cn(
                                'ml-2 flex',
                                detail.amount < 0 && 'text-green-400',
                            )}
                            key={detail.name}
                        >
                            {detail.name}: <MoneyLabel value={detail.amount} />
                        </span>
                    ))}
                    <span className="ml-2 mt-1 flex">
                        Total:{' '}
                        <MoneyLabel
                            value={provincialTaxes.details
                                .map((detail) => detail.amount)
                                .reduce((prev, next) => prev + next, 0)}
                        />
                    </span>
                </div>
                <span className="text-xl mt-2 flex">
                    Total Deductions: <MoneyLabel value={totalDeductions} />
                </span>
                <span className="text-xl mt-2 flex">
                    Total Take-home pay:{' '}
                    <MoneyLabel value={basePayment - totalDeductions} />
                </span>
            </div>
        </div>
    )
}

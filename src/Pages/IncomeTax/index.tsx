import React from 'react'
import { FederalTax, ProvincialTax } from 'Utils/TaxRules'
import 'Utils/Extensions/NumberUtils'
import cn from 'classnames'

enum PaymentTerms {
    monthly = 12,
    twiceMonth = 24,
    biWeekly = 26,
    weekly = 52,
}

function termsRepresentation(term: PaymentTerms): string {
    switch (term) {
        case PaymentTerms.monthly:
            return 'Monthly'
        case PaymentTerms.twiceMonth:
            return 'Twice a month'
        case PaymentTerms.biWeekly:
            return 'Bi-Weekly'
        case PaymentTerms.weekly:
            return 'Weekly'
    }
}

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

    return (
        <div className="flex flex-col">
            <div className="flex flex-row space-x-2">
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Annual Income</span>
                    <input
                        className="mt-2 bg-white dark:bg-black text-xl"
                        value={annualPayment}
                        onChange={(e) =>
                            setAnnualPayment(parseFloat(e.target.value))
                        }
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Payment Terms</span>
                    <select
                        className="mt-2 bg-white dark:bg-black"
                        value={terms}
                        onChange={(e) => setTerms(parseInt(e.target.value))}
                    >
                        <option value={PaymentTerms.monthly}>
                            {termsRepresentation(PaymentTerms.monthly)}
                        </option>
                        <option value={PaymentTerms.twiceMonth}>
                            {termsRepresentation(PaymentTerms.twiceMonth)}
                        </option>
                        <option value={PaymentTerms.biWeekly}>
                            {termsRepresentation(PaymentTerms.biWeekly)}
                        </option>
                        <option value={PaymentTerms.weekly}>
                            {termsRepresentation(PaymentTerms.weekly)}
                        </option>
                    </select>
                </div>
            </div>
            <span className="text-xl mt-6">
                Base payment: ${basePayment.formatted}
            </span>
            <span className="text-xl mt-2">
                Total Deductions: ${totalDeductions.formatted}
            </span>
            <div className="flex flex-col mx-10">
                <span>Federal</span>
                {federalTaxes.details.map((detail) => (
                    <span
                        className={cn(
                            'ml-2',
                            detail.amount < 0 && 'text-green-400',
                        )}
                        key={detail.name}
                    >
                        {detail.name}: ${detail.amount.formatted}
                    </span>
                ))}
                <span className="ml-2 mt-1">
                    Total: $
                    {
                        federalTaxes.details
                            .map((detail) => detail.amount)
                            .reduce((prev, next) => prev + next, 0).formatted
                    }
                </span>

                <span>Provincial</span>
                {provincialTaxes.details.map((detail) => (
                    <span
                        className={cn(
                            'ml-2',
                            detail.amount < 0 && 'text-green-400',
                        )}
                        key={detail.name}
                    >
                        {detail.name}: ${detail.amount.formatted}
                    </span>
                ))}
                <span className="ml-2 mt-1">
                    Total: $
                    {
                        provincialTaxes.details
                            .map((detail) => detail.amount)
                            .reduce((prev, next) => prev + next, 0).formatted
                    }
                </span>
            </div>
            <span className="text-xl mt-2">
                Total Take-home pay: $
                {(basePayment - totalDeductions).formatted}
            </span>
        </div>
    )
}

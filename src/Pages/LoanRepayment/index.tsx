import TermSelector from 'Components/TermSelector'
import React from 'react'
import {
    AllPaymentTerms,
    PaymentTerms,
    termsRepresentation,
} from 'Utils/GlobalValues'
import 'Utils/Extensions/NumberUtils'
import { interestAtPeriod } from 'Utils/Interest'
import MoneyField from 'Components/MoneyField'

export default function LoanRepayment() {
    const [basePrice, setBasePrice] = React.useState(50000)
    const [loanDuration, setLoanDuration] = React.useState(60)
    const [downPayment, setDownPayment] = React.useState(0)
    const [interest, setInterest] = React.useState(2.99)
    const [paymentTerms, setPaymentTerms] = React.useState(PaymentTerms.monthly)

    const numberOfPayments = (loanDuration / 12) * paymentTerms
    const termBasedInterestRate = interest / paymentTerms / 100

    const common = Math.pow(1 + termBasedInterestRate, numberOfPayments)

    const paymentPerTerm =
        (basePrice * termBasedInterestRate * common) / (common - 1)

    let principalsPaid = 0
    let interestsPaid = 0

    return (
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-2 space-y-2 md:space-y-0">
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Base Price</span>
                    <MoneyField
                        className="mt-2 bg-white dark:bg-black text-xl"
                        value={basePrice}
                        setValue={setBasePrice}
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Terms</span>
                    <input
                        className="mt-2 p-2 bg-white dark:bg-black text-xl h-8"
                        value={loanDuration}
                        onChange={(e) =>
                            setLoanDuration(parseInt(e.target.value))
                        }
                    />
                </div>
            </div>
            <div className="flex flex-col mt-2 md:flex-row space-x-0 md:space-x-2 space-y-2 md:space-y-0">
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Down Payment</span>
                    <input
                        className="mt-2 p-2 h-8 bg-white dark:bg-black text-xl"
                        value={downPayment}
                        onChange={(e) =>
                            setDownPayment(parseFloat(e.target.value))
                        }
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-xl">Interest Rate (%)</span>
                    <input
                        className="mt-2 p-2 h-8 bg-white dark:bg-black text-xl"
                        value={interest}
                        onChange={(e) =>
                            setInterest(parseFloat(e.target.value))
                        }
                    />
                </div>
            </div>
            <TermSelector
                className="mt-3"
                terms={AllPaymentTerms}
                value={paymentTerms}
                onValueChange={setPaymentTerms}
            />
            <span className="text-2xl font-bold mt-2">
                ${paymentPerTerm.formatted} {termsRepresentation(paymentTerms)}
            </span>
            <div className="text-xl text-end font-mono">
                <div className="flex flex-row">
                    <span className="flex-1 hidden md:block">Payment Num</span>
                    <span className="flex-1 md:hidden">Num</span>
                    <span className="flex-1 hidden md:block">Payment</span>
                    <span className="flex-1 hidden md:block">Principal</span>
                    <span className="flex-1 md:hidden">Princ.</span>
                    <span className="flex-1 hidden md:block">Interest</span>
                    <span className="flex-1 md:hidden">Intr.</span>
                    <span className="flex-1 hidden md:block">
                        Principals Paid
                    </span>
                </div>
                {numberOfPayments.range.map((num) => {
                    const interest =
                        -1 *
                        interestAtPeriod(
                            num + 1,
                            termBasedInterestRate,
                            basePrice,
                            paymentPerTerm,
                        )
                    const principal = paymentPerTerm - interest
                    principalsPaid += principal
                    interestsPaid += interest
                    return (
                        <div className="flex flex-row" key={num}>
                            <span className="flex-1">{num + 1}</span>
                            <span className="flex-1 hidden md:block">
                                ${paymentPerTerm.formatted}
                            </span>
                            <span className="flex-1">
                                ${principal.formatted}
                            </span>
                            <span className="flex-1">
                                ${interest.formatted}
                            </span>
                            <span className="flex-1 hidden md:block">
                                ${principalsPaid.formatted}
                            </span>
                        </div>
                    )
                })}
                <div className="flex-row hidden md:flex">
                    <span className="flex-1">Total Paid</span>
                    <span className="flex-1">
                        ${(paymentPerTerm * numberOfPayments).formatted}
                    </span>
                    <span className="flex-1">${basePrice.formatted}</span>
                    <span className="flex-1">${interestsPaid.formatted}</span>
                    <span className="flex-1">${basePrice.formatted}</span>
                </div>
                <div className="flex flex-col md:hidden mt-2">
                    <span>
                        Total Payment: $
                        {(paymentPerTerm * numberOfPayments).formatted}
                    </span>
                    <span>Total Interests: ${interestsPaid.formatted}</span>
                </div>
            </div>
        </div>
    )
}

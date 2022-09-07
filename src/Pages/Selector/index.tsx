import React from 'react'
import { Link } from 'react-router-dom'

export default function Selector() {
    return (
        <div className="flex flex-col items-center space-y-5">
            <Link
                className="text-2xl rounded-2xl bg-accent-background-light dark:bg-accent-background-dark py-2 w-1/2 flex justify-center text-center"
                to="/tax"
            >
                Income Tax Calculator
            </Link>
            <Link
                className="text-2xl rounded-2xl bg-accent-background-light dark:bg-accent-background-dark py-2 w-1/2 flex justify-center text-center"
                to="/loan"
            >
                Loan Repayment Calculator
            </Link>
        </div>
    )
}

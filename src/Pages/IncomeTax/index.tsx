import React from 'react'
import { FederalTax, TaxRule } from 'Utils/TaxRules'

export default function IncomeTax() {
    console.log('Calculation start')
    console.log('Provincial Tax')
    const calculated = FederalTax.apply(85000, 26)
    console.log(calculated)
    return (
        <div className="flex flex-col">
            <span>test</span>
        </div>
    )
}

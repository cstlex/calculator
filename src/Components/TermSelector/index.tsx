import React from 'react'
import { PaymentTerms, termsRepresentation } from 'Utils/GlobalValues'
import cn from 'classnames'

type Props = {
    terms: PaymentTerms[]
    value: PaymentTerms
    onValueChange: (arg0: PaymentTerms) => void
}

export default function TermSelector({
    terms,
    value,
    onValueChange,
    className,
}: Props & React.HTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={cn('bg-white dark:bg-black h-8', className)}
            value={value}
            onChange={(e) => onValueChange(parseInt(e.target.value))}
        >
            {terms.map((term) => (
                <option value={term} key={term}>
                    {termsRepresentation(term)}
                </option>
            ))}
        </select>
    )
}

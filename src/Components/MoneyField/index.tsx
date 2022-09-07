import React from 'react'
import { useNumberState } from 'Utils/NumberState'
import cn from 'classnames'

type Props = {
    value: number
    setValue: (arg0: number) => void
}

export default function MoneyField({
    value,
    setValue,
    className,
}: Props & React.HTMLAttributes<HTMLInputElement>) {
    const [showingValue, setShowingValue] = React.useState(`${value}`)
    const [finalValue, setFinalValue] = useNumberState(value)

    React.useEffect(() => {
        setValue(finalValue)
        setShowingValue(`$${finalValue.formatted}`)
    }, [finalValue])

    return (
        <input
            className={cn('p-2 h-8', className)}
            value={showingValue}
            onChange={(e) => setShowingValue(e.target.value)}
            onBlur={(e) => setFinalValue(e.target.value)}
        />
    )
}

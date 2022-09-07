import React from 'react'
import { useNumberState } from 'Utils/NumberState'
import cn from 'classnames'
import 'Utils/Extensions/NumberUtils'

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

    const onEditFinished = (text: string) => {
        const filtered = text.replace(/[^0-9.]/g, '')
        const numberValue = parseFloat(filtered)
        if (Number.isNaN(numberValue) || numberValue === finalValue) {
            setShowingValue(`$${finalValue.formatted}`)
        } else {
            setFinalValue(filtered)
        }
    }

    return (
        <input
            className={cn('p-2 h-8', className)}
            value={showingValue}
            onChange={(e) => setShowingValue(e.target.value)}
            onBlur={(e) => onEditFinished(e.target.value)}
        />
    )
}

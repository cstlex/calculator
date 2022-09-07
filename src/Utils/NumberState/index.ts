import React from 'react'

export function useNumberState(
    defaultValue?: number,
): [number, (arg0: string) => void] {
    const [number, setNumber] = React.useState<number>(defaultValue ?? 0)

    const filterValue = (newValue: string) => {
        const filtered = newValue.replace(/[^0-9.]/g, '')
        const numberValue = parseFloat(filtered)
        if (!Number.isNaN(numberValue)) {
            setNumber(numberValue)
        }
    }

    return [number, filterValue]
}

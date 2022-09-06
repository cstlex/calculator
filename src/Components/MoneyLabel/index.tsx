import React from 'react'
import cn from 'classnames'
import 'Utils/Extensions/NumberUtils'

type Props = {
    value: number
}

export default function MoneyLabel({
    value,
    className,
}: Props & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <span className={cn('font-mono flex-grow text-end', className)}>
            ${value.formatted}
        </span>
    )
}

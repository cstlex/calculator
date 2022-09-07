import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'

export default function Menu({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'h-16 bg-black flex flex-row items-center px-5 print:hidden text-white',
                className,
            )}
        >
            <span className="text-2xl">Calculator</span>
            <Link className="ml-3" to="tax">
                Income Tax
            </Link>
            <Link className="ml-3" to="loan">
                Loan
            </Link>
        </div>
    )
}

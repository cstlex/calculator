import React from 'react'
import { Link } from 'react-router-dom'

export default function Menu() {
    return (
        <div className="h-16 bg-black flex flex-row items-center px-5">
            <span className="text-2xl text-white">Calculator</span>
            <Link className="ml-3" to="tax">
                Income Tax
            </Link>
            <Link className="ml-3" to="loan">
                Loan
            </Link>
        </div>
    )
}

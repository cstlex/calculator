import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Menu from 'Components/Menu'
import IncomeTax from 'Pages/IncomeTax'
import LoanRepayment from 'Pages/LoanRepayment'
import Selector from 'Pages/Selector'

export default function App() {
    return (
        <div className="flex flex-col h-screen bg-accent-background-light dark:bg-accent-background-dark text-black dark:text-white">
            <Menu />
            <div className="flex-grow print:flex-grow-0 px-5 py-5 flex flex-col">
                <div className="h-0 print:h-full flex-grow overflow-scroll bg-accent-cardBackground-light dark:bg-accent-cardBackground-dark rounded-2xl px-2 py-2">
                    <Routes>
                        <Route path="/" element={<Selector />} />
                        <Route path="/tax" element={<IncomeTax />} />
                        <Route path="/loan" element={<LoanRepayment />} />
                        <Route
                            path="*"
                            element={<Navigate to="/tax" replace />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

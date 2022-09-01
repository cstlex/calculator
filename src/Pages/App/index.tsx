import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Menu from 'Components/Menu'
import IncomeTax from 'Pages/IncomeTax'

export default function App() {
    return (
        <div className="flex flex-col h-screen bg-accent-background-light dark:bg-accent-background-dark text-black dark:text-white">
            <Menu />
            <div className="flex-grow px-5 py-5 flex flex-col">
                <div className="h-0 flex-grow overflow-scroll bg-accent-cardBackground-light dark:bg-accent-cardBackground-dark rounded-2xl px-2 py-2">
                    <Routes>
                        <Route path="/tax" element={<IncomeTax />} />
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

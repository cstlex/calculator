export function interestAtPeriod(
    currentPeriod: number,
    interestRatePerPeriod: number,
    presentValue: number,
    paymentPerPeriod: number,
): number {
    return (
        futureValue(
            interestRatePerPeriod,
            currentPeriod - 1,
            -1 * paymentPerPeriod,
            presentValue,
        ) * interestRatePerPeriod
    )
}

export function futureValue(
    interestRatePerPeriod: number,
    numberOfPeriods: number,
    paymentPerPeriod: number,
    presentValue: number,
): number {
    if (interestRatePerPeriod === 0) {
        return -(presentValue + paymentPerPeriod * numberOfPeriods)
    }

    const ratePowered = Math.pow(1 + interestRatePerPeriod, numberOfPeriods)
    return (
        -presentValue * ratePowered -
        (paymentPerPeriod / interestRatePerPeriod) * (ratePowered - 1)
    )
}

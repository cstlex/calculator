export function interestAtPeriod(
    currentPeriod: number,
    interestRatePerPeriod: number,
    presentValue: number,
    paymentPerPeriod: number,
): number {
    const fv =
        futureValue(
            interestRatePerPeriod,
            currentPeriod - 1,
            -1 * paymentPerPeriod,
            presentValue,
        ) * interestRatePerPeriod
    return fv
}

export function futureValue(
    interestRatePerPeriod: number,
    numberOfPeriods: number,
    paymentPerPeriod: number,
    presentValue: number,
): number {
    const isRateZero = interestRatePerPeriod === 0

    if (interestRatePerPeriod === 0) {
        return -(presentValue + paymentPerPeriod * numberOfPeriods)
    }

    const ratePowered = Math.pow(1 + interestRatePerPeriod, numberOfPeriods)
    return (
        -presentValue * ratePowered -
        (paymentPerPeriod / interestRatePerPeriod) * (ratePowered - 1)
    )
}

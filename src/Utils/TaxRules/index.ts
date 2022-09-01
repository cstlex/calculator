export type TaxCalculated = {
    basePayment: number
    totalIncomeTax: number
    totalDeducted: number
}
export class Tax {
    constructor(
        // Income tax
        public main: TaxRule[],
        // Other deductibles like CPP and EI
        public termDeduction: TaxRule[],
        // Tax credits
        public credits: TaxRule[],
    ) {}

    public apply(amount: number, termCount: number): TaxCalculated {
        const deducted = this.termDeduction.map((rule) => ({
            name: rule.name,
            amount: rule.apply(amount, termCount),
        }))
        console.log(deducted)
        const totalDeducted = deducted
            .map((rule) => rule.amount)
            .reduce((prev, next) => prev + next)

        const incomeTax = this.main
            .map((rule) => ({
                name: rule.name,
                amount: rule.apply(amount),
            }))
            .filter((tax) => tax.amount > 0)
        console.log(incomeTax)
        const totalIncomeTax = incomeTax
            .map((tax) => tax.amount)
            .reduce((prev, next) => prev + next)

        const credits = this.credits.map((rule) => ({
            name: rule.name,
            amount: rule.apply(amount),
        }))
        console.log(credits)
        const taxCredit = credits
            .map((rule) => rule.amount)
            .reduce((prev, next) => prev + next)
        console.log(taxCredit)

        return {
            basePayment: amount / termCount,
            totalIncomeTax: (totalIncomeTax - taxCredit) / termCount,
            totalDeducted,
        }
    }
}

export class TaxRule {
    constructor(
        public name: string,
        // in percentage
        public rate: number,
        public minimumApplicable?: number,
        public maximumApplicable?: number,
        public baseDeduction?: number,
        public subRules?: TaxRule[],
    ) {}

    apply(amount: number, termCount?: number): number {
        let applicableAmount: number = amount
        if (this.minimumApplicable) {
            if (applicableAmount < this.minimumApplicable) {
                return 0
            }
            applicableAmount -= this.minimumApplicable
        }
        if (this.maximumApplicable) {
            applicableAmount = Math.min(
                applicableAmount,
                this.maximumApplicable - (this.minimumApplicable ?? 0),
            )
        }

        if (this.baseDeduction) {
            applicableAmount -= this.baseDeduction
        }

        if (applicableAmount < 0) {
            return 0
        }

        if (termCount) {
            applicableAmount /= termCount
        }

        if (this.subRules) {
            applicableAmount = this.subRules
                .map((rule) => rule.apply(applicableAmount, termCount))
                .reduce((prev, next) => prev + next)
        }

        return applicableAmount * (this.rate / 100)
    }
}

class FixedAmountRule extends TaxRule {
    constructor(public name: string, public amount: number) {
        super(name, 100.0)
    }

    override apply(amount: number, termCount?: number): number {
        return super.apply(this.amount, termCount)
    }
}

class MinimumFixedAmountRule extends FixedAmountRule {
    override apply(amount: number, termCount?: number): number {
        const amountBackup = this.amount
        this.amount = Math.min(amount, this.amount)
        const result = super.apply(amount, termCount)
        this.amount = amountBackup
        return result
    }
}

export const FederalTax = new Tax(
    [
        new TaxRule('15%', 15, 0, 50197),
        new TaxRule('20.5%', 20.5, 50197, 100392),
        new TaxRule('26%', 26, 100392, 155625),
        new TaxRule('29%', 29, 155625, 221708),
        new TaxRule('33%', 33, 221709),
    ],
    [
        new TaxRule('CPP', 5.7, undefined, undefined, 3500),
        new TaxRule('EI', 1.58, undefined, undefined),
    ],
    [
        new TaxRule('Tax Credit', 15, undefined, undefined, undefined, [
            new FixedAmountRule('Basic Personal Amount', 14398),
            new TaxRule('CPP', 5.7, undefined, 64900, 3500),
            new TaxRule('EI', 1.58, undefined, 60300),
            new MinimumFixedAmountRule('Canada Employment Amount', 1287),
        ]),
    ],
)

export const ProvincialTax = new Tax(
    [
        new TaxRule('5.05%', 5.05, 0, 46226),
        new TaxRule('9.15%', 9.15, 46226, 92454),
        new TaxRule('11.16%', 9.15, 92454, 150000),
    ],
    [],
    [],
)

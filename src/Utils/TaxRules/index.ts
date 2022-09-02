export type TaxCalculated = {
    basePayment: number
    totalIncomeTax: number
    totalDeducted: number
    details: { name: string; amount: number }[]
}
export class Tax {
    constructor(
        // Income tax
        public main: TaxRule[],
        // Other deductibles like CPP and EI
        public termDeduction: TaxRule[],
        // Surtax applied to main taxes
        public surtax: TaxRule[],
        // Tax credits
        public credits: TaxRule[],
    ) {}

    public apply(amount: number, termCount: number): TaxCalculated {
        const deducted = this.termDeduction
            .map((rule) => ({
                name: rule.name,
                amount: rule.apply(amount, termCount),
            }))
            .filter((rule) => rule.amount > 0)
        const totalDeducted = deducted
            .map((rule) => rule.amount)
            .reduce((prev, next) => prev + next, 0)

        const incomeTax = this.main
            .map((rule) => ({
                name: rule.name,
                amount: rule.apply(amount),
            }))
            .filter((tax) => tax.amount > 0)
        const totalIncomeTax = incomeTax
            .map((tax) => tax.amount)
            .reduce((prev, next) => prev + next, 0)

        const credits = this.credits
            .map((rule) => ({
                name: rule.name,
                amount: rule.apply(amount),
            }))
            .filter((rule) => rule.amount > 0)
        const taxCredit = credits
            .map((rule) => rule.amount)
            .reduce((prev, next) => prev + next, 0)

        const baseIncomeTax = totalIncomeTax - taxCredit
        const surtaxes = this.surtax
            .map((rule) => ({
                name: rule.name,
                amount: rule.apply(baseIncomeTax),
            }))
            .filter((rule) => rule.amount > 0)
        const totalSurtaxes = surtaxes
            .map((tax) => tax.amount)
            .reduce((prev, next) => prev + next, 0)
        let surtaxed = baseIncomeTax + totalSurtaxes

        if (surtaxed < 0) {
            surtaxed = 0
        }

        return {
            basePayment: amount / termCount,
            totalIncomeTax: surtaxed / termCount,
            totalDeducted,
            details: [
                ...deducted,
                ...incomeTax.map((tax) => ({
                    name: tax.name,
                    amount: tax.amount / termCount,
                })),
                ...surtaxes.map((tax) => ({
                    name: tax.name,
                    amount: tax.amount / termCount,
                })),
                ...credits.map((credit) => ({
                    name: credit.name,
                    amount: (-1 * credit.amount) / termCount,
                })),
            ],
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
                .reduce((prev, next) => prev + next, 0)
        }

        return applicableAmount * (this.rate / 100)
    }
}

class FixedAmountRule extends TaxRule {
    constructor(name: string, public amount: number) {
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

class OntarioHealthPremiumRule extends TaxRule {
    constructor(
        rate: number,
        public baseAmount: number,
        public minimumAmount: number,
        minimumApplicable: number,
        maximumApplicable?: number,
    ) {
        super(
            'Ontario Health Premium',
            rate,
            minimumApplicable,
            maximumApplicable,
        )
    }

    override apply(amount: number, termCount?: number): number {
        if (this.minimumApplicable && this.minimumApplicable > amount) {
            return 0
        }

        if (this.maximumApplicable && this.maximumApplicable < amount) {
            return 0
        }

        let resultingAmount =
            this.baseAmount +
            ((amount - (this.minimumApplicable ?? 0)) * this.rate) / 100

        resultingAmount = Math.min(this.minimumAmount, resultingAmount)

        if (termCount) {
            resultingAmount /= termCount
        }

        return resultingAmount
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
    [],
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
        new TaxRule('11.16%', 11.16, 92454, 150000),
        new TaxRule('12.16%', 12.16, 150000, 220000),
        new TaxRule('13.16%', 13.16, 220000),
    ],
    [
        new OntarioHealthPremiumRule(6, 0, 300, 20000, 36000),
        new OntarioHealthPremiumRule(6, 300, 450, 36000, 48000),
        new OntarioHealthPremiumRule(25, 450, 600, 48000, 72000),
        new OntarioHealthPremiumRule(25, 600, 750, 72000, 200000),
        new OntarioHealthPremiumRule(25, 750, 900, 200000),
    ],
    [
        new TaxRule('20% Surtax', 20, 4991, 6387),
        new TaxRule('36% Surtax', 36, 6387),
    ],
    [
        new TaxRule('Tax Credit', 5.05, undefined, undefined, undefined, [
            new FixedAmountRule('Basic Personal Amount', 11141),
            new TaxRule('CPP', 5.7, undefined, 64900, 3500),
            new TaxRule('EI', 1.58, undefined, 60300),
        ]),
    ],
)

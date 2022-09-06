export enum PaymentTerms {
    monthly = 12,
    twiceMonth = 24,
    biWeekly = 26,
    weekly = 52,
}

export const AllPaymentTerms: PaymentTerms[] = [
    PaymentTerms.monthly,
    PaymentTerms.twiceMonth,
    PaymentTerms.biWeekly,
    PaymentTerms.weekly,
]

export function termsRepresentation(term: PaymentTerms): string {
    switch (term) {
        case PaymentTerms.monthly:
            return 'Monthly'
        case PaymentTerms.twiceMonth:
            return 'Twice a month'
        case PaymentTerms.biWeekly:
            return 'Bi-Weekly'
        case PaymentTerms.weekly:
            return 'Weekly'
    }
}

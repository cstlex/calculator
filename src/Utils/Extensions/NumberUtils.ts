declare global {
    interface Number {
        formatted: string
        range: number[]
    }
}

// eslint-disable-next-line no-extend-native
Object.defineProperty(Number.prototype, 'formatted', {
    get: function (): string {
        const value = this.toFixed(2).toString()

        if (this > 1000) {
            const components = value.split('.')
            let integerPart = components[0]
            const floatPart = components[1]
            const thousandRegex = /(\d+)(\d{3})/
            while (thousandRegex.test(integerPart)) {
                integerPart = integerPart.replace(
                    thousandRegex,
                    '$1' + ',' + '$2',
                )
            }
            return integerPart + '.' + floatPart
        } else {
            return value
        }
    },
})

// eslint-disable-next-line no-extend-native
Object.defineProperty(Number.prototype, 'range', {
    get: function (): number[] {
        const range: number[] = []

        for (let i = 0; i < this; i++) {
            range.push(i)
        }

        return range
    },
})

export {}

export class StringToDecimalTransformer {
    from(value: string): number {
        const decimal = +value;
        return +decimal.toFixed(2);
    }

    to(value: number): number {
        return value;
    }
}
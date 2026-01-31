'use client';

interface PriceProps {
    value: number;
    currencyCode?: string;
}

export function Price({value, currencyCode = 'ARS'}: PriceProps) {
    return (
        <>
            {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: currencyCode,
            }).format(value / 100)}
        </>
    );
}

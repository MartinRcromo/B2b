import {ProductCardSimple} from './product-card-simple';
import {Pagination} from '@/components/shared/pagination';
import {SortDropdown} from './sort-dropdown';

interface SimpleProduct {
    id: string;
    name: string;
    slug: string;
    featuredAsset?: {
        id: string;
        preview: string;
    } | null;
    variants: Array<{
        id: string;
        priceWithTax: number;
    }>;
}

interface ProductGridFallbackProps {
    products: SimpleProduct[];
    totalItems: number;
    currentPage: number;
    take: number;
}

export function ProductGridFallback({products, totalItems, currentPage, take}: ProductGridFallbackProps) {
    const totalPages = Math.ceil(totalItems / take);

    if (!products.length) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </p>
                <SortDropdown/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCardSimple key={product.id} product={product}/>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages}/>
            )}
        </div>
    );
}

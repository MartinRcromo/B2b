import {ProductCardSimple} from "@/components/commerce/product-card-simple";
import {cacheLife} from "next/cache";
import {query} from "@/lib/vendure/api";
import {GetAllProductsQuery, SearchProductsQuery} from "@/lib/vendure/queries";
import {ProductCarousel} from "@/components/commerce/product-carousel";

async function getFeaturedProducts() {
    'use cache'
    cacheLife('days')

    // Try search API first (works when search index is built for channel)
    try {
        const searchResult = await query(SearchProductsQuery, {
            input: {
                take: 12,
                skip: 0,
                groupByProduct: true
            }
        });

        if (searchResult.data.search.items.length > 0) {
            return { type: 'search' as const, items: searchResult.data.search.items };
        }
    } catch {
        // Search failed, fall through
    }

    // Fallback: use products API directly (always works for channel)
    const productsResult = await query(GetAllProductsQuery, {
        options: { take: 12, skip: 0 }
    });

    return { type: 'products' as const, items: productsResult.data.products.items };
}


export async function FeaturedProducts() {
    const result = await getFeaturedProducts();

    if (!result.items || result.items.length === 0) {
        return null;
    }

    // If search worked, use the carousel with ProductCard fragments
    if (result.type === 'search') {
        return (
            <ProductCarousel
                title="Productos Destacados"
                products={result.items}
            />
        );
    }

    // Otherwise, render products directly using simple cards
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Productos Destacados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {result.items.map((product) => (
                        <ProductCardSimple key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

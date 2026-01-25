import {ProductCarousel} from "@/components/commerce/product-carousel";
import {cacheLife} from "next/cache";
import {query} from "@/lib/vendure/api";
import {SearchProductsQuery} from "@/lib/vendure/queries";

async function getFeaturedProducts() {
    'use cache'
    cacheLife('days')

    // Buscar todos los productos disponibles
    const result = await query(SearchProductsQuery, {
        input: {
            take: 12,
            skip: 0,
            groupByProduct: true
        }
    });

    return result.data.search.items;
}


export async function FeaturedProducts() {
    const products = await getFeaturedProducts();

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <ProductCarousel
            title="Productos Destacados"
            products={products}
        />
    )
}
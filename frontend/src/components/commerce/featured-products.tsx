import {ProductCarousel} from "@/components/commerce/product-carousel";
import {cacheLife} from "next/cache";
import {query} from "@/lib/vendure/api";
import {GetCollectionProductsQuery, SearchProductsQuery} from "@/lib/vendure/queries";

async function getFeaturedCollectionProducts() {
    'use cache'
    cacheLife('days')

    // First try to fetch from a "featured" collection
    try {
        const result = await query(GetCollectionProductsQuery, {
            slug: "featured",
            input: {
                collectionSlug: "featured",
                take: 12,
                skip: 0,
                groupByProduct: true
            }
        });

        if (result.data.collection && result.data.search.items.length > 0) {
            return result.data.search.items;
        }
    } catch {
        // Collection doesn't exist, fall through to show all products
    }

    // Fallback: show all products when no "featured" collection exists
    const searchResult = await query(SearchProductsQuery, {
        input: {
            take: 12,
            skip: 0,
            groupByProduct: true
        }
    });

    return searchResult.data.search.items;
}


export async function FeaturedProducts() {
    const products = await getFeaturedCollectionProducts();

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
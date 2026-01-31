import {Suspense} from "react";
import {FacetFilters} from "@/components/commerce/facet-filters";
import {ProductGridSkeleton} from "@/components/shared/product-grid-skeleton";
import {ProductGrid} from "@/components/commerce/product-grid";
import {ProductGridFallback} from "@/components/commerce/product-grid-fallback";
import {buildSearchInput, getCurrentPage} from "@/lib/search-helpers";
import {query} from "@/lib/vendure/api";
import {SearchProductsQuery, GetAllProductsQuery} from "@/lib/vendure/queries";

interface SearchResultsProps {
    searchParams: Promise<{
        page?: string
    }>
}

export async function SearchResults({searchParams}: SearchResultsProps) {
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);

    // Try search API first
    const searchResult = await query(SearchProductsQuery, {
        input: buildSearchInput({searchParams: searchParamsResolved})
    });

    const hasSearchResults = searchResult.data.search.items.length > 0;

    // If search has results, use normal flow
    if (hasSearchResults) {
        const productDataPromise = Promise.resolve(searchResult);

        return (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg"/>}>
                        <FacetFilters productDataPromise={productDataPromise}/>
                    </Suspense>
                </aside>
                <div className="lg:col-span-3">
                    <Suspense fallback={<ProductGridSkeleton/>}>
                        <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12}/>
                    </Suspense>
                </div>
            </div>
        );
    }

    // Fallback: use products API directly when search index is empty
    const productsResult = await query(GetAllProductsQuery, {
        options: { take: 12, skip: (page - 1) * 12 }
    });

    return (
        <div>
            <Suspense fallback={<ProductGridSkeleton/>}>
                <ProductGridFallback
                    products={productsResult.data.products.items}
                    totalItems={productsResult.data.products.totalItems}
                    currentPage={page}
                    take={12}
                />
            </Suspense>
        </div>
    );
}

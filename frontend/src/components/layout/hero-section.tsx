import {Button} from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative bg-muted overflow-hidden">
            <div className="container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2">
                        Argenta Autopartes B2B
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Portal exclusivo para distribuidores. Catálogo completo, precios competitivos y gestión de pedidos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button asChild size="lg" className="min-w-[200px]">
                            <Link href="/search">
                                Ver Catálogo
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                            <Link href="/sign-in">
                                Iniciar Sesión
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

        </section>
    );
}

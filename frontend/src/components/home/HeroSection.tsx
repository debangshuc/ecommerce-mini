import { ArrowRight, Truck, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { getProductsByIds } from "@/services/productService";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

const highlights = [
  { icon: Truck, text: `Free delivery over ${formatPrice(FREE_DELIVERY_THRESHOLD)}` },
  { icon: Tag, text: "Student-friendly prices" },
  { icon: Star, text: "4.5+ rated essentials" },
];

export function HeroSection() {
  const collage = getProductsByIds(["1", "8", "18"]);

  return (
    <section className="container-page pt-6 lg:pt-10">
      <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-lavender-50 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
        <div>
          <span className="inline-flex items-center rounded-full bg-peach-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-peach-600">
            Back-to-campus essentials
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
            Everything You Need to Make Your{" "}
            <span className="text-lavender-600">Semester Better.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-soft">
            Notebooks, pens, calculators, art supplies and ready-made student
            kits, all in one place and priced for a student budget.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/shop" size="lg" rightIcon={<ArrowRight size={18} />}>
              Shop Now
            </Button>
            <Button href="/shop?category=student-kits" size="lg" variant="outline">
              Explore Student Kits
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {highlights.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 text-sm font-medium text-ink-soft"
              >
                <Icon size={18} className="text-lavender-600" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="grid h-[360px] grid-cols-5 grid-rows-2 gap-4 sm:h-[460px]">
            {collage.map((product, index) => (
              <ProductImage
                key={product.id}
                src={product.image}
                alt={product.name}
                priority={index === 0}
                sizes="(max-width: 1024px) 90vw, 40vw"
                className={cn(
                  "h-full w-full rounded-3xl",
                  index === 0 ? "col-span-3 row-span-2" : "col-span-2"
                )}
              />
            ))}
          </div>
          <div className="absolute -bottom-3 left-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-lift sm:left-8">
            <p className="text-xs font-semibold text-ink-muted">Student kits from</p>
            <p className="text-xl font-bold text-lavender-700">{formatPrice(799)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
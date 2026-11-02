import { RotateCcw, ShieldCheck, Tag, Truck } from "lucide-react";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: Tag,
    title: "Student-friendly prices",
    text: "Everyday essentials and bundles priced to fit a student budget.",
    tone: "bg-lavender-100 text-lavender-700",
  },
  {
    icon: Truck,
    title: "Fast, affordable delivery",
    text: `Free delivery on orders above ${formatPrice(FREE_DELIVERY_THRESHOLD)}.`,
    tone: "bg-sky-100 text-sky-500",
  },
  {
    icon: ShieldCheck,
    title: "Trusted brands",
    text: "Genuine products from brands students already rely on.",
    tone: "bg-mint-100 text-mint-600",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    text: "Wrong item or damaged pack? Return it within 7 days.",
    tone: "bg-peach-100 text-peach-600",
  },
];

export function WhyShop() {
  return (
    <section className="container-page py-12 lg:py-16">
      <SectionHeading
        align="center"
        eyebrow="Why CampusCart"
        title="Why Shop With CampusCart"
        subtitle="Built by students, for students."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text, tone }) => (
          <div key={title} className="card-soft p-6">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
              <Icon size={24} />
            </span>
            <h3 className="mt-5 font-sans text-base font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
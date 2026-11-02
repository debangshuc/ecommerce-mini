import { GraduationCap } from "lucide-react";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export function AnnouncementBar() {
  return (
    <div className="bg-lavender-700 text-white">
      <div className="container-page flex items-center justify-center gap-2 py-2 text-center text-xs font-medium sm:text-sm">
        <GraduationCap size={16} className="shrink-0" aria-hidden="true" />
        <p>
          Student offer: free delivery above{" "}
          {formatPrice(FREE_DELIVERY_THRESHOLD)} · Save more with CampusCart
          bundles
        </p>
      </div>
    </div>
  );
}
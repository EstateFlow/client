import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
type PreviewItem = {
  image: string;
  type: string;
  rooms: number;
  size: number;
  price: string;
};

export function RealEstatePreview({ items }: { items: PreviewItem[] }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-white shadow-md p-2 w-64">
          <img src={item.image} alt="" className="w-full h-36 object-contain bg-muted mb-2 rounded-md" />
          <div className="font-semibold">{item.type}</div>
          <div className="text-sm text-muted-foreground">{item.rooms} {t("rooms")} • {item.size} m²</div>
          <div className="font-bold">{item.price}</div>
          <div className="flex mt-1">
            {Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { productCategoriesApi, productsApi } from "../../../api/endpoints/products";

export function DashboardPage() {
  const { data: products } = useQuery({
    queryKey: ["products", "dashboard"],
    queryFn: () => productsApi.getPaged({ page: 1, pageSize: 1 }),
  });

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productCategoriesApi.getAll,
  });

  const cards = [
    { label: "Jami mahsulotlar", value: products?.totalCount ?? "—" },
    { label: "Jami kategoriyalar", value: categories?.length ?? "—" },
    { label: "Jami bloglar", value: "—" },
    { label: "Yangi murojaatlar", value: "—" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Boshqaruv paneli</h1>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-400">
        Blog va murojaatlar (contacts) modullari hozircha ishlab chiqilmagan — Auth, Media, Mahsulot va Sahifa
        modullari ustida ishlandi.
      </p>
    </div>
  );
}

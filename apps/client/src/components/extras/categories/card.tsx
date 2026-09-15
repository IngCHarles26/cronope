import { cn } from "../../../lib/utils";
import { useGetCategories } from "./hooks/useGetCategories";
import { NewCategoriesForm } from "./new-categories";

interface Props {
  className?: string;
}

export const CategoriesCard = ({ className }: Props) => {
  const { data } = useGetCategories();

  if (!data) return null;

  return (
    <section className={cn(className, "space-y-4 ")}>
      <div className="flex items-center justify-between gap-3 border-b pb-2 border-chart-1">
        <h2 className="font-heading text-lg font-bold uppercase tracking-widest text-chart-2">
          Categorías
        </h2>

        <NewCategoriesForm />
      </div>

      <ul className="grid grid-cols-1 gap-3">
        {data.map(({ id, name }) => (
          <li
            key={id}
            className="flex items-center justify-between gap-3 rounded border border-chart-1 bg-surface px-2 py-1 uppercase">
            <span className="text-sm font-medium text-chart-2">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

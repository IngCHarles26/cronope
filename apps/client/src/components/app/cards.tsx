interface Props {
  info: [string, string | number][];
}

export const CardItemsInfo = ({ info }: Props) => {
  return (
    <div className="space-y-0.5 text-[0.7rem] w-full">
      {info.map(([label, value], index) => (
        <p key={index + label + "optioncard"} className="flex items-center gap-3 w-full">
          <span className="text-text-soft text-left uppercase tracking-wider w-full">{label}</span>
          <span className="text-text truncate text-right font-semibold w-full">{value}</span>
        </p>
      ))}
    </div>
  );
};

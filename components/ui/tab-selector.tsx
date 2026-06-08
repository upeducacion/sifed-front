import { cn } from "@/lib/utils";

interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabSelectorProps {
  options: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function TabSelector({
  options,
  activeTab,
  onChange,
  className,
}: TabSelectorProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1 p-1.5 bg-brand-50 rounded-2xl w-fit border border-brand-100/50", className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === option.id
              ? "bg-white text-brand-600 shadow-sm border border-brand-100"
              : "text-brand-950/40 hover:text-brand-950"
          )}
        >
          {option.icon && <span className="shrink-0">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}

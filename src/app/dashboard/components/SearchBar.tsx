import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-500 transition-colors">
        <Search size={18} />
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documents..."
        className="
          block w-full pl-10 pr-4 py-2.5 
          bg-white border border-neutral-200 rounded-xl
          text-sm text-neutral-900 placeholder:text-neutral-400
          outline-none
          shadow-sm
          focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
          transition-all duration-200
        "
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <kbd className="hidden md:inline-flex items-center h-5 px-1.5 text-[10px] font-medium text-neutral-400 bg-neutral-50 border border-neutral-200 rounded font-sans">
          /
        </kbd>
      </div>
    </div>
  );
}
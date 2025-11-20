export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-[#FFCF91]" style={{ borderColor: "#FFBD71" }}>
      <div className="flex items-center px-3">
        <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2">
          <circle cx="11" cy="11" r="7" stroke="#FFBD71" strokeWidth="2" fill="none" />
          <path d="M20 20l-3-3" stroke="#FFBD71" strokeWidth="2" />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
          className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-black/50"
        />
      </div>
    </div>
  );
}

import { LucideIcon, Search } from "lucide-react";
import { Input } from "./ui/input";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterFieldProps {
  type?: "select" | "text"; // default select
  value: string;
  onChange: (value: string) => void;
  options?: FilterOption[]; // required for select
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function FilterField({
  type = "text",
  value,
  onChange,
  options = [],
  placeholder = "Select",
  icon: Icon,
  className = "",
}: FilterFieldProps) {
  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      {type === "text" ? (
        <div className="relative flex-1 max-w-xs ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10  "
          />
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm"
        >
          <option value="all">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

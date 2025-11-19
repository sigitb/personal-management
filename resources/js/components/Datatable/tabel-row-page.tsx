import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RowPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export function RowPerPage({ value, onChange, options = [10, 25, 50, 100] }: RowPerPageProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">per page</span>

      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="rounded-[7px]" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={String(opt)}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

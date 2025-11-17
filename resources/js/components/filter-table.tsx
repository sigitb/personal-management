import React from "react";
import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TableFiltersProps {
  filters: {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  };
  onChange: (name: string, value: string) => void;
  onReset: () => void;
}

export function TableFilters({ filters, onChange, onReset }: TableFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-end mb-3">
      <Input
        placeholder="🔍 Cari..."
        value={filters.search || ""}
        onChange={(e) => onChange("search", e.target.value)}
        className="w-48"
      />
      {/* <Select
        value={filters.status || ""}
        onValueChange={(val) => onChange("status", val)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Semua</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="inactive">Nonaktif</SelectItem>
        </SelectContent>
      </Select> */}
      <Input
        type="date"
        value={filters.date_from || ""}
        onChange={(e) => onChange("date_from", e.target.value)}
      />
      <Input
        type="date"
        value={filters.date_to || ""}
        onChange={(e) => onChange("date_to", e.target.value)}
      />
      <Button variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}

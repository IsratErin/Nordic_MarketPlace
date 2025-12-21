import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, DollarSign, Package } from "lucide-react";
import type { ProductFilters } from "../types/product.types";
import { FilterButton } from "./filterButton";

interface ProductFilterProps {
  filters: ProductFilters;
  categories: Array<{ id: number; name: string }>;
  onFilterChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

type FilterDropdown = "search" | "category" | "price" | "stock" | null;

export const ProductFilter = ({
  filters,
  categories,
  onFilterChange,
  onReset,
}: ProductFilterProps) => {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);
  const [openDropdown, setOpenDropdown] = useState<FilterDropdown>(null);

  // Sync external filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilters = (patch: Partial<ProductFilters>) => {
    const next = { ...localFilters, ...patch };
    setLocalFilters(next);
    onFilterChange(next);
  };

  const toggleDropdown = (dropdown: FilterDropdown) =>
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateFilters({ searchQuery: e.target.value || undefined });

  const handleCategoryChange = (value: string) =>
    updateFilters({
      categoryId: value === "all" ? undefined : Number(value),
    });

  const handleInStockChange = (value: string) =>
    updateFilters({
      inStock: value === "all" ? undefined : value === "true",
    });

  const handlePriceChange =
    (key: "minPrice" | "maxPrice") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setLocalFilters((prev) => ({
        ...prev,
        [key]: e.target.value ? Number(e.target.value) : undefined,
      }));

  const applyPriceFilter = () => {
    onFilterChange(localFilters);
    setOpenDropdown(null);
  };

  const resetFilters = () => {
    setLocalFilters({});
    onReset();
    setOpenDropdown(null);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <FilterButton
          active={!!filters.searchQuery}
          icon={<Search className="h-4 w-4" />}
          label="Search"
          open={openDropdown === "search"}
          onClick={() => toggleDropdown("search")}
        >
          <Input
            autoFocus
            placeholder="Search products..."
            value={localFilters.searchQuery ?? ""}
            onChange={handleSearchChange}
          />
        </FilterButton>

        {/* Category */}
        <FilterButton
          active={!!filters.categoryId}
          icon={<Filter className="h-4 w-4" />}
          label="Category"
          open={openDropdown === "category"}
          onClick={() => toggleDropdown("category")}
        >
          <Select
            value={localFilters.categoryId?.toString() ?? "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterButton>

        {/* Price */}
        <FilterButton
          active={!!filters.minPrice || !!filters.maxPrice}
          icon={<DollarSign className="h-4 w-4" />}
          label="Price"
          open={openDropdown === "price"}
          onClick={() => toggleDropdown("price")}
        >
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice ?? ""}
                onChange={handlePriceChange("minPrice")}
              />
              <Input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice ?? ""}
                onChange={handlePriceChange("maxPrice")}
              />
            </div>
            <Button size="sm" className="w-full" onClick={applyPriceFilter}>
              Apply
            </Button>
          </div>
        </FilterButton>

        {/* Stock */}
        <FilterButton
          active={filters.inStock !== undefined}
          icon={<Package className="h-4 w-4" />}
          label="Availability"
          open={openDropdown === "stock"}
          onClick={() => toggleDropdown("stock")}
        >
          <Select
            value={
              localFilters.inStock === undefined
                ? "all"
                : localFilters.inStock.toString()
            }
            onValueChange={handleInStockChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="true">In Stock</SelectItem>
              <SelectItem value="false">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </FilterButton>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear all ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { CreateProductDTO } from "../types/product.types";

interface AddProductModalProps {
  onClose: () => void;
  onSubmit: (data: CreateProductDTO) => Promise<void>;
  categories: Array<{ id: number; name: string }>;
}

export const AddProductModal = ({
  onClose,
  onSubmit,
  categories,
}: AddProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: categories[0]?.id || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Product Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Price (SEK) *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="stock"
                className="text-sm font-medium text-gray-700"
              >
                Stock *
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="categoryId"
              className="text-sm font-medium text-gray-700"
            >
              Category *
            </Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

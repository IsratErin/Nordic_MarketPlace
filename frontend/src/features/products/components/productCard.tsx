import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product.types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: Product["id"]) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: Product["id"]) => void;
  isAdmin?: boolean;
}

// Deterministic hash helpers
const hashString = (str: string) =>
  [...str].reduce((acc, char) => char.codePointAt(0)! + ((acc << 5) - acc), 0);

const seededInt = (seed: string, min: number, max: number) =>
  min + (Math.abs(hashString(seed)) % (max - min + 1));

const seededFloat = (seed: string) =>
  (Math.abs(hashString(seed)) % 10_000) / 10_000;

const COLORS = [
  "bg-slate-100",
  "bg-gray-100",
  "bg-zinc-100",
  "bg-neutral-100",
  "bg-stone-100",
] as const;
const BADGES = ["New", "Sale", "Limited", "Bestseller"] as const;

export const ProductCard = ({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  isAdmin = false,
}: ProductCardProps) => {
  const backgroundColor = COLORS[product.name.length % COLORS.length];
  const badge = BADGES[seededInt(product.name, 0, BADGES.length - 1)];
  const rating =
    seededInt(product.name, 3, 5) + seededFloat(`${product.name}-rating`);
  const reviews = seededInt(product.name, 10, 500);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(product.id);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg relative">
      {/* Admin Controls - Top Right */}
      {isAdmin && (
        <div className="absolute right-2 top-2 z-10 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white shadow-md"
            onClick={handleEdit}
            title="Edit product"
          >
            <Pencil className="h-4 w-4 text-gray-700" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 shadow-md"
            onClick={handleDelete}
            title="Delete product"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Wrap Header + Content in Link */}
      <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
        {/* Header */}
        <CardHeader className={`${backgroundColor} relative p-8`}>
          <Badge variant="secondary" className="absolute left-3 top-3">
            {badge}
          </Badge>
          <div className="flex min-h-[120px] items-center justify-center">
            <h3 className="text-center text-2xl font-semibold leading-tight text-gray-800">
              {product.name}
            </h3>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex flex-1 flex-col space-y-3 p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category?.name}
          </p>
          <p className="min-h-[2.5rem] line-clamp-2 text-sm text-gray-600">
            {product.description ?? ""}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-gray-800 text-gray-800"
                    : "fill-gray-300 text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">
              ({reviews})
            </span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {product.price} SEK
          </span>
          {isAdmin && (
            <p className="text-xs text-gray-500">
              Stock: <span className="font-semibold">{product.stock}</span>
            </p>
          )}
        </CardContent>
      </Link>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gray-900 hover:bg-gray-800"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

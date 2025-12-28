import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Minus, Plus } from "lucide-react";
import type { CartItem as CartItemType } from "../types/cart.types";

interface CartItemListProps {
  items: CartItemType[];
  onRemove: (productId: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
}

export default function CartItemList({
  items,
  onRemove,
  onQuantityChange,
}: CartItemListProps) {
  return (
    <Card className="overflow-x-auto bg-white border border-gray-200 rounded-none shadow-none">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center py-4 px-2 sm:px-4 gap-4 hover:bg-neutral-50 transition"
            >
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="font-bold text-base truncate">
                  {item.name}
                </span>
                <span className="text-primary font-semibold text-sm">
                  SEK {item.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">
                  In stock: <span className="font-medium">{item.stock}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onQuantityChange(item.productId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="border-gray-300"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) =>
                    onQuantityChange(
                      item.productId,
                      Math.max(1, Math.min(item.stock, Number(e.target.value)))
                    )
                  }
                  className="w-12 text-center"
                  aria-label="Quantity"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onQuantityChange(item.productId, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.stock}
                  className="border-gray-300"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.productId)}
                aria-label="Remove item"
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                <X size={18} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter />
    </Card>
  );
}

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchProductById } from "../store/productThunks";
import { clearSelectedProduct } from "../store/productSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Loader2 } from "lucide-react";

// Helper functions
function seededRandom(str: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (str.codePointAt(i) ?? 0) + ((hash << 5) - hash);
  }
  const rnd = Math.abs(hash) % (max - min + 1);
  return min + rnd;
}

function seededRandomFloat(str: string, salt: string = "") {
  let hash = 0;
  const fullStr = str + salt;
  for (let i = 0; i < fullStr.length; i++) {
    hash = (fullStr.codePointAt(i) ?? 0) + ((hash << 5) - hash);
  }
  return (Math.abs(hash) % 10000) / 10000;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProduct, loadingStates, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number.parseInt(id)));
    }

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      console.log("Add to cart:", selectedProduct.id);
      alert(`${selectedProduct.name} added to cart!`);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  // Loading state
  if (loadingStates.fetchById) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 font-semibold text-lg mb-2">Error</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleGoBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Product not found
          </p>
          <Button onClick={handleGoBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Generate dummy data
  const badgeList = ["New", "Sale", "Limited", "Bestseller"];
  const badge =
    badgeList[seededRandom(selectedProduct.name, 0, badgeList.length - 1)];
  const rating =
    seededRandom(selectedProduct.name, 3, 5) +
    seededRandomFloat(selectedProduct.name, "rating") * 0.5;
  const reviews = seededRandom(selectedProduct.name, 10, 500);

  const getColorFromName = (name: string) => {
    const colors = [
      "from-slate-50 to-slate-100",
      "from-gray-50 to-gray-100",
      "from-zinc-50 to-zinc-100",
      "from-blue-50 to-blue-100",
      "from-indigo-50 to-indigo-100",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb/Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={handleGoBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Product Image - Left side */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="overflow-hidden">
              <div
                className={`bg-linear-to-br ${getColorFromName(
                  selectedProduct.name
                )} aspect-square flex items-center justify-center relative`}
              >
                {badge && (
                  <Badge className="absolute top-4 left-4 bg-white text-gray-900 shadow-md">
                    {badge}
                  </Badge>
                )}
                <div className="text-center p-8">
                  <h2 className="text-5xl font-bold text-gray-800 mb-4">
                    {selectedProduct.name}
                  </h2>
                  <Package className="w-32 h-32 mx-auto text-gray-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Product Info - Right side */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {selectedProduct.category?.name}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedProduct.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating.toFixed(1)} ({reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  SEK {selectedProduct.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Incl. VAT</p>
              </div>
            </div>

            {/* Stock Status */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Availability:
                  </span>
                  {selectedProduct.stock > 0 ? (
                    <span className="text-green-600 font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      {selectedProduct.stock} in stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      Out of stock
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full text-lg py-6 bg-gray-900 hover:bg-gray-800"
              onClick={handleAddToCart}
              disabled={selectedProduct.stock === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            {/* Description */}
            {selectedProduct.description && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">
                    Product Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features/Benefits */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Why Buy From Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-600">
                        On orders over 1000 SEK
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-600">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Secure Payment
                      </p>
                      <p className="text-sm text-gray-600">
                        100% secure transactions
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
          </div>
        </div>
      </div>
    </div>
  );
}

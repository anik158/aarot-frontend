import React from "react";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
    return (
        <Link
            to={`/products/${product.id}`}
            className="group relative flex flex-col
                 bg-white/60 backdrop-blur-xl
                 border border-white/60
                 shadow-xl rounded-3xl overflow-hidden
                 transition-all duration-300 hover:scale-[1.02] hover:bg-white/80"
        >
            {/* Highly Visible Shining Glow Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-white/60 animate-shine-slow pointer-events-none" />

            {/* Top Highlight Bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

            <img
                className="w-full h-64 object-cover rounded-t-3xl"
                src={product.first_image}
                alt={product.name}
            />

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                    </h3>
                    <span className="text-2xl font-bold text-emerald-600">
            ${parseFloat(product.price).toFixed(2)}
          </span>
                </div>

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {product.sizes.map((s) => (
                            <span
                                key={s.id}
                                className="px-3 py-1 text-xs bg-white/20 border border-white/40 rounded-xl text-gray-800 backdrop-blur-sm"
                            >
                {s.name}
              </span>
                        ))}
                    </div>
                )}

                {/* Colors */}
                {product.colors?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {product.colors.map((c) => (
                            <span
                                key={c.id}
                                className="px-3 py-1 text-xs bg-white/20 border border-white/40 rounded-xl text-gray-800 backdrop-blur-sm"
                            >
                {c.name}
              </span>
                        ))}
                    </div>
                )}

                {/* Status */}
                <div className="mt-auto">
          <span
              className={`inline-block px-5 py-2 text-sm font-medium rounded-2xl backdrop-blur-sm ${
                  product.status === 1
                      ? "bg-emerald-500/20 text-emerald-600 border border-emerald-400/30"
                      : "bg-red-500/20 text-red-300 border border-red-400/30"
              }`}
          >
            {product.status === 1 ? "Available" : "Out of Stock"}
          </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductItem;
import { Truck, Shield, RotateCcw, Star } from 'lucide-react';

const ProductTabs = ({ product, activeTab, onTabChange }) => {
  const tabs = ['description', 'reviews', 'shipping'];

  return (
    <div className="border-t border-gray-200">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-8 py-4 font-medium text-sm capitalize transition-colors relative ${
              activeTab === tab ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
        ))}
      </div>

      <div className="p-8">
        {activeTab === 'description' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'No detailed description available for this product.'}
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">SKU</span>
                <p className="font-medium text-gray-900">{product.slug?.toUpperCase() || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">Availability</span>
                <p className="font-medium text-gray-900">
                  {product.qty > 0 ? `${product.qty} in stock` : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
            {product.reviews?.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-emerald-600">
                          {review.user?.name?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-emerald-600 mt-0.5" />
                <span>Free standard shipping on all orders over $50</span>
              </li>
              <li className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-emerald-600 mt-0.5" />
                <span>30-day hassle-free return policy</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                <span>All products come with 2-year warranty</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
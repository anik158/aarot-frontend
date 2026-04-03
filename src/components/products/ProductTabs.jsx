import { Truck, Shield, RotateCcw, Star, Send } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosRequest } from '../../helpers/config';
import { toast } from 'react-toastify';

const ProductTabs = ({ product, activeTab, onTabChange, onReviewAdded }) => {
  const tabs = ['description', 'reviews', 'shipping'];
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  
  const [newReview, setNewReview] = useState({ title: '', body: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info('Please login to leave a review.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosRequest.post('/reviews', {
        ...newReview,
        product_id: product.id,
      });

      if (response.data.success) {
        toast.success('Review submitted!');
        setNewReview({ title: '', body: '', rating: 5 });
        if (onReviewAdded) onReviewAdded(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-8 py-4 font-medium text-sm hover:cursor-pointer capitalize transition-colors relative ${
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-dm">What customers are saying</h3>
              {product.reviews?.length > 0 ? (
                <div className="space-y-8">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                            {review.user?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                            <span className="text-xs text-gray-400">{review.created_at || 'Recently'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-600 leading-relaxed italic">"{review.body || review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-dm">Leave a review</h3>
                {isLoggedIn ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                      <input
                        type="text"
                        required
                        placeholder="Great product!"
                        value={newReview.title}
                        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Share your experience..."
                        value={newReview.body}
                        onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : (
                        <>
                          <Send className="w-5 h-5" />
                          Post Review
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-6">You must be logged in to leave a review.</p>
                    <a
                      href="/sign-in"
                      className="inline-block px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
                    >
                      Sign In
                    </a>
                  </div>
                )}
              </div>
            </div>
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
const SizeSelector = ({ sizes, selectedSize, onSizeSelect }) => {
  if (!sizes?.length) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Size <span className="text-gray-400 font-normal">- Select an option</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSizeSelect(size.id)}
            className={`w-12 h-12 rounded-lg border-2 transition-all hover:cursor-pointer font-medium ${
              selectedSize === size.id
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
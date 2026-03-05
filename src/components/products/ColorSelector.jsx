const ColorSelector = ({ colors, selectedColor, onColorSelect }) => {
  if (!colors?.length) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Color <span className="text-gray-400 font-normal">- Select an option</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color.id)}
            className={`px-4 py-2 rounded-lg hover:cursor-pointer border-2 transition-all ${
              selectedColor === color.id
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
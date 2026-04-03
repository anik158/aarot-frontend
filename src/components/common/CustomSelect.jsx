import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => String(o.id) === String(value));

    return (
        <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none hover:border-emerald-400 transition-all duration-200 shadow-sm"
            >
                <span className={`block truncate ${value ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className="w-full text-left px-5 py-3 text-sm text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        >
                            All {label}
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { onChange(opt.id); setIsOpen(false); }}
                                className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                                    String(value) === String(opt.id)
                                        ? "bg-emerald-50 text-emerald-600 font-semibold"
                                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                                }`}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomSelect;

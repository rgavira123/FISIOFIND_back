"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selected,
  setSelected,
  placeholder = "Selecciona una o varias opciones",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length <= 2) {
      return selected
        .map((value) => options.find((opt) => opt.value === value)?.label)
        .join(", ");
    }
    return `${selected.length} opciones seleccionadas`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-end" ref={dropdownRef}>
      {/* Selected tags display - now in a separate container with fixed height */}
      <div className="min-h-[30px] mb-1">
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((value) => {
              const label =
                options.find((opt) => opt.value === value)?.label || value;
              return (
                <div
                  key={value}
                  className="bg-[#6bc9be] text-white px-3 py-1 rounded-full text-sm inline-flex items-center shadow-sm"
                >
                  <span>{label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(value);
                    }}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 opacity-80"
                    aria-label={`Eliminar ${label}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dropdown button - maintained at a consistent height */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-10 px-4 text-left border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:border-[#6bc9be] transition-colors duration-200 flex justify-between items-center"
        >
          <span
            className={`truncate ${
              selected.length === 0 ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {getDisplayText()}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown options */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
              >
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-center flex-shrink-0 mr-3">
                    <div
                      className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                        selected.includes(option.value)
                          ? "bg-[#6bc9be] border-[#6bc9be]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selected.includes(option.value) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-700 my-auto leading-normal">
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;

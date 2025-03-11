import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder = "Seleccionar..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Cerrar el dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    setIsOpen(false);
    onChange(option); // Actualizar el valor seleccionado
  };

  const displayValue = value || placeholder;

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        className="w-full py-4 text-lg bg-white border-none rounded-none appearance-none pr-10 focus:outline-none text-gray-600 cursor-pointer flex items-center"
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
            e.preventDefault();
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <span className="pl-2">{displayValue}</span>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div 
          id="dropdown-list"
          role="listbox"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`py-3 px-4 hover:bg-blue-50 cursor-pointer transition-colors ${
                option === value ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={option === value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOptionClick(option);
                  e.preventDefault();
                }
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

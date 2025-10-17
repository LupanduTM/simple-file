import React from 'react';

const Input = ({ id, name, type = 'text', placeholder, required, value, onChange }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-light-gray-bg rounded-md border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out text-dark-text placeholder-gray-500"
    />
  );
};

export default Input;

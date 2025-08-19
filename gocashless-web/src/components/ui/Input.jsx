import React from 'react';

const Input = ({ id, name, type = 'text', placeholder, required }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-light-gray-bg rounded-md border-transparent focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition duration-300 ease-in-out text-dark-text placeholder-gray-500"
    />
  );
};

export default Input;

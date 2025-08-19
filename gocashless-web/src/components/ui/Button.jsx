import React from 'react';

const Button = ({ children, type = 'button', fullWidth = false }) => {
  return (
    <button
      type={type}
      className={`w-${fullWidth ? 'full' : 'auto'} bg-accent text-gray-600 font-bold py-3 px-6 rounded-md hover:bg-teal-500 transition duration-300 ease-in-out shadow-sm`}
    >
      {children}
    </button>
  );
};

export default Button;

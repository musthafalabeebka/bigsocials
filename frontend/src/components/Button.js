import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap font-body font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'gradient-primary text-on-primary hover:opacity-90 hover:-translate-y-0.5 shadow-ambient',
    secondary: 'bg-transparent border-2 border-[#0028aa]/20 text-[#0028aa] hover:bg-[#eef1ff]',
    ghost: 'bg-transparent text-[#666] hover:bg-[#f8f9fa] hover:text-[#1b1c19]',
    danger: 'bg-error text-white hover:bg-error/90',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-xl',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

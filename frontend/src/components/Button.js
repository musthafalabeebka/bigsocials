import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap font-body font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  
  const variants = {
    primary: 'gradient-primary text-on-primary hover:scale-105 shadow-ambient',
    secondary: 'bg-transparent border-2 border-primary/20 text-primary hover:bg-primary/5',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container-high',
    danger: 'bg-error text-white hover:bg-error/90',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-full',
    md: 'px-6 py-3 text-sm rounded-full',
    lg: 'px-8 py-4 text-base rounded-full',
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

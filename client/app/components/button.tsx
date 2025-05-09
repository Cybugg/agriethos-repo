import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
    
    const variantStyles = {
      default: "bg-[#a5eb4c] text-[#003024] hover:bg-[#96d645]",
      outline: "border border-[#d9d9d9] text-[#898989] hover:bg-[#f6fded] hover:text-[#003024]"
    };
    
    const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;
    
    return (
      <button className={buttonClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
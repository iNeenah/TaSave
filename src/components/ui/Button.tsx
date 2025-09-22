import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    let buttonClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ";
    
    // Variants
    if (variant === "primary") {
      buttonClasses += "bg-green-500 text-black hover:bg-green-400 ";
    } else if (variant === "secondary") {
      buttonClasses += "bg-gray-800 text-green-500 border border-gray-600 hover:bg-gray-700 ";
    } else if (variant === "outline") {
      buttonClasses += "border border-green-500 text-green-500 hover:bg-green-500 hover:text-black ";
    } else if (variant === "ghost") {
      buttonClasses += "text-green-500 hover:bg-gray-800 ";
    }
    
    // Sizes
    if (size === "sm") {
      buttonClasses += "px-3 py-1.5 text-sm rounded ";
    } else if (size === "md") {
      buttonClasses += "px-4 py-2 text-base rounded-md ";
    } else if (size === "lg") {
      buttonClasses += "px-6 py-3 text-lg rounded-lg ";
    }
    
    return (
      <button
        ref={ref}
        className={buttonClasses + className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
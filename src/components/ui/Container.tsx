import { HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = "", size = "lg", children, ...props }, ref) => {
    let containerClasses = "mx-auto px-4 sm:px-6 lg:px-8 ";
    
    if (size === "sm") {
      containerClasses += "max-w-2xl ";
    } else if (size === "md") {
      containerClasses += "max-w-4xl ";
    } else if (size === "lg") {
      containerClasses += "max-w-6xl ";
    } else if (size === "xl") {
      containerClasses += "max-w-7xl ";
    } else if (size === "full") {
      containerClasses += "max-w-full ";
    }
    
    return (
      <div
        ref={ref}
        className={containerClasses + className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;
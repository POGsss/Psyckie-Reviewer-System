import { forwardRef } from "react";

const variants = {
  primary: "bg-[#E8252A] text-white hover:bg-[#c41e22]",
  secondary: "bg-[#FCE8EA] text-[#E8252A] hover:bg-[#f8d0d4]",
  consult: "bg-white text-[#E8252A] hover:bg-gray-50 border border-[#E8252A]",
  outline: "border-2 border-[#e5e7eb] text-[#1a1a2e] hover:border-[#1a1a2e]",
  ghost: "bg-transparent text-[#1a1a2e] hover:bg-gray-100",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
  icon: "h-10 w-10",
};

const Button = forwardRef(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-[20px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8252A] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;

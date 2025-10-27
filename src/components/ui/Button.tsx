interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "button1" | "button2" | "button3" | "button4";
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
    const baseClass = "px-4 py-2 rounded font-semibold transition-colors";
    const variantClass = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
        button1: "bg-[#63AEA8] text-white hover:bg-[#4DAE9A]",
        button2: "bg-[#E06085] text-white hover:bg-[#D05075]",
        button3: "bg-[#C57CEA] text-white hover:bg-[#B06CD5]",
        button4: "bg-[#F9C479] text-white hover:bg-[#E9B469]",
    };

    return (
        <button className={`${baseClass} ${variantClass[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}

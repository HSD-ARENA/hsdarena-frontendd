interface LabelProps {
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
}

export default function Label({ htmlFor, children, className = "" }: LabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block mb-1 font-medium text-white ${className}`}
        >
            {children}
        </label>
    );
}

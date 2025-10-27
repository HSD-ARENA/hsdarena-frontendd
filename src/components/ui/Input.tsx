interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export default function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
}

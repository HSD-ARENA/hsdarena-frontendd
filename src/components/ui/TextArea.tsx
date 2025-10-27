interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export default function TextArea({ className = "", ...props }: TextAreaProps) {
    return (
        <textarea
            className={`w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
}

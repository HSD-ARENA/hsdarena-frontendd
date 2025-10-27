interface SpinnerProps {
    className?: string;
}

export default function Spinner({ className = "" }: SpinnerProps) {
    return (
        <div className={`w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin ${className}`}></div>
    );
}

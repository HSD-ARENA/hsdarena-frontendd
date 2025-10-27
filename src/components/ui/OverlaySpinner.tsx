import Spinner from "./Spinner";

interface OverlaySpinnerProps {
    className?: string;
}

export default function OverlaySpinner({ className = "" }: OverlaySpinnerProps) {
    return (
        <div
            className={`absolute inset-0 flex items-center justify-center bg-white/70 z-10 ${className}`}
        >
            <Spinner />
        </div>
    );
}

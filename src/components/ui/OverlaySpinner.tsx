interface OverlaySpinnerProps {
    className?: string;
}

export default function OverlaySpinner({ className = "" }: OverlaySpinnerProps) {
    return (
        <div
            className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${className}`}
            style={{
                backgroundColor: '#1a0505',
                backgroundImage: `
                    radial-gradient(at 0% 0%, hsla(353,96%,29%,0.4) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, hsla(353,90%,30%,0.3) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, hsla(350,100%,20%,0.4) 0px, transparent 50%),
                    radial-gradient(at 0% 100%, hsla(0,0%,10%,1) 0px, transparent 50%)
                `
            }}
        >
            {/* Spinner Icon */}
            <div className="w-16 h-16 border-4 border-[#451a1a] border-t-[#dc2626] rounded-full animate-spin mb-4"></div>

            {/* Loading Text */}
            <p className="text-white text-xl font-semibold">Yükleniyor...</p>
        </div>
    );
}

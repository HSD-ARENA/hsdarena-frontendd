interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({ isOpen, onClose, children, className = "" }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className={`bg-white p-6 rounded shadow-lg relative ${className}`}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">X</button>
                {children}
            </div>
        </div>
    );
}

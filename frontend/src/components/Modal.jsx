import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  closeOnOverlay = true,
  closeOnEsc = true,
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    modalRef.current?.focus();

    const handleKeyDown = (event) => {
      if (closeOnEsc && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl outline-none rounded-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-gray-500 transition-all duration-200 rounded-lg hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div
          id="modal-description"
          className="max-h-[60vh] overflow-y-auto px-6 py-5 text-sm leading-6 text-gray-600"
        >
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

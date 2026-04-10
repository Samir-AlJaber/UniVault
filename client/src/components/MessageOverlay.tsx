type MessageOverlayProps = {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  cancelText?: string;
  onClose: () => void;
  onCancel?: () => void;
};

export default function MessageOverlay({
  isOpen,
  title,
  message,
  buttonText = "OK",
  cancelText = "Cancel",
  onClose,
  onCancel,
}: MessageOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="overlay-buttons">
          <button className="overlay-btn" onClick={onClose}>
            {buttonText}
          </button>
          {onCancel && (
            <button className="overlay-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
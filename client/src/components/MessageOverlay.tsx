type MessageOverlayProps = {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
};

export default function MessageOverlay({
  isOpen,
  title,
  message,
  buttonText = "OK",
  onClose,
}: MessageOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="overlay-btn" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import { MaterialIcon } from './MaterialIcon';

interface CameraCaptureModalProps {
  onCapture: (file: File, dataUrl: string) => void;
  onClose: () => void;
}

export function CameraCaptureModal({ onCapture, onClose }: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facing, setFacing] = useState<'user' | 'environment'>('environment');
  const [hasCamera, setHasCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initCamera() {

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setHasCamera(true);
        setError(null);
      } catch (err: unknown) {
        if (cancelled) return;
        const e = err as DOMException;
        if (e.name === 'NotAllowedError') {
          setError('Camera permission denied');
        } else if (e.name === 'NotFoundError') {
          setHasCamera(false);
          setError('No camera found on this device');
        } else {
          setError('Failed to access camera');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [facing]);

  const flipCamera = () => {
    setFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        setCapturedFile(file);
        setCapturedPreview(dataUrl);
      },
      'image/jpeg',
      0.85
    );
  };

  const retake = () => {
    setCapturedPreview(null);
    setCapturedFile(null);
  };

  const confirmCapture = () => {
    if (capturedFile && capturedPreview) {
      onCapture(capturedFile, capturedPreview);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-surface-container-high rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-bold text-lg">Take a Photo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        <div className="relative bg-black min-h-[300px] flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-high gap-3 p-6">
              <MaterialIcon name="no_photography" className="text-4xl text-slate-500" />
              <p className="text-slate-400 text-sm text-center">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full max-h-[400px] object-cover ${capturedPreview ? 'hidden' : ''}`}
            style={facing === 'user' ? { transform: 'scaleX(-1)' } : undefined}
          />

          <canvas ref={canvasRef} className="hidden" />

          {capturedPreview && (
            <img
              src={capturedPreview}
              alt="Captured"
              className="w-full max-h-[400px] object-cover"
            />
          )}
        </div>

        <div className="p-4 flex items-center justify-center gap-4">
          {capturedPreview ? (
            <>
              <button
                onClick={retake}
                className="p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                <MaterialIcon name="replay" className="text-2xl text-slate-400" />
              </button>

              <button
                onClick={confirmCapture}
                className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <MaterialIcon name="check" className="text-3xl" />
              </button>

              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                <MaterialIcon name="close" className="text-2xl text-slate-400" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                <MaterialIcon name="close" className="text-2xl text-slate-400" />
              </button>

              <button
                onClick={handleCapture}
                disabled={!hasCamera || isLoading}
                className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                <div className="w-12 h-12 bg-white rounded-full" />
              </button>

              {hasCamera && !isLoading && (
                <button
                  onClick={flipCamera}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors"
                >
                  <MaterialIcon name="flip_camera_android" className="text-2xl text-slate-400" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

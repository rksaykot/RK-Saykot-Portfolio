import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, Download, X, CheckCircle2, AlertCircle } from 'lucide-react';

// Generates a random alphanumeric string (avoids ambiguous characters like 0/O, 1/I/l)
function generateRandomCode(length = 5) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CvDownloadModal({ isOpen, onClose, cvUrl, fileName = 'RK_Saykot_CV.pdf' }) {
  const canvasRef = useRef(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | success
  const [errorText, setErrorText] = useState('');
  const inputRef = useRef(null);

  // Draw distorted captcha on HTML5 canvas so bots cannot scrape plain text
  function drawCaptcha(text) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#161b22');
    bgGrad.addColorStop(1, '#0d1117');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Random background noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 200 + 55)}, ${Math.floor(Math.random() * 200 + 55)}, 255, 0.25)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Random background noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render characters with distortion, rotation and custom styling
    const charSpacing = width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      ctx.save();
      const x = (i + 1) * charSpacing;
      const y = height / 2 + Math.random() * 8 - 4;
      const angle = (Math.random() - 0.5) * 0.45; // slight tilt

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Letter styling
      ctx.font = `bold ${Math.floor(Math.random() * 6 + 22)}px "JetBrains Mono", monospace`;
      const colors = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(char, -8, 8);

      ctx.restore();
    }
  }

  function reloadCaptcha() {
    const newCode = generateRandomCode(5);
    setCaptchaCode(newCode);
    setUserInput('');
    setStatus('idle');
    setErrorText('');
    setTimeout(() => drawCaptcha(newCode), 50);
  }

  useEffect(() => {
    if (isOpen) {
      reloadCaptcha();
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  function handleVerify(e) {
    if (e) e.preventDefault();
    if (!userInput.trim()) {
      setStatus('error');
      setErrorText('Please enter the captcha code.');
      return;
    }

    // Case-insensitive verification
    if (userInput.trim().toLowerCase() === captchaCode.toLowerCase()) {
      setStatus('success');
      setErrorText('');

      // Trigger automatic download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Auto close modal after successful download
        setTimeout(() => {
          onClose();
        }, 1200);
      }, 500);
    } else {
      setStatus('error');
      setErrorText('Incorrect code. Please try again.');
      reloadCaptcha();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-all duration-300 animate-fadeIn">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 md:p-8 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-base-content/5 text-base-content/60 transition-colors hover:bg-base-content/10 hover:text-base-content"
          aria-label="Close verification modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-base-content">
              Human Verification
            </h3>
            <p className="text-xs text-base-content/60">
              Security check before downloading CV
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-base-content/70">
          To prevent automated web scrapers and bots from downloading the resume, please enter the security code shown in the image below:
        </p>

        {/* Captcha Canvas Box */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/50 p-2.5">
          <canvas
            ref={canvasRef}
            width={200}
            height={52}
            className="rounded-xl border border-white/10 shadow-inner select-none cursor-not-allowed"
          />
          <button
            type="button"
            onClick={reloadCaptcha}
            title="Get new code"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-base-300/80 bg-base-100 py-3 text-xs font-mono text-base-content/70 transition-all hover:border-primary/40 hover:text-primary active:scale-95"
          >
            <RefreshCw size={14} className="transition-transform duration-300 active:rotate-180" />
            <span>New Code</span>
          </button>
        </div>

        {/* Form Input */}
        <form onSubmit={handleVerify} className="mt-4">
          <div>
            <label className="block text-[0.72rem] font-mono uppercase tracking-wider text-base-content/50 mb-1.5">
              Enter Verification Code
            </label>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type code here..."
              maxLength={6}
              disabled={status === 'success'}
              className={`w-full rounded-xl border bg-base-200/30 px-4 py-3 font-mono text-base tracking-widest text-base-content outline-none transition-all placeholder:tracking-normal placeholder:text-base-content/30 focus:bg-base-100 ${
                status === 'error'
                  ? 'border-error focus:ring-2 focus:ring-error/20'
                  : 'border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
            />
          </div>

          {/* Feedback messages */}
          {status === 'error' && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-error animate-shake">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Verification successful! Downloading CV now…</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={status === 'success'}
              className="rounded-full px-5 py-2.5 font-mono text-xs text-base-content/60 transition-colors hover:text-base-content"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'success'}
              className="btn btn-primary rounded-full px-6 font-mono text-xs normal-case shadow-lg shadow-primary/20"
            >
              {status === 'success' ? (
                <>
                  <CheckCircle2 size={15} /> Verified
                </>
              ) : (
                <>
                  <Download size={15} /> Verify & Download
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

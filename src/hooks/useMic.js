// src/hooks/useMic.js
import { useEffect, useRef, useState } from "react";

export default function useMic(onText) {
  const [isListening, setIsListening] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "es-ES";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => onText?.(e.results[0][0].transcript);
    rec.onend = () => setIsListening(false);
    recRef.current = rec;
  }, [onText]);

  const start = () => { recRef.current?.start(); setIsListening(true); };
  const stop  = () => recRef.current?.stop();
  return { isListening, start, stop };
}

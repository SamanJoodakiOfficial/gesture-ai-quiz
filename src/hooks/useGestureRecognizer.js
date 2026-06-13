import { useCallback, useEffect, useRef, useState } from 'react';
import { DrawingUtils, FilesetResolver, GestureRecognizer, HandLandmarker } from '@mediapipe/tasks-vision';

const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODEL_PATH = 'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task';

function normalizeResult(result) {
  const firstGesture = result?.gestures?.[0]?.[0];
  const firstHandedness = result?.handednesses?.[0]?.[0] || result?.handedness?.[0]?.[0];

  return {
    name: firstGesture?.categoryName || 'None',
    score: Number(firstGesture?.score || 0),
    handedness: firstHandedness?.categoryName || 'Unknown',
    landmarks: result?.landmarks || [],
  };
}

export function useGestureRecognizer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognizerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const isRunningRef = useRef(false);

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [gesture, setGesture] = useState({
    name: 'None',
    score: 0,
    handedness: 'Unknown',
    landmarks: [],
  });

  const drawResults = useCallback((landmarks) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);

    if (!landmarks?.length) return;

    const drawingUtils = new DrawingUtils(context);
    for (const handLandmarks of landmarks) {
      drawingUtils.drawConnectors(handLandmarks, HandLandmarker.HAND_CONNECTIONS, {
        color: '#22c55e',
        lineWidth: 4,
      });
      drawingUtils.drawLandmarks(handLandmarks, {
        color: '#f97316',
        lineWidth: 2,
        radius: 4,
      });
    }
  }, []);

  const predictLoop = useCallback(() => {
    if (!isRunningRef.current) return;

    const video = videoRef.current;
    const recognizer = recognizerRef.current;

    if (video && recognizer && video.readyState >= 2) {
      try {
        if (video.currentTime !== lastVideoTimeRef.current) {
          const now = performance.now();
          let result;
          try {
            result = recognizer.recognizeForVideo(video, now);
          } catch {
            result = recognizer.recognizeForVideo(video);
          }

          const normalized = normalizeResult(result);
          setGesture(normalized);
          drawResults(normalized.landmarks);
          lastVideoTimeRef.current = video.currentTime;
        }
      } catch (recognitionError) {
        setError('خطا در پردازش فریم وب‌کم. صفحه را refresh کنید یا دسترسی دوربین را بررسی کنید.');
        console.error(recognitionError);
      }
    }

    animationRef.current = requestAnimationFrame(predictLoop);
  }, [drawResults]);

  const initializeRecognizer = useCallback(async () => {
    if (recognizerRef.current) return recognizerRef.current;

    setStatus('loading-model');
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
    recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_PATH,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    return recognizerRef.current;
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      await initializeRecognizer();
      setStatus('requesting-camera');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 960 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error('Video element is not ready.');

      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();

      isRunningRef.current = true;
      setStatus('running');
      animationRef.current = requestAnimationFrame(predictLoop);
    } catch (cameraError) {
      console.error(cameraError);
      setStatus('error');
      setError('دسترسی به وب‌کم ممکن نشد. اجازه Camera را فعال کنید و برنامه را روی localhost یا HTTPS اجرا کنید.');
    }
  }, [initializeRecognizer, predictLoop]);

  const stopCamera = useCallback(() => {
    isRunningRef.current = false;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setGesture({ name: 'None', score: 0, handedness: 'Unknown', landmarks: [] });
    setStatus('idle');
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    gesture,
    status,
    error,
    startCamera,
    stopCamera,
    isRunning: status === 'running',
  };
}

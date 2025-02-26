"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import { load as loadHandpose } from "@tensorflow-models/handpose";
import { HandGesture } from "@/types/types";
import { ASLGestures } from "@/data/handgesture-data";

interface Landmark {
  x: number;
  y: number;
  z: number;
}

function estimateFingerCurl(
  fingerLandmarks: any[]
): "curl" | "half" | "no-curl" {
  // Make sure we have valid landmarks
  if (!fingerLandmarks || fingerLandmarks.length < 4) {
    return "curl"; // Default to curl if data is invalid
  }

  const start = fingerLandmarks[0];
  const end = fingerLandmarks[3];

  // Making sure the landmarks have x, y, z properties
  if (
    !start ||
    !end ||
    typeof start[0] !== "number" ||
    typeof end[0] !== "number"
  ) {
    return "curl";
  }

  const distance = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
      Math.pow(end[1] - start[1], 2) +
      Math.pow(end[2] - start[2], 2)
  );

  if (distance < 30) return "curl";
  if (distance < 60) return "half";
  return "no-curl";
}

function estimateGesture(landmarks: any[]): HandGesture | null {
  // Make sure we have valid landmarks
  if (!landmarks || landmarks.length < 21) {
    return null;
  }

  try {
    const thumbCurl = estimateFingerCurl(landmarks.slice(1, 5));
    const indexCurl = estimateFingerCurl(landmarks.slice(5, 9));
    const middleCurl = estimateFingerCurl(landmarks.slice(9, 13));
    const ringCurl = estimateFingerCurl(landmarks.slice(13, 17));
    const pinkyCurl = estimateFingerCurl(landmarks.slice(17, 21));

    const currentPosition = {
      thumb: thumbCurl,
      index: indexCurl,
      middle: middleCurl,
      ring: ringCurl,
      pinky: pinkyCurl,
    };

    for (const gesture of ASLGestures) {
      if (
        gesture.fingerPositions.thumb === currentPosition.thumb &&
        gesture.fingerPositions.index === currentPosition.index &&
        gesture.fingerPositions.middle === currentPosition.middle &&
        gesture.fingerPositions.ring === currentPosition.ring &&
        gesture.fingerPositions.pinky === currentPosition.pinky
      ) {
        return gesture;
      }
    }
  } catch (error) {
    console.error("Error estimating gesture:", error);
  }

  return null;
}

interface ASLTranslatorProps {
  onTranslation: (text: string) => void;
}

export function ASLTranslator({ onTranslation }: ASLTranslatorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [detectedSign, setDetectedSign] = useState<HandGesture | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const [webcamAvailable, setWebcamAvailable] = useState(true);
  const requestAnimationFrameRef = useRef<number | null>(null);
  const handposeModelRef = useRef<any>(null);
  // Add these properties to the ASLTranslator component
  const [lastDetectedSigns, setLastDetectedSigns] = useState<
    Record<string, number>
  >({});

  // Check if webcam is available
  useEffect(() => {
    const checkWebcamAvailability = async () => {
      try {
        // Just check if we can enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length === 0) {
          setWebcamAvailable(false);
          setErrorMessage(
            "No webcam detected on your device. Please connect a webcam to use this feature."
          );
        } else {
          setWebcamAvailable(true);
        }
      } catch (error) {
        console.error("Error checking webcam availability:", error);
        setWebcamAvailable(false);
        setErrorMessage(
          "Unable to access webcam. This may be due to browser restrictions or permissions."
        );
      }
    };

    checkWebcamAvailability();
  }, []);

  // Update the detectHands function to include the time-based duplicate detection
  const detectHands = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !handposeModelRef.current) {
      requestAnimationFrameRef.current = requestAnimationFrame(detectHands);
      return;
    }

    try {
      // Make sure video is playing and has dimensions
      if (
        videoRef.current.readyState === 4 &&
        videoRef.current.videoWidth > 0 &&
        videoRef.current.videoHeight > 0
      ) {
        // Detect hand landmarks
        const predictions = await handposeModelRef.current.estimateHands(
          videoRef.current
        );

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Clear canvas and draw video frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          if (predictions && predictions.length > 0) {
            // Draw hand landmarks
            drawHand(ctx, predictions[0].landmarks);

            // Estimate gesture
            const gesture = estimateGesture(predictions[0].landmarks);
            if (gesture) {
              const currentTime = Date.now();
              const lastDetectedTime = lastDetectedSigns[gesture.name] || 0;

              // Only register the sign if it hasn't been detected in the last minute (60000ms)
              if (currentTime - lastDetectedTime > 60000) {
                setLastDetectedSigns((prev) => ({
                  ...prev,
                  [gesture.name]: currentTime,
                }));

                setDetectedSign(gesture);
                onTranslation(gesture.name);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in hand detection:", error);
    }

    // Continue detection loop
    requestAnimationFrameRef.current = requestAnimationFrame(detectHands);
  }, [lastDetectedSigns, onTranslation]);

  // Function to draw hand landmarks
  const drawHand = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    // Make sure we have valid landmarks
    if (!landmarks || landmarks.length < 21) return;

    try {
      // Draw landmarks
      for (let i = 0; i < landmarks.length; i++) {
        const [x, y] = landmarks[i];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }

      // Draw connections
      const connections = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [0, 9],
        [9, 10],
        [10, 11],
        [11, 12],
        [0, 13],
        [13, 14],
        [14, 15],
        [15, 16],
        [0, 17],
        [17, 18],
        [18, 19],
        [19, 20],
      ];

      for (const [i, j] of connections) {
        if (landmarks[i] && landmarks[j]) {
          const [x1, y1] = landmarks[i];
          const [x2, y2] = landmarks[j];
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    } catch (error) {
      console.error("Error drawing hand:", error);
    }
  };

  // Function to request webcam access
  const requestWebcamAccess = useCallback(async () => {
    if (!webcamAvailable) {
      setErrorMessage(
        "No webcam detected on your device. Please connect a webcam to use this feature."
      );
      return null;
    }

    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage(
          "Your browser doesn't support webcam access. Please try a different browser."
        );
        return null;
      }

      // Request webcam access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      return stream;
    } catch (error: any) {
      // Handle specific error types
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setErrorMessage(
          "Webcam access denied. Please allow camera access in your browser settings."
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setErrorMessage(
          "No webcam found. Please connect a webcam and try again."
        );
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        setErrorMessage(
          "Your webcam is already in use by another application."
        );
      } else if (
        error.name === "OverconstrainedError" ||
        error.name === "ConstraintNotSatisfiedError"
      ) {
        setErrorMessage(
          "Your webcam doesn't meet the required specifications."
        );
      } else {
        setErrorMessage(
          "Error accessing webcam. Please check your camera and browser permissions."
        );
      }

      console.error("Detailed webcam error:", error);
      return null;
    }
  }, [webcamAvailable]);

  // Effect to initialize models and start detection
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const loadModels = async () => {
      try {
        setIsModelLoading(true);

        // Initialize TensorFlow.js
        await tf.ready();
        setModelLoadingProgress(20);

        // Set backend to WebGL for better performance
        await tf.setBackend("webgl");
        setModelLoadingProgress(40);

        // Load Handpose model
        handposeModelRef.current = await loadHandpose({
          detectionConfidence: 0.8,
          maxContinuousChecks: 10,
          iouThreshold: 0.3,
          scoreThreshold: 0.75,
        });
        setModelLoadingProgress(80);

        // Request webcam access
        mediaStream = await requestWebcamAccess();

        if (mediaStream && videoRef.current) {
          videoRef.current.srcObject = mediaStream;

          // Wait for video to be ready before starting detection
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current
                .play()
                .then(() => {
                  setVideoReady(true);
                  setModelLoadingProgress(100);
                  setIsModelLoading(false);
                })
                .catch((error) => {
                  console.error("Error playing video:", error);
                  setErrorMessage(
                    "Could not play video stream. Please try again."
                  );
                  setIsModelLoading(false);
                });
            }
          };
        } else {
          // If we couldn't get the media stream, still mark loading as complete
          setModelLoadingProgress(100);
          setIsModelLoading(false);
        }
      } catch (error) {
        console.error("Error loading models:", error);
        setErrorMessage("Failed to load models. Please try again.");
        setIsModelLoading(false);
      }
    };

    loadModels();

    return () => {
      // Cleanup
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [requestWebcamAccess]);

  // Effect to start detection when video is ready
  useEffect(() => {
    if (videoReady && !isModelLoading) {
      detectHands();
    }
  }, [videoReady, isModelLoading, detectHands]);

  // Function to retry webcam access
  const retryWebcamAccess = async () => {
    setErrorMessage("");
    setIsModelLoading(true);

    const stream = await requestWebcamAccess();

    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              setVideoReady(true);
              setIsModelLoading(false);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
              setErrorMessage("Could not play video stream. Please try again.");
              setIsModelLoading(false);
            });
        }
      };
    } else {
      setIsModelLoading(false);
    }
  };

  return (
    <div className="relative aspect-video">
      {isModelLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
          <div className="mb-4 text-white">
            Loading ASL Translation Models...
          </div>
          <div className="w-64 h-2 overflow-hidden bg-gray-700 rounded-full">
            <div
              className="h-full transition-all duration-300 ease-in-out bg-primary"
              style={{ width: `${modelLoadingProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-white">{modelLoadingProgress}%</div>
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
          <div className="max-w-md p-4 text-center text-white">
            <div className="mb-2 text-lg text-red-500">Error</div>
            <div className="mb-4">{errorMessage}</div>
            <button
              onClick={retryWebcamAccess}
              className="px-4 py-2 text-white transition-colors rounded bg-primary hover:bg-primary/90"
            >
              Retry Camera Access
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 object-cover w-full h-full"
        autoPlay
        playsInline
        muted
        width={640}
        height={480}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 object-cover w-full h-full"
        width={640}
        height={480}
      />

      {detectedSign && (
        <div className="absolute px-4 py-2 text-white rounded-md bottom-4 left-4 bg-black/70">
          Detected: {detectedSign.name} - {detectedSign.description}
        </div>
      )}
    </div>
  );
}

export interface HandGesture {
  name: string;
  description: string;
  category?: string;
  fingerPositions: {
    thumb: "curl" | "half" | "no-curl";
    index: "curl" | "half" | "no-curl";
    middle: "curl" | "half" | "no-curl";
    ring: "curl" | "half" | "no-curl";
    pinky: "curl" | "half" | "no-curl";
  };
}

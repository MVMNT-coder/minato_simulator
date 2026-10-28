// ============================================================
// Avatar 型定義 (three.js デジタルヒューマン基盤)
// ============================================================

export type AvatarMotionState =
  | "idle"
  | "talking"
  | "thinking"
  | "listening"
  | "positive"
  | "negative";

export type MinatoEmotion =
  | "neutral"
  | "thoughtful"
  | "anxious"
  | "relieved"
  | "hopeful"
  | "conflicted"
  | "sad"
  | "warm";

export type GazeDirection =
  | "camera"
  | "down"
  | "down-left"
  | "down-right"
  | "left"
  | "right"
  | "away";

export type CameraMood = "standard" | "close" | "wide";

export type AvatarRuntimeState = {
  motionState: AvatarMotionState;
  emotion: MinatoEmotion;
  gazeDirection: GazeDirection;
  cameraMood: CameraMood;
  isSpeaking: boolean;
  speechAmplitude?: number;
};

export type AvatarConfig = {
  modelUrl: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  animationMap?: Partial<Record<AvatarMotionState, string>>;
};

export type AvatarSceneCallbacks = {
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
  onError?: (error: unknown) => void;
};

import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText, G } from 'react-native-svg';
import type { Face } from 'react-native-vision-camera-face-detector';

interface FacePainterProps {
  faces: Face[];
  frameWidth: number;
  frameHeight: number;
  viewWidth: number;
  viewHeight: number;
  isFrontCamera?: boolean;
}

export const FacePainter: React.FC<FacePainterProps> = ({
  faces,
  frameWidth,
  frameHeight,
  viewWidth,
  viewHeight,
  isFrontCamera = true,
}) => {
  if (!frameWidth || !frameHeight || !viewWidth || !viewHeight) return null;

  // Calculate Scale Ratios
  const scaleX = viewWidth / frameWidth;
  const scaleY = viewHeight / frameHeight;

  return (
    <Svg style={StyleSheet.absoluteFill}>
      {faces.map((face, index) => {
        const { bounds, leftEyeOpenProbability, rightEyeOpenProbability, landmarks } = face;

        // Front Camera Mirror Adjustment
        const x = isFrontCamera ? frameWidth - bounds.x - bounds.width : bounds.x;
        const y = bounds.y;

        // Scaled Rectangle Coordinates
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = bounds.width * scaleX;
        const scaledHeight = bounds.height * scaleY;

        // Landmarks (Left / Right Eyes)
        const leftEye = landmarks?.LEFT_EYE;
        const rightEye = landmarks?.RIGHT_EYE;

        const leftEyeX = leftEye
          ? (isFrontCamera ? frameWidth - leftEye.x : leftEye.x) * scaleX
          : null;
        const leftEyeY = leftEye ? leftEye.y * scaleY : null;

        const rightEyeX = rightEye
          ? (isFrontCamera ? frameWidth - rightEye.x : rightEye.x) * scaleX
          : null;
        const rightEyeY = rightEye ? rightEye.y * scaleY : null;

        // Blink Detection Logic
        const leftProb = leftEyeOpenProbability ?? 1.0;
        const rightProb = rightEyeOpenProbability ?? 1.0;
        const isBlinking = leftProb < 0.45 && rightProb < 0.45;

        return (
          <G key={index}>
            {/* FACE RECTANGLE */}
            <Rect
              x={scaledX}
              y={scaledY}
              width={scaledWidth}
              height={scaledHeight}
              stroke="#22c55e" // Colors.green
              strokeWidth="4"
              fill="none"
            />

            {/* LEFT EYE LANDMARK */}
            {leftEyeX !== null && leftEyeY !== null && (
              <Circle
                cx={leftEyeX}
                cy={leftEyeY}
                r={5}
                fill="#ef4444" // Colors.red
              />
            )}

            {/* RIGHT EYE LANDMARK */}
            {rightEyeX !== null && rightEyeY !== null && (
              <Circle
                cx={rightEyeX}
                cy={rightEyeY}
                r={5}
                fill="#ef4444" // Colors.red
              />
            )}

            {/* STATUS TEXT (BLINK / OPEN) */}
            <SvgText
              x={scaledX}
              y={Math.max(scaledY - 10, 20)}
              fill={isBlinking ? '#ef4444' : '#22c55e'}
              fontSize="16"
              fontWeight="bold">
              {isBlinking ? 'BLINK' : 'OPEN'}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, ActivityIndicator, Alert as RNAlert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
  type CameraOutput,
} from 'react-native-vision-camera';
import { createFaceDetectorOutput, type Face } from 'react-native-vision-camera-face-detector';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import { FaceVerificationCamera } from '../components/face-verification-camera';
import { FaceVerificationPhotoPreviewStep } from '../components/face-verification-photo-preview';
import { FaceVerificationResultView } from '../components/face-verification-result-view';
import { FaceVerificationDeclarationForm } from '../components/face-verification-declaration-form';
import { FaceVerificationConfirmDialog } from '../components/face-verification-confirm-dialog';
import { FaceVerificationLoadingView } from '../components/face-verification-loading-view';
import { FaceVerificationErrorView } from '../components/face-verification-error-view';
import { useFaceVerificationStore } from '../store/face-verification.store';
import { useSubmitVerification, useSubmitDLC } from '../hooks';
import type {
  FaceVerificationPhase,
  FaceVerificationRouteParams,
  VerificationResponseT,
} from '../types';

type FaceVerificationScreenProps = FaceVerificationRouteParams;

export function FaceVerificationScreen({ registrationStatus }: FaceVerificationScreenProps) {
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');

  // Photo output for capture (v5 outputs API)
  const photoOutput = usePhotoOutput({ qualityPrioritization: 'speed' });

  // State machine
  const [phase, setPhase] = useState<FaceVerificationPhase>('camera');
  const [faces, setFaces] = useState<Face[]>([]);
  const [previewUri, setPreviewUri] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [verResponse, setVerResponse] = useState<VerificationResponseT | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Declaration form
  const [selfVerNec, setSelfVerNec] = useState<'Yes' | 'No' | ''>('');
  const [selfVerNmc, setSelfVerNmc] = useState<'Yes' | 'No' | ''>('');

  // Dialogs
  const [dlcDialogOpen, setDlcDialogOpen] = useState(false);

  // Layout tracking for face overlay scaling
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  // Operational refs
  const phaseRef = useRef<FaceVerificationPhase>('camera');
  const frameSizeRef = useRef({ width: 0, height: 0 });
  const isProcessing = useRef(false);
  const isCapturing = useRef(false);
  const lastDetectionTime = useRef(0);
  const eyesClosed = useRef(false);
  const blinkCount = useRef(0);

  /** Updates phase state and its mirror ref together. */
  const updatePhase = useCallback((next: FaceVerificationPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  // Updates the store-backed liveness message; unchanged strings are a no-op
  const updateMsg = useCallback((newMsg: string) => {
    useFaceVerificationStore.getState().setMsg(newMsg);
  }, []);

  // API hooks
  const verificationMutation = useSubmitVerification();
  const dlcMutation = useSubmitDLC();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const submitVerification = useCallback(
    async (img1: string, img2: string) => {
      updatePhase('submitting');

      verificationMutation.mutate(
        { image_1: img1, image_2: img2 },
        {
          onSuccess: ({ data }) => {
            if (data) {
              setVerResponse(data);
              isCapturing.current = false;

              if (data.self_ver_code === '00' || data.self_ver_code === '22') {
                updatePhase('result');
              } else if (img2 !== '') {
                updatePhase('result');
              } else {
                updatePhase('declaration');
              }
            }
          },
          onError: (error) => {
            isCapturing.current = false;
            setErrorMsg(error.message || 'Verification failed');
            updatePhase('error');
          },
        }
      );
    },
    [verificationMutation, updatePhase]
  );

  const capturePhoto = useCallback(async () => {
    try {
      isCapturing.current = true;
      updateMsg('Capturing photo...');

      // 1. Capture snapshot while <Camera /> is still mounted and active
      const photoFile = await photoOutput.capturePhotoToFile({}, {});

      // 2. NOW transition phase state after native capture completes
      updatePhase('capturing');

      updateMsg('Please wait...');

      const filePath = photoFile.filePath.startsWith('file://')
        ? photoFile.filePath
        : `file://${photoFile.filePath}`;

      // TODO: Update this to not use legacy code
      const base64Image = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.deleteAsync(filePath, { idempotent: true });

      const cleanBase64 = base64Image.replace(/[\r\n\s]/g, '');

      const uri = `data:image/jpeg;base64,${cleanBase64}`;
      setPreviewUri(uri);
      // Registration mode: first photo → preview screen
      if (registrationStatus === 1 && !image1) {
        setImage1(cleanBase64);
        isCapturing.current = false;
        updatePhase('preview');
        return;
      }

      // Registration mode: second photo → preview screen (submitted after approval)
      if (registrationStatus === 1 && image1 && !image2) {
        setImage2(cleanBase64);
        isCapturing.current = false;
        updatePhase('preview');
        return;
      }

      // Normal mode: single photo → submit
      if (registrationStatus === 0) {
        setImage1(cleanBase64);
        await submitVerification(cleanBase64, '');
        return;
      }
    } catch (error) {
      console.error('Capture error:', error);
      isCapturing.current = false;
      setErrorMsg('Failed to capture image');
      updatePhase('error');
    }
  }, [image1, image2, registrationStatus, photoOutput, submitVerification, updatePhase, updateMsg]);

  // Face detection callback
  const handleDetectedFaces = useCallback(
    (detectedFaces: Face[]) => {
      if (isCapturing.current || isProcessing.current || phaseRef.current !== 'camera') {
        return;
      }

      const now = Date.now();
      if (now - lastDetectionTime.current < 800) return;
      lastDetectionTime.current = now;
      isProcessing.current = true;

      setFaces(detectedFaces);

      const frame = detectedFaces[0];
      const frameWidth = frame?.frameWidth ?? frameSizeRef.current.width;
      const frameHeight = frame?.frameHeight ?? frameSizeRef.current.height;

      if (
        frameWidth &&
        frameHeight &&
        (frameSizeRef.current.width !== frameWidth || frameSizeRef.current.height !== frameHeight)
      ) {
        frameSizeRef.current = { width: frameWidth, height: frameHeight };
        setFrameSize(frameSizeRef.current);
      }

      if (detectedFaces.length === 0) {
        updateMsg('No Face Detected');
        isProcessing.current = false;
        return;
      }

      if (detectedFaces.length > 1) {
        updateMsg('Multiple Faces Detected');
        isProcessing.current = false;
        return;
      }

      const face = detectedFaces[0];
      const yaw = face.yawAngle ?? 0;
      const pitch = face.pitchAngle ?? 0;

      if (Math.abs(yaw) >= 28 || Math.abs(pitch) >= 32) {
        updateMsg('Please look straight');
        isProcessing.current = false;
        return;
      }

      const centerX = face.bounds.x + face.bounds.width / 2;
      const centerY = face.bounds.y + face.bounds.height / 2;
      const isCentered =
        centerX > frameWidth * 0.3 &&
        centerX < frameWidth * 0.7 &&
        centerY > frameHeight * 0.3 &&
        centerY < frameHeight * 0.7;

      if (!isCentered) {
        updateMsg('Center your face');
        isProcessing.current = false;
        return;
      }

      const isLargeEnough =
        face.bounds.width > frameWidth * 0.2 && face.bounds.height > frameHeight * 0.2;

      if (!isLargeEnough) {
        updateMsg('Move closer to camera');
        isProcessing.current = false;
        return;
      }

      updateMsg('Blink your eyes');

      const leftEye = face.leftEyeOpenProbability ?? -1;
      const rightEye = face.rightEyeOpenProbability ?? -1;

      if (leftEye === -1 || rightEye === -1) {
        updateMsg('Blink detection unsupported');
        isProcessing.current = false;
        return;
      }

      const isClosed = leftEye < 0.35 && rightEye < 0.35;
      const isOpen = leftEye > 0.6 && rightEye > 0.6;

      if (isClosed && !eyesClosed.current) {
        eyesClosed.current = true;
        updateMsg('Eyes Closed');
        isProcessing.current = false;
        return;
      }

      if (isOpen && eyesClosed.current) {
        eyesClosed.current = false;
        blinkCount.current += 1;
        updateMsg('Blink Detected');
      }

      if (blinkCount.current > 0 && !isCapturing.current) {
        void capturePhoto();
      }

      isProcessing.current = false;
    },
    [capturePhoto, updateMsg]
  );

  // Native face-detector output, created exactly ONCE (in an effect) for
  // this screen's lifetime.
  //
  // Do NOT use `useFaceDetectorOutput()` here: it memoizes on its
  // rest-options object (`useMemo(..., [options])`), which is re-created
  // every render, so it returns a NEW native output each render. A new
  // output identity makes <Camera outputs> tear down and rebuild the camera
  // session (unbindAll) on EVERY render — aborting in-flight captures with
  // "ImageCaptureException: Camera is closed".
  const [faceDetectorOutput, setFaceDetectorOutput] = useState<CameraOutput | null>(null);

  // Latest-ref holder so the natively-captured callback always reaches the
  // freshest `handleDetectedFaces` without changing output identity.
  const detectedFacesHandlerRef = useRef<{ current?: (faces: Face[]) => void }>({});

  useEffect(() => {
    const output = createFaceDetectorOutput({
      performanceMode: 'accurate',
      runLandmarks: true,
      runClassifications: true,
      onFacesDetected: (detectedFaces) => {
        detectedFacesHandlerRef.current.current?.(detectedFaces);
      },
      onError: (error: unknown) => {
        console.error('Face detection error:', error);
      },
    });
    setFaceDetectorOutput(output);
    // Nitro hybrids are GC-managed; no eager dispose() needed on unmount.
  }, []);

  // Point the detector at the freshest handler after every render.
  useEffect(() => {
    detectedFacesHandlerRef.current.current = handleDetectedFaces;
  });

  // Memoized outputs — both elements are identity-stable, so <Camera>
  // configures its native session once per mount instead of tearing it down
  // on every render.
  const outputs = useMemo(
    () => (faceDetectorOutput ? [faceDetectorOutput, photoOutput] : []),
    [faceDetectorOutput, photoOutput]
  );

  const handleSubmitDLC = useCallback(() => {
    const selfVerCode = verResponse?.self_ver_code ?? '';

    if (selfVerNec === '') {
      RNAlert.alert('Error', 'Please select Yes or No');
      return;
    }
    if (selfVerCode === '4' && selfVerNmc === '') {
      RNAlert.alert('Error', 'Please select Yes or No');
      return;
    }

    setDlcDialogOpen(true);
  }, [selfVerNec, selfVerNmc, verResponse]);

  const confirmDLCSubmission = useCallback(() => {
    setDlcDialogOpen(false);
    updatePhase('submitting');

    dlcMutation.mutate(
      {
        selfVerNec: selfVerNec as 'Yes' | 'No',
        selfVerNmc: selfVerNmc as 'Yes' | 'No' | '',
        self_ver_code: verResponse?.self_ver_code ?? '',
      },
      {
        onSuccess: ({ data }) => {
          if (data) {
            setVerResponse(data);
            updatePhase('result');
          }
        },
        onError: (error) => {
          setErrorMsg(error.message || 'DLC submission failed');
          updatePhase('error');
        },
      }
    );
  }, [dlcMutation, selfVerNec, selfVerNmc, verResponse, updatePhase]);

  const resetForSecondCapture = useCallback(() => {
    blinkCount.current = 0;
    eyesClosed.current = false;
    setImage2('');
    setPreviewUri('');
    setVerResponse(null);
    isCapturing.current = false;
    updateMsg('Please blink!!');
    updatePhase('camera');
  }, [updatePhase, updateMsg]);

  if (!hasPermission || !device) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-base text-muted-foreground">Loading Camera...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <View
        className="flex-1"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setLayoutSize({ width, height });
        }}>
        {/* PHASE: camera — live feed with blink detection */}
        {phase === 'camera' && (
          <FaceVerificationCamera
            device={device}
            outputs={outputs}
            faces={faces}
            frameWidth={frameSize.width}
            frameHeight={frameSize.height}
            viewWidth={layoutSize.width}
            viewHeight={layoutSize.height}
          />
        )}

        {/* PHASE: capturing / submitting — loading spinner */}
        {(phase === 'capturing' || phase === 'submitting') && <FaceVerificationLoadingView />}

        {/* PHASE: preview — first/second photo confirmation (registration mode only) */}
        {phase === 'preview' && (
          <FaceVerificationPhotoPreviewStep
            previewUri={previewUri}
            actionLabel={
              registrationStatus === 1 && image1 && !image2 ? 'Take Second Photo' : 'Submit Photo'
            }
            onSubmitPress={() => {
              if (registrationStatus === 1 && image1 && !image2) {
                // Approved the first photo; return to camera to capture the second.
                blinkCount.current = 0;
                eyesClosed.current = false;
                setPreviewUri('');
                updateMsg('Please blink!!');
                updatePhase('camera');
              } else if (registrationStatus === 1 && image1 && image2) {
                // Approved the second photo; submit both images.
                void submitVerification(image1, image2);
              }
            }}
          />
        )}

        {/* PHASE: result — server response display */}
        {phase === 'result' && verResponse && (
          <FaceVerificationResultView
            verResponse={verResponse}
            previewUri={previewUri}
            hasSecondImage={image2 !== ''}
            onProceedToDeclaration={resetForSecondCapture}
          />
        )}

        {/* PHASE: declaration — self-declaration form */}
        {phase === 'declaration' && verResponse && (
          <FaceVerificationDeclarationForm
            selfVerCode={verResponse.self_ver_code}
            selfVerNec={selfVerNec}
            selfVerNmc={selfVerNmc}
            onChangeNec={setSelfVerNec}
            onChangeNmc={setSelfVerNmc}
            onSubmit={handleSubmitDLC}
            previewUri={previewUri}
          />
        )}

        {/* PHASE: error */}
        {phase === 'error' && (
          <FaceVerificationErrorView errorMsg={errorMsg} onGoBack={() => router.back()} />
        )}
      </View>

      {/* DLC TERMS DIALOG */}
      <FaceVerificationConfirmDialog
        open={dlcDialogOpen}
        onOpenChange={setDlcDialogOpen}
        title="Terms and Conditions."
        description={
          'By submitting this Declaration, you have agreed that the ' +
          'information furnished by you is true.\n\nAre you sure you want to submit?'
        }
        destructive
        onConfirm={confirmDLCSubmission}
      />
    </SafeAreaView>
  );
}

export type { FaceVerificationScreenProps };

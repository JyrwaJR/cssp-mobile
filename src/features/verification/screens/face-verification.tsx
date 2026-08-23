import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert as RNAlert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { useFaceDetectorOutput, type Face } from 'react-native-vision-camera-face-detector';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from '@components/ui';
import { FacePainter } from './face-painter';
import { useSubmitVerification, useSubmitDLC } from '../hooks';
import type { FaceVerificationPhase, VerificationResponseT } from '../types';

interface FaceVerificationScreenProps {
  registrationStatus: 0 | 1;
}

export function FaceVerificationScreen({ registrationStatus }: FaceVerificationScreenProps) {
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');

  // Photo output for capture (v5 outputs API)
  const photoOutput = usePhotoOutput({ qualityPrioritization: 'speed' });

  // State machine
  const [phase, setPhase] = useState<FaceVerificationPhase>('camera');
  const [msg, setMsg] = useState('Please blink!!');
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dlcDialogOpen, setDlcDialogOpen] = useState(false);

  // Layout tracking for face overlay scaling
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  // Operational refs (not re-rendered) — avoid stale closures in callbacks
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
          onSuccess: (data) => {
            setVerResponse(data);
            isCapturing.current = false;

            if (data.self_ver_code === '00' || data.self_ver_code === '22') {
              updatePhase('result');
            } else if (img2 !== '') {
              // Two-photo flow: show treasury approval cards
              updatePhase('result');
            } else {
              // One-photo flow: show declaration form
              updatePhase('declaration');
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
      updatePhase('capturing');
      setMsg('Please wait...');

      // v5: capture directly to a temporary file
      const photoFile = await photoOutput.capturePhotoToFile({}, {});

      const filePath = photoFile.filePath.startsWith('file://')
        ? photoFile.filePath
        : `file://${photoFile.filePath}`;

      const base64Image = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const cleanBase64 = base64Image.replace(/[\r\n\s]/g, '');

      setPreviewUri(`data:image/jpeg;base64,${cleanBase64}`);

      // Registration mode: first photo → preview screen
      if (registrationStatus === 1 && !image1) {
        setImage1(cleanBase64);
        updatePhase('preview');
        isCapturing.current = false;
        return;
      }

      // Registration mode: second photo → submit both
      if (registrationStatus === 1 && image1 && !image2) {
        setImage2(cleanBase64);
        await submitVerification(image1, cleanBase64);
        return;
      }

      // Normal mode: single photo → submit
      if (registrationStatus === 0) {
        setImage1(cleanBase64);
        await submitVerification(cleanBase64, '');
        return;
      }
    } catch {
      isCapturing.current = false;
      setErrorMsg('Failed to capture image');
      updatePhase('error');
    }
  }, [image1, image2, registrationStatus, photoOutput, submitVerification, updatePhase]);

  // Face detection callback — runs on JS thread via the detector output
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

      if (frameWidth && frameHeight) {
        frameSizeRef.current = { width: frameWidth, height: frameHeight };
        setFrameSize(frameSizeRef.current);
      }

      if (detectedFaces.length === 0) {
        setMsg('No Face Detected');
        isProcessing.current = false;
        return;
      }

      if (detectedFaces.length > 1) {
        setMsg('Multiple Faces Detected');
        isProcessing.current = false;
        return;
      }

      const face = detectedFaces[0];
      const yaw = face.yawAngle ?? 0;
      const pitch = face.pitchAngle ?? 0;

      if (Math.abs(yaw) >= 28 || Math.abs(pitch) >= 32) {
        setMsg('Please look straight');
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
        setMsg('Center your face');
        isProcessing.current = false;
        return;
      }

      const isLargeEnough =
        face.bounds.width > frameWidth * 0.2 && face.bounds.height > frameHeight * 0.2;

      if (!isLargeEnough) {
        setMsg('Move closer to camera');
        isProcessing.current = false;
        return;
      }

      setMsg('Blink your eyes');

      const leftEye = face.leftEyeOpenProbability ?? -1;
      const rightEye = face.rightEyeOpenProbability ?? -1;

      if (leftEye === -1 || rightEye === -1) {
        setMsg('Blink detection unsupported');
        isProcessing.current = false;
        return;
      }

      const isClosed = leftEye < 0.35 && rightEye < 0.35;
      const isOpen = leftEye > 0.6 && rightEye > 0.6;

      if (isClosed && !eyesClosed.current) {
        eyesClosed.current = true;
        setMsg('Eyes Closed');
        isProcessing.current = false;
        return;
      }

      if (isOpen && eyesClosed.current) {
        eyesClosed.current = false;
        blinkCount.current += 1;
        setMsg('Blink Detected');
      }

      if (blinkCount.current > 0 && !isCapturing.current) {
        void capturePhoto();
      }

      isProcessing.current = false;
    },
    [capturePhoto]
  );

  // Face detector output — onFacesDetected fires on the JS thread (v5 outputs API)
  const faceDetectorOutput = useFaceDetectorOutput({
    performanceMode: 'accurate',
    runLandmarks: true,
    runClassifications: true,
    onFacesDetected: handleDetectedFaces,
    onError: (error) => {
      console.error('Face detection error:', error);
    },
  });

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
        onSuccess: (data) => {
          setVerResponse(data);
          updatePhase('result');
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
    setMsg('Please blink!!');
    updatePhase('camera');
  }, [updatePhase]);

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
          <>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              outputs={[faceDetectorOutput, photoOutput]}
            />
            <FacePainter
              faces={faces}
              frameWidth={frameSize.width}
              frameHeight={frameSize.height}
              viewWidth={layoutSize.width}
              viewHeight={layoutSize.height}
              isFrontCamera={true}
            />
            {/* Bottom overlay message */}
            <View className="absolute bottom-5 left-5 right-5 rounded-xl bg-black/75 p-4">
              <Text className="text-center text-lg font-bold text-white">{msg}</Text>
            </View>
          </>
        )}

        {/* PHASE: capturing / submitting — loading spinner */}
        {(phase === 'capturing' || phase === 'submitting') && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-bold text-primary">Please wait</Text>
            <ActivityIndicator size="large" className="mt-4" />
          </View>
        )}

        {/* PHASE: preview — first photo confirmation (registration mode only) */}
        {phase === 'preview' && (
          <ScrollView contentContainerClassName="items-center p-4">
            {previewUri ? (
              <Image
                source={{ uri: previewUri }}
                className="h-64 w-56 rounded-2xl border-2 border-primary"
              />
            ) : null}
            <Text className="mt-4 text-center text-sm text-foreground">
              This photo is required for the system to verify your Authenticity.
            </Text>
            <Text className="mt-2 text-center text-sm text-foreground">
              Please make sure that it is your photograph. Before submitting the photo, please read
              Our Privacy Policy.
            </Text>
            <Text className="mt-2 text-center text-sm font-bold text-destructive">
              [Note: The photo {`won't`} be used for any other purpose except for authenticating
              your Identity for Pension.]
            </Text>
            <Button size="lg" className="mt-6" onPress={() => setConfirmDialogOpen(true)}>
              <Text className="text-base font-bold text-white">Submit Photo</Text>
            </Button>
          </ScrollView>
        )}

        {/* PHASE: result — server response display */}
        {phase === 'result' && verResponse && (
          <ScrollView contentContainerClassName="gap-4 p-4">
            {/* Success: self_ver_code === '00' */}
            {verResponse.self_ver_code === '00' && (
              <Alert variant="success">
                <AlertTitle>Verification Successful</AlertTitle>
                <AlertDescription>{verResponse.msg}</AlertDescription>
              </Alert>
            )}

            {/* Rejected: self_ver_code === '22' */}
            {verResponse.self_ver_code === '22' && (
              <>
                {previewUri ? (
                  <Image
                    source={{ uri: previewUri }}
                    className="mx-auto h-52 w-44 rounded-xl border-2 border-destructive"
                  />
                ) : null}
                <Alert variant="destructive">
                  <AlertTitle>Photo Rejected</AlertTitle>
                  <AlertDescription>{verResponse.msg}</AlertDescription>
                </Alert>
              </>
            )}

            {/* Two-photo flow result (registration): treasury approval */}
            {verResponse.self_ver_code !== '00' &&
              verResponse.self_ver_code !== '22' &&
              image2 !== '' && (
                <>
                  <Alert variant="success">
                    <AlertDescription>
                      Your Photo has been successfully submitted and is subjected to approval by the
                      Treasury Officer of the Treasury Office where you are registered for
                      disbursement of your monthly pension.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertDescription>
                      You can proceed for submission of your Self declaration for Non-employment or
                      Non-marriage by clicking on {`"Submit Self Declaration"`}
                    </AlertDescription>
                  </Alert>
                  <Button size="lg" onPress={resetForSecondCapture}>
                    <Text className="text-base font-bold text-white">Submit Self Declaration.</Text>
                  </Button>
                </>
              )}
          </ScrollView>
        )}

        {/* PHASE: declaration — self-declaration form */}
        {phase === 'declaration' && verResponse && (
          <DeclarationForm
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
          <View className="flex-1 items-center justify-center p-4">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
            <Button size="lg" variant="outline" className="mt-6" onPress={() => router.back()}>
              <Text className="text-base font-bold text-primary">Go Back</Text>
            </Button>
          </View>
        )}
      </View>

      {/* CONFIRMATION DIALOG — photo submission (registration mode) */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent onClose={() => setConfirmDialogOpen(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              {
                'By submitting this photo you agree to our Privacy Policy.\nAre you sure you want to submit this photo?\n\n[Note: The camera will capture your photo one more time after submission]'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel title="No" onPress={() => setConfirmDialogOpen(false)} />
            <AlertDialogAction
              onPress={() => {
                setConfirmDialogOpen(false);
                blinkCount.current = 0;
                eyesClosed.current = false;
                setPreviewUri('');
                setMsg('Please blink!!');
                updatePhase('camera');
              }}>
              <Text className="text-base font-bold text-white">Yes</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DLC TERMS DIALOG */}
      <AlertDialog open={dlcDialogOpen} onOpenChange={setDlcDialogOpen}>
        <AlertDialogContent onClose={() => setDlcDialogOpen(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Terms and Conditions.</AlertDialogTitle>
            <AlertDialogDescription>
              {
                'By submitting this Declaration, you have agreed that the information furnished by you is true.\n\nAre you sure you want to submit?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel title="No" onPress={() => setDlcDialogOpen(false)} />
            <AlertDialogAction onPress={confirmDLCSubmission}>
              <Text className="text-base font-bold text-white">Yes</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}

/**
 * Self-declaration form shown after verification when the server requests a
 * DLC declaration. Shows the re-marriage question only when `selfVerCode`
 * equals `'4'`.
 */
function DeclarationForm({
  selfVerCode,
  selfVerNec,
  selfVerNmc,
  onChangeNec,
  onChangeNmc,
  onSubmit,
  previewUri,
}: {
  selfVerCode: string;
  selfVerNec: 'Yes' | 'No' | '';
  selfVerNmc: 'Yes' | 'No' | '';
  onChangeNec: (value: 'Yes' | 'No') => void;
  onChangeNmc: (value: 'Yes' | 'No') => void;
  onSubmit: () => void;
  previewUri: string;
}) {
  const showMarriageQuestion = selfVerCode === '4';

  return (
    <ScrollView contentContainerClassName="items-center p-4">
      {previewUri ? (
        <Image
          source={{ uri: previewUri }}
          className="mb-4 h-52 w-44 rounded-xl border-2 border-primary"
        />
      ) : null}

      <View className="w-full rounded-md border-r-4 border-r-primary bg-muted p-4">
        {/* NON-EMPLOYMENT */}
        <Text className="text-center font-bold underline">NON-EMPLOYMENT</Text>
        <Text className="text-center font-bold text-destructive">(SELF DECLARATION)</Text>
        <Text className="my-2 text-sm">
          Are you employed or re-employed in any State or Central Government Office/Autonomous
          Bodies or Corporations during the last six months period?
        </Text>

        <View className="my-2 flex-row justify-center gap-3">
          <Button
            variant={selfVerNec === 'No' ? 'primary' : 'outline'}
            onPress={() => onChangeNec('No')}
            className="w-20">
            <Text className={`font-bold ${selfVerNec === 'No' ? 'text-white' : 'text-primary'}`}>
              No
            </Text>
          </Button>
          <Button
            variant={selfVerNec === 'Yes' ? 'primary' : 'outline'}
            onPress={() => onChangeNec('Yes')}
            className="w-20">
            <Text className={`font-bold ${selfVerNec === 'Yes' ? 'text-white' : 'text-primary'}`}>
              Yes
            </Text>
          </Button>
        </View>

        {/* RE-MARRIAGE (only when selfVerCode === '4') */}
        {showMarriageQuestion && (
          <>
            <Text className="mt-4 text-center font-bold underline">RE-MARRIAGE/NON MARRIAGE</Text>
            <Text className="text-center font-bold text-destructive">(SELF DECLARATION)</Text>
            <Text className="my-2 text-sm">
              Are you married or re-married during the last six months period?
            </Text>

            <View className="my-2 flex-row justify-center gap-3">
              <Button
                variant={selfVerNmc === 'Yes' ? 'primary' : 'outline'}
                onPress={() => onChangeNmc('Yes')}
                className="w-20">
                <Text
                  className={`font-bold ${selfVerNmc === 'Yes' ? 'text-white' : 'text-primary'}`}>
                  Yes
                </Text>
              </Button>
              <Button
                variant={selfVerNmc === 'No' ? 'primary' : 'outline'}
                onPress={() => onChangeNmc('No')}
                className="w-20">
                <Text
                  className={`font-bold ${selfVerNmc === 'No' ? 'text-white' : 'text-primary'}`}>
                  No
                </Text>
              </Button>
            </View>
          </>
        )}

        <Button size="lg" className="mt-5" onPress={onSubmit}>
          <Text className="text-base font-bold text-white">Submit</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

export type { FaceVerificationScreenProps };

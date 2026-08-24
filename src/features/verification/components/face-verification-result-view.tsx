import React from 'react';
import { ScrollView, Text, Image } from 'react-native';
import { Alert, AlertDescription, AlertTitle, Button } from '@components/ui';
import type { VerificationResponseT } from '../types';

/** Props for {@link FaceVerificationResultView}. */
export interface FaceVerificationResultViewProps {
  /** Server response driving the branch: '00' success, '22' rejected. */
  verResponse: VerificationResponseT;
  /** Data URI of the latest photo; shown only on the rejection branch. */
  previewUri: string;
  /** True when a second photo was submitted (enables declaration CTA). */
  hasSecondImage: boolean;
  /** Invoked by the "Submit Self Declaration." button. */
  onProceedToDeclaration: () => void;
}

/**
 * Displays the verification outcome for FaceVerificationScreen: success
 * alert ('00'), rejection with photo ('22'), or the submitted-for-
 * approval notice with a CTA to the self-declaration form. Purely
 * presentational.
 */
export function FaceVerificationResultView({
  verResponse,
  previewUri,
  hasSecondImage,
  onProceedToDeclaration,
}: FaceVerificationResultViewProps) {
  return (
    <ScrollView contentContainerClassName="gap-4 p-4">
      {verResponse.self_ver_code === '00' && (
        <Alert variant="success">
          <AlertTitle>Verification Successful</AlertTitle>
          <AlertDescription>{verResponse.msg}</AlertDescription>
        </Alert>
      )}

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

      {verResponse.self_ver_code !== '00' &&
        verResponse.self_ver_code !== '22' &&
        hasSecondImage && (
          <>
            <Alert variant="success">
              <AlertDescription>
                Your Photo has been successfully submitted and is subjected to approval by the
                Treasury Officer of the Treasury Office where you are registered for disbursement of
                your monthly pension.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertDescription>
                You can proceed for submission of your Self declaration for Non-employment or
                Non-marriage by clicking on {`"Submit Self Declaration"`}
              </AlertDescription>
            </Alert>
            <Button size="lg" onPress={onProceedToDeclaration}>
              <Text className="text-base font-bold text-white">Submit Self Declaration.</Text>
            </Button>
          </>
        )}
    </ScrollView>
  );
}

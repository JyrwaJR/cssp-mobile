import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Button } from '@components/ui';

/** Allowed answers for each self-declaration question. */
type SelfVerAnswer = 'Yes' | 'No' | '';

/** Props for {@link FaceVerificationDeclarationForm}. */
export interface FaceVerificationDeclarationFormProps {
  /** Server verification code; `'4'` additionally shows the re-marriage question. */
  selfVerCode: string;
  /** Answer for the non-employment question. Empty string = unanswered. */
  selfVerNec: SelfVerAnswer;
  /** Answer for the re-marriage question. Empty string = unanswered. */
  selfVerNmc: SelfVerAnswer;
  /** Called when the user answers the non-employment question. */
  onChangeNec: (value: 'Yes' | 'No') => void;
  /** Called when the user answers the re-marriage question. */
  onChangeNmc: (value: 'Yes' | 'No') => void;
  /** Called when the user presses the Submit button. */
  onSubmit: () => void;
  /** Captured photo data URI above the form; empty string hides it. */
  previewUri: string;
}

/**
 * Renders the DLC self-declaration form: non-employment question,
 * optionally the re-marriage question (when `selfVerCode === '4'`),
 * and a Submit button. Purely presentational — validation and network
 * submission live in the parent FaceVerificationScreen.
 */
export function FaceVerificationDeclarationForm({
  selfVerCode,
  selfVerNec,
  selfVerNmc,
  onChangeNec,
  onChangeNmc,
  onSubmit,
  previewUri,
}: FaceVerificationDeclarationFormProps) {
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

import React from 'react';
import Pdf from 'react-native-pdf';
import { router, useLocalSearchParams } from 'expo-router';
import { Container } from '@components/layout';
import { EmptyScreen, LoadingScreen } from '@components/screens';
import { PAGE_ROUTES } from '@utils/constants';
import { saveAndShareBase64Pdf, saveBase64Pdf } from '@utils/helpers/save-base64-pdf';
import { Ternary } from '@components/common';
import { Button } from '@components/ui';
import { View } from 'react-native';

type PdfPreviewParams = {
  uri: string;
  downloadable?: string;
};

export function PdfPreview() {
  const { uri: base64, downloadable = 'true' } = useLocalSearchParams<PdfPreviewParams>();
  const isDownloadable = downloadable === 'true' ? true : false;

  const [pdfUri, setPdfUri] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!base64) return;

    let cancelled = false;

    const loadPdf = async () => {
      try {
        setError(null);

        const uri = await saveBase64Pdf(base64);

        if (!cancelled) {
          setPdfUri(uri);
        }
      } catch (e) {
        console.error('PDF error:', e);

        if (!cancelled) {
          setError('Unable to load PDF');
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [base64]);

  const onPressGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(PAGE_ROUTES.HOME);
    }
  };

  if (!base64 || error) {
    return (
      <Container>
        <EmptyScreen
          title="Invalid PDF"
          message={error ?? 'The provided PDF is invalid.'}
          refreshLabel="Go back"
          refresh={onPressGoBack}
        />
      </Container>
    );
  }

  if (!pdfUri) {
    return (
      <Container>
        <LoadingScreen />
      </Container>
    );
  }

  return (
    <Container className="p-0">
      <Pdf
        source={{ uri: pdfUri }}
        spacing={0}
        trustAllCerts={false}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        onLoadComplete={(pages) => {
          console.log('PDF loaded:', pages);
        }}
        onError={(error) => {
          console.error('PDF render error:', error);
        }}
      />
      <Ternary
        condition={isDownloadable}
        ifTrue={
          <View className="flex-row items-center justify-center">
            <Button
              disabled={!downloadable}
              className="w-full"
              size={'lg'}
              onPress={() => saveAndShareBase64Pdf(pdfUri)}>
              Download
            </Button>
          </View>
        }
        ifFalse={null}
      />
    </Container>
  );
}

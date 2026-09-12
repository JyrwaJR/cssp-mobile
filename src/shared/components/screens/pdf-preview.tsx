import Pdf from 'react-native-pdf';
import { useSafeNavigation } from '@hooks/use-safe-navigation';
import { Container } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import { PAGE_ROUTES } from '@utils/constants';
import { saveAndShareBase64Pdf } from '@utils/helpers/save-base64-pdf';
import { Ternary } from '@components/common';
import { Button } from '@components/ui';
import { View } from 'react-native';
import { usePdfPreviewStore } from '@stores/pdf-preview';
import { useEffect } from 'react';
import { logger } from '@utils/logger';

export function PdfPreview() {
  const isDownloadable = usePdfPreviewStore((s) => s.downloadable);
  const uri = usePdfPreviewStore((s) => s.uri);
  const clearPdf = usePdfPreviewStore((s) => s.clearPdf);
  const { navigate, back } = useSafeNavigation();

  useEffect(() => {
    return () => clearPdf();
  }, []);

  const onPressGoBack = () => {
    const wentBack = back();
    if (!wentBack) {
      navigate(PAGE_ROUTES.HOME, 'replace');
    }
  };

  if (!uri) {
    return (
      <Container>
        <EmptyScreen
          title="Invalid PDF"
          message={'The provided PDF is invalid.'}
          refreshLabel="Go back"
          refresh={onPressGoBack}
        />
      </Container>
    );
  }

  return (
    <Container className="p-0" scrollable>
      <Pdf
        source={{ uri }}
        trustAllCerts={false}
        enableDoubleTapZoom
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        onError={(error) => {
          logger.log('PDF render error:', error);
        }}
      />
      <Ternary
        condition={isDownloadable}
        ifTrue={
          <View className="flex-row items-center justify-center">
            <Button
              disabled={!isDownloadable}
              className="w-full"
              size={'lg'}
              onPress={() => saveAndShareBase64Pdf(uri)}>
              Download
            </Button>
          </View>
        }
        ifFalse={null}
      />
    </Container>
  );
}

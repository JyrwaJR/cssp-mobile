import { useCallback, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Result of {@link useImageCompressor.compressImageToBase64 | compressImageToBase64}.
 *
 * Contains the re-encoded JPEG's temp-file URI, its base64 payload, and the
 * measured binary size. `uri` points to a cache file the caller should
 * delete after extracting `base64`.
 */
export interface CompressedImageResult {
  uri: string;
  base64: string;
  bytes: number;
  sizeKB: number;
  quality: number;
}

/**
 * Tuning options for {@link useImageCompressor.compressImageToBase64 | compressImageToBase64}.
 *
 * Re-encoding starts at `initialQuality` and steps down by `qualityStep`
 * until the base64 payload fits within `maxSizeKB`; quality never drops
 * below `minQuality`. All options are optional and have sensible defaults.
 */
export interface CompressImageOptions {
  maxSizeKB?: number;
  initialQuality?: number;
  minQuality?: number;
  qualityStep?: number;
}

/**
 * Compresses image files to a target size and returns their base64 payload.
 *
 * Uses `expo-image-manipulator` to re-encode JPEGs, stepping quality from
 * `initialQuality` down toward `minQuality` until the payload fits within
 * `maxSizeKB` (default 500 KB). Intermediate temp files that overshoot the
 * target are deleted as it iterates. Resolves with the compressed result,
 * or rejects with an {@link Error} when the image cannot be reduced to the
 * target size (the final attempt's temp file is deleted first).
 *
 * @returns `compressImageToBase64` plus reactive `isCompressing`, `error`,
 * `result`, and `reset` state for callers that render progress status.
 */
export function useImageCompressor() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompressedImageResult | null>(null);

  const compressImageToBase64 = useCallback(
    async (
      imageUri: string,
      options: CompressImageOptions = {}
    ): Promise<CompressedImageResult> => {
      const {
        maxSizeKB = 500,
        initialQuality = 0.85,
        minQuality = 0.3,
        qualityStep = 0.05,
      } = options;

      setIsCompressing(true);
      setError(null);
      setResult(null);

      try {
        const maxSizeBytes = maxSizeKB * 1024;

        let quality = initialQuality;

        while (quality >= minQuality) {
          const image = await ImageManipulator.manipulateAsync(imageUri, [], {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          });

          if (!image.base64) {
            throw new Error('Failed to generate base64 image');
          }

          // Base64 represents approximately 4/3 of the
          // original binary data.
          const bytes = Math.ceil((image.base64.length * 3) / 4);

          if (bytes <= maxSizeBytes) {
            const compressedResult: CompressedImageResult = {
              uri: image.uri,
              base64: image.base64,
              bytes,
              sizeKB: bytes / 1024,
              quality,
            };

            setResult(compressedResult);

            return compressedResult;
          }

          // Overshooting iteration: remove its temp output before retrying lower.
          await FileSystem.deleteAsync(image.uri, { idempotent: true });

          quality -= qualityStep;
        }

        // Final attempt at minimum quality.
        const image = await ImageManipulator.manipulateAsync(imageUri, [], {
          compress: minQuality,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        });

        if (!image.base64) {
          throw new Error('Failed to generate base64 image');
        }

        const bytes = Math.ceil((image.base64.length * 3) / 4);

        if (bytes > maxSizeBytes) {
          await FileSystem.deleteAsync(image.uri, { idempotent: true });
          throw new Error(
            `Unable to compress image below ${maxSizeKB} KB. ` +
              `Final size: ${(bytes / 1024).toFixed(2)} KB`
          );
        }

        const compressedResult: CompressedImageResult = {
          uri: image.uri,
          base64: image.base64,
          bytes,
          sizeKB: bytes / 1024,
          quality: minQuality,
        };

        setResult(compressedResult);

        return compressedResult;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to compress image';

        setError(message);

        throw err;
      } finally {
        setIsCompressing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsCompressing(false);
  }, []);

  return {
    compressImageToBase64,
    isCompressing,
    error,
    result,
    reset,
  };
}

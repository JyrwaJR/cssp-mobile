import React from 'react';
import { Image, Text, View } from 'react-native';

import type { SectionCardProps, StepImageProps } from './types';

/**
 * High-contrast image placeholder / container for senior guidance.
 *
 * Renders an instructional screenshot when {@link StepImageProps.source} is
 * provided; otherwise shows a large dashed placeholder with
 * {@link StepImageProps.placeholderText}. When a caption is supplied it is
 * displayed in a dark "Look for this" bar beneath the image.
 *
 * @param props - Component props. See {@link StepImageProps}.
 * @returns A bordered image or placeholder block with optional caption bar.
 */
export const StepImage: React.FC<StepImageProps> = ({
  source,
  caption,
  placeholderText = 'App Screen Guide Placeholder',
}) => (
  <View className="my-3 overflow-hidden rounded-md border border-gray-300 bg-gray-50 ">
    {source ? (
      <Image
        source={source}
        className="resize-cover aspect-[9/16] w-full bg-white"
        accessibilityLabel={caption || 'Instructional step visual guide'}
      />
    ) : (
      <View className="h-48 w-full items-center justify-center border-b-2 border-dashed border-gray-300 bg-gray-100 p-4">
        <Text className="text-center text-3xl">📱</Text>
        <Text className="mt-2 text-center text-base font-bold text-slate-700">
          {placeholderText}
        </Text>
      </View>
    )}
    {caption && (
      <View className="bg-gray-800 p-3.5">
        <Text className="text-center text-sm font-bold leading-5 text-white">
          💡 Look for this: {caption}
        </Text>
      </View>
    )}
  </View>
);

/**
 * Senior-friendly section card with large header badges and high contrast.
 *
 * Displays a numbered circular badge beside a bold title in the card header,
 * separated from {@link SectionCardProps.children} by a divider.
 *
 * @param props - Component props. See {@link SectionCardProps}.
 * @returns A white card containing the numbered header and body content.
 */
export const SectionCard: React.FC<SectionCardProps> = ({ stepNumber, title, children }) => (
  <View className="gap-4 rounded-md border border-gray-300 bg-white p-5 ">
    <View className="flex-row items-center gap-3 border-b-2 border-gray-200 pb-4">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-700">
        <Text className="text-xl font-black text-white">{stepNumber}</Text>
      </View>
      <Text className="flex-1 text-xl font-black tracking-wide text-slate-900">{title}</Text>
    </View>
    <View className="gap-4 pt-1">{children}</View>
  </View>
);

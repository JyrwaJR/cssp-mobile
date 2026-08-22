import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ViewProps,
} from 'react-native';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  /** Enable scrolling for long content or small screens (default: true) */
  scrollable?: boolean;
  /** Automatically dismiss keyboard when tapping outside inputs (default: true) */
  dismissKeyboard?: boolean;
  /** Center content vertically (default: false) */
  centered?: boolean;
  /** Custom Tailwind classes for the outer container */
  className?: string;
  /** Custom Tailwind classes for the scroll view content container */
  contentClassName?: string;
}

export const Container = ({
  children,
  scrollable = true,
  dismissKeyboard = true,
  centered = false,
  className = '',
  contentClassName = '',
  style,
  ...props
}: ContainerProps) => {
  const content = (
    <View
      className={`w-full flex-1 ${centered ? 'justify-center' : ''} ${className}`}
      style={style}
      {...props}>
      {children}
    </View>
  );

  const wrappedContent = dismissKeyboard ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
    </TouchableWithoutFeedback>
  ) : (
    content
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="w-full flex-1">
      {scrollable ? (
        <ScrollView
          className="w-full flex-1"
          contentContainerClassName={`grow p-6 ${centered ? 'justify-center' : ''} ${contentClassName}`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {wrappedContent}
        </ScrollView>
      ) : (
        wrappedContent
      )}
    </KeyboardAvoidingView>
  );
};

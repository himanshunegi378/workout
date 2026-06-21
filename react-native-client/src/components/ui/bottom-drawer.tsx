import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  useColorScheme,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomDrawer({
  isOpen,
  onClose,
  title,
  children,
}: BottomDrawerProps) {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Backdrop overlay */}
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={styles.backdropBlur} />
        </Pressable>

        {/* Content container */}
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: themeColors.backgroundElement,
                paddingBottom: Math.max(insets.bottom, Spacing.four),
              },
            ]}
          >
            {/* Grab handle indicator */}
            <View style={styles.grabHandle} />

            {/* Header row */}
            {title && (
              <View style={styles.header}>
                <ThemedText type="smallBold" style={styles.titleText}>
                  {title}
                </ThemedText>
                <Pressable onPress={onClose} style={styles.closeButton} hitSlop={12}>
                  <SymbolView
                    name={{ ios: 'multiply.circle.fill', android: 'cancel', web: 'close' }}
                    size={24}
                    tintColor={themeColors.textSecondary}
                  />
                </Pressable>
              </View>
            )}

            <View style={styles.body}>{children}</View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropBlur: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    maxHeight: '85%',
  },
  grabHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    marginBottom: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
    height: 32,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    gap: Spacing.three,
  },
});

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  useColorScheme,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, Fonts } from '@/constants/theme';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  suffix?: string;
  stepOptions?: number[];
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  suffix,
  stepOptions = [],
}: NumberStepperProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];
  
  const [currentStep, setCurrentStep] = useState(step);
  const [inputValue, setInputValue] = useState(value.toString());

  // Sync state with parent value
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleDecrement = () => {
    const newValue = Math.max(min, Number((value - currentStep).toFixed(2)));
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, Number((value + currentStep).toFixed(2)));
    onChange(newValue);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleInputBlur = () => {
    let parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      parsed = min;
    } else {
      parsed = Math.max(min, Math.min(max, parsed));
    }
    setInputValue(parsed.toString());
    onChange(parsed);
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        {label && (
          <ThemedText type="smallBold" style={styles.labelText}>
            {label}
          </ThemedText>
        )}
        {stepOptions.length > 0 && (
          <View style={[styles.stepOptions, { backgroundColor: themeColors.backgroundSelected }]}>
            {stepOptions.map((opt) => {
              const isActive = currentStep === opt;
              return (
                <Pressable
                  key={opt}
                  onPress={() => setCurrentStep(opt)}
                  style={[
                    styles.optButton,
                    isActive && { backgroundColor: '#be185d' },
                  ]}
                >
                  <ThemedText
                    type="code"
                    style={[
                      styles.optText,
                      { color: isActive ? '#ffffff' : themeColors.textSecondary },
                    ]}
                  >
                    ±{opt}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      {/* Control row */}
      <View style={[styles.stepperRow, { backgroundColor: themeColors.backgroundSelected }]}>
        <Pressable
          onPress={handleDecrement}
          disabled={value <= min}
          style={({ pressed }) => [
            styles.ctrlButton,
            pressed && styles.pressed,
            value <= min && styles.disabled,
          ]}
        >
          <SymbolView
            name={{ ios: 'minus', android: 'remove', web: 'remove' }}
            size={18}
            tintColor={themeColors.text}
          />
        </Pressable>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="decimal-pad"
            value={inputValue}
            onChangeText={handleInputChange}
            onBlur={handleInputBlur}
            style={[
              styles.input,
              {
                color: themeColors.text,
              },
            ]}
          />
          {suffix && (
            <ThemedText type="code" style={styles.suffixText}>
              {suffix}
            </ThemedText>
          )}
        </View>

        <Pressable
          onPress={handleIncrement}
          disabled={value >= max}
          style={({ pressed }) => [
            styles.ctrlButton,
            pressed && styles.pressed,
            value >= max && styles.disabled,
          ]}
        >
          <SymbolView
            name={{ ios: 'plus', android: 'add', web: 'add' }}
            size={18}
            tintColor={themeColors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.one,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 26,
  },
  labelText: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
  },
  stepOptions: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 2,
  },
  optButton: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  optText: {
    fontSize: 10,
    fontWeight: '700',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: Spacing.one,
  },
  ctrlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(128,128,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.3,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  input: {
    width: 60,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 4,
  },
  suffixText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

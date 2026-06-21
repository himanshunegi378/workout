import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useAuth } from '@/context/auth-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedIcon } from '@/components/animated-icon';
import { Spacing } from '@/constants/theme';

/**
 * Premium Login and Signup screen.
 * Implements high-fidelity form layout, password visibility toggle, focus indicators,
 * and integration with the AuthProvider context.
 */
export function AuthScreen() {
  const { login, signup, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setValidationError(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleAuth = async () => {
    setValidationError(null);
    clearError();

    if (!username.trim() || username.length < 3) {
      setValidationError('Username must be at least 3 characters');
      return;
    }
    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(username.trim(), password);
      } else {
        await signup(username.trim(), password);
      }
    } catch {
      // Auth context handles errors in state; no need to throw locally
    } finally {
      setLoading(false);
    }
  };

  const displayError = validationError || error;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand Logo & Header */}
            <View style={styles.header}>
              <AnimatedIcon />
              <ThemedText type="subtitle" style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </ThemedText>
              <ThemedText type="small" style={styles.subtitleText}>
                {isLogin ? 'Log in to track your workouts' : 'Join and start tracking sets & PRs'}
              </ThemedText>
            </View>

            {/* Interactive Forms */}
            <View style={styles.form}>
              {displayError && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(150)}
                  style={styles.errorBanner}
                >
                  <ThemedText type="smallBold" style={styles.errorText}>
                    {displayError}
                  </ThemedText>
                </Animated.View>
              )}

              {/* Username field */}
              <View style={styles.inputContainer}>
                <ThemedText type="smallBold" style={styles.label}>
                  Username
                </ThemedText>
                <TextInput
                  value={username}
                  onChangeText={(val) => {
                    setUsername(val);
                    if (validationError || error) {
                      setValidationError(null);
                      clearError();
                    }
                  }}
                  placeholder="Enter your username"
                  placeholderTextColor="#666"
                  style={[
                    styles.input,
                    userFocused && styles.inputFocused,
                  ]}
                  onFocus={() => setUserFocused(true)}
                  onBlur={() => setUserFocused(false)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password field */}
              <View style={styles.inputContainer}>
                <ThemedText type="smallBold" style={styles.label}>
                  Password
                </ThemedText>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (validationError || error) {
                        setValidationError(null);
                        clearError();
                      }
                    }}
                    placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                    placeholderTextColor="#666"
                    secureTextEntry={!showPassword}
                    style={[
                      styles.input,
                      styles.passwordInput,
                      passFocused && styles.inputFocused,
                    ]}
                    onFocus={() => setPassFocused(true)}
                    onBlur={() => setPassFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.toggleShow}
                    activeOpacity={0.7}
                  >
                    <ThemedText type="smallBold" style={styles.toggleText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Repeat Password (signup only) */}
              {!isLogin && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(150)}
                  style={styles.inputContainer}
                >
                  <ThemedText type="smallBold" style={styles.label}>
                    Confirm Password
                  </ThemedText>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      if (validationError || error) {
                        setValidationError(null);
                        clearError();
                      }
                    }}
                    placeholder="Repeat your password"
                    placeholderTextColor="#666"
                    secureTextEntry={!showPassword}
                    style={[
                      styles.input,
                      confirmFocused && styles.inputFocused,
                    ]}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </Animated.View>
              )}

              {/* Submission button */}
              <TouchableOpacity
                onPress={handleAuth}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText type="default" style={styles.buttonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </ThemedText>
                )}
              </TouchableOpacity>

              {/* Form Mode Toggle */}
              <TouchableOpacity
                onPress={toggleAuthMode}
                style={styles.modeToggle}
                activeOpacity={0.7}
              >
                <ThemedText type="small" style={styles.modeToggleText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <ThemedText type="smallBold" style={styles.pinkText}>
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.five,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
    marginTop: Spacing.three,
  },
  subtitleText: {
    color: '#888',
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  form: {
    gap: Spacing.three,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.two,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
  inputContainer: {
    gap: Spacing.one,
  },
  label: {
    color: '#aaa',
    marginLeft: Spacing.one,
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1.5,
    borderColor: '#222',
    color: '#fff',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#be185d',
    backgroundColor: '#151515',
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: Spacing.six * 1.5,
  },
  toggleShow: {
    position: 'absolute',
    right: Spacing.three,
    padding: Spacing.two,
  },
  toggleText: {
    color: '#be185d',
  },
  button: {
    backgroundColor: '#be185d',
    paddingVertical: Spacing.three + 2,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.three,
    shadowColor: '#be185d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#be185d88',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  modeToggle: {
    alignItems: 'center',
    marginTop: Spacing.two,
    padding: Spacing.two,
  },
  modeToggleText: {
    color: '#888',
  },
  pinkText: {
    color: '#be185d',
  },
});

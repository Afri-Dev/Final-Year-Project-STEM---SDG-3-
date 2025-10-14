/**
 * Welcome/Auth Screen - Modern Beautiful UI
 * Enhanced user registration and login interface
 */

import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore, useThemeStore } from "../services/store";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  getPrimaryColorForGender,
  getColorScheme,
} from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

type TabType = "login" | "register";
type GenderType = "male" | "female" | "other" | "prefer_not_to_say";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const { login, register, isLoading, user } = useAuthStore();
  const { theme } = useThemeStore();

  const [activeTab, setActiveTab] = useState<TabType>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerAge, setRegisterAge] = useState("");
  const [registerGender, setRegisterGender] = useState<GenderType | "">("");
  const [registerGrade, setRegisterGrade] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Use gender-based theme - dynamically updates when gender selection changes
  const colors = useMemo(() => {
    const genderValue = registerGender && registerGender !== 'other' && registerGender !== 'prefer_not_to_say' 
      ? registerGender as 'male' | 'female'
      : undefined;
    return getColorScheme(theme === "dark", genderValue);
  }, [theme, registerGender]);

  // Animation values
  const [slideAnim] = useState(new Animated.Value(0));
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    // Clear errors when switching tabs
    setEmailError("");
    setPasswordError("");
    setNameError("");
    setAgeError("");
    Animated.spring(slideAnim, {
      toValue: tab === "login" ? 0 : 1,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string, isLogin: boolean = false): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (!isLogin && password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (!password) return { strength: "", color: colors.border, width: "0%" };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) {
      return { strength: "Weak", color: colors.error, width: "33%" };
    } else if (score <= 3) {
      return { strength: "Medium", color: colors.warning, width: "66%" };
    } else {
      return { strength: "Strong", color: colors.success, width: "100%" };
    }
  };

  const handleLogin = async () => {
    try {
      const isEmailValid = validateEmail(loginEmail);
      const isPasswordValid = validatePassword(loginPassword, true);

      if (!isEmailValid || !isPasswordValid) {
        triggerShake();
        return;
      }

      await login(loginEmail, loginPassword);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      triggerShake();
      
      // Parse error message for user-friendly feedback
      const errorMessage = error?.message || String(error);
      
      if (errorMessage.includes("Invalid email or password")) {
        Alert.alert(
          "Login Failed",
          "The email or password you entered is incorrect. Please try again.",
        );
      } else if (errorMessage.includes("No user found")) {
        setEmailError("No account found with this email");
        Alert.alert(
          "Account Not Found",
          "No account exists with this email address. Please sign up first.",
        );
      } else {
        Alert.alert(
          "Login Failed",
          "An error occurred while logging in. Please try again.",
        );
      }
    }
  };

  const handleRegister = async () => {
    try {
      // Validate name
      if (!registerName || registerName.length < 2) {
        setNameError("Name must be at least 2 characters");
        triggerShake();
        return;
      }
      setNameError("");

      // Validate email
      if (!validateEmail(registerEmail)) {
        triggerShake();
        return;
      }

      // Validate age
      const age = parseInt(registerAge);
      if (!registerAge || isNaN(age) || age < 10 || age > 20) {
        setAgeError("Age must be between 10 and 20");
        triggerShake();
        return;
      }
      setAgeError("");

      // Validate other fields
      if (!registerGender || !registerGrade) {
        Alert.alert("Required Fields", "Please fill in all fields");
        triggerShake();
        return;
      }

      // Validate password
      if (!validatePassword(registerPassword)) {
        triggerShake();
        return;
      }

      if (registerPassword !== registerConfirmPassword) {
        setPasswordError("Passwords do not match");
        triggerShake();
        return;
      }

      // Create user with email and password
      await register(
        {
          name: registerName,
          email: registerEmail,
          age,
          gender: registerGender as any,
          educationLevel: registerGrade as any,
          avatarId: "default",
          theme: theme,
        },
        registerPassword,
      );

      router.replace("/(tabs)/home");
    } catch (error: any) {
      triggerShake();
      
      // Parse error message for specific cases
      const errorMessage = error?.message || String(error);
      
      if (errorMessage.includes("UNIQUE constraint") || 
          errorMessage.includes("users.username") ||
          errorMessage.includes("users.email") ||
          errorMessage.includes("already exists")) {
        
        setEmailError("This email is already registered");
        
        Alert.alert(
          "Email Already Taken",
          "An account with this email address already exists. Please sign in instead or use a different email.",
          [
            {
              text: "Use Different Email",
              style: "cancel",
            },
            {
              text: "Go to Sign In",
              onPress: () => handleTabSwitch("login"),
            },
          ]
        );
      } else if (errorMessage.includes("Email already in use")) {
        setEmailError("This email is already in use");
        Alert.alert(
          "Email Already Registered",
          "This email is already registered. Please sign in or use a different email.",
        );
      } else if (errorMessage.includes("weak-password")) {
        setPasswordError("Password is too weak");
        Alert.alert(
          "Weak Password",
          "Please choose a stronger password with at least 6 characters.",
        );
      } else if (errorMessage.includes("invalid-email")) {
        setEmailError("Invalid email format");
        Alert.alert(
          "Invalid Email",
          "Please enter a valid email address.",
        );
      } else {
        Alert.alert(
          "Registration Failed",
          "An error occurred while creating your account. Please try again.",
        );
      }
    }
  };

  const handleGuestMode = () => {
    Alert.alert(
      "Guest Mode",
      "Guest mode will give you limited access. You won't be able to save progress. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => router.replace("/(tabs)/home") },
      ],
    );
  };

  const renderGenderPicker = () => {
    const genders: { label: string; value: GenderType; themeColor: string }[] = [
      { label: "Male", value: "male", themeColor: "#13a4ec" },
      { label: "Female", value: "female", themeColor: "#FF48E3" },
    ];

    return (
      <View style={styles.pickerGrid}>
        {genders.map((gender) => {
          const isSelected = registerGender === gender.value;
          const borderColor = isSelected ? gender.themeColor : colors.border;
          const backgroundColor = isSelected ? gender.themeColor : colors.surface;
          
          return (
            <TouchableOpacity
              key={gender.value}
              style={[
                styles.pickerOption,
                {
                  backgroundColor,
                  borderColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setRegisterGender(gender.value)}
            >
              <MaterialIcons
                name={gender.value === "male" ? "face" : "face-3"}
                size={24}
                color={isSelected ? "#ffffff" : colors.text}
              />
              <Text
                style={[
                  styles.pickerOptionText,
                  {
                    color: isSelected ? "#ffffff" : colors.text,
                  },
                ]}
              >
                {gender.label}
              </Text>
              {isSelected && (
                <View style={styles.themeColorIndicator}>
                  <MaterialIcons name="palette" size={16} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderGradePicker = () => {
    const educationLevels = [
      { label: "Primary Education", value: "primary" },
      { label: "Secondary Education", value: "secondary" },
      { label: "Undergraduate Education", value: "undergraduate" },
      { label: "Master's Education", value: "masters" },
      { label: "PhD Education", value: "phd" },
      { label: "No Formal Education", value: "none" },
    ];

    return (
      <View style={styles.educationGrid}>
        {educationLevels.map((education) => (
          <TouchableOpacity
            key={education.value}
            style={[
              styles.educationOption,
              {
                backgroundColor:
                  registerGrade === education.value ? colors.primary : colors.surface,
                borderColor:
                  registerGrade === education.value ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setRegisterGrade(education.value)}
          >
            <MaterialIcons
              name="school"
              size={20}
              color={registerGrade === education.value ? "#ffffff" : colors.text}
            />
            <Text
              style={[
                styles.educationOptionText,
                { color: registerGrade === education.value ? "#ffffff" : colors.text },
              ]}
            >
              {education.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.primary, colors.science, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="science" size={56} color="#ffffff" />
          </View>
          <Text style={styles.logoText}>STEMtastic</Text>
          <Text style={styles.tagline}>Learn. Explore. Innovate.</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Switcher */}
        <View
          style={[
            styles.tabSwitcher,
            { backgroundColor: colors.surface },
            Shadows.md,
          ]}
        >
          <View style={styles.tabButtons}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "login" && { backgroundColor: "transparent" },
              ]}
              onPress={() => handleTabSwitch("login")}
            >
              <MaterialIcons
                name="login"
                size={20}
                color={
                  activeTab === "login" ? colors.primary : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === "login"
                        ? colors.primary
                        : colors.textSecondary,
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "register" && { backgroundColor: "transparent" },
              ]}
              onPress={() => handleTabSwitch("register")}
            >
              <MaterialIcons
                name="person-add"
                size={20}
                color={
                  activeTab === "register"
                    ? colors.primary
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === "register"
                        ? colors.primary
                        : colors.textSecondary,
                  },
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: colors.primary,
                left: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["2%", "52%"],
                }),
              },
            ]}
          />
        </View>

        {/* Forms Container */}
        <View
          style={[
            styles.formsContainer,
            { backgroundColor: colors.surface },
            Shadows.lg,
          ]}
        >
          {/* Login Form */}
          {activeTab === "login" && (
            <Animated.View 
              style={[
                styles.form,
                { transform: [{ translateX: shakeAnim }] }
              ]}
            >
              <Text style={[styles.formTitle, { color: colors.text }]}>
                Welcome Back!
              </Text>
              <Text
                style={[styles.formSubtitle, { color: colors.textSecondary }]}
              >
                Sign in to continue your learning journey
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: emailError ? colors.error : colors.border,
                      borderWidth: emailError ? 2 : 1.5,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={emailError ? colors.error : colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={loginEmail}
                    onChangeText={(text) => {
                      setLoginEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    onBlur={() => validateEmail(loginEmail)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {emailError ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {emailError}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: passwordError ? colors.error : colors.border,
                      borderWidth: passwordError ? 2 : 1.5,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={passwordError ? colors.error : colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={loginPassword}
                    onChangeText={(text) => {
                      setLoginPassword(text);
                      if (passwordError) setPasswordError("");
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {passwordError}
                    </Text>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text
                  style={[styles.forgotPasswordText, { color: colors.primary }]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 },
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.science]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color="#ffffff"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <Animated.View 
              style={[
                styles.form,
                { transform: [{ translateX: shakeAnim }] }
              ]}
            >
              <Text style={[styles.formTitle, { color: colors.text }]}>
                Join STEMtastic!
              </Text>
              <Text
                style={[styles.formSubtitle, { color: colors.textSecondary }]}
              >
                Start your STEM learning adventure today
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: nameError ? colors.error : colors.border,
                      borderWidth: nameError ? 2 : 1.5,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="person-outline"
                    size={20}
                    color={nameError ? colors.error : colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textSecondary}
                    value={registerName}
                    onChangeText={(text) => {
                      setRegisterName(text);
                      if (nameError) setNameError("");
                    }}
                  />
                </View>
                {nameError ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {nameError}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: emailError ? colors.error : colors.border,
                      borderWidth: emailError ? 2 : 1.5,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={emailError ? colors.error : colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={registerEmail}
                    onChangeText={(text) => {
                      setRegisterEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    onBlur={() => validateEmail(registerEmail)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {emailError ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {emailError}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Age (10-20) <Text style={styles.required}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: ageError ? colors.error : colors.border,
                      borderWidth: ageError ? 2 : 1.5,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="cake"
                    size={20}
                    color={ageError ? colors.error : colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your age"
                    placeholderTextColor={colors.textSecondary}
                    value={registerAge}
                    onChangeText={(text) => {
                      setRegisterAge(text);
                      if (ageError) setAgeError("");
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                {ageError ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {ageError}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: passwordError ? colors.error : colors.border,
                      borderWidth: passwordError ? 2 : 1.5,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={passwordError ? colors.error : colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Create a password"
                    placeholderTextColor={colors.textSecondary}
                    value={registerPassword}
                    onChangeText={(text) => {
                      setRegisterPassword(text);
                      if (passwordError) setPasswordError("");
                    }}
                    secureTextEntry={!showRegisterPassword}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                  >
                    <MaterialIcons
                      name={
                        showRegisterPassword ? "visibility" : "visibility-off"
                      }
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {registerPassword ? (
                  <View style={styles.passwordStrength}>
                    <View style={styles.passwordStrengthBar}>
                      <View
                        style={[
                          styles.passwordStrengthFill,
                          {
                            width: getPasswordStrength(registerPassword).width as any,
                            backgroundColor: getPasswordStrength(registerPassword).color,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.passwordStrengthText,
                        { color: getPasswordStrength(registerPassword).color },
                      ]}
                    >
                      {getPasswordStrength(registerPassword).strength}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[styles.helperText, { color: colors.textSecondary }]}
                  >
                    Must be at least 6 characters
                  </Text>
                )}
                {passwordError ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {passwordError}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Confirm Password <Text style={styles.required}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: passwordError ? colors.error : colors.border,
                      borderWidth: passwordError ? 2 : 1.5,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={passwordError ? colors.error : colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    value={registerConfirmPassword}
                    onChangeText={(text) => {
                      setRegisterConfirmPassword(text);
                      if (passwordError) setPasswordError("");
                    }}
                    secureTextEntry={!showRegisterPassword}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                  >
                    <MaterialIcons
                      name={
                        showRegisterPassword ? "visibility" : "visibility-off"
                      }
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Gender <Text style={styles.required}>*</Text>
                </Text>
                {renderGenderPicker()}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Education Level <Text style={styles.required}>*</Text>
                </Text>
                {renderGradePicker()}
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 },
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.science]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color="#ffffff"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Guest Mode */}
        <View style={styles.guestSection}>
          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
              OR
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
          </View>

          <TouchableOpacity
            style={[styles.guestButton, { borderColor: colors.primary }]}
            onPress={handleGuestMode}
          >
            <MaterialIcons name="explore" size={20} color={colors.primary} />
            <Text style={[styles.guestButtonText, { color: colors.primary }]}>
              Explore as Guest
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.xl + 40,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoText: {
    fontSize: 36,
    fontWeight: Typography.fontWeight.bold,
    color: "#ffffff",
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  tabSwitcher: {
    borderRadius: BorderRadius.xl,
    padding: 4,
    marginBottom: Spacing.lg,
    position: "relative",
  },
  tabButtons: {
    flexDirection: "row",
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  tabButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 4,
    width: "46%",
    height: 4,
    borderRadius: 2,
  },
  formsContainer: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.lg,
  },
  formTitle: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: Typography.fontSize.base,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    height: 56,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    height: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -Spacing.sm,
  },
  forgotPasswordText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  primaryButton: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginTop: Spacing.sm,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  pickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.sm,
    width: "48%",
    position: "relative" as "relative",
  },
  pickerOptionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  themeColorIndicator: {
    position: "absolute" as "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: BorderRadius.full,
    padding: 2,
  },
  gradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  gradeOption: {
    width: (width - Spacing.lg * 2 - Spacing.xl * 2 - Spacing.sm * 3) / 4,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  gradeOptionText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  educationGrid: {
    gap: Spacing.sm,
  },
  educationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  educationOptionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  guestSection: {
    marginTop: Spacing.lg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  guestButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    marginTop: 4,
    fontStyle: "italic",
  },
  required: {
    color: "#ef4444",
    fontWeight: Typography.fontWeight.bold,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  passwordStrength: {
    marginTop: 8,
    gap: 4,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textAlign: "right",
  },
});

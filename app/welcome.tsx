/**
 * Welcome/Auth Screen - Modern Beautiful UI
 * Enhanced user registration and login interface
 */

import React, { useState } from "react";
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
} from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

type TabType = "login" | "register";
type GenderType = "male" | "female" | "other" | "prefer_not_to_say";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const { login, register, isLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<TabType>("register");
  const [showPassword, setShowPassword] = useState(false);

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

  // Animation values
  const [slideAnim] = useState(new Animated.Value(0));

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    Animated.spring(slideAnim, {
      toValue: tab === "login" ? 0 : 1,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleLogin = async () => {
    try {
      if (!loginEmail || !loginPassword) {
        Alert.alert("Required Fields", "Please enter your email and password");
        return;
      }

      await login(loginEmail, loginPassword);
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again.",
      );
    }
  };

  const handleRegister = async () => {
    try {
      // Validate inputs
      if (
        !registerName ||
        !registerEmail ||
        !registerAge ||
        !registerGender ||
        !registerGrade ||
        !registerPassword ||
        !registerConfirmPassword
      ) {
        Alert.alert("Required Fields", "Please fill in all fields");
        return;
      }

      const age = parseInt(registerAge);
      if (isNaN(age) || age < 10 || age > 20) {
        Alert.alert("Invalid Age", "Age must be between 10 and 20");
        return;
      }

      if (registerName.length < 2) {
        Alert.alert("Invalid Name", "Name must be at least 2 characters");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerEmail)) {
        Alert.alert("Invalid Email", "Please enter a valid email address");
        return;
      }

      if (registerPassword.length < 6) {
        Alert.alert(
          "Invalid Password",
          "Password must be at least 6 characters",
        );
        return;
      }

      if (registerPassword !== registerConfirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match");
        return;
      }

      // Create user with email and password
      await register(
        {
          name: registerName,
          email: registerEmail,
          age,
          gender: registerGender as any,
          gradeLevel: registerGrade,
          avatarId: "default",
          theme: theme,
        },
        registerPassword,
      );

      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Registration Failed", "Please try again.");
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
    const genders: { label: string; value: GenderType }[] = [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
      { label: "Prefer not to say", value: "prefer_not_to_say" },
    ];

    return (
      <View style={styles.pickerGrid}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender.value}
            style={[
              styles.pickerOption,
              {
                backgroundColor:
                  registerGender === gender.value
                    ? colors.primary
                    : colors.surface,
                borderColor:
                  registerGender === gender.value
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={() => setRegisterGender(gender.value)}
          >
            <MaterialIcons
              name={
                gender.value === "male"
                  ? "face"
                  : gender.value === "female"
                    ? "face-3"
                    : "face-6"
              }
              size={24}
              color={registerGender === gender.value ? "#ffffff" : colors.text}
            />
            <Text
              style={[
                styles.pickerOptionText,
                {
                  color:
                    registerGender === gender.value ? "#ffffff" : colors.text,
                },
              ]}
            >
              {gender.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderGradePicker = () => {
    const grades = ["5", "6", "7", "8", "9", "10", "11", "12"];

    return (
      <View style={styles.gradeGrid}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade}
            style={[
              styles.gradeOption,
              {
                backgroundColor:
                  registerGrade === grade ? colors.primary : colors.surface,
                borderColor:
                  registerGrade === grade ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setRegisterGrade(grade)}
          >
            <Text
              style={[
                styles.gradeOptionText,
                { color: registerGrade === grade ? "#ffffff" : colors.text },
              ]}
            >
              {grade}
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
            <View style={styles.form}>
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
                  Email Address
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
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
                  { backgroundColor: colors.primary },
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
            </View>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <View style={styles.form}>
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
                  Full Name
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="person-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textSecondary}
                    value={registerName}
                    onChangeText={setRegisterName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Email Address
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Age (10-20)
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="cake"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your age"
                    placeholderTextColor={colors.textSecondary}
                    value={registerAge}
                    onChangeText={setRegisterAge}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Gender
                </Text>
                {renderGenderPicker()}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Grade Level
                </Text>
                {renderGradePicker()}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Create a password"
                    placeholderTextColor={colors.textSecondary}
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
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
                <Text
                  style={[styles.helperText, { color: colors.textSecondary }]}
                >
                  Must be at least 6 characters
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Confirm Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    value={registerConfirmPassword}
                    onChangeText={setRegisterConfirmPassword}
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

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.primary },
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
            </View>
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
  },
  pickerOptionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
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
});

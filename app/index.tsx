/**
 * Splash Screen / Index Page
 * Entry point of the app - shows splash screen and redirects to welcome or home
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore, useThemeStore } from "../services/store";
import { Colors, Typography, Spacing } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 12,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/welcome");
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: `${colors.primary}33` },
          ]}
        >
          <MaterialIcons name="science" size={120} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          STEM for Everyone, Everywhere
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Learn • Explore • Innovate
        </Text>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.text }]}>
              Loading...
            </Text>
            <Text style={[styles.progressPercentage, { color: colors.text }]}>
              100%
            </Text>
          </View>

          <View
            style={[
              styles.progressBarBackground,
              { backgroundColor: `${colors.primary}33` },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.primary,
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Powered by AI • Built for Zambia
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["3xl"],
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    textAlign: "center",
    fontWeight: Typography.fontWeight.medium,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
  },
  progressContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  progressText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  progressPercentage: {
    fontSize: Typography.fontSize.sm,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  tagline: {
    fontSize: Typography.fontSize.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
});

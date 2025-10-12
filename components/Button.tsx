/**
 * Reusable Button Component
 * Supports primary, secondary, and outline variants with loading states
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, BorderRadius, Spacing, Typography } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  theme?: "light" | "dark";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  theme = "light",
}) => {
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: BorderRadius.lg,
      paddingHorizontal:
        size === "small"
          ? Spacing.md
          : size === "large"
            ? Spacing.xl
            : Spacing.lg,
      paddingVertical:
        size === "small"
          ? Spacing.sm
          : size === "large"
            ? Spacing.md
            : Spacing.sm + 2,
      opacity: disabled || loading ? 0.6 : 1,
    };

    if (fullWidth) {
      baseStyle.width = "100%";
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize:
        size === "small"
          ? Typography.fontSize.sm
          : size === "large"
            ? Typography.fontSize.lg
            : Typography.fontSize.base,
      fontWeight: Typography.fontWeight.bold,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseTextStyle,
          color: "#ffffff",
        };
      case "secondary":
        return {
          ...baseTextStyle,
          color: colors.text,
        };
      case "outline":
      case "ghost":
        return {
          ...baseTextStyle,
          color: colors.primary,
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#ffffff" : colors.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              getTextStyle(),
              textStyle,
              icon ? { marginLeft: Spacing.sm } : null,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});

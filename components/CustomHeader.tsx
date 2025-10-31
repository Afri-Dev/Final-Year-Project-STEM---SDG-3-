import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  home: undefined;
  [key: string]: any;
};

type StackHeaderProps = {
  navigation?: StackNavigationProp<RootStackParamList>;
  options?: {
    title?: string;
    headerShown?: boolean;
  };
  route?: {
    name: string;
    key: string;
    params: any;
  };
};
import { useThemeStore, useAuthStore } from '../services/store';
import { Colors, Typography, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

type CustomHeaderProps = StackHeaderProps & {
  showBackButton?: boolean;
  showCloseButton?: boolean;
  title?: string;
  rightComponent?: React.ReactNode;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  navigation = {
    goBack: () => {},
    navigate: () => {},
    canGoBack: () => false,
  } as any,
  options = {},
  showBackButton = true,
  showCloseButton = false,
  title,
  rightComponent,
}) => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  const headerTitle = title || options.title || '';
  const canGoBack = navigation.canGoBack();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBackButton && canGoBack && (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text 
            style={[
              styles.title, 
              { color: colors.text },
              !canGoBack && { marginLeft: Spacing.md }
            ]} 
            numberOfLines={1}
          >
            {headerTitle}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {showCloseButton && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('home')}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No padding or border needed as we'll handle it in headerContent
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 20, // Exact match to profile page
    paddingBottom: Spacing.md,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    // No flex needed as we're using space-between
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    // No textAlign needed as we're using flexbox for alignment
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomHeader;

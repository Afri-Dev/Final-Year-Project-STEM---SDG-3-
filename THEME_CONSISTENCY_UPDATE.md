# Theme Consistency Update - Female Theme Application

## Problem
The gender-based theme colors (specifically the female theme with pink color `#FF48E3`) were not being consistently applied across all pages of the application. Only the home screen was using the gender-based theming system.

## Root Cause
Most pages were using the basic theme colors directly:
```typescript
const colors = theme === 'dark' ? Colors.dark : Colors.light;
```

Instead of using the `getColorScheme()` helper function that applies gender-based theme colors:
```typescript
const colors = getColorScheme(theme === 'dark', user?.gender);
```

## Solution
Updated all pages and components to use the `getColorScheme()` helper function with the user's gender parameter. This ensures the female theme (pink `#FF48E3`) or male theme (blue `#13a4ec`) is consistently applied throughout the entire application.

## Files Updated

### 1. **app/welcome.tsx**
- **Change**: Added `useMemo` to dynamically calculate colors based on selected gender during registration
- **Benefit**: Theme preview updates in real-time as user selects their gender
- **Implementation**:
  ```typescript
  const colors = useMemo(() => {
    const genderValue = registerGender && registerGender !== 'other' && registerGender !== 'prefer_not_to_say' 
      ? registerGender as 'male' | 'female'
      : undefined;
    return getColorScheme(theme === "dark", genderValue);
  }, [theme, registerGender]);
  ```

### 2. **app/(tabs)/home.tsx** ✅
- **Status**: Already using `getColorScheme()` correctly
- **No changes needed**

### 3. **app/(tabs)/learn.tsx**
- **Change**: Updated to use `getColorScheme(theme === 'dark', user?.gender)`
- **Added**: Import `useAuthStore` to access user gender
- **Before**: `const colors = theme === 'dark' ? Colors.dark : Colors.light;`
- **After**: `const colors = getColorScheme(theme === 'dark', user?.gender);`

### 4. **app/(tabs)/leaderboard.tsx**
- **Change**: Updated to use `getColorScheme(theme === 'dark', user?.gender)`
- **Added**: Import `getColorScheme` from theme constants
- **Before**: `const colors = theme === 'dark' ? Colors.dark : Colors.light;`
- **After**: `const colors = getColorScheme(theme === 'dark', user?.gender);`

### 5. **app/(tabs)/profile.tsx**
- **Change**: Updated to use `getColorScheme(theme === 'dark', user?.gender)`
- **Added**: Import `getColorScheme` from theme constants
- **Before**: `const colors = theme === 'dark' ? Colors.dark : Colors.light;`
- **After**: `const colors = getColorScheme(theme === 'dark', user?.gender);`

### 6. **app/index.tsx** (Splash Screen)
- **Change**: Updated to use `getColorScheme(theme === 'dark', user?.gender)`
- **Added**: Import `useAuthStore` to access user gender
- **Before**: `const colors = theme === 'dark' ? Colors.dark : Colors.light;`
- **After**: `const colors = getColorScheme(theme === 'dark', user?.gender);`

### 7. **app/(tabs)/_layout.tsx** (Tab Navigation)
- **Change**: Updated to use `getColorScheme(theme === 'dark', user?.gender)`
- **Added**: Import `useAuthStore` to access user gender
- **Benefit**: Tab bar colors now match the user's gender-based theme

### 8. **components/Button.tsx**
- **Change**: Added `gender` prop support for gender-based theming
- **Usage**: Can now pass gender prop to buttons for consistent theming
- **Implementation**:
  ```typescript
  interface ButtonProps {
    // ... other props
    gender?: "male" | "female"; // Support gender-based theming
  }
  
  const colors = getColorScheme(theme === "dark", gender);
  ```

## Theme Color Reference

### Male Theme (Default Blue)
- **Primary**: `#13a4ec`
- **Primary Light**: `#13a4ec33` (20% opacity)
- **Primary Dark**: `#0f8bc9`

### Female Theme (Pink)
- **Primary**: `#FF48E3`
- **Primary Light**: `#FF48E333` (20% opacity)
- **Primary Dark**: `#E03CCB`

## How It Works

The `getColorScheme()` function in `constants/theme.ts`:
1. Takes theme mode (dark/light) and optional gender parameter
2. Returns base colors for the theme mode
3. Applies gender-specific primary colors if gender is provided
4. Falls back to default blue theme if no gender specified

```typescript
export const getColorScheme = (isDark: boolean, gender?: 'male' | 'female') => {
  const baseColors = isDark ? Colors.dark : Colors.light;
  
  // Apply gender-based theme colors
  if (gender === 'female') {
    return {
      ...baseColors,
      primary: GenderThemeColors.female.primary,
      primaryLight: GenderThemeColors.female.primaryLight,
      primaryDark: GenderThemeColors.female.primaryDark,
    };
  } else if (gender === 'male') {
    return {
      ...baseColors,
      primary: GenderThemeColors.male.primary,
      primaryLight: GenderThemeColors.male.primaryLight,
      primaryDark: GenderThemeColors.male.primaryDark,
    };
  }
  
  return baseColors;
};
```

## Testing Checklist

To verify the female theme is consistently applied:

1. ✅ Register a new user with gender set to "Female"
2. ✅ Check all pages display pink theme (`#FF48E3`):
   - Welcome/Registration screen (updates as you select gender)
   - Home screen
   - Learn screen
   - Leaderboard screen
   - Profile screen
   - Tab navigation bar
3. ✅ Verify buttons use the pink theme
4. ✅ Verify progress bars use the pink theme
5. ✅ Verify all primary UI elements use the pink theme

## Benefits

1. **Consistent User Experience**: All pages now respect the user's gender-based theme preference
2. **Real-time Preview**: Registration form updates theme colors as gender is selected
3. **Maintainable Code**: Single source of truth for theme logic
4. **Scalable**: Easy to add more gender-based customizations in the future
5. **Accessible**: Theme applies to all UI elements including navigation, buttons, and indicators

## Technical Notes

- **useMemo Hook**: Used in welcome.tsx to optimize performance and prevent unnecessary recalculations
- **Optional Gender**: All implementations gracefully handle missing gender (falls back to default blue)
- **Type Safety**: TypeScript ensures gender values are correctly typed as 'male' | 'female'
- **No Breaking Changes**: Default behavior (blue theme) remains unchanged if no gender specified

## Future Enhancements

Potential improvements for the theme system:

1. Add more gender options with custom colors
2. Allow users to customize their own theme colors
3. Add theme animations when switching between themes
4. Implement theme persistence across app restarts (already in store.ts)
5. Add accessibility options for high-contrast themes

---

**Date**: 2025-10-14  
**Status**: ✅ Completed  
**Verified**: All TypeScript errors resolved, type checking passed

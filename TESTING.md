# STEM Learning App - Testing Guide

## 🧪 Quick Test Instructions

### Prerequisites
```bash
# Make sure you're in the project directory
cd stem_learning_app

# Install dependencies (if not done)
npm install

# Start the development server
npm start
```

## ✅ Test Checklist

### Test 1: App Launch (2 minutes)
```
1. Run: npm start
2. Press 'a' for Android or 'i' for iOS
3. ✅ Splash screen appears with animated logo
4. ✅ Progress bar animates to 100%
5. ✅ App redirects to welcome screen (no user) or dashboard (existing user)
```

**Expected Result:** Smooth transition from splash to next screen  
**If it fails:** Check that database.initialize() completes successfully

---

### Test 2: User Registration (5 minutes)
```
1. On welcome screen, click "New to the Adventure?" tab
2. Fill in registration form:
   - Name: "Test User"
   - Age: "15"
   - Gender: Click dropdown, select "male"
   - Grade: Click dropdown, select "10th Grade"
3. Click "Register" button
4. ✅ App should navigate to dashboard
5. ✅ Dashboard shows "Welcome back! Test User"
6. ✅ Stats show 0 XP, 0 Badges, 0 Streak
```

**Expected Result:** User created, logged in, dashboard displayed  
**If it fails:** Check console for database errors

---

### Test 3: Dashboard Features (5 minutes)
```
1. On dashboard, verify all elements:
   ✅ User avatar and name in header
   ✅ Notification bell icon
   ✅ 3 stat cards (XP Points, Badges, Streak)
   ✅ Level progress card showing Level 1
   ✅ 4 quick action cards (Learn, Quiz, Leaderboard, Profile)
   ✅ AI suggestion card with gradient
   ✅ "Continue Learning" section with 2 subjects

2. Test interactions:
   ✅ Pull down to refresh (should work)
   ✅ Tap notification icon (placeholder)
   ✅ Tap Learn card (navigates to Learn tab)
   ✅ Tap Profile card (navigates to Profile tab)
```

**Expected Result:** All UI elements display correctly, navigation works  
**If it fails:** Check that subjects are loaded from database

---

### Test 4: Learn Tab (3 minutes)
```
1. Navigate to Learn tab (bottom navigation)
2. ✅ See "Let's learn something new today!" header
3. ✅ See 4 subject cards:
   - Science (blue icon)
   - Technology (green icon)
   - Engineering (purple icon)
   - Mathematics (red icon)
4. ✅ Each card shows:
   - Subject name and description
   - "X topics" count
   - Progress bar with percentage
5. ✅ "Your Learning Journey" stats card displays
6. ✅ Pull to refresh works

7. Tap a subject card (e.g., Science)
```

**Expected Result:** Subject cards display, clicking shows "not implemented" or goes to subject detail  
**If it fails:** Check that subjects loaded from database

---

### Test 5: Profile Tab (5 minutes)
```
1. Navigate to Profile tab
2. ✅ See user avatar and name
3. ✅ See level (Level 1 - Beginner)
4. ✅ See Edit Avatar and Theme Toggle buttons
5. ✅ See level progress bar (0/100 XP)
6. ✅ See 3 stat cards (XP: 0, Badges: 0, Streak: 0)
7. ✅ See badge grid with 6 badges (3 locked, 3 unlocked - sample data)
8. ✅ See 7-day streak calendar

9. Test Theme Toggle:
   - Click theme toggle button
   - ✅ App switches to dark mode
   - ✅ All colors invert properly
   - ✅ Click again, switches back to light mode

10. Test Settings:
    - Scroll down to settings
    - Click "Logout" button
    - ✅ App redirects to welcome screen
```

**Expected Result:** Profile displays all user data, theme toggle works, logout works  
**If it fails:** Check that user data is in authStore

---

### Test 6: Quiz Tab (2 minutes)
```
1. Navigate to Quiz tab
2. ✅ See "Test Your Knowledge" header
3. ✅ See quiz stats card (sample data)
4. ✅ See 4 quiz category cards
5. ✅ See "Coming Soon" card

6. Tap a quiz category
```

**Expected Result:** Shows placeholder or navigates to quiz list  
**If it fails:** Expected - quiz list not implemented yet

---

### Test 7: Navigation Flow (3 minutes)
```
1. Start at Dashboard
2. Tap Learn quick action → ✅ Goes to Learn tab
3. Tap bottom nav Home → ✅ Goes back to Dashboard
4. Tap bottom nav Profile → ✅ Goes to Profile
5. Tap bottom nav Learn → ✅ Goes to Learn tab
6. Tap bottom nav Quiz → ✅ Goes to Quiz tab

7. Test tab persistence:
   - Go to Profile tab
   - Close app (don't kill, just background)
   - Reopen app
   - ✅ Should still be on Profile tab (or go to Dashboard)
```

**Expected Result:** All navigation works smoothly  
**If it fails:** Check Expo Router configuration

---

### Test 8: Database Content (2 minutes)
```
1. Open React Native Debugger or check console logs
2. Check that data exists:
   ✅ 4 subjects created
   ✅ 20 topics created (5 per subject)
   ✅ 20+ lessons created
   ✅ 40+ quiz questions created
   ✅ 8 badges created

To verify manually:
- In app, go to Learn tab
- Should see all 4 subjects
- Each subject should show "5 topics"
```

**Expected Result:** All content seeded correctly  
**If it fails:** Delete app and reinstall to re-seed database

---

### Test 9: Theme Persistence (2 minutes)
```
1. Go to Profile tab
2. Toggle theme to dark mode
3. Close app completely (kill it)
4. Reopen app
5. ✅ Theme should still be dark mode

6. Toggle back to light mode
7. Close and reopen
8. ✅ Theme should still be light mode
```

**Expected Result:** Theme preference persists across app restarts  
**If it fails:** Check SecureStore.setItemAsync('app_theme', theme)

---

### Test 10: Offline Functionality (3 minutes)
```
1. Turn on airplane mode on device
2. Open app
3. ✅ App should still work
4. ✅ Can navigate between tabs
5. ✅ Can view all content
6. ✅ Everything functions normally

7. Try to register a new user (if logged out)
8. ✅ Should work (local only)
```

**Expected Result:** App fully functional offline  
**If it fails:** Check that no network calls are being made

---

## 🐛 Common Issues & Fixes

### Issue 1: White Screen on Launch
**Fix:**
```bash
# Clear cache and restart
expo start -c
```

### Issue 2: Database Not Seeding
**Fix:**
```bash
# Uninstall and reinstall app
# Android:
adb uninstall com.stemlearning.app
npm run android

# iOS:
# Delete app from simulator
npm run ios
```

### Issue 3: "Database not initialized" Error
**Fix:**
- Check that `database.initialize()` is called in `app/_layout.tsx`
- Check console logs for initialization errors
- Make sure expo-sqlite is installed: `npx expo install expo-sqlite`

### Issue 4: Navigation Not Working
**Fix:**
- Check that Expo Router is properly configured
- Verify all screen files are in correct location
- Check that file names match route names

### Issue 5: Theme Not Changing
**Fix:**
- Check that useThemeStore is being called in component
- Verify colors are using `colors.text` not hardcoded values
- Check that theme toggle calls `toggleTheme()` function

### Issue 6: Missing Icons
**Fix:**
```bash
# Make sure @expo/vector-icons is installed
npx expo install @expo/vector-icons
```

### Issue 7: TypeScript Errors
**Fix:**
```bash
# Run type check
npm run type-check

# Common fix: restart TypeScript server in IDE
```

---

## 📊 Test Results Template

Copy this and fill it out:

```
TEST DATE: [Date]
DEVICE: [Android/iOS/Simulator]
OS VERSION: [e.g., Android 13, iOS 17]

✅ = Pass  ❌ = Fail  ⚠️ = Partial

[ ] Test 1: App Launch
[ ] Test 2: User Registration
[ ] Test 3: Dashboard Features
[ ] Test 4: Learn Tab
[ ] Test 5: Profile Tab
[ ] Test 6: Quiz Tab
[ ] Test 7: Navigation Flow
[ ] Test 8: Database Content
[ ] Test 9: Theme Persistence
[ ] Test 10: Offline Functionality

ISSUES FOUND:
1. [Describe issue]
2. [Describe issue]

NOTES:
[Any additional observations]
```

---

## 🎯 What Should Work Now

### Fully Functional:
- ✅ App launch and splash screen
- ✅ Dashboard with all stats and cards
- ✅ Learn tab with subject browsing
- ✅ Profile tab with badges and streak
- ✅ Theme switching (light/dark)
- ✅ Bottom tab navigation
- ✅ Pull-to-refresh on all tabs
- ✅ User registration (basic)
- ✅ Logout functionality

### Partially Working:
- ⚠️ Welcome screen (form works, needs better validation)
- ⚠️ Quiz tab (shows categories, no quiz taking yet)
- ⚠️ Profile badges (sample data, needs real DB integration)

### Not Yet Built:
- ❌ Subject detail (topic list)
- ❌ Lesson viewer
- ❌ Quiz taking screen
- ❌ Quiz results screen
- ❌ Leaderboard
- ❌ Achievements detail screen
- ❌ Settings screens
- ❌ Edit profile

---

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ Core infrastructure is solid
2. ✅ Ready to build quiz flow
3. ✅ Ready to build learning flow

If tests fail:
1. Check the specific test section above
2. Review the "Common Issues & Fixes" section
3. Check BUILD_GUIDE.md for implementation details
4. Review existing code in similar screens

---

## 💡 Testing Tips

1. **Test on Real Device**: Emulators don't always catch all issues
2. **Test Both Themes**: Switch between light and dark mode
3. **Test Offline**: Turn on airplane mode
4. **Clear Data**: Sometimes you need fresh start (uninstall/reinstall)
5. **Check Console**: Look for errors and warnings
6. **Use React DevTools**: Great for debugging state

---

## 📝 Reporting Bugs

When you find a bug, document:
1. What you were doing
2. What you expected to happen
3. What actually happened
4. Device and OS version
5. Screenshot (if visual bug)
6. Console errors (if any)

---

**Happy Testing! 🎉**
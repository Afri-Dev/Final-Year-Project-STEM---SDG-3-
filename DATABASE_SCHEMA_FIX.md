# Database Schema Fix - Order Column Issue

## Problem Summary

**Error:** `Call to function 'NativeDatabase.prepareAsync' has been rejected → java.lang.NullPointerException`

**Root Cause:** SQLite doesn't recognize backticks (`) as column delimiters. The `order` column was incorrectly defined using backticks instead of double quotes.

## What Was Fixed

### 1. SQL Syntax Corrections
- **Before:** `` \`order\` INTEGER DEFAULT 0 ``
- **After:** `"order" INTEGER DEFAULT 0`

### 2. Affected Tables
- `subjects` table
- `topics` table  
- `lessons` table
- `questions` table

### 3. Affected Queries
- `getAllSubjects()` - SELECT with ORDER BY
- `getTopicsBySubject()` - SELECT with ORDER BY
- `getLessonsByTopic()` - SELECT with ORDER BY
- `getQuestionsByQuiz()` - SELECT with ORDER BY

### 4. Affected INSERT Statements
- `seedSubjects()` - INSERT INTO subjects
- `seedTopics()` - INSERT INTO topics
- `seedLessons()` - INSERT INTO lessons
- `seedQuizzes()` - INSERT INTO questions

## Solution Implemented

### Automatic Database Reset on Schema Change Detection

Following best practices for breaking schema changes, the database service now:

1. **Detects Old Schema** on app startup
2. **Deletes Old Database** using `SQLite.deleteDatabaseAsync()`
3. **Recreates Tables** with correct syntax
4. **Re-seeds Data** automatically

### Code Changes

#### 1. Added Schema Detection Method
```typescript
private async checkNeedsSchemaReset(): Promise<boolean>
```
- Opens existing database
- Checks for old schema presence
- Returns true if reset needed

#### 2. Updated Initialization Flow
```typescript
async initialize(): Promise<void> {
  // Check if we need to delete old database
  const needsReset = await this.checkNeedsSchemaReset();
  
  if (needsReset) {
    await SQLite.deleteDatabaseAsync('stem_learning.db');
  }
  
  // Continue with normal initialization
}
```

#### 3. Database Version Updated
- **From:** v5
- **To:** v6

## User Impact

⚠️ **Important:** All existing data will be reset when the app launches with this fix.

- User accounts will be deleted
- Progress will be reset
- Badges/achievements will be cleared
- Leaderboard will be reset

This is necessary to fix the fundamental schema issue.

## Testing

After applying this fix:

1. **Clean app data** (optional, but recommended)
2. **Restart the app**
3. **Check logs** for:
   - `🔄 Detected old schema with breaking changes, resetting database...`
   - `✅ Old database deleted successfully`
   - `✅ Database opened successfully`
   - `✅ Database initialization complete`

4. **Test registration** - Should work without NullPointerException
5. **Test subject loading** - Should display all subjects correctly

## Prevention

To avoid similar issues in the future:

1. **Always use double quotes** for reserved SQL keywords in SQLite
2. **Test schema changes** on a clean database
3. **Use migrations carefully** for breaking changes
4. **Follow the memory guideline:** Detect Old Schema → Delete DB → Recreate

## Technical Details

### SQLite Column Escaping Rules
- ✅ **Double quotes:** `"order"`
- ✅ **Square brackets:** `[order]`
- ❌ **Backticks:** `` `order` `` (MySQL syntax, not SQLite)

### Reserved Keywords in SQLite
Common reserved keywords that need escaping:
- `order`
- `group`
- `select`
- `where`
- `from`
- `table`

## Related Files Modified

- `services/database.ts` - Main fix implementation
- Database version bumped from 5 → 6

## Migration History

- **v4:** Added authentication columns
- **v5:** Added educationLevel column  
- **v6:** Fixed order column syntax (breaking change)

---

**Date:** 2025-10-14  
**Status:** ✅ Fixed  
**Breaking Change:** Yes (requires database reset)

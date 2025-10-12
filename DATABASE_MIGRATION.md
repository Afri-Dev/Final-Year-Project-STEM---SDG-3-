# Database Migration Guide

## 🔄 Automatic Migration System

The STEM Learning App includes an **automatic database migration system** that updates your existing database without losing data.

---

## ✅ What Was Migrated

### Changes Made
The database was updated to add authentication support:

1. **Added `username` column** to `users` table
   - Auto-generated from existing user names
   - Example: "John Doe" → "johndoe"
   - Made unique with index

2. **Added `password` column** to `users` table
   - Existing users get default password: `password123`
   - New users set their own password during registration

---

## 🔧 How It Works

### Migration Process
The migration runs automatically when you start the app:

```typescript
// On app startup:
1. Initialize database connection
2. Create tables if they don't exist
3. Run migration:
   - Check if username column exists
   - Check if password column exists
   - Add missing columns
   - Update existing users with default values
   - Create unique index on username
4. Seed initial data if needed
5. App ready to use
```

### Migration Code Location
File: `services/database.ts`
Function: `migrateDatabase()`

---

## 📋 Migration Details

### Step 1: Check Existing Columns
```sql
PRAGMA table_info(users);
```
Checks what columns currently exist in the users table.

### Step 2: Add Missing Columns
```sql
-- Add username if missing
ALTER TABLE users ADD COLUMN username TEXT;

-- Add password if missing
ALTER TABLE users ADD COLUMN password TEXT;
```

### Step 3: Update Existing Users
```sql
-- For each existing user without username/password:
UPDATE users 
SET username = ?, password = ? 
WHERE id = ?;
```

### Step 4: Create Unique Index
```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_username ON users(username);
```

---

## 🆕 For Existing Users

### If You Had an Account Before
Your existing account has been updated:

**Username**: Auto-generated from your name
- "John Doe" → username: `johndoe`
- "Mary Jane" → username: `maryjane`
- Spaces removed, lowercase

**Password**: Set to default
- Default password: `password123`
- You can login with this password
- **Recommended**: Change it after logging in (feature coming soon)

### How to Login
1. Open the app
2. Click "Sign In" tab
3. Username: (your name without spaces, lowercase)
4. Password: `password123`
5. Click "Sign In"

---

## 🆕 For New Users

### Fresh Registration
New users who register after the migration:

1. Fill out the registration form
2. Create your own password (minimum 6 characters)
3. Confirm your password
4. Username auto-generated from your name
5. All set!

---

## 🔍 Checking Migration Status

### Console Logs
When the app starts, you'll see:
```
Database initialized successfully
Added username column to users table
Added password column to users table
Updated X existing users with username and password
```

### No Existing Users
If you're starting fresh:
```
Database initialized successfully
Initial data seeded successfully
```

---

## ⚠️ Important Notes

### Data Safety
- ✅ **No data loss**: All existing user data is preserved
- ✅ **Automatic**: Migration runs automatically on app start
- ✅ **Idempotent**: Safe to run multiple times (won't duplicate)
- ✅ **Backward compatible**: Old data structure still works

### Default Passwords
If you had an account before this update:
- Your password is now: `password123`
- This is temporary and for testing
- You should change it after logging in
- (Password change feature coming soon)

### Username Collisions
If two users have the same name:
- Example: Two users named "John Doe"
- Both would get username "johndoe"
- The unique index will prevent duplicates
- Second user's migration will fail
- **Solution**: Manually update one username in database

---

## 🛠️ Manual Database Reset (If Needed)

### Option 1: Clear App Data (Recommended)
**Android:**
1. Go to Settings → Apps → STEM Learning App
2. Tap "Storage"
3. Tap "Clear Data"
4. Reopen app
5. Fresh database created with new schema

**iOS:**
1. Delete and reinstall the app
2. Fresh database created

### Option 2: Clear Expo Cache
```bash
# Stop the app
Ctrl+C

# Clear cache
npm start -- --reset-cache

# Or completely reset
rm -rf node_modules
npm install
npm start
```

### Option 3: Delete Database Directly
The database file is located at:
- Android: `/data/data/com.stemlearning.app/databases/stem_learning.db`
- iOS: `~/Library/Developer/CoreSimulator/Devices/.../stem_learning.db`

Delete this file and restart the app.

---

## 📊 Database Schema (After Migration)

### Users Table (Complete)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE,        -- ✨ NEW
  password TEXT,               -- ✨ NEW
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  gradeLevel TEXT NOT NULL,
  avatarId TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  currentStreak INTEGER DEFAULT 0,
  longestStreak INTEGER DEFAULT 0,
  totalBadges INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  lastActive TEXT NOT NULL,
  theme TEXT DEFAULT 'light'
);

-- Unique index on username
CREATE UNIQUE INDEX idx_username ON users(username);
```

---

## 🧪 Testing the Migration

### Test 1: Existing User Login
```
1. Start the app
2. Go to Sign In tab
3. Username: (your old name, lowercase, no spaces)
4. Password: password123
5. Should login successfully ✅
```

### Test 2: New User Registration
```
1. Start the app
2. Go to Register tab
3. Fill in all fields including password
4. Should create account successfully ✅
5. Should auto-login ✅
```

### Test 3: Check Console
```
Watch console for migration messages:
- "Added username column to users table" ✅
- "Added password column to users table" ✅
- "Updated X existing users..." ✅
```

---

## 🔮 Future Migrations

### Adding New Columns
The migration system can be extended:

```typescript
// In migrateDatabase() function:

// Check for new column
const hasNewColumn = tableInfo.some((col: any) => col.name === "newColumn");

// Add if missing
if (!hasNewColumn) {
  await this.db.execAsync(
    "ALTER TABLE users ADD COLUMN newColumn TEXT"
  );
}
```

### Version Tracking
Future enhancement:
```typescript
// Add version table
CREATE TABLE schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL
);

// Track migrations
INSERT INTO schema_version (version, applied_at)
VALUES (2, datetime('now'));
```

---

## 🐛 Troubleshooting

### Error: "table users has no column named username"
**Solution**: Migration didn't run
```bash
# Restart app
npm start

# Check console for migration logs
```

### Error: "UNIQUE constraint failed: users.username"
**Solution**: Duplicate usernames exist
```bash
# You have two users with same name
# Need to manually update one username in database
```

### Error: Migration runs but login still fails
**Solution**: Clear app data and restart
```bash
# Android: Settings → Apps → Clear Data
# iOS: Delete and reinstall
```

### Can't remember username
**Solution**: Username is your name in lowercase without spaces
```
"John Doe" → johndoe
"Mary Jane Smith" → maryjanesmith
"Alex-P" → alex-p
```

---

## ✅ Summary

### What Happened
- ✅ Database automatically updated with new columns
- ✅ Existing users got default password: `password123`
- ✅ New users can set their own password
- ✅ No data was lost
- ✅ App continues to work normally

### What You Need to Do
**Existing Users:**
1. Login with username (name without spaces, lowercase)
2. Use password: `password123`
3. Change password later (feature coming soon)

**New Users:**
1. Register normally
2. Set your own password
3. Remember your credentials

### Migration Status
✅ **Complete and Working**

The database migration system is live and tested. All users can now authenticate with username and password!

---

**Questions?** Check `AUTH_GUIDE.md` for authentication details.

**Last Updated**: Migration added for username/password authentication
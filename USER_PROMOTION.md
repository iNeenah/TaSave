# 👥 User Role Management - TaSave

## 🔐 Promoting Users to Different Roles

Since the promote-user script was removed for production deployment, here are alternative methods to manage user roles:

### Method 1: Direct Database Query (Recommended)

Connect to your Neon database and run SQL commands directly:

```sql
-- Promote user to admin
UPDATE users SET role = 'admin' WHERE username = 'your_username';

-- Promote user to contributor
UPDATE users SET role = 'contributor' WHERE username = 'your_username';

-- Demote user back to regular user
UPDATE users SET role = 'user' WHERE username = 'your_username';

-- Check current user roles
SELECT id, username, role, created_at FROM users ORDER BY created_at DESC;
```

### Method 2: Using Drizzle Studio (GUI)

1. Install Drizzle Studio globally:
   ```bash
   npm install -g drizzle-kit
   ```

2. Run Drizzle Studio:
   ```bash
   npx drizzle-kit studio
   ```

3. Navigate to the `users` table and edit the `role` column directly

### Method 3: Create Admin API Endpoint (Future Enhancement)

You could create a protected API endpoint for role management:

```typescript
// src/app/api/admin/promote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth-roles";

export async function POST(request: NextRequest) {
  // Check if current user is admin
  const canManage = await isAdmin();
  if (!canManage) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { username, role } = await request.json();
  
  // Update user role
  await db.update(users)
    .set({ role })
    .where(eq(users.username, username));

  return NextResponse.json({ success: true });
}
```

## 🎯 Initial Setup Steps

1. **Apply Database Migration** (if not done):
   ```sql
   CREATE TYPE "public"."role" AS ENUM('user', 'contributor', 'admin');
   ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;
   ```

2. **Promote Initial Admin**:
   ```sql
   UPDATE users SET role = 'admin' WHERE username = 'admin';
   ```

3. **Verify Role System**:
   - Login as admin user
   - Check that "Upload Machine" button appears
   - Test uploading a machine
   - Verify access control works for regular users

## 📋 Role Permissions

| Role | View Machines | Upload Machines | Admin Functions |
|------|---------------|-----------------|-----------------|
| user | ✅ | ❌ | ❌ |
| contributor | ✅ | ✅ | ❌ |
| admin | ✅ | ✅ | ✅ |

## 🔧 Troubleshooting

### User Can't Upload Machines
1. Check user role in database
2. Verify role column exists and has correct enum values
3. Clear browser cache and re-login

### Role Changes Not Reflected
1. User needs to logout and login again
2. Check if JWT token includes role information
3. Verify database connection and query execution

## 🚀 Production Deployment Notes

- The role system is fully functional in production
- Database migration must be applied manually to Neon
- Initial admin promotion must be done via direct database access
- All role-based features work automatically once roles are set

This system provides secure, scalable role management for the TaSave platform! 🎯
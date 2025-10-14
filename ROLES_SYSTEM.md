# TaSave - Role-Based Access Control System

## 🔐 Overview

TaSave now implements a comprehensive role-based access control (RBAC) system to manage user permissions and ensure content quality. This system controls who can upload machines and provides a foundation for future administrative features.

## 👥 User Roles

### 🟢 User (Default)
- **Permissions**: View machines, create reviews, manage favorites/todos
- **Restrictions**: Cannot upload machines
- **Description**: Standard user with read-only access to machine content

### 🔵 Contributor
- **Permissions**: All User permissions + Upload machines
- **Restrictions**: Cannot delete machines or manage other users
- **Description**: Trusted community members who can contribute content

### 🔴 Administrator
- **Permissions**: All Contributor permissions + Full system access
- **Restrictions**: None
- **Description**: Full administrative access (prepared for future features)

## 🛡️ Security Implementation

### Permission Checks
- **Server Actions**: `requirePermission()` validates access before execution
- **API Routes**: Role verification in all machine upload endpoints
- **UI Components**: Conditional rendering based on user permissions
- **Page Access**: Route-level protection with access denied pages

### Database Schema
```sql
-- Role enum
CREATE TYPE "public"."role" AS ENUM('user', 'contributor', 'admin');

-- Users table with role column
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;
```

## 🚀 Usage

### Promoting Users
```bash
# Promote user to contributor
npx tsx promote-user.ts username contributor

# Promote user to admin
npx tsx promote-user.ts admin admin

# Demote user back to regular user
npx tsx promote-user.ts username user
```

### Checking Permissions in Code
```typescript
// Check if user can upload machines
const canUpload = await canUploadMachines();

// Check if user is admin
const isUserAdmin = await isAdmin();

// Require specific permission (throws error if denied)
await requirePermission('UPLOAD_MACHINE');
```

## 🎨 UI Features

### Access Control
- **Upload Button**: Only visible to contributors and admins
- **Upload Page**: Shows access denied message for regular users
- **Role Badges**: Visual indication of user roles (future feature)

### User Experience
- **Clear Messaging**: Informative error messages about required permissions
- **Role Display**: Shows current role and required role for actions
- **Graceful Degradation**: Features hide/show based on permissions

## 📋 Permission Matrix

| Action | User | Contributor | Admin |
|--------|------|-------------|-------|
| View Machines | ✅ | ✅ | ✅ |
| Create Reviews | ✅ | ✅ | ✅ |
| Manage Favorites/Todos | ✅ | ✅ | ✅ |
| Upload Machines | ❌ | ✅ | ✅ |
| Delete Machines | ❌ | ❌ | ✅* |
| Moderate Reviews | ❌ | ❌ | ✅* |
| Manage Users | ❌ | ❌ | ✅* |

*Future features - infrastructure ready

## 🔧 Technical Details

### Files Modified
- `src/db/schema.ts` - Added role enum and user role column
- `src/lib/auth-roles.ts` - Role management and permission checking
- `src/lib/actions/machines.ts` - Added permission checks to upload function
- `src/app/upload/page.tsx` - Access control and denied page
- `src/app/dashboard/page.tsx` - Conditional upload button
- `src/app/api/machines/route.ts` - API permission validation

### New Files Created
- `src/lib/auth-roles.ts` - Complete role management system
- `src/components/UserRoleBadge.tsx` - Role display component
- `promote-user.ts` - User promotion utility script
- `ROLES_SYSTEM.md` - This documentation

### Database Migration
```sql
-- Apply this migration to your Neon database
CREATE TYPE "public"."role" AS ENUM('user', 'contributor', 'admin');
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;
```

## 🎯 Benefits

### Security
- **Controlled Access**: Only trusted users can upload content
- **Quality Assurance**: Reduces spam and low-quality submissions
- **Scalable Permissions**: Easy to add new roles and permissions

### User Experience
- **Clear Hierarchy**: Users understand their capabilities
- **Motivation**: Provides path for increased privileges
- **Professional Feel**: Enterprise-grade access control

### Administration
- **Easy Management**: Simple commands to promote/demote users
- **Audit Trail**: Clear permission structure for compliance
- **Future-Proof**: Ready for advanced admin features

## 🔮 Future Enhancements

### Planned Features
- **Role Management UI**: Admin dashboard for user management
- **Bulk Operations**: Promote multiple users at once
- **Permission Logs**: Track permission changes and usage
- **Custom Roles**: Define custom roles with specific permissions

### Advanced Permissions
- **Machine Ownership**: Authors can edit their own machines
- **Category Moderators**: Users who can moderate specific categories
- **Time-Limited Roles**: Temporary elevated permissions
- **API Keys**: Role-based API access for integrations

## 📊 Current Status

✅ **Implemented**
- Role-based access control system
- Upload permission restrictions
- UI conditional rendering
- API endpoint protection
- User promotion utilities

🚧 **In Progress**
- Database migration (manual step required)
- User role promotion (admin setup needed)

🔮 **Planned**
- Admin dashboard
- Role management UI
- Advanced permission features

## 🎉 Ready for Production

The role system is fully implemented and ready for production use. After applying the database migration and promoting initial administrators, the system will provide robust access control for the TaSave platform.

### Next Steps
1. Apply database migration to Neon
2. Promote initial admin users
3. Test role functionality
4. Deploy to production
5. Monitor and iterate based on usage
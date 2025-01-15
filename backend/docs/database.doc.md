# Prisma Schema Documentation

This document provides an overview of the Prisma schema models used in the application.

## User

Represents a user in the system.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for the user.
- **name**: `String` - User's full name.
- **username**: `String` (Unique) - Unique username for the user.
- **email**: `String?` (Unique) - Optional unique email address for the user.
- **isEmailVerified**: `Boolean` - Indicates whether the user's email has been verified.
- **password**: `String` - The user's password (should be hashed before storage).
- **image**: `String?` - Optional field for the user's profile image.
- **roleId**: `String` - Foreign key linking to the `Role` model.
- **createdAt**: `DateTime` - Timestamp of when the user was created (default: now).
- **updatedAt**: `DateTime` - Timestamp of the last time the user was updated (auto-updated).
- **sessions**: `Session[]` - Relation to the `Session` model.
- **AuditLog**: `AuditLog[]` - Relation to the `AuditLog` model.
- **User Activity**: `User Activity[]` - Relation to the `User Activity` model.

### Indexes

- `@@index([username, email, roleId])`

---

## Session

Represents a user session in the system.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for each session.
- **expiresAt**: `DateTime` - Timestamp indicating when the session expires.
- **token**: `String` (Unique) - Unique token for the session.
- **createdAt**: `DateTime` - Timestamp of when the session was created (default: now).
- **updatedAt**: `DateTime` - Timestamp of the last time the session was updated (auto-updated).
- **ipAddress**: `String?` - Optional field for the IP address associated with the session.
- **userAgent**: `String?` - Optional field for the user agent associated with the session.
- **userId**: `String` - Foreign key linking to the `User ` model.

### Indexes

- `@@unique([token])`

---

## Role

Represents a role assigned to users in the system.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for each role.
- **name**: `String` (Unique) - Unique name for the role (e.g., Admin, Teacher, Student).
- **description**: `String` - Description of the role.
- **createdAt**: `DateTime` - Timestamp of when the role was created (default: now).
- **updatedAt**: `DateTime` - Timestamp of the last time the role was updated (auto-updated).
- **users**: `User []` - Relation to the `User ` model.
- **Permission**: `Permission[]` - Relation to the `Permission` model.
- **RolePermissions**: `RolePermissions[]` - Relation to the `RolePermissions` model.

### Indexes

- `@@index([name])`

---

## PermissionGroup

Represents a group of permissions in the system.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for each permission group.
- **name**: `String` (Unique) - Unique name for the permission group.
- **description**: `String` - Description of the permission group.
- **createdAt**: `DateTime` - Timestamp of when the group was created (default: now).
- **updatedAt**: `DateTime` - Timestamp of the last time the group was updated (auto-updated).
- **permissions**: `Permission[]` - Relation to the `Permission` model.

### Indexes

- `@@index([name])`

---

## Permission

Represents a permission that can be assigned to roles.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for each permission.
- **name**: `String` (Unique) - Unique name for the permission (e.g., "create_student").
- **description**: `String` - Description of the permission.
- **createdAt**: `DateTime` - Timestamp of when the permission was created (default: now).
- **updatedAt**: `DateTime` - Timestamp of the last time the permission was updated (auto-updated).
- **roles**: `Role[]` - Relation to the `Role` model - **permissionGroupId**: `String` - Foreign key linking to the `PermissionGroup` model.

### Indexes

- `@@index([name])`

---

## RolePermissions

Represents the association between roles and permissions.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for each role-permission association.
- **roleId**: `String` - Foreign key linking to the `Role` model.
- **permissionId**: `String` - Foreign key linking to the `Permission` model.
- **createdAt**: `DateTime` - Timestamp of when the association was created (default: now).
- **updatedAt**: `DateTime` - Timestamp of the last time the association was updated (auto-updated).

### Indexes

- `@@unique([roleId, permissionId])`

---

## AuditLog

Represents a log of actions performed by users in the system.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for each audit log entry.
- **action**: `String` - Description of the action performed.
- **userId**: `String` - Foreign key linking to the `User ` model.
- **createdAt**: `DateTime` - Timestamp of when the action was logged (default: now).

### Indexes

- `@@index([userId])`

---

## UserActivity

Represents activity logs for users in the system.

### Fields

- **id**: `String` (Primary Key) - Unique identifier for each user activity entry.
- **activity**: `String` - Description of the user activity.
- **userId**: `String` - Foreign key linking to the `User ` model.
- **createdAt**: `DateTime` - Timestamp of when the activity was logged (default: now).

### Indexes

- `@@index([userId])`

---
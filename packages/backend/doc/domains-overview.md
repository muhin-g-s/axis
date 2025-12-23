# Domain Overview

This document provides an overview of all domains in the backend application, their responsibilities, and the data they store.

## Table of Contents
- [Identity Domain](#identity-domain)
- [Workspaces Domain](#workspaces-domain)
- [Projects Domain](#projects-domain)
- [Issues Domain](#issues-domain)
- [Workspace Configuration Domain](#workspace-configuration-domain)

---

## Identity Domain

**Responsibilities:**
- User authentication and authorization
- User account management
- Password hashing and verification
- Session management

**Entities:**
- **User** - Represents a system user with credentials and profile information

**Data Storage:**
- **Database Table:** `users`
- **Fields:**
  - `id`: User's unique identifier (primary key)
  - `username`: User's chosen username (unique)
  - `email`: User's email address (unique)
  - `passwordHash`: Hashed password
  - `createdAt`: Timestamp when the user was created
  - `updatedAt`: Timestamp when the user was last updated
  - `deletedAt`: Timestamp when the user was soft-deleted (optional)

---

## Workspaces Domain

**Responsibilities:**
- Workspace management and organization
- User membership in workspaces
- Role-based permissions within workspaces

**Entities:**
- **Workspace** - Represents a collaborative workspace
- **WorkspaceUser** - Represents a user's membership in a workspace with their role

**Data Storage:**
1. **Database Table:** `workspaces`
   - **Fields:**
     - `id`: Workspace's unique identifier (primary key)
     - `name`: Name of the workspace
     - `ownerId`: ID of the user who owns the workspace (references users table)
     - `createdAt`: Timestamp when the workspace was created
     - `updatedAt`: Timestamp when the workspace was last updated
     - `deletedAt`: Timestamp when the workspace was soft-deleted (optional)

2. **Database Table:** `workspace_users`
   - **Fields:**
     - `workspaceId`: ID of the workspace (references workspaces table)
     - `userId`: ID of the user (references users table)
     - `role`: User's role in the workspace (e.g., 'admin', 'member')
   - **Primary Key:** Composite key of (workspaceId, userId)

---

## Projects Domain

**Responsibilities:**
- Project management within workspaces
- Project lifecycle (creation, renaming, deletion)
- Project ownership and permissions

**Entities:**
- **Project** - Represents a project within a workspace

**Data Storage:**
- **Database Table:** `projects`
- **Fields:**
  - `id`: Project's unique identifier (primary key)
  - `name`: Name of the project
  - `workspaceId`: ID of the workspace the project belongs to (references workspaces table)
  - `version`: Version number for optimistic locking
  - `createdAt`: Timestamp when the project was created
  - `updatedAt`: Timestamp when the project was last updated
  - `deletedAt`: Timestamp when the project was soft-deleted (optional)

---

## Issues Domain

**Responsibilities:**
- Issue/Task management within projects
- Issue lifecycle (creation, assignment, status updates, etc.)
- Issue prioritization and estimation
- Issue labeling and categorization

**Entities:**
- **Issue** - Represents a task or issue within a project (schema not yet implemented as domain entity)

**Data Storage:**
- **Database Table:** `issues`
- **Fields:**
  - `id`: Issue's unique identifier (primary key)
  - `projectId`: ID of the project this issue belongs to (references projects table)
  - `title`: Title of the issue
  - `description`: Detailed description of the issue
  - `statusId`: ID of the issue's current status (references workspace_statuses table)
  - `priorityId`: ID of the issue's priority (references workspace_priorities table)
  - `estimate`: Numeric estimation for the issue
  - `assigneeId`: ID of the user assigned to the issue (references users table)
  - `uniqueIdentifier`: Unique identifier for the issue (unique)

- **Database Table:** `issue_labels` (junction table)
  - **Fields:**
    - `issueId`: ID of the issue (references issues table)
    - `labelId`: ID of the label (references workspace_labels table)
  - **Primary Key:** Composite key of (issueId, labelId)

---

## Workspace Configuration Domain

**Responsibilities:**
- Workspace-level configuration management
- Status, priority, and label definitions
- Customization options for workspaces

**Entities:**
- **Status** - Represents a workflow status that issues can have
- **Priority** - Represents a priority level for issues
- **Label** - Represents a label for categorizing issues

**Data Storage:**
1. **Database Table:** `workspace_statuses`
   - **Fields:**
     - `id`: Status's unique identifier (primary key)
     - `workspaceId`: ID of the workspace this status belongs to (references workspaces table)
     - `name`: Name of the status (e.g., 'To Do', 'In Progress', 'Done')
     - `order`: Numeric order of the status in the workflow

2. **Database Table:** `workspace_priorities`
   - **Fields:**
     - `id`: Priority's unique identifier (primary key)
     - `workspaceId`: ID of the workspace this priority belongs to (references workspaces table)
     - `name`: Name of the priority (e.g., 'Low', 'Medium', 'High')
     - `level`: Numeric representation of the priority level

3. **Database Table:** `workspace_labels`
   - **Fields:**
     - `id`: Label's unique identifier (primary key)
     - `workspaceId`: ID of the workspace this label belongs to (references workspaces table)
     - `name`: Name of the label (e.g., 'Bug', 'Feature', 'Enhancement')
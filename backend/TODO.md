общая архитектура

```
src/
 ├─ modules/
 │   ├─ identity/
 │   ├─ workspaces/
 │   ├─ projects/
 │   └─ issues/
 │
 ├─ app/
 │   ├─ container/
 │   ├─ http/
 │   ├─ events/
 │   └─ config/
 │
 └─ index.ts
```

cхема модуля
```
projects/
 ├─ domain/
 │   ├─ entities/
 │   │   └─ Project.ts
 │   ├─ value-objects/
 │   │   ├─ ProjectId.ts
 │   │   └─ WorkspaceId.ts
 │   ├─ repositories/
 │   │   └─ ProjectRepository.ts
 │   └─ errors/
 │       └─ ProjectNotFoundError.ts
 │
 ├─ application/
 │   ├─ commands/
 │   │   └─ CreateProjectCommand.ts
 │   ├─ handlers/
 │   │   └─ CreateProjectHandler.ts
 │   ├─ queries/
 │   │   └─ ProjectExistsQuery.ts
 │   ├─ services/
 │   │   └─ ProjectQueryService.ts
 │   └─ dto/
 │       └─ ProjectDTO.ts
 │
 ├─ infrastructure/
 │   ├─ persistence/
 │   │   ├─ orm/
 │   │   │   └─ ProjectModel.ts
 │   │   └─ repositories/
 │   │       └─ SequelizeProjectRepository.ts
 │   ├─ http/
 │   │   ├─ ProjectController.ts
 │   │   └─ routes.ts
 │   └─ mappers/
 │       └─ ProjectMapper.ts
 │
 └─ index.ts
```

Use case: Создание задачи с назначением меток и добавлением наблюдателей Сценарий Пользователь создаёт задачу в проекте и одновременно: Назначает исполнителя (assignee) Присваивает метки (labels) Добавляет наблюдателей (watchers) Требование: все изменения должны быть атомарными — если что-то пошло не так, задача не создаётся, метки и наблюдатели не привязываются.

```
UI → IssueController → CreateIssueHandler
       ├─ rightsChecker → workspaces/WorkspaceService
       ├─ projectService → projects/ProjectService
       ├─ identityService → identity/IdentityService
       ├─ labelService → labels/LabelsService
       └─ issueRepo.saveFullIssue() → транзакция DB
```

```
-- Migrations will appear here as you chat with AI

create table users (
  id bigint primary key generated always as identity,
  username text not null unique,
  email text not null unique,
  password_hash text not null
);

create table workspaces (
  id bigint primary key generated always as identity,
  name text not null,
  owner_id bigint not null references users (id)
);

create table workspace_users (
  workspace_id bigint not null references workspaces (id),
  user_id bigint not null references users (id),
  role text not null,
  primary key (workspace_id, user_id)
);

create table projects (
  id bigint primary key generated always as identity,
  name text not null,
  workspace_id bigint not null references workspaces (id)
);

create table issues (
  id bigint primary key generated always as identity,
  project_id bigint not null references projects (id),
  title text not null,
  description text,
  status text,
  priority text,
  estimate numeric,
  assignee_id bigint references users (id),
  unique_identifier text not null unique
);

create table statuses (
  id bigint primary key generated always as identity,
  project_id bigint not null references projects (id),
  name text not null,
  is_default boolean not null default false
);

create table priorities (
  id bigint primary key generated always as identity,
  project_id bigint not null references projects (id),
  name text not null,
  is_default boolean not null default false
);

create table labels (
  id bigint primary key generated always as identity,
  project_id bigint not null references projects (id),
  name text not null,
  is_default boolean not null default false
);

create table issue_labels (
  issue_id bigint not null references issues (id),
  label_id bigint not null references labels (id),
  primary key (issue_id, label_id)
);
```
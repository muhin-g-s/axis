## 0. Общие допущения MVP (контекст)

* Система **мульти-тенантная**: изоляция данных обеспечивается на уровне `workspace`.
* Пользователь (`user`) может состоять в нескольких рабочих пространствах через `workspace_users`.
* Ролевая модель MVP минимальная:

  * **Workspace Owner / Admin**
  * **Workspace Member**
* Все операции с проектами, задачами и справочниками выполняются **в контексте workspace**.

---

# 1. Управление пользователями (Users)

## Use Case 1.1 — Регистрация пользователя

**1) Субъект**
Новый пользователь (анонимный)

**2) Описание действия**
Создание учетной записи пользователя в системе.

**3) Входные данные**

```json
{
  "email": "user@example.com",
  "password": "hashed_password",
  "name": "John Doe"
}
```

**4) Результат / выходные данные**

* Создана запись в `users`
* Возвращается `user_id`, базовый профиль

**5) Взаимодействующие сущности**

* `users`

---

## Use Case 1.2 — Добавление пользователя в рабочее пространство

**1) Субъект**
Workspace Owner / Admin

**2) Описание действия**
Привязка существующего пользователя к workspace с определенной ролью.

**3) Входные данные**

```json
{
  "workspace_id": "uuid",
  "user_id": "uuid",
  "role": "member | admin"
}
```

**4) Результат**

* Создана запись в `workspace_users`

**5) Сущности и связи**

* `users` ←→ `workspace_users` ←→ `workspaces`
* Связь many-to-many

---

# 2. Управление рабочими пространствами (Workspaces)

## Use Case 2.1 — Создание рабочего пространства

**1) Субъект**
Аутентифицированный пользователь

**2) Описание действия**
Создание нового workspace (тенанта).

**3) Входные данные**

```json
{
  "name": "Acme Team"
}
```

**4) Результат**

* Создан `workspace`
* Пользователь добавлен в `workspace_users` с ролью `owner`

**5) Сущности**

* `workspaces`
* `workspace_users`
* `users`

---

## Use Case 2.2 — Получение списка рабочих пространств пользователя

**1) Субъект**
Пользователь

**2) Описание**
Просмотр всех workspace, в которых состоит пользователь.

**3) Входные данные**

* `user_id` (из auth context)

**4) Результат**

```json
[
  {
    "workspace_id": "...",
    "name": "...",
    "role": "admin"
  }
]
```

**5) Сущности**

* `workspace_users` → `workspaces`

---

# 3. Управление проектами (Projects)

## Use Case 3.1 — Создание проекта

**1) Субъект**
Workspace Admin

**2) Описание**
Создание проекта внутри workspace.

**3) Входные данные**

```json
{
  "workspace_id": "uuid",
  "name": "Backend",
  "key": "BE"
}
```

**4) Результат**

* Создан `project`

**5) Сущности**

* `workspaces` 1→N `projects`

---

## Use Case 3.2 — Получение проектов workspace

**1) Субъект**
Участник workspace

**2) Описание**
Просмотр доступных проектов.

**3) Входные данные**

* `workspace_id`

**4) Результат**
Список проектов

**5) Сущности**

* `projects`

---

# 4. Управление справочниками (Statuses, Priorities, Labels)

## Use Case 4.1 — Создание статуса задачи

**1) Субъект**
Workspace Admin

**2) Описание**
Добавление статуса (например, To Do, In Progress).

**3) Входные данные**

```json
{
  "workspace_id": "uuid",
  "name": "In Progress",
  "order": 2
}
```

**4) Результат**

* Создан `status`

**5) Сущности**

* `workspaces` 1→N `statuses`

---

## Use Case 4.2 — Создание приоритета

**1) Субъект**
Workspace Admin

**2) Описание**
Добавление приоритета задач.

**3) Входные данные**

```json
{
  "workspace_id": "uuid",
  "name": "High",
  "level": 3
}
```

**4) Результат**

* Создан `priority`

**5) Сущности**

* `priorities` ← `workspaces`

---

## Use Case 4.3 — Создание метки (Label)

**1) Субъект**
Workspace Member

**2) Описание**
Создание текстовой метки.

**3) Входные данные**

```json
{
  "workspace_id": "uuid",
  "name": "backend"
}
```

**4) Результат**

* Создан `label`

**5) Сущности**

* `labels`

---

# 5. Управление задачами (Issues)

## Use Case 5.1 — Создание задачи

**1) Субъект**
Workspace Member

**2) Описание**
Создание issue в проекте.

**3) Входные данные**

```json
{
  "project_id": "uuid",
  "title": "Fix auth bug",
  "description": "...",
  "status_id": "uuid",
  "priority_id": "uuid",
  "assignee_id": "uuid | null"
}
```

**4) Результат**

* Создан `issue`

**5) Сущности**

* `projects` 1→N `issues`
* `issues` → `statuses`
* `issues` → `priorities`
* `issues` → `users` (assignee)

---

## Use Case 5.2 — Изменение статуса задачи

**1) Субъект**
Workspace Member

**2) Описание**
Перевод задачи в другой статус.

**3) Входные данные**

```json
{
  "issue_id": "uuid",
  "status_id": "uuid"
}
```

**4) Результат**

* Обновлен `issues.status_id`

**5) Сущности**

* `issues` → `statuses`

---

## Use Case 5.3 — Назначение приоритета

**1) Субъект**
Workspace Member

**2) Описание**
Изменение приоритета задачи.

**3) Входные данные**

```json
{
  "issue_id": "uuid",
  "priority_id": "uuid"
}
```

**4) Результат**

* Обновлен `issues.priority_id`

**5) Сущности**

* `issues` → `priorities`

---

## Use Case 5.4 — Добавление метки к задаче

**1) Субъект**
Workspace Member

**2) Описание**
Связывание задачи с меткой.

**3) Входные данные**

```json
{
  "issue_id": "uuid",
  "label_id": "uuid"
}
```

**4) Результат**

* Создана запись в `issue_labels`

**5) Сущности и связи**

* `issues` ←→ `issue_labels` ←→ `labels`
* Связь many-to-many

---

## Use Case 5.5 — Получение списка задач проекта

**1) Субъект**
Workspace Member

**2) Описание**
Просмотр задач с фильтрацией.

**3) Входные данные (query)**

```json
{
  "project_id": "uuid",
  "status_id": "uuid?",
  "priority_id": "uuid?",
  "label_ids": ["uuid"]
}
```

**4) Результат**
Список issues с вложенными статусами, приоритетами и метками.

**5) Сущности**

* `issues`
* `statuses`
* `priorities`
* `issue_labels`
* `labels`

---

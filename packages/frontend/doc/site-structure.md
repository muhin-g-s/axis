# Фронтенд

## Короткий перечень страниц (MVP)

1. Auth: Sign up / Sign in / Password reset / Email verification
2. Workspace selector / Workspaces list (страница «Мои рабочие пространства»)
3. Workspace dashboard (обзор рабочего пространства)
4. Workspace settings (общие настройки рабочего пространства)
5. Members (список участников и управление ролями / приглашения)
6. Projects list (список проектов workspace)
7. Project board / Issues list (board / list view для одного проекта)
8. Issue create / edit (modal или отдельная страница)
9. Issue detail (полная карточка задачи)
10. Labels management (справочник меток)
11. Statuses & Priorities management (управление статусами и приоритетами)
12. User profile / Account settings
13. Error & access pages (403, 404, workspace-not-found)

## Layouts приложения

### L0 — Auth Layout (Public / Minimal)

**Используется для**
Auth-страниц (Sign in / Sign up / Reset / Verify)

**Функциональность**

* Центрированный контейнер (form card)
* Логотип / название продукта
* Минимальный футер (terms, privacy — опционально)
* Нет workspace-контекста
* Нет header/sidebar
* Redirect logic:

  * если пользователь аутентифицирован → redirect на `/workspaces` или последний workspace

---

### L1 — App Root Layout (Authenticated Shell)

**Базовый layout для всех аутентифицированных страниц**

**Функциональность**

* Проверка аутентификации (auth guard)
* Загрузка user profile + список workspaces (lazy/once)
* Верхний App Header:

  * Workspace switcher
  * Quick create issue
  * Search (global, optional MVP+)
  * User menu (profile, logout)
* Основной контейнер для вложенных layouts

> Сам по себе L1 редко используется напрямую — он оборачивает workspace/layout’ы ниже.

---

### L2 — Workspace Layout

**Контекстный layout рабочего пространства**

**Функциональность**

* Workspace guard:

  * проверка, что workspace существует
  * проверка, что user — member
* Левый Sidebar workspace:

  * Dashboard
  * Projects
  * Members
  * Labels
  * Statuses / Priorities
  * Settings (visible по роли)
* Отображение текущего workspace name
* Breadcrumb root (`Workspace`)

Используется всеми страницами внутри workspace.

---

### L3 — Project Layout

**Вложенный layout проекта**

**Функциональность**

* Проверка принадлежности project → workspace
* Project header:

  * Project name + key
  * View switcher: Board / List
  * Project actions (edit/archive — по роли)
* Project-level breadcrumbs (`Workspace → Project`)
* Tabs или view state (board/list)

---

### L4 — Settings Layout

**Общий layout для страниц настроек**

**Функциональность**

* Вертикальная навигация (Settings menu):

  * Workspace settings
  * Members
  * Labels
  * Statuses & Priorities
* Единый UI-паттерн:

  * list → edit → confirm modal
* Role-based visibility пунктов

Используется для workspace-level settings.

---

### L5 — Error / Empty State Layout

**Функциональность**

* Стандартизированный error UI
* Код ошибки + human-readable message
* CTA (Back / Go to dashboard / Request access)
* Не раскрывает internal details

---

## Детальное описание страниц, функциональность, guards, какие леауты использует

### 1) Auth: Sign up / Sign in / Password reset / Email verification

**Функциональность**

* Формы регистрации и входа (email + password).
* Email подтверждение (verification token flow).
* Reset password по email (token).
* "Remember me", управление сессиями (список активных сессий в профиле — опционально).
* Простая validation UI (email формат, минимальная длина пароля).

**Guards / проверки**

* Только анонимные пользователи могут видеть Sign Up / Sign In (client route guard).

**Routes**

* `/auth/sign-in`
* `/auth/sign-up`
* `/auth/reset-password`
* `/auth/reset-password/:token`
* `/auth/verify-email/:token`

**Layout**

* `L0 — Auth Layout`

---

### 2) Workspace selector / Workspaces list

**Функциональность**

* Список всех `workspaces`, где пользователь — участник.
* Кнопка создания нового workspace.
* Переход/свич workspace (переключение контекста).

**Guards**

* Требуется аутентификация.

**Route**

* `/workspaces`

**Layout**

* `L1 — App Root Layout`

---

### 3) Workspace dashboard (overview)

**Функциональность**

* Виджеты: последние задачи, число открытых по приоритетам, быстрый фильтр, быстрый create issue, recent activity (кратко).
* Ссылки на Projects, Members, Settings.

**Guards**

* Доступ только участникам workspace.
* UI: скрывать действия (например, «удалить workspace») для не-admin/owner.

**Route**

* `/w/:workspaceId`

**Layout**

* `L1 → L2 (Workspace Layout)`

---

### 4) Workspace settings (general)

**Функциональность**

* Редактирование имени workspace, описание.
* Transfer ownership, delete workspace (confirm modal).
* Настройки приглашаемых доменов/политик (опционально).

**Guards**

* Доступ: owner для удаления/передачи, admin для редактирования общих настроек (настраивается).

**Route**

* `/w/:workspaceId/settings/general`

**Layout**

* `L1 → L2 → L4 (Settings Layout)`

---

### 5) Members (workspace_users)

**Функциональность**

* Список участников (email, name, role).
* Приглашение по email (создание приглашения с токеном).
* Изменение роли (member ↔ admin), удаление участника, resend invite, accept invite flow.

**Guards**

* Доступ: admin/owner только (просмотр — можно разрешить всем членам, но управление — admin).

**Route**

* `/w/:workspaceId/settings/members`

**Layout**

* `L1 → L2 → L4`

---

### 6) Projects list

**Функциональность**

* Список проектов workspace (name, key, description).
* Create / edit / archive / delete project (modal).
* Поиск и фильтрация.

**Guards**

* Просмотр: все участники workspace.
* Создание/удаление: admin/owner.
* Сервер: уникальность `project.key` в пределах `workspace_id`. Все действия — фильтрация по `workspace_id`.

**Route**

* `/w/:workspaceId/projects`

**Layout**

* `L1 → L2`

---

### 7) Project board / Issues list (список / Kanban)

**Функциональность**

* Два режима: список и board (колонки — статусы).
* Фильтры: status, priority, labels, assignee, text search.
* Drag & drop задачи между статусами (обновление `status_id`).
* Bulk actions (assign, change priority, add label, move to project) — базовый набор.
* Quick create issue (в контексте выбранного проекта).

**Guards**

* Доступ: участники workspace. Для операций — проверить принадлежность проекта к workspace.

**Routes**

* Board view:
  `/w/:workspaceId/projects/:projectId/board`
* List view:
  `/w/:workspaceId/projects/:projectId/issues`

**Layout**

* `L1 → L2 → L3 (Project Layout)`

---

### 8) Issue create / edit (modal или страница)

**Функциональность**

* Поля: title, description, project_id (предзаполнено), status_id (default), priority_id, assignee_id (optional), labels (multi).
* Валидация обязательных полей.
* Attachments / comments — не входят в MVP unless requested.
* Create returns issue_id + full issue payload.

**Guards**

* Доступ: участник workspace.

**Routes**

* Create (modal):
  `/w/:workspaceId/projects/:projectId/issues/new`
* Edit:
  `/w/:workspaceId/issues/:issueId/edit`

**Layout**

* `L1 → L2`
* Modal поверх текущего layout **или**
* Standalone page (mobile / fallback)

---

### 9) Issue detail (карточка задачи)

**Функциональность**

* Полная информация о задаче: статус, приоритет, проект, assignee, метки, история изменений (кратко).
* Действия: edit, change status, change priority, assign, add/remove label, transition (если есть workflow).
* Компоненты: breadcrumbs (Workspace → Project → Issue).

**Guards**

* Доступ: участники workspace.

**Route**

* `/w/:workspaceId/issues/:issueId`

**Layout**

* `L1 → L2`

---

### 10) Labels management

**Функциональность**

* Список меток workspace (name, color? slug).
* Create / edit / archive/delete метки.
* Быстрая привязка метки к задаче из карточки.

**Guards**

* Create: member
* Delete/rename: admin

**Route**

* `/w/:workspaceId/settings/labels`

**Layout**

* `L1 → L2 → L4`

---

### 11) Statuses & Priorities management

**Функциональность**

* Список статусов с порядком (drag & drop order).
* Создание/редактирование/удаление статусов и приоритетов.
* Preview порядка на board.

**Guards**

* Create: member
* Delete/rename: admin

**Routes**

* `/w/:workspaceId/settings/statuses`
* `/w/:workspaceId/settings/priorities`

**Layout**

* `L1 → L2 → L4`

---

### 12) User profile / Account settings

**Функциональность**

* Редактирование имени, пароля, email (с подтверждением), управление сессиями, SSH/API tokens (опционально).
* Просмотр списка workspaces, быстрые ссылки.

**Guards**

* Аутентификация обязательна.

**Routes**

* `/account/profile`
* `/account/security`
* `/account/sessions`

**Layout**

* `L1 — App Root Layout`

---

### 13) Error & access pages

**Функциональность**

* 403 — доступ запрещён (с кратким объяснением и CTA: «вернуться», «запросить доступ»).
* 404 — не найдена задача/проект/workspace.
* Workspace-not-found / Not-a-member уведомления.

**Guards**

* Везде: однаково формировать ответы, не раскрывая лишней информации (security).

**Routes**

* `/workspace-not-found`
* `/not-a-member`

**Layout**

* `L5 — Error Layout`

# API Contract — Super Admin & Admin Portals

Base URL: `http://localhost:8000`

**Auth:** httpOnly session cookies. CSRF token required for mutations (`X-CSRFToken` header).

**Response format:** Either `{ success, data }` (ApiResponse wrapper) or Direct DRF response `{ count, results, ... }`.

---

## 1. Super Admin Portal (`/super-admin/*`)

### 1.1 Dashboard — `/super-admin/`

| #   | Action                                                                                                       | Method | Endpoint | Request | Response | Status         |
| --- | ------------------------------------------------------------------------------------------------------------ | ------ | -------- | ------- | -------- | -------------- |
| N/A | Static dashboard — no API calls currently. Quick stats are hardcoded (0 values). System status is hardcoded. | —      | —        | —       | —        | ✅ Mock/Static |

---

### 1.2 Academic Years — `/super-admin/academic-years`

| #   | Action                        | Method   | Endpoint                                            | Request                                                  | Response              | Status  |
| --- | ----------------------------- | -------- | --------------------------------------------------- | -------------------------------------------------------- | --------------------- | ------- |
| 1   | **List academic years**       | `GET`    | `/api/v1/academic/academic-years/`                  | —                                                        | `Array<AcademicYear>` | ✅ Live |
| 2   | **Create academic year**      | `POST`   | `/api/v1/academic/academic-years/`                  | `{ name: string, start_year: number, end_year: number }` | `AcademicYear`        | ✅ Live |
| 3   | **Activate academic year**    | `POST`   | `/api/v1/academic/academic-years/{id}/activate/`    | `{ resourceId: string }`                                 | `AcademicYear`        | ✅ Live |
| 4   | **Set current academic year** | `POST`   | `/api/v1/academic/academic-years/{id}/set_current/` | `{ resourceId: string }`                                 | `AcademicYear`        | ✅ Live |
| 5   | **Archive academic year**     | `POST`   | `/api/v1/academic/academic-years/{id}/archive/`     | `{ resourceId: string }`                                 | `AcademicYear`        | ✅ Live |
| 6   | **Delete academic year**      | `DELETE` | `/api/v1/academic/academic-years/{id}/`             | `{ resourceId: string }`                                 | `void`                | ✅ Live |

**Type: `AcademicYear`**

```typescript
interface AcademicYear {
  id: string | number
  name: string // e.g. "2024-2025"
  start_year: number
  end_year: number
  status: 'active' | 'inactive' | 'archived'
  is_current: boolean
  created_at: string
  updated_at: string
}
```

---

### 1.3 Assessment Types — `/super-admin/assessment-types`

| #   | Action                      | Method | Endpoint                             | Request | Response                | Status       |
| --- | --------------------------- | ------ | ------------------------------------ | ------- | ----------------------- | ------------ |
| 1   | **List assessment types**   | `GET`  | `/api/v1/academic/assessment-types/` | —       | `Array<AssessmentType>` | ✅ Live      |
| 2   | _Create_ (UI button exists) | —      | —                                    | —       | —                       | ❌ Not wired |
| 3   | _Edit_ (UI button exists)   | —      | —                                    | —       | —                       | ❌ Not wired |
| 4   | _Delete_ (UI button exists) | —      | —                                    | —       | —                       | ❌ Not wired |

**Type: `AssessmentType`**

```typescript
interface AssessmentType {
  id: string
  code: string
  name: string
  description?: string
}
```

---

### 1.4 Cycles — `/super-admin/cycles`

| #   | Action                      | Method | Endpoint                   | Request | Response       | Status       |
| --- | --------------------------- | ------ | -------------------------- | ------- | -------------- | ------------ |
| 1   | **List cycles**             | `GET`  | `/api/v1/academic/cycles/` | —       | `Array<Cycle>` | ✅ Live      |
| 2   | _Create_ (UI button exists) | —      | —                          | —       | —              | ❌ Not wired |
| 3   | _Edit_ (UI button exists)   | —      | —                          | —       | —              | ❌ Not wired |

**Type: `Cycle`** (from `src/server/data/academic/types.ts`)

```typescript
interface Cycle {
  id: string
  code: string
  name: string
  has_track: boolean
}
```

---

### 1.5 Levels — `/super-admin/levels`

| #   | Action                      | Method | Endpoint                   | Request | Response       | Status       |
| --- | --------------------------- | ------ | -------------------------- | ------- | -------------- | ------------ |
| 1   | **List levels**             | `GET`  | `/api/v1/academic/levels/` | —       | `Array<Level>` | ✅ Live      |
| 2   | _Create_ (UI button exists) | —      | —                          | —       | —              | ❌ Not wired |
| 3   | _Edit_ (UI button exists)   | —      | —                          | —       | —              | ❌ Not wired |

**Type: `Level`**

```typescript
interface Level {
  id: string
  cycle_id: string
  code: string
  name: string
  order: number
  track_id?: string | null
}
```

---

### 1.6 Tracks (Profils) — `/super-admin/tracks`

| #   | Action                      | Method | Endpoint                   | Request | Response       | Status       |
| --- | --------------------------- | ------ | -------------------------- | ------- | -------------- | ------------ |
| 1   | **List tracks**             | `GET`  | `/api/v1/academic/tracks/` | —       | `Array<Track>` | ✅ Live      |
| 2   | _Create_ (UI button exists) | —      | —                          | —       | —              | ❌ Not wired |
| 3   | _Edit_ (UI button exists)   | —      | —                          | —       | —              | ❌ Not wired |

**Type: `Track`**

```typescript
interface Track {
  id: string
  cycle_id: string
  code: string
  name: string
  description?: string
}
```

---

### 1.7 Subjects — `/super-admin/subjects`

| #   | Action                      | Method | Endpoint                     | Request | Response         | Status       |
| --- | --------------------------- | ------ | ---------------------------- | ------- | ---------------- | ------------ |
| 1   | **List subjects**           | `GET`  | `/api/v1/academic/subjects/` | —       | `Array<Subject>` | ✅ Live      |
| 2   | _Create_ (UI button exists) | —      | —                            | —       | —                | ❌ Not wired |
| 3   | _Edit_ (UI button exists)   | —      | —                            | —       | —                | ❌ Not wired |

**Type: `Subject`**

```typescript
interface Subject {
  id: string
  code: string
  name: string
  description?: string
  // UI also expects:
  type?: string // 'Scientifique' | 'Littéraire' | 'Général'
  cycle_ids?: string[]
  track_id?: string
}
```

---

### 1.8 Periods (Term Types) — `/super-admin/periods`

| #   | Action                                | Method | Endpoint                       | Request | Response          | Status       |
| --- | ------------------------------------- | ------ | ------------------------------ | ------- | ----------------- | ------------ |
| 1   | **List term types**                   | `GET`  | `/api/v1/academic/term-types/` | —       | `Array<TermType>` | ✅ Live      |
| 2   | **List terms**                        | `GET`  | `/api/v1/academic/terms/`      | —       | `Array<Term>`     | ✅ Live      |
| 3   | _Create term type_ (UI button exists) | —      | —                              | —       | —                 | ❌ Not wired |
| 4   | _Add period_ (UI button exists)       | —      | —                              | —       | —                 | ❌ Not wired |
| 5   | _Edit/Delete term_ (UI buttons exist) | —      | —                              | —       | —                 | ❌ Not wired |

**Types:**

```typescript
interface TermType {
  id: string
  code: string
  name: string
  period_count: number
}

interface Term {
  id: string
  term_type_id: string
  code: string
  name?: string
  order: number
}
```

---

### 1.9 Geography — `/super-admin/geography`

| #   | Action                                  | Method | Endpoint                        | Request | Response                      | Status       |
| --- | --------------------------------------- | ------ | ------------------------------- | ------- | ----------------------------- | ------------ |
| 1   | **List countries**                      | `GET`  | `/api/v1/countries/`            | —       | `Array<Country>`              | ✅ Live      |
| 2   | **List regions**                        | `GET`  | `/api/v1/regions/`              | —       | `Array<RegionAdministrative>` | ✅ Live      |
| 3   | **List admin units**                    | `GET`  | `/api/v1/administrative-units/` | —       | `Array<AdministrativeUnit>`   | ✅ Live      |
| 4   | **List localities**                     | `GET`  | `/api/v1/localities/`           | —       | `Array<Locality>`             | ✅ Live      |
| 5   | _Create/Edit/Delete_ (UI buttons exist) | —      | —                               | —       | —                             | ❌ Not wired |

**Types:**

```typescript
interface Country {
  id: string
  code: string
  name: string
  description?: string
}
interface RegionAdministrative {
  id: string
  country_id: string
  code: string
  name: string
  description?: string
}
interface AdministrativeUnit {
  id: string
  region_id: string
  parent_id?: string | null
  code: string
  name: string
  type: 'PREFECTURE' | 'COMMUNE' | 'SUBPREFECTURE'
}
interface Locality {
  id: string
  administrative_unit_id: string
  code: string
  name: string
}
```

---

### 1.10 Users — `/super-admin/users`

| #   | Action                                  | Method | Endpoint               | Request | Response           | Status       |
| --- | --------------------------------------- | ------ | ---------------------- | ------- | ------------------ | ------------ |
| 1   | **List users**                          | `GET`  | `/api/v2/admin/users/` | —       | `Array<AdminUser>` | ✅ Live      |
| 2   | _Create/Edit/Delete_ (UI buttons exist) | —      | —                      | —       | —                  | ❌ Not wired |

**Type: `AdminUser`**

```typescript
interface AdminUser {
  id: string
  email: string | null
  phone: string | null
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
  last_login: string | null
  updated_at: string
  role?: string // Derived from groups, may not be present
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface CreateAdminUserInput {
  email: string
  phone?: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
}
```

---

### 1.11 Theme Settings — `/super-admin/theme-settings`

| #   | Action              | Method | Endpoint               | Request                                    | Response     | Status  |
| --- | ------------------- | ------ | ---------------------- | ------------------------------------------ | ------------ | ------- |
| 1   | **Get theme**       | `GET`  | `/api/v2/theme/`       | —                                          | `ThemeState` | ✅ Live |
| 2   | **Set theme**       | `POST` | `/api/v2/theme/`       | `{ theme: 'light' \| 'dark' \| 'system' }` | `ThemeState` | ✅ Live |
| 3   | **Toggle theme**    | `POST` | `/api/v2/theme/toggle` | —                                          | `ThemeState` | ✅ Live |
| 4   | **Reset to system** | `POST` | `/api/v2/theme/reset`  | —                                          | `ThemeState` | ✅ Live |

**Type: `ThemeState`**

```typescript
interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
}
```

---

### 1.12 Configuration — `/super-admin/configuration`

| #   | Action                                                                  | Method | Endpoint | Request | Response | Status         |
| --- | ----------------------------------------------------------------------- | ------ | -------- | ------- | -------- | -------------- |
| N/A | Static settings form — no API calls. All fields are hardcoded defaults. | —      | —        | —       | —        | ✅ Mock/Static |

---

### 1.13 Reports — `/super-admin/reports`

| #   | Action                                                         | Method | Endpoint | Request | Response | Status         |
| --- | -------------------------------------------------------------- | ------ | -------- | ------- | -------- | -------------- |
| N/A | Static reports dashboard — all KPIs are hardcoded mock values. | —      | —        | —       | —        | ✅ Mock/Static |

---

### 1.14 Schools — `/super-admin/schools/`

| #   | Action               | Method   | Endpoint                | Request             | Response         | Status  |
| --- | -------------------- | -------- | ----------------------- | ------------------- | ---------------- | ------- |
| 1   | **List schools**     | `GET`    | `/api/v2/schools/`      | —                   | `Array<School>`  | ✅ Live |
| 2   | **Create school**    | `POST`   | `/api/v2/schools/`      | `CreateSchoolInput` | `School`         | ✅ Live |
| 3   | **Get school by ID** | `GET`    | `/api/v2/schools/{id}/` | —                   | `School \| null` | ✅ Live |
| 4   | **Update school**    | `PATCH`  | `/api/v2/schools/{id}/` | `Partial<School>`   | `School`         | ✅ Live |
| 5   | **Delete school**    | `DELETE` | `/api/v2/schools/{id}/` | —                   | `void`           | ✅ Live |

**Types:**

```typescript
interface School {
  id: string
  name: string
  code: string
  locality_id: string
  address?: string
  phone?: string
  email?: string
  website?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface CreateSchoolInput {
  name: string
  code: string
  locality_id: string
  address?: string
  phone?: string
  email?: string
  website?: string
}
```

All School entities include the standard audit fields: `created_at`, `updated_at` (both required, always returned by API), plus optional `created_by`, `updated_by`, `is_deleted`, `deleted_at`, `deleted_by`.

---

### 1.15 School Detail — `/super-admin/schools/$schoolId`

| #   | Action                | Method   | Endpoint                | Request           | Response         | Status  |
| --- | --------------------- | -------- | ----------------------- | ----------------- | ---------------- | ------- |
| 1   | **Get school detail** | `GET`    | `/api/v2/schools/{id}/` | —                 | `School \| null` | ✅ Live |
| 2   | **Update school**     | `PATCH`  | `/api/v2/schools/{id}/` | `Partial<School>` | `School`         | ✅ Live |
| 3   | **Delete school**     | `DELETE` | `/api/v2/schools/{id}/` | —                 | `void`           | ✅ Live |

**Type: `School`** (same as 1.14 above)

---

### 1.16 School Sub-resources

| #   | Action                        | Method  | Endpoint                                                     | Request                  | Response                        | Status  |
| --- | ----------------------------- | ------- | ------------------------------------------------------------ | ------------------------ | ------------------------------- | ------- |
| 1   | **List school years**         | `GET`   | `/api/v2/schools/{schoolId}/years/`                          | —                        | `Array<SchoolYear>`             | ✅ Live |
| 2   | **Get school year by ID**     | `GET`   | `/api/v2/school-years/{id}/`                                 | —                        | `SchoolYear \| null`            | ✅ Live |
| 3   | **Create school year**        | `POST`  | `/api/v2/school-years/`                                      | `Omit<SchoolYear, 'id'>` | `SchoolYear`                    | ✅ Live |
| 4   | **Update school year**        | `PATCH` | `/api/v2/school-years/{id}/`                                 | `Partial<SchoolYear>`    | `SchoolYear`                    | ✅ Live |
| 5   | **List school year cycles**   | `GET`   | `/api/v2/school-years/{schoolYearId}/cycles/`                | —                        | `Array<SchoolYearCycle>`        | ✅ Live |
| 6   | **List school year levels**   | `GET`   | `/api/v2/school-year-cycles/{schoolYearCycleId}/levels/`     | —                        | `Array<SchoolYearLevel>`        | ✅ Live |
| 7   | **List subjects for level**   | `GET`   | `/api/v2/school-year-levels/{schoolYearLevelId}/subjects/`   | —                        | `Array<SchoolYearLevelSubject>` | ✅ Live |
| 8   | **List classrooms for level** | `GET`   | `/api/v2/school-year-levels/{schoolYearLevelId}/classrooms/` | —                        | `Array<Classroom>`              | ✅ Live |
| 9   | **Create classroom**          | `POST`  | `/api/v2/school-admin/classrooms/`                           | `Omit<Classroom, 'id'>`  | `Classroom`                     | ✅ Live |

**Types:**

```typescript
interface SchoolYear {
  id: string
  school_id: string
  start_date: string
  end_date: string
  name: string
  status: 'CURRENT' | 'FUTURE' | 'ARCHIVE'
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface SchoolYearCycle {
  id: string
  school_year_id: string
  cycle_id: string
  term_type_id: string
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface SchoolYearLevel {
  id: string
  school_year_cycle_id: string
  level_id: string
  level_name?: string
  track_id?: string
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface SchoolYearLevelSubject {
  id: string
  school_year_level_id: string
  subject_id: string
  coefficient: number
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface Classroom {
  id: string
  school_year_level_id: string
  name: string
  capacity?: number
  room_number?: string
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}
```

---

## 2. Admin Portal (`/admin/*`)

### 2.1 Dashboard — `/admin/`

| #   | Action                                                                 | Method | Endpoint | Request | Response | Status         |
| --- | ---------------------------------------------------------------------- | ------ | -------- | ------- | -------- | -------------- |
| N/A | Static dashboard — no API calls. Quick stats are hardcoded (0 values). | —      | —        | —       | —        | ✅ Mock/Static |

---

### 2.2 Users — `/admin/users`

| #   | Action                                                                | Method | Endpoint | Request | Response | Status         |
| --- | --------------------------------------------------------------------- | ------ | -------- | ------- | -------- | -------------- |
| N/A | Users list — fully static mock data (5 users hardcoded). No API call. | —      | —        | —       | —        | ✅ Mock/Static |

**Type (same as Super Admin users — see 1.10 above):**

---

## Legend

| Badge          | Meaning                                    |
| -------------- | ------------------------------------------ |
| ✅ Live        | Connected to real API via `createServerFn` |
| ❌ Not wired   | UI button exists but no API integration    |
| ✅ Mock/Static | Hardcoded data, no API call made           |

---

## Backend URL Patterns

| Domain                 | Base Path                                        | Used By                                                         |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------------------- |
| Auth (V2)              | `/api/v2/auth/*`                                 | Login, Logout, Register, Session                                |
| Theme (V2)             | `/api/v2/theme/*`                                | Theme settings                                                  |
| Academic (V1)          | `/api/v1/academic/*`                             | Years, Cycles, Levels, Tracks, Subjects, Terms, AssessmentTypes |
| Geography (V1)         | `/api/v1/countries/*`, `/api/v1/regions/*`, etc. | Geography management                                            |
| School Operations (V2) | `/api/v2/schools/*`, `/api/v2/school-years/*`    | Schools, SchoolYears, Cycles, Levels, Subjects, Classrooms      |
| Admin (V2)             | `/api/v2/admin/*`                                | User management                                                 |

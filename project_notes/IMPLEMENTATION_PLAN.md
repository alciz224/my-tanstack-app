# Plan d'Implémentation - School Management System

> Analyse basée sur data-model-erd, page-specs, form-validation-patterns
> Complète PORTAL_TODO_LIST.md existant

---

## 1. ÉTAT ACTUEL DU CODEBASE

### 1.1 Pages existantes (Super Admin)

| Page                          | Status             | Commentaire                                     |
| ----------------------------- | ------------------ | ----------------------------------------------- |
| `/super-admin` (dashboard)    | 🔶 Shell statique  | Stats en dur                                    |
| `/super-admin/geography`      | 🔶 Partiel         | Tabs Regions/AdminUnits/Localities, pas Country |
| `/super-admin/cycles`         | 🔶 Partiel         | Card grid,CRUD                                  |
| `/super-admin/levels`         | 🔶 Partiel         | Table, grouped by cycle                         |
| `/super-admin/tracks`         | 🔶 Partiel         | Table, CRUD                                     |
| `/super-admin/subjects`       | 🔶 Partiel         | Table, CRUD                                     |
| `/super-admin/periods`        | 🔶 Partiel         | TermTypes + Terms                               |
| `/super-admin/academic-years` | 🔶 Presque complet | Set current, archive, computed fields           |
| `/super-admin/schools`        | 🔶 Partiel         | List + detail                                   |
| `/super-admin/users`          | 🔶 Partiel         | CRUD                                            |
| `/super-admin/reports`        | 🔶 Shell           |
| `/super-admin/configuration`  | 🔶 Partiel         |
| `/super-admin/theme-settings` | 🔶 Partiel         |

### 1.2 Pages existantes (School Admin)

| Page                                     | Status             | Commentaire     |
| ---------------------------------------- | ------------------ | --------------- |
| `/school-admin` (dashboard)              | 🔶 Shell statique  |
| `/school-admin/years`                    | ⬜ Non implémenté  | **CRITIQUE**    |
| `/school-admin/years/create`             | ⬜ Wizard 7 étapes |
| `/school-admin/years/:yearId`            | ⬜ Tabs detail     |
| `/school-admin/teachers`                 | ✅                 | List + status   |
| `/school-admin/teachers/:id/assignments` | ✅                 | Table           |
| `/school-admin/teachers/:id/workload`    | ✅                 | Calendar        |
| `/school-admin/students`                 | ✅                 | List + filters  |
| `/school-admin/students/pre-register`    | ✅                 | Form            |
| `/school-admin/students/assign`          | ✅                 | Dual-panel      |
| `/school-admin/students/:id`             | ✅                 | Profile         |
| `/school-admin/classrooms`               | ✅                 | Cards           |
| `/school-admin/schedule`                 | ✅                 | Timetable       |
| `/school-admin/schedule/time-slots`      | ✅                 | Table per cycle |
| `/school-admin/assessments`              | ✅                 | Dashboard       |
| `/school-admin/assessments/:id/subjects` | ✅                 | CRUD            |
| `/school-admin/assessments/:id/validate` | ✅                 | Review          |
| `/school-admin/reports/report-cards`     | ✅                 | Generation      |
| `/school-admin/reports/report-cards/:id` | ✅                 | View            |
| `/school-admin/reports/transcripts/:id`  | ✅                 | View            |
| `/school-admin/reports/statistics`       | ✅                 | Dashboard       |

### 1.3 Data Adapters existants

```
✅ geography/ (types, mocks, local, api, factory)
✅ academic/ (types, mocks, local, api, factory)
✅ schools/ (types, mocks, local, api, factory)
✅ users/ (types, mocks, local, api, factory)
✅ students/ (types, mocks, local, api, factory)
✅ teachers/ (types, mocks, local, api, factory)
✅ assessments/ (types, mocks, local, api, factory)
✅ schedules/ (types, mocks, local, api, factory)
✅ reports/ (types, mocks, local, api, factory)
✅ finance/ (types, mocks, local, api, factory)
✅ parents/ (types, mocks, local, api, factory)
✅ auth/ (types, mocks, local, api, factory)
✅ theme/ (types, local, api, factory, base)
```

---

## 2. DONNÉES MANQUANTES / TYPES À COMPLÉTER

### 2.1 Geography - Types vs Data Model

```typescript
// géographique/types.ts - MANQUANT
// ❌ Pas de Country dans l'adapter (only in forms)
```

### 2.2 Academic - Types vs Data Model

```typescript
// academic/types.ts - INCOMPATIBLE
// CRITICAL: Le model a 29 entités avec champs spécifiques
// Les types actuels sont simplifiés/divergents

// Cycle model attendu:
interface Cycle {
  id: string
  code: string // UNIQUE (MAT, PRI, COL, LYC)
  name: string // UNIQUE
  has_track: boolean // Only Lycée = true
}

// Cycle type actuel:
interface Cycle {
  id: string
  name: string
  duration: string // ❌ Pas dans model
  status: 'Active' | 'Inactive' // ❌ Pas dans model
}
```

### 2.3 À créer (adapters manquants)

| Domain            | Fichiers à créer                                                           |
| ----------------- | -------------------------------------------------------------------------- |
| SchoolYear        | `types.ts`, `mocks.ts`, `local.adapter.ts`, `api.adapter.ts`, `factory.ts` |
| SchoolYearCycle   | (sous-domain de school-year?)                                              |
| SchoolYearLevel   | (sous-domain de school-year?)                                              |
| Classroom         | (sous-domain de school-year?)                                              |
| SchoolYearTeacher | (sous-domain de teachers?) - vérifier si déjà complet                      |
| StudentAssessment | `types.ts`, `local.adapter.ts`, `api.adapter.ts`, `factory.ts`             |

---

## 3. RÈGLES MÉTIER - IMPLEMENTATION OBLIGATOIRE

### 3.1 Contraintes d'unicité (au niveau API/server)

| Entité                 | Contrainte                                                                   | Message erreur                         |
| ---------------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| Country                | (code) UNIQUE                                                                | "Code pays déjà utilisé"               |
| Country                | (name) UNIQUE                                                                | "Nom pays déjà utilisé"                |
| RegionAdministrative   | (country_id, code) UNIQUE                                                    | "Code région existe déjà dans ce pays" |
| RegionAdministrative   | (country_id, name) UNIQUE                                                    |                                        |
| AdministrativeUnit     | (region_id, code) UNIQUE                                                     |                                        |
| AdministrativeUnit     | (region_id, name) UNIQUE                                                     |                                        |
| Locality               | (administrative_unit_id, code) UNIQUE                                        |                                        |
| Locality               | (administrative_unit_id, name) UNIQUE                                        |                                        |
| Cycle                  | (code) UNIQUE                                                                |                                        |
| Cycle                  | (name) UNIQUE                                                                |                                        |
| Track                  | (cycle_id, code) UNIQUE                                                      |                                        |
| Track                  | (cycle_id, name) UNIQUE                                                      |                                        |
| Level                  | (cycle_id, code) UNIQUE                                                      |                                        |
| Level                  | (cycle_id, name) UNIQUE                                                      |                                        |
| Subject                | (code) UNIQUE                                                                |                                        |
| Subject                | (name) UNIQUE                                                                |                                        |
| AcademicYear           | (code) UNIQUE                                                                |                                        |
| School                 | (code) UNIQUE                                                                |                                        |
| School                 | (name) UNIQUE                                                                |                                        |
| SchoolYear             | (school_id, name) UNIQUE                                                     |                                        |
| SchoolYearCycle        | (school_year_id, cycle_id) UNIQUE                                            |                                        |
| SchoolYearLevel        | (school_year_cycle_id, level_id, track_id) UNIQUE                            |                                        |
| SchoolYearLevelSubject | (school_year_level_id, subject_id) UNIQUE                                    |                                        |
| Classroom              | (school_year_level_id, name) UNIQUE                                          |                                        |
| SchoolYearTeacher      | (school_year_id, teacher_id) UNIQUE                                          |                                        |
| TeacherAssignment      | (classroom_id, school_year_level_subject_id) UNIQUE (1 ACTIVE)               |                                        |
| StudentEnrollment      | (student_id, school_year_level_id) UNIQUE                                    |                                        |
| Assessment             | (school_year_cycle_id, assessment_type_id, school_year_cycle_term_id) UNIQUE |                                        |
| AssessmentSubject      | (assessment_id, classroom_id, school_year_level_subject_id) UNIQUE           |                                        |
| StudentAssessment      | (assessment_subject_id, student_enrollment_id) UNIQUE                        |                                        |
| ReportCard             | (student_enrollment_id, school_year_cycle_term_id) UNIQUE                    |                                        |
| Transcript             | (student_enrollment_id, school_year_id, cycle_id, level_id) UNIQUE           |                                        |

### 3.2 États/Statuts - Lifecycle

```typescript
// AcademicYear
type AcademicYearStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
// Règle: is_current = true → tous les autres = false (atomic)
// Règle: ARCHIVED → read-only

// SchoolYear
type SchoolYearStatus = 'CURRENT' | 'FUTURE' | 'ARCHIVE'
// Règle: Un seul CURRENT par school

// SchoolYearTeacher
type TeacherStatus = 'ACTIVE' | 'SUSPENDED' | 'LEFT'
// Règle: SUSPENDED/LEFT → pas de nouvelle assignment

// TeacherAssignment
type AssignmentStatus = 'ACTIVE' | 'REPLACED' | 'ENDED'
// Règle: Status irréversible

// StudentEnrollment
type EnrollmentStatus = 'PRE_REGISTERED' | 'ACTIVE' | 'COMPLETED' | 'DROPPED'
// Règle: Iréversible

// Assessment
type AssessmentStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
// Règle: DRAFT → ACTIVE → CLOSED → ARCHIVED (pas de retour)

// AssessmentSubject
type AssessmentSubjectStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED'

// StudentAssessment
type StudentAssessmentStatus = 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'CANCELLED'

// ReportCard / Transcript
type DocumentStatus = 'DRAFT' | 'FINAL' | 'LOCKED'
// Règle: LOCKED → immuable (correction = cancel + regenerate)
```

### 3.3 Logique Conditionnelle (Forms)

```typescript
// AdministrativeUnit
IF type === 'SUBPREFECTURE':
  parent_id → REQUIRED, dropdown filter: region_id + type=PREFECTURE
ELSE:
  parent_id → NULL, hidden

// Level
IF cycle.has_track === true:
  track_id → REQUIRED, dropdown filter: cycle_id
ELSE:
  track_id → NULL, hidden

// Track
IF cycle_id selected:
  IF cycle.has_track !== true:
    Error: "Ce cycle n'a pas de filières"

// SchoolYearLevelSubject
IF cycle.has_track:
  track_id obligatoire au niveau
ELSE:
  track_id optionnel

// StudentAssessment
IF is_absent === true:
  raw_score → NULL, disabled
  is_excused → visible
  status → ne peut pas être VALIDATED
ELSE:
  raw_score → required, 0 ≤ value ≤ max_score
  is_excused → false, hidden
```

### 3.4 Validation de Suppression (Deletion Blocks)

| Entité               | Bloqué si                                      | Message                                         |
| -------------------- | ---------------------------------------------- | ----------------------------------------------- |
| Country              | Regions existent                               | "Impossible de supprimer: des régions existent" |
| RegionAdministrative | AdminUnits existent                            |                                                 |
| AdministrativeUnit   | Localities OR Schools existent                 |                                                 |
| Locality             | Schools existent                               |                                                 |
| Cycle                | Levels OR SchoolYearCycles exist               |                                                 |
| Track                | Levels use it                                  |                                                 |
| Level                | SchoolYearLevels exist                         |                                                 |
| Subject              | SchoolYearLevelSubjects exist                  |                                                 |
| School               | SchoolYears OR Users exist                     |                                                 |
| SchoolYear           | SchoolYearCycles/Levels/Enrollments exist      |                                                 |
| Classroom            | StudentEnrollments OR TeacherAssignments exist |                                                 |
| SchoolYearTeacher    | TeacherAssignments ACTIVE exist                |                                                 |
| Assessment           | AssessmentSubjects exist                       |                                                 |
| AssessmentSubject    | StudentAssessments exist                       |                                                 |
| StudentEnrollment    | StudentAssessments OR ReportCards exist        |                                                 |

---

## 4. ORDRE D'IMPLÉMENTATION RECOMMANDÉ

### PHASE A: Foundation (2-3 jours)

```
A.1 Term Types + Terms (CRUD)
     → Route: /super-admin/term-types (actuellement dans periods)
     → Dependencies: form-validation-patterns#Form9, Form10

A.2 Assessment Types (CRUD)
     → Route: /super-admin/assessment-types (actuellement dans configuration)
     → Dependencies: form-validation-patterns#Form11

A.3 Countries Management
     → Route: /super-admin/geography (nouveau tab)
     → Dependencies: form-validation-patterns#Form1

A.4 Geography CRUD completion
     → Countries, Regions, AdminUnits, Localities
     → Cascading selects
     → Deletion blocks
```

### PHASE B: Data Layer (3-4 jours)

```
B.1 Corriger types academic (Cycle, Level, Track, Subject)
B.2 Créer adapter SchoolYear + children
     → SchoolYear, SchoolYearCycle, SchoolYearLevel
     → SchoolYearLevelSubject, Classroom
     → SchoolYearCycleTimeSlot
B.3 Créer adapter StudentAssessment
```

### PHASE C: School Year Setup (5-7 jours) - CRITIQUE

```
C.1 School Year list (/school-admin/years)
     → Filter: CURRENT / FUTURE / ARCHIVE
     → Actions: Add, Edit, Set Current, Archive

C.2 School Year Wizard (/school-admin/years/create)
     → Step 1: Basic info (name, dates, status)
     → Step 2: Cycles + Term Types
     → Step 3: Levels (+ Tracks)
     → Step 4: Subjects + Coefficients
     → Step 5: Classrooms
     → Step 6: Time Slots
     → Step 7: Review & Activate

C.3 School Year Detail (/school-admin/years/:yearId)
     → Tabs: Overview, Cycles, Levels, Subjects, Classrooms, TimeSlots, Teachers
```

### PHASE D: Enseignants (1-2 jours)

```
D.1 Wire à adapter SchoolYearTeacher
D.2 Improve CRUD + status transitions
```

### PHASE E: Élèves (2-3 jours)

```
E.1 Wire StudentEnrollment adapter
E.2 Improve pre-registration (homonym detection)
E.3 Improve transfer flow
```

### PHASE F: Emplois du temps (1-2 jours)

```
F.1 Wire Schedule adapter
F.2 Conflict detection display
```

### PHASE G: Évaluations (2-3 jours)

```
G.1 Wire StudentAssessment adapter
G.2 Grade entry sheet (Teacher)
G.3 Validation flow (School Admin)
```

### PHASE H: Rapports (3-4 jours)

```
H.1 Report Card generation logic
H.2 Transcript generation
H.3 Statistics dashboard
```

### PHASE I: Portails Secondaires (5-7 jours)

```
I.1 Teacher Portal - My Classes, Grade Entry, Schedule
I.2 Student Portal - Grades, Report Cards, Schedule
I.3 Parent Portal - Child selector, vues children
```

---

## 5. COMPOSANTS UI RÉUTILISABLES

| Composant            | Status | Description                             |
| -------------------- | ------ | --------------------------------------- |
| `StatusBadge`        | ⬜     | Universal pour tous les status enums    |
| `CascadingSelect`    | ⬜     | Country → Region → AdminUnit → Locality |
| `DataTable`          | 🔶     | Partiel, besoin improvement             |
| `ConfirmationModal`  | ⬜     | Pour status changes, deletes            |
| `DeletionWarning`    | ⬜     | Blocked delete explanation              |
| `StepperWizard`      | ⬜     | Pour School Year setup                  |
| `GradeSheet`         | ⬜     | Spreadsheet-like grade entry            |
| `WeeklyCalendar`     | ⬜     | Timetable grid                          |
| `ReportCardDocument` | 🔶     | Print-ready, partial                    |

---

## 6. NOTES TECHNIQUES

### 6.1 Pattern Adapter (déjà utilisé)

```
src/server/data/{domain}/
├── types.ts          # Interfaces (import from here!)
├── mocks.ts          # Mock data
├── local.adapter.ts  # Local dev
├── api.adapter.ts    # Production
└── factory.ts        # Returns correct adapter based on env
```

### 6.2 Server Functions (déjà utilisé)

- Utiliser `createServerFn` pour fetch ET mutations
- Forward cookies via `serverFetch` pour SSR auth
- Ne pas utiliser `fetch` directement

### 6.3 Import paths

- Toujours utiliser `@/` pour `src/`
- Importer types depuis `types.ts`, PAS `mocks.ts`

### 6.4 TypeScript best practices

- `useState<Type>()` pour les types explicites
- Run `npx tsc --noEmit` avant commit

---

## 7. PROBLÈMES CONNUS / RISKS

1. **Academic types incompatible** - Must refactor avant implementation
2. **SchoolYear adapter manquant** - Bloque School Year Setup Wizard
3. **StudentAssessment adapter manquant** - Bloque Grade Entry
4. **Country pas dans geography adapter** - Geography incomplete

---

## 8. CHECKLIST PAR MODULE

### Super Admin - Geography

- [ ] Countries list + CRUD
- [ ] Regions list + CRUD (filter par country)
- [ ] Admin Units list + CRUD (conditional parent)
- [ ] Localities list + CRUD (cascading)
- [ ] Deletion blocks pour chaque entité

### Super Admin - Academic

- [ ] Cycles (has_track toggle)
- [ ] Tracks (filter: has_track=true)
- [ ] Levels (conditional track)
- [ ] Subjects
- [ ] TermTypes + Terms (expandable)
- [ ] Assessment Types
- [ ] Academic Years (computed fields, is_current, archive)

### School Admin - Setup

- [ ] School Year list
- [ ] Wizard 7 étapes
- [ ] Detail page tabs

### School Admin - People

- [ ] Teachers + Assignments
- [ ] Students + Pre-reg + Assignment + Transfer

### Reports

- [ ] Report Card generation
- [ ] Transcript
- [ ] Statistics

---

_Document généré depuis l'analyse du code + data-model-erd + page-specs + form-validation-patterns_
_Dernière mise à jour: Mai 2026_

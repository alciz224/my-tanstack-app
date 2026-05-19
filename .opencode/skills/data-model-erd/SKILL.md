---
name: data-model-erd
description: Complete data model reference for the School Management System. Contains all 29 entities organized into 5 domain layers (Geography, Academic Structure, School Operations, Pedagogy, Reporting), their fields, types, constraints, business rules, and inter-table relationships. Use whenever building pages, forms, API integrations, or understanding the business domain. This is the single source of truth for entity structure.
---

# Data Model & Entity Relationship Reference

> Distilled from `docs/tables/`. This is the canonical data model for the School Management System, covering 29 entities across 5 domain layers.

---

## Architecture Overview

The system uses a **MASTER → CONTEXT** pattern:

- **MASTER tables** are global reference data (shared across schools/years).
- **CONTEXT tables** bind MASTER data to a specific school + year.
- **OPERATIONAL tables** represent transactional/year-scoped events.

All tables share common audit fields: `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`, `deleted_by` (soft delete pattern).

---

## Layer 1: Geography (MASTER — Global Reference)

These tables are stable, rarely edited, and shared across all schools.

### Country

| Field       | Type   | Required | Notes                        |
| ----------- | ------ | -------- | ---------------------------- |
| id          | PK     | ✅       |                              |
| code        | string | ✅       | ISO code (e.g. `GN`), UNIQUE |
| name        | string | ✅       | UNIQUE                       |
| description | text   | ❌       |                              |

- **Used by**: RegionAdministrative
- **Constraints**: Cannot delete if regions exist
- **UI Hint**: Read-only dropdown in most contexts

### RegionAdministrative

| Field       | Type         | Required | Notes                     |
| ----------- | ------------ | -------- | ------------------------- |
| id          | PK           | ✅       |                           |
| country_id  | FK → Country | ✅       |                           |
| code        | string       | ✅       | (country_id, code) UNIQUE |
| name        | string       | ✅       | (country_id, name) UNIQUE |
| description | text         | ❌       |                           |

- **Used by**: AdministrativeUnit
- **Guinea reality**: 8 regions + Conakry (Boké, Conakry, Faranah, Kankan, Kindia, Labé, Mamou, Nzérékoré)

### AdministrativeUnit

| Field     | Type                      | Required | Notes                                      |
| --------- | ------------------------- | -------- | ------------------------------------------ |
| id        | PK                        | ✅       |                                            |
| region_id | FK → RegionAdministrative | ✅       |                                            |
| parent_id | FK → AdministrativeUnit   | ❌       | Self-referencing hierarchy                 |
| code      | string                    | ✅       | (region_id, code) UNIQUE                   |
| name      | string                    | ✅       | (region_id, name) UNIQUE                   |
| type      | enum                      | ✅       | `PREFECTURE` / `COMMUNE` / `SUBPREFECTURE` |

- **Hierarchy rules**:
  - `PREFECTURE` → parent_id = NULL
  - `COMMUNE` → parent_id = NULL
  - `SUBPREFECTURE` → parent_id REQUIRED, must be a PREFECTURE
- **Used by**: Locality, School

### Locality

| Field                  | Type                    | Required | Notes                                 |
| ---------------------- | ----------------------- | -------- | ------------------------------------- |
| id                     | PK                      | ✅       |                                       |
| administrative_unit_id | FK → AdministrativeUnit | ✅       |                                       |
| code                   | string                  | ✅       | (administrative_unit_id, code) UNIQUE |
| name                   | string                  | ✅       | (administrative_unit_id, name) UNIQUE |

- **Used by**: School, Student, Teacher
- **UI Hint**: Cascading selects: Country → Region → AdministrativeUnit → Locality

---

## Layer 2: Academic Structure (MASTER — Global Reference)

### Cycle

| Field     | Type    | Required | Notes                                         |
| --------- | ------- | -------- | --------------------------------------------- |
| id        | PK      | ✅       |                                               |
| code      | string  | ✅       | UNIQUE (e.g. `MAT`, `PRI`, `COL`, `LYC`)      |
| name      | string  | ✅       | UNIQUE (Maternelle, Primaire, Collège, Lycée) |
| has_track | boolean | ✅       | Only Lycée = true                             |

- **Used by**: Level, SchoolYearCycle, Track
- **Guinea reality**: Primaire (6yr), Collège (4yr), Lycée (3yr)

### Track

| Field    | Type       | Required | Notes                        |
| -------- | ---------- | -------- | ---------------------------- |
| id       | PK         | ✅       |                              |
| code     | string     | ✅       | (cycle_id, code) UNIQUE      |
| name     | string     | ✅       | (cycle_id, name) UNIQUE      |
| cycle_id | FK → Cycle | ✅       | Must have `has_track = true` |

- **Guinea reality**: SM (Sciences Maths), SE (Sciences Expérimentales), SS (Sciences Sociales)
- **Constraint**: Track only exists for Lycée cycle

### Level

| Field    | Type       | Required | Notes                                |
| -------- | ---------- | -------- | ------------------------------------ |
| id       | PK         | ✅       |                                      |
| code     | string     | ✅       | (cycle_id, code) UNIQUE              |
| name     | string     | ✅       | (cycle_id, name) UNIQUE              |
| cycle_id | FK → Cycle | ✅       |                                      |
| track_id | FK → Track | ❌       | Required if `cycle.has_track = true` |
| order    | int        | ✅       | Position in cycle (1..n)             |

- **Guinea reality**: 1ère→6ème Année (Primaire), 7ème→10ème (Collège), 11ème/12ème/Terminale (Lycée)
- **Used by**: SchoolYearLevel

### Subject

| Field       | Type   | Required | Notes                                |
| ----------- | ------ | -------- | ------------------------------------ |
| id          | PK     | ✅       |                                      |
| code        | string | ✅       | UNIQUE (e.g. `MATH`, `FRAN`, `PHYS`) |
| name        | string | ✅       | UNIQUE                               |
| description | text   | ❌       |                                      |

- **Guinea reality**: Mathématiques, Français, Physique, Chimie, Biologie, Histoire, Géographie, Anglais, Philosophie, EPS, ECM

### TermType

| Field        | Type   | Required | Notes                                              |
| ------------ | ------ | -------- | -------------------------------------------------- |
| id           | PK     | ✅       |                                                    |
| code         | string | ✅       | UNIQUE (e.g. `TRIMESTER`, `SEMESTER`)              |
| name         | string | ✅       | UNIQUE                                             |
| period_count | int    | ✅       | Must be > 0 (e.g. 3 for trimester, 2 for semester) |

- **Immutable once used**

### Term

| Field        | Type          | Required | Notes                                                  |
| ------------ | ------------- | -------- | ------------------------------------------------------ |
| id           | PK            | ✅       |                                                        |
| term_type_id | FK → TermType | ✅       |                                                        |
| code         | string        | ✅       | (term_type_id, code) UNIQUE                            |
| name         | string        | ❌       |                                                        |
| order        | int           | ✅       | (term_type_id, order) UNIQUE, 1 ≤ order ≤ period_count |

### AssessmentType

| Field       | Type   | Required | Notes                                  |
| ----------- | ------ | -------- | -------------------------------------- |
| id          | PK     | ✅       |                                        |
| code        | string | ✅       | UNIQUE (e.g. `COMPO`, `COURS`, `PART`) |
| name        | string | ✅       | UNIQUE                                 |
| description | text   | ❌       |                                        |

### AcademicYear

| Field      | Type    | Required | Notes                                |
| ---------- | ------- | -------- | ------------------------------------ |
| id         | PK      | ✅       |                                      |
| code       | string  | ✅       | UNIQUE (e.g. `2024-2025`)            |
| start_year | int     | ✅       |                                      |
| end_year   | int     | ✅       | Must be `start_year + 1`             |
| is_current | boolean | ✅       | **Only one** can be `true` at a time |
| status     | enum    | ✅       | `DRAFT` / `ACTIVE` / `ARCHIVED`      |

- **Critical rules**:
  - Setting `is_current = true` forces ALL others to `false`
  - `ARCHIVED` → cannot modify, cannot set as current
  - No physical delete allowed

---

## Layer 3: School Operations (CONTEXT — School + Year Scoped)

### School

| Field       | Type          | Required | Notes  |
| ----------- | ------------- | -------- | ------ |
| id          | PK            | ✅       |        |
| name        | string        | ✅       | UNIQUE |
| code        | string        | ✅       | UNIQUE |
| locality_id | FK → Locality | ✅       |        |
| address     | string        | ❌       |        |
| phone       | string        | ❌       |        |
| email       | string        | ❌       |        |
| website     | string        | ❌       |        |

- **Central entity** — everything revolves around a School

### SchoolYear

| Field      | Type        | Required | Notes                            |
| ---------- | ----------- | -------- | -------------------------------- |
| id         | PK          | ✅       |                                  |
| school_id  | FK → School | ✅       |                                  |
| start_date | date        | ✅       |                                  |
| end_date   | date        | ✅       | start_date < end_date            |
| name       | string      | ✅       | (school_id, name) UNIQUE         |
| status     | enum        | ✅       | `CURRENT` / `FUTURE` / `ARCHIVE` |

- **Only ONE** `CURRENT` per school
- **Container for**: SchoolYearCycle, SchoolYearLevel, Classroom, enrollments

### SchoolYearCycle

| Field          | Type            | Required | Notes                                        |
| -------------- | --------------- | -------- | -------------------------------------------- |
| id             | PK              | ✅       |                                              |
| school_year_id | FK → SchoolYear | ✅       |                                              |
| cycle_id       | FK → Cycle      | ✅       | (school_year_id, cycle_id) UNIQUE            |
| term_type_id   | FK → TermType   | ✅       | Defines trimester vs semester for this cycle |

### SchoolYearLevel

| Field                | Type                 | Required | Notes                              |
| -------------------- | -------------------- | -------- | ---------------------------------- |
| id                   | PK                   | ✅       |                                    |
| school_year_cycle_id | FK → SchoolYearCycle | ✅       |                                    |
| level_id             | FK → Level           | ✅       |                                    |
| track_id             | FK → Track           | ❌       | Required if cycle.has_track = true |

- **(school_year_cycle_id, level_id, track_id) UNIQUE**

### SchoolYearLevelSubject

| Field                | Type                 | Required | Notes       |
| -------------------- | -------------------- | -------- | ----------- |
| id                   | PK                   | ✅       |             |
| school_year_level_id | FK → SchoolYearLevel | ✅       |             |
| subject_id           | FK → Subject         | ✅       |             |
| coefficient          | decimal              | ✅       | Must be > 0 |

- **(school_year_level_id, subject_id) UNIQUE**
- Used for grade calculations and report cards

### Classroom

| Field                | Type                 | Required | Notes                               |
| -------------------- | -------------------- | -------- | ----------------------------------- |
| id                   | PK                   | ✅       |                                     |
| school_year_level_id | FK → SchoolYearLevel | ✅       |                                     |
| name                 | string               | ✅       | (school_year_level_id, name) UNIQUE |
| capacity             | int                  | ❌       | Must be ≥ 0                         |
| room_number          | string               | ❌       |                                     |

### SchoolYearTeacher

| Field          | Type            | Required | Notes                               |
| -------------- | --------------- | -------- | ----------------------------------- |
| id             | PK              | ✅       |                                     |
| school_year_id | FK → SchoolYear | ✅       |                                     |
| teacher_id     | FK → CustomUser | ✅       | (school_year_id, teacher_id) UNIQUE |
| status         | enum            | ✅       | `ACTIVE` / `SUSPENDED` / `LEFT`     |
| hire_date      | date            | ❌       |                                     |
| end_date       | date            | ❌       |                                     |

- **Prerequisite** for TeacherAssignment
- `SUSPENDED` / `LEFT` → no new assignments

### SchoolYearCycleTimeSlot

| Field                | Type                 | Required | Notes                                |
| -------------------- | -------------------- | -------- | ------------------------------------ |
| id                   | PK                   | ✅       |                                      |
| school_year_cycle_id | FK → SchoolYearCycle | ✅       |                                      |
| name                 | string               | ✅       | (school_year_cycle_id, name) UNIQUE  |
| order                | int                  | ✅       | (school_year_cycle_id, order) UNIQUE |
| start_time           | time                 | ✅       | start_time < end_time                |
| end_time             | time                 | ✅       |                                      |
| duration_minutes     | int                  | ✅       |                                      |
| status               | enum                 | ✅       | `ACTIVE` / `INACTIVE`                |

- No overlap within same cycle
- Immutable after use (create new one instead)

---

## Layer 4: Pedagogy (OPERATIONAL — Transactional)

### TeacherAssignment

| Field                        | Type                        | Required | Notes                           |
| ---------------------------- | --------------------------- | -------- | ------------------------------- |
| id                           | PK                          | ✅       |                                 |
| school_year_teacher_id       | FK → SchoolYearTeacher      | ✅       |                                 |
| classroom_id                 | FK → Classroom              | ✅       |                                 |
| school_year_level_subject_id | FK → SchoolYearLevelSubject | ✅       |                                 |
| assignment_status            | enum                        | ✅       | `ACTIVE` / `REPLACED` / `ENDED` |
| start_date                   | date                        | ✅       |                                 |
| end_date                     | date                        | ❌       |                                 |
| replaced_by_id               | FK → TeacherAssignment      | ❌       |                                 |

- **Only ONE** `ACTIVE` per (classroom_id, school_year_level_subject_id)
- Replacement creates NEW row, old → `REPLACED` with `end_date`
- `REPLACED`/`ENDED` → **irreversible**

### StudentEnrollment

| Field                                 | Type                 | Required | Notes                                                 |
| ------------------------------------- | -------------------- | -------- | ----------------------------------------------------- |
| id                                    | PK                   | ✅       |                                                       |
| student_id                            | FK → CustomUser      | ✅       |                                                       |
| first_name                            | string               | ✅       |                                                       |
| last_name                             | string               | ✅       |                                                       |
| school_year_level_id                  | FK → SchoolYearLevel | ✅       |                                                       |
| classroom_id                          | FK → Classroom       | ❌       | NULL = pre-registration                               |
| previous_classroom_id                 | FK → Classroom       | ❌       | Set on transfer                                       |
| enrollment_status                     | enum                 | ✅       | `PRE_REGISTERED` / `ACTIVE` / `COMPLETED` / `DROPPED` |
| enrollment_date                       | date                 | ✅       |                                                       |
| start_date                            | date                 | ❌       | ≥ enrollment_date                                     |
| end_date                              | date                 | ❌       | ≥ start_date                                          |
| transfer_reason                       | string               | ❌       |                                                       |
| annual_identifier                     | string               | ✅       | UNIQUE per school year                                |
| pre_enroll_level_same_name_identifier | string               | ❌       | Handles homonyms                                      |
| classroom_identifier                  | string               | ❌       |                                                       |
| classroom_same_name_identifier        | string               | ❌       | Handles homonyms in class                             |

- **(student_id, school_year_level_id) UNIQUE**
- Transfer = update classroom_id + set previous_classroom_id, other students unchanged

### Schedule

| Field                 | Type                         | Required | Notes                                         |
| --------------------- | ---------------------------- | -------- | --------------------------------------------- |
| id                    | PK                           | ✅       |                                               |
| school_year_id        | FK → SchoolYear              | ✅       |                                               |
| school_year_cycle_id  | FK → SchoolYearCycle         | ✅       |                                               |
| classroom_id          | FK → Classroom               | ✅       |                                               |
| teacher_assignment_id | FK → TeacherAssignment       | ✅       | Must be ACTIVE                                |
| day_of_week           | enum                         | ✅       | MON–SUN                                       |
| time_slot_id          | FK → SchoolYearCycleTimeSlot | ✅       |                                               |
| start_time            | time                         | ✅       |                                               |
| end_time              | time                         | ✅       |                                               |
| effective_from        | date                         | ✅       |                                               |
| effective_to          | date                         | ❌       |                                               |
| status                | enum                         | ✅       | `DRAFT` / `ACTIVE` / `SUSPENDED` / `ARCHIVED` |

- **No overlap**: same class, same teacher, same slot

### Assessment

| Field                     | Type                     | Required | Notes                                      |
| ------------------------- | ------------------------ | -------- | ------------------------------------------ |
| id                        | PK                       | ✅       |                                            |
| school_year_id            | FK → SchoolYear          | ✅       |                                            |
| school_year_cycle_id      | FK → SchoolYearCycle     | ✅       |                                            |
| school_year_cycle_term_id | FK → SchoolYearCycleTerm | ✅       |                                            |
| assessment_type_id        | FK → AssessmentType      | ✅       |                                            |
| name                      | string                   | ✅       |                                            |
| start_date                | date                     | ✅       | ≤ end_date                                 |
| end_date                  | date                     | ✅       |                                            |
| status                    | enum                     | ✅       | `DRAFT` → `ACTIVE` → `CLOSED` → `ARCHIVED` |

- **(school_year_cycle_id, assessment_type_id, school_year_cycle_term_id) UNIQUE**
- Only `ACTIVE` allows creating assessment subjects
- `CLOSED` → no new grades

### AssessmentSubject

| Field                        | Type                        | Required | Notes                                              |
| ---------------------------- | --------------------------- | -------- | -------------------------------------------------- |
| id                           | PK                          | ✅       |                                                    |
| assessment_id                | FK → Assessment             | ✅       |                                                    |
| school_year_level_subject_id | FK → SchoolYearLevelSubject | ✅       |                                                    |
| classroom_id                 | FK → Classroom              | ✅       | Must match level                                   |
| teacher_assignment_id        | FK → TeacherAssignment      | ✅       | Must be ACTIVE + match subject+class               |
| name                         | string                      | ✅       |                                                    |
| exam_date                    | date                        | ✅       |                                                    |
| max_score                    | decimal                     | ✅       | (e.g. 20)                                          |
| coefficient                  | decimal                     | ✅       | Inherited from SchoolYearLevelSubject, overridable |
| status                       | enum                        | ✅       | `DRAFT` → `PUBLISHED` → `CLOSED` → `ARCHIVED`      |

- **(assessment_id, classroom_id, school_year_level_subject_id) UNIQUE**

### StudentAssessment

| Field                 | Type                   | Required | Notes                                             |
| --------------------- | ---------------------- | -------- | ------------------------------------------------- |
| id                    | PK                     | ✅       |                                                   |
| assessment_subject_id | FK → AssessmentSubject | ✅       |                                                   |
| student_enrollment_id | FK → StudentEnrollment | ✅       | Must be ACTIVE + in same class                    |
| raw_score             | decimal                | ❌       | 0 ≤ raw_score ≤ max_score                         |
| normalized_score      | decimal                | ❌       | For cross-subject comparison                      |
| status                | enum                   | ✅       | `DRAFT` → `SUBMITTED` → `VALIDATED` → `CANCELLED` |
| is_absent             | boolean                | ✅       | If true → raw_score NULL, not VALIDATED           |
| is_excused            | boolean                | ✅       | If absent+excused → makeup possible               |
| remark                | text                   | ❌       |                                                   |

- **(assessment_subject_id, student_enrollment_id) UNIQUE**
- **Most sensitive table** — feeds report cards and rankings

---

## Layer 5: Reporting (COMPUTED — Read-heavy)

### ReportCard (Bulletin)

| Field                     | Type                     | Required | Notes                                               |
| ------------------------- | ------------------------ | -------- | --------------------------------------------------- |
| id                        | PK                       | ✅       |                                                     |
| student_enrollment_id     | FK → StudentEnrollment   | ✅       |                                                     |
| school_year_cycle_term_id | FK → SchoolYearCycleTerm | ✅       |                                                     |
| school_year_id            | FK → SchoolYear          | ✅       |                                                     |
| average_score             | decimal                  | ✅       | Weighted average of normalized scores               |
| rank                      | int                      | ❌       | Within classroom                                    |
| decision                  | enum                     | ✅       | `PASS` / `FAIL` / `REPEAT` / `TRANSFER` / `PENDING` |
| status                    | enum                     | ✅       | `DRAFT` → `FINAL` → `LOCKED`                        |
| generated_at              | datetime                 | ✅       |                                                     |
| locked_at                 | datetime                 | ❌       |                                                     |

- **(student_enrollment_id, school_year_cycle_term_id) UNIQUE**
- Only generated when assessments are CLOSED and notes are VALIDATED
- Once `LOCKED` → immutable (correction = cancel + new bulletin)

### Transcript (AcademicRecord)

| Field                 | Type                   | Required | Notes                                               |
| --------------------- | ---------------------- | -------- | --------------------------------------------------- |
| id                    | PK                     | ✅       |                                                     |
| student_enrollment_id | FK → StudentEnrollment | ✅       |                                                     |
| school_year_id        | FK → SchoolYear        | ✅       |                                                     |
| cycle_id              | FK → SchoolYearCycle   | ✅       |                                                     |
| level_id              | FK → SchoolYearLevel   | ✅       |                                                     |
| average_score         | decimal                | ❌       |                                                     |
| rank                  | int                    | ❌       |                                                     |
| decision              | enum                   | ✅       | `PASS` / `FAIL` / `REPEAT` / `TRANSFER` / `PENDING` |
| remarks               | text                   | ❌       |                                                     |
| status                | enum                   | ✅       | `DRAFT` → `FINAL` → `LOCKED`                        |
| generated_at          | datetime               | ✅       |                                                     |
| locked_at             | datetime               | ❌       |                                                     |

- **(student_enrollment_id, school_year_id, cycle_id, level_id) UNIQUE**
- Aggregation of all ReportCards for the year
- Official academic record for ministry/inspections

---

## Entity Relationship Summary

```
Country
  └── RegionAdministrative
        └── AdministrativeUnit (self-referencing: parent_id)
              └── Locality
                    └── School
                          └── SchoolYear (CURRENT/FUTURE/ARCHIVE)
                                ├── SchoolYearCycle ← Cycle (MASTER) + TermType
                                │     ├── SchoolYearCycleTimeSlot
                                │     └── SchoolYearLevel ← Level (MASTER) + Track?
                                │           ├── Classroom
                                │           │     ├── StudentEnrollment ← Student
                                │           │     ├── TeacherAssignment ← SchoolYearTeacher ← Teacher
                                │           │     └── Schedule
                                │           └── SchoolYearLevelSubject ← Subject (MASTER)
                                │                 └── AssessmentSubject
                                │                       └── StudentAssessment → ReportCard → Transcript
                                └── SchoolYearTeacher ← CustomUser (Teacher role)
                                      └── TeacherAssignment

AcademicYear (standalone, global time reference)
TermType → Term (abstract period naming)
AssessmentType (standalone, global assessment categorization)
Assessment ← SchoolYearCycle + Term + AssessmentType
```

---

## Global Status Lifecycle Patterns

| Entity            | Status Flow                                   | Reversible?            |
| ----------------- | --------------------------------------------- | ---------------------- |
| AcademicYear      | DRAFT → ACTIVE → ARCHIVED                     | No (ARCHIVED is final) |
| SchoolYear        | CURRENT / FUTURE / ARCHIVE                    | One CURRENT per school |
| SchoolYearTeacher | ACTIVE → SUSPENDED → LEFT                     | No                     |
| TeacherAssignment | ACTIVE → REPLACED / ENDED                     | No                     |
| StudentEnrollment | PRE_REGISTERED → ACTIVE → COMPLETED / DROPPED | No                     |
| Assessment        | DRAFT → ACTIVE → CLOSED → ARCHIVED            | No                     |
| AssessmentSubject | DRAFT → PUBLISHED → CLOSED → ARCHIVED         | No                     |
| StudentAssessment | DRAFT → SUBMITTED → VALIDATED → CANCELLED     | No                     |
| ReportCard        | DRAFT → FINAL → LOCKED                        | No                     |
| Transcript        | DRAFT → FINAL → LOCKED                        | No                     |
| Schedule          | DRAFT → ACTIVE → SUSPENDED → ARCHIVED         | SUSPENDED ↔ ACTIVE     |
| TimeSlot          | ACTIVE / INACTIVE                             | Yes                    |

---
name: form-validation-patterns
description: Comprehensive form specifications, field validation rules, and business constraint enforcement patterns for the School Management System. Covers every create/edit form with field types, required/optional status, validation rules (client + server), cascading dependencies, uniqueness checks, and conditional logic. Use when implementing any form, modal, or data entry interface.
---

# Form Specifications & Validation Patterns

> Every create/edit form in the system with field-level specs, validation rules, conditional logic, and error messages.

---

## Global Patterns

### Audit Fields (Auto-managed)

Every entity has these fields managed automatically — **never show in forms**:

- `created_at`, `updated_at` → server timestamp
- `created_by`, `updated_by` → current authenticated user
- `is_deleted`, `deleted_at`, `deleted_by` → soft delete system

### Validation Timing

| Check                      | When                      | Implementation  |
| -------------------------- | ------------------------- | --------------- |
| Required fields            | On blur + submit          | Client-side     |
| Type validation            | On change                 | Client-side     |
| Range/format               | On blur                   | Client-side     |
| Uniqueness                 | Debounced (300ms) on blur | Server call     |
| Cross-field constraints    | On submit                 | Client + Server |
| Dependency checks (delete) | Before action             | Server call     |

### Error Message Language

All validation messages should be bilingual (French primary, English fallback):

- Required: "Ce champ est obligatoire" / "This field is required"
- Unique violation: "Cette valeur existe déjà" / "This value already exists"
- Range: "La valeur doit être entre {min} et {max}"

---

## Form 1: Country

| Field       | Type       | Required | Validation                   | Notes                    |
| ----------- | ---------- | -------- | ---------------------------- | ------------------------ |
| code        | text input | ✅       | 2-3 chars, uppercase, UNIQUE | Auto-uppercase transform |
| name        | text input | ✅       | 2-100 chars, UNIQUE          |                          |
| description | textarea   | ❌       | max 500 chars                |                          |

**Server-side unique checks**: `code`, `name`

---

## Form 2: RegionAdministrative

| Field       | Type            | Required | Validation            | Notes           |
| ----------- | --------------- | -------- | --------------------- | --------------- |
| country_id  | select dropdown | ✅       | Must exist            | Default: Guinea |
| code        | text input      | ✅       | UNIQUE within country |                 |
| name        | text input      | ✅       | UNIQUE within country |                 |
| description | textarea        | ❌       | max 500 chars         |                 |

**Composite unique checks**: `(country_id, code)`, `(country_id, name)`

---

## Form 3: AdministrativeUnit

| Field     | Type            | Required        | Validation                           | Conditional                              |
| --------- | --------------- | --------------- | ------------------------------------ | ---------------------------------------- |
| region_id | select dropdown | ✅              | Must exist                           | Filters available parents                |
| type      | select (enum)   | ✅              | PREFECTURE / COMMUNE / SUBPREFECTURE | Controls parent_id visibility            |
| parent_id | select dropdown | **Conditional** | Must be PREFECTURE                   | **Only visible if type = SUBPREFECTURE** |
| code      | text input      | ✅              | UNIQUE within region                 |                                          |
| name      | text input      | ✅              | UNIQUE within region                 |                                          |

**Conditional logic**:

```
IF type === 'SUBPREFECTURE':
  parent_id → REQUIRED, show dropdown (filter: same region, type=PREFECTURE)
ELSE:
  parent_id → HIDDEN, set to NULL
```

**Composite unique checks**: `(region_id, code)`, `(region_id, name)`

---

## Form 4: Locality

| Field                  | Type             | Required | Validation               | Notes                       |
| ---------------------- | ---------------- | -------- | ------------------------ | --------------------------- |
| administrative_unit_id | cascading select | ✅       | Must exist               | Cascade: Region → AdminUnit |
| code                   | text input       | ✅       | UNIQUE within admin unit |                             |
| name                   | text input       | ✅       | UNIQUE within admin unit |                             |

**Cascading dependency**: User selects Region first, then AdminUnit dropdown populates.

---

## Form 5: Cycle

| Field     | Type          | Required | Validation        | Notes                   |
| --------- | ------------- | -------- | ----------------- | ----------------------- |
| code      | text input    | ✅       | 2-5 chars, UNIQUE | e.g. MAT, PRI, COL, LYC |
| name      | text input    | ✅       | UNIQUE            |                         |
| has_track | toggle/switch | ✅       | boolean           | Only true for Lycée     |

**Warning on edit**: "Modifying a cycle may affect all dependent levels and school year configurations."

---

## Form 6: Track

| Field    | Type            | Required | Validation                   | Conditional                               |
| -------- | --------------- | -------- | ---------------------------- | ----------------------------------------- |
| cycle_id | select dropdown | ✅       | Must have `has_track = true` | **Only cycles with has_track=true shown** |
| code     | text input      | ✅       | UNIQUE within cycle          |                                           |
| name     | text input      | ✅       | UNIQUE within cycle          |                                           |

**Pre-filter**: Cycle dropdown only shows cycles where `has_track = true`

---

## Form 7: Level

| Field    | Type            | Required        | Validation                    | Conditional                            |
| -------- | --------------- | --------------- | ----------------------------- | -------------------------------------- |
| cycle_id | select dropdown | ✅              | Must exist                    | Filters track dropdown                 |
| track_id | select dropdown | **Conditional** | Must belong to selected cycle | **Required if cycle.has_track = true** |
| code     | text input      | ✅              | UNIQUE within cycle           |                                        |
| name     | text input      | ✅              | UNIQUE within cycle           |                                        |
| order    | number input    | ✅              | > 0, sequential within cycle  | Auto-suggest next value                |

**Conditional logic**:

```
IF selected_cycle.has_track === true:
  track_id → REQUIRED, show dropdown (filter: tracks for this cycle)
ELSE:
  track_id → HIDDEN, set to NULL
```

---

## Form 8: Subject

| Field       | Type       | Required | Validation         | Notes           |
| ----------- | ---------- | -------- | ------------------ | --------------- |
| code        | text input | ✅       | UNIQUE, 2-10 chars | e.g. MATH, FRAN |
| name        | text input | ✅       | UNIQUE             |                 |
| description | textarea   | ❌       | max 500 chars      |                 |

---

## Form 9: TermType

| Field        | Type         | Required | Validation          | Notes                    |
| ------------ | ------------ | -------- | ------------------- | ------------------------ |
| code         | text input   | ✅       | UNIQUE              | e.g. TRIMESTER, SEMESTER |
| name         | text input   | ✅       | UNIQUE              |                          |
| period_count | number input | ✅       | > 0 (typically 2-4) | Determines # of Terms    |

**Post-create**: Auto-generate Term records (T1, T2, T3...) or prompt to create them

---

## Form 10: Term

| Field        | Type            | Required | Validation                         | Notes                   |
| ------------ | --------------- | -------- | ---------------------------------- | ----------------------- |
| term_type_id | select dropdown | ✅       | Must exist                         |                         |
| code         | text input      | ✅       | UNIQUE within term_type            | e.g. T1, T2, S1         |
| name         | text input      | ❌       |                                    | e.g. "Trimestre 1"      |
| order        | number input    | ✅       | 1 ≤ order ≤ term_type.period_count | UNIQUE within term_type |

**Constraint enforcement**: `order` cannot exceed `period_count` of parent TermType

---

## Form 11: AssessmentType

| Field       | Type       | Required | Validation     | Notes                   |
| ----------- | ---------- | -------- | -------------- | ----------------------- |
| code        | text input | ✅       | UNIQUE, stable | e.g. COMPO, COURS, PART |
| name        | text input | ✅       | UNIQUE         |                         |
| description | textarea   | ❌       |                |                         |

---

## Form 12: AcademicYear

| Field      | Type              | Required | Validation                           | Notes                                  |
| ---------- | ----------------- | -------- | ------------------------------------ | -------------------------------------- |
| start_year | number input      | ✅       | 4-digit year                         |                                        |
| end_year   | number (readonly) | ✅       | **Auto = start_year + 1**            | Computed field, not editable           |
| code       | text (readonly)   | ✅       | **Auto = `{start_year}-{end_year}`** | Computed field                         |
| status     | select (enum)     | ✅       | DRAFT / ACTIVE / ARCHIVED            | Default: DRAFT                         |
| is_current | toggle            | ✅       |                                      | Confirmation dialog if setting to true |

**Critical business rules**:

- Setting `is_current = true` → API deactivates all others → show confirmation
- `ARCHIVED` → form becomes read-only
- Auto-compute: `code` and `end_year` from `start_year`

**Blocked actions on edit**:

- If status = ARCHIVED → all fields disabled, show "This year is archived" banner

---

## Form 13: School

| Field       | Type             | Required | Validation   | Notes           |
| ----------- | ---------------- | -------- | ------------ | --------------- |
| name        | text input       | ✅       | UNIQUE       |                 |
| code        | text input       | ✅       | UNIQUE       |                 |
| locality_id | cascading select | ✅       | Must exist   | 4-level cascade |
| address     | text input       | ❌       |              |                 |
| phone       | text input       | ❌       | Phone format |                 |
| email       | text input       | ❌       | Email format |                 |
| website     | text input       | ❌       | URL format   |                 |

**Cascading selects for locality**:

```
Country → Region → Administrative Unit → Locality
```

Each selection filters the next dropdown.

---

## Form 14: SchoolYear

| Field      | Type           | Required | Validation                 | Notes                         |
| ---------- | -------------- | -------- | -------------------------- | ----------------------------- |
| school_id  | select/context | ✅       | Must exist                 | Pre-filled from context       |
| name       | text input     | ✅       | UNIQUE within school       | e.g. "Lycée Filima 2024-2025" |
| start_date | date picker    | ✅       | < end_date                 |                               |
| end_date   | date picker    | ✅       | > start_date               |                               |
| status     | select (enum)  | ✅       | CURRENT / FUTURE / ARCHIVE | Default: FUTURE               |

**Only ONE** `CURRENT` per school — setting CURRENT triggers confirmation

---

## Form 15: SchoolYearCycle (usually part of wizard)

| Field          | Type            | Required | Validation                | Notes                    |
| -------------- | --------------- | -------- | ------------------------- | ------------------------ |
| school_year_id | context         | ✅       |                           | From wizard context      |
| cycle_id       | select dropdown | ✅       | UNIQUE within school year | Shows unselected cycles  |
| term_type_id   | select dropdown | ✅       | Must exist                | e.g. Trimester, Semester |

---

## Form 16: SchoolYearLevel (usually part of wizard)

| Field                | Type            | Required        | Validation                | Conditional                      |
| -------------------- | --------------- | --------------- | ------------------------- | -------------------------------- |
| school_year_cycle_id | context         | ✅              |                           | From wizard context              |
| level_id             | select dropdown | ✅              | Must belong to same cycle |                                  |
| track_id             | select dropdown | **Conditional** |                           | Required if cycle.has_track=true |

---

## Form 17: SchoolYearLevelSubject (usually part of wizard)

| Field                | Type                | Required | Validation           | Notes               |
| -------------------- | ------------------- | -------- | -------------------- | ------------------- |
| school_year_level_id | context             | ✅       |                      | From wizard context |
| subject_id           | select/multi-select | ✅       | UNIQUE within level  | Can add multiple    |
| coefficient          | number input        | ✅       | > 0, decimal allowed | Per subject         |

**UX**: Multi-add with coefficient inline editing per subject

---

## Form 18: Classroom

| Field                | Type           | Required | Validation          | Notes                |
| -------------------- | -------------- | -------- | ------------------- | -------------------- |
| school_year_level_id | select/context | ✅       |                     |                      |
| name                 | text input     | ✅       | UNIQUE within level | e.g. "2ème Année A1" |
| capacity             | number input   | ❌       | ≥ 0                 |                      |
| room_number          | text input     | ❌       |                     |                      |

---

## Form 19: SchoolYearTeacher

| Field          | Type                | Required | Validation            | Notes                  |
| -------------- | ------------------- | -------- | --------------------- | ---------------------- |
| school_year_id | context             | ✅       |                       |                        |
| teacher_id     | select/autocomplete | ✅       | UNIQUE within year    | Search by teacher name |
| status         | select (enum)       | ✅       | ACTIVE/SUSPENDED/LEFT | Default: ACTIVE        |
| hire_date      | date picker         | ❌       |                       |                        |
| end_date       | date picker         | ❌       | ≥ hire_date           |                        |

---

## Form 20: TeacherAssignment

| Field                        | Type        | Required | Validation     | Notes                                  |
| ---------------------------- | ----------- | -------- | -------------- | -------------------------------------- |
| school_year_teacher_id       | select      | ✅       | Must be ACTIVE | Filter: ACTIVE teachers only           |
| classroom_id                 | select      | ✅       |                |                                        |
| school_year_level_subject_id | select      | ✅       |                | Filter: subjects for classroom's level |
| start_date                   | date picker | ✅       |                |                                        |

**Active constraint**: Only ONE active assignment per (classroom, subject) — show warning if exists

**Replace flow** (separate modal):
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| replacement_teacher_id | select | ✅ | Must be ACTIVE, filter out current teacher |
| end_date_current | date picker | ✅ | Applies to current assignment |
| start_date_new | date picker | ✅ | For new assignment |

---

## Form 21: StudentEnrollment (Pre-registration)

| Field                | Type                | Required | Validation | Notes                        |
| -------------------- | ------------------- | -------- | ---------- | ---------------------------- |
| student_id           | select/autocomplete | ✅       |            | Search or create new student |
| first_name           | text input          | ✅       |            | For homonym management       |
| last_name            | text input          | ✅       |            |                              |
| school_year_level_id | select              | ✅       |            | Cascading: Cycle → Level     |
| enrollment_date      | date picker         | ✅       |            | Default: today               |

**Auto-generated fields** (not shown in form):

- `enrollment_status` = PRE_REGISTERED
- `classroom_id` = NULL
- `annual_identifier` = computed
- `pre_enroll_level_same_name_identifier` = computed if homonym exists

**Homonym detection**: On first_name + last_name blur → check if same name exists at same level → show warning

---

## Form 22: Classroom Assignment (from pre-registered)

| Field        | Type   | Required | Validation                 | Notes                   |
| ------------ | ------ | -------- | -------------------------- | ----------------------- |
| classroom_id | select | ✅       | Same level, capacity check | Show available capacity |

**On submit**: Status changes from PRE_REGISTERED → ACTIVE, generates classroom identifiers

---

## Form 23: Student Transfer

| Field            | Type     | Required | Validation                              | Notes |
| ---------------- | -------- | -------- | --------------------------------------- | ----- |
| new_classroom_id | select   | ✅       | Same level only, different from current |       |
| transfer_reason  | textarea | ❌       | max 500 chars                           |       |

**Effects on submit**:

- `previous_classroom_id` = current classroom
- `classroom_id` = new classroom
- Identifier updates for transferred student only
- Other students unchanged

---

## Form 24: SchoolYearCycleTimeSlot

| Field                | Type              | Required | Validation               | Notes              |
| -------------------- | ----------------- | -------- | ------------------------ | ------------------ |
| school_year_cycle_id | context           | ✅       |                          |                    |
| name                 | text input        | ✅       | UNIQUE within cycle      | e.g. "1ère heure"  |
| order                | number input      | ✅       | UNIQUE within cycle, > 0 |                    |
| start_time           | time picker       | ✅       | < end_time               | HH:MM format       |
| end_time             | time picker       | ✅       | > start_time             |                    |
| duration_minutes     | number (computed) | ✅       | Auto from times          | Read-only computed |

**Overlap validation**: Check no time overlap with existing slots in same cycle

---

## Form 25: Schedule Entry

| Field                 | Type           | Required | Validation                 | Notes                 |
| --------------------- | -------------- | -------- | -------------------------- | --------------------- |
| classroom_id          | context/select | ✅       |                            |                       |
| day_of_week           | select (enum)  | ✅       | MON-SAT                    |                       |
| time_slot_id          | select         | ✅       | ACTIVE only                |                       |
| teacher_assignment_id | select         | ✅       | ACTIVE, matching classroom | Shows subject+teacher |
| effective_from        | date picker    | ✅       |                            |                       |
| effective_to          | date picker    | ❌       | ≥ effective_from           |                       |

**Conflict checks**:

- Same class + same day + same time slot → blocked
- Same teacher + same day + same time slot (any class) → blocked

---

## Form 26: Assessment

| Field                     | Type        | Required | Validation           | Notes                       |
| ------------------------- | ----------- | -------- | -------------------- | --------------------------- |
| school_year_cycle_id      | select      | ✅       |                      | Cascade from SchoolYear     |
| school_year_cycle_term_id | select      | ✅       | Must belong to cycle |                             |
| assessment_type_id        | select      | ✅       |                      |                             |
| name                      | text input  | ✅       |                      | Auto-suggest from type+term |
| start_date                | date picker | ✅       | ≤ end_date           |                             |
| end_date                  | date picker | ✅       | ≥ start_date         |                             |

**Uniqueness**: (cycle, type, term) — only ONE assessment per type per term per cycle

---

## Form 27: AssessmentSubject

| Field                        | Type         | Required | Validation                      | Notes                          |
| ---------------------------- | ------------ | -------- | ------------------------------- | ------------------------------ |
| assessment_id                | context      | ✅       | Must be ACTIVE                  |                                |
| classroom_id                 | select       | ✅       |                                 |                                |
| school_year_level_subject_id | select       | ✅       | Must match classroom level      |                                |
| teacher_assignment_id        | select       | ✅       | ACTIVE, matching class+subject  |                                |
| name                         | text input   | ✅       |                                 | Auto-suggest from subject+term |
| exam_date                    | date picker  | ✅       | Within assessment date range    |                                |
| max_score                    | number input | ✅       | > 0, default: 20                |                                |
| coefficient                  | number input | ✅       | > 0, default from level subject |                                |

---

## Form 28: StudentAssessment (Grade Entry)

| Field      | Type         | Required        | Validation            | Conditional                   |
| ---------- | ------------ | --------------- | --------------------- | ----------------------------- |
| raw_score  | number input | **Conditional** | 0 ≤ value ≤ max_score | **Disabled if is_absent**     |
| is_absent  | checkbox     | ✅              |                       | Clears raw_score if checked   |
| is_excused | checkbox     | ✅              |                       | **Only visible if is_absent** |
| remark     | text input   | ❌              | max 200 chars         |                               |

**Conditional logic**:

```
IF is_absent === true:
  raw_score → DISABLED, cleared to NULL
  is_excused → VISIBLE
  status cannot be VALIDATED
ELSE:
  raw_score → ENABLED, REQUIRED
  is_excused → HIDDEN, set to false
```

**Computed**: `normalized_score = (raw_score / max_score) * scale` (e.g. scale = 20)

---

## Cascading Select Dependency Map

This map shows which dropdowns depend on other selections:

```
┌─────────────────────────────────────────────────────┐
│ Geography Cascade                                    │
│ Country → Region → AdministrativeUnit → Locality     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Academic Structure Cascade                           │
│ Cycle → Level (+ Track if has_track)                 │
│ TermType → Term                                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ School Context Cascade                               │
│ School → SchoolYear → SchoolYearCycle                 │
│   SchoolYearCycle → SchoolYearLevel → Classroom       │
│   SchoolYearCycle → SchoolYearCycleTerm               │
│   SchoolYearLevel → SchoolYearLevelSubject            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Assignment Cascade                                   │
│ SchoolYear → SchoolYearTeacher → TeacherAssignment    │
│ SchoolYearLevel → Classroom → StudentEnrollment       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Assessment Cascade                                   │
│ SchoolYearCycle → Assessment → AssessmentSubject       │
│   AssessmentSubject → StudentAssessment               │
│   StudentAssessment → ReportCard → Transcript         │
└─────────────────────────────────────────────────────┘
```

---

## Deletion Rules Reference

Before allowing delete on any entity, check these dependencies:

| Entity               | Blocked By                                 | Error Message                                                   |
| -------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| Country              | Has RegionAdministrative                   | "Ce pays ne peut pas être supprimé car il contient des régions" |
| RegionAdministrative | Has AdministrativeUnit                     | "Cette région contient des unités administratives"              |
| AdministrativeUnit   | Has Locality or School                     | "Cette unité contient des localités ou écoles"                  |
| Locality             | Has School                                 | "Cette localité contient des écoles"                            |
| Cycle                | Has Level or SchoolYearCycle               | "Ce cycle est utilisé par des niveaux ou années scolaires"      |
| Track                | Has Level                                  | "Cette filière est utilisée par des niveaux"                    |
| Level                | Has SchoolYearLevel                        | "Ce niveau est utilisé dans des années scolaires"               |
| Subject              | Has SchoolYearLevelSubject                 | "Cette matière est assignée à des niveaux"                      |
| School               | Has SchoolYear or Users                    | "Cette école a des années scolaires ou utilisateurs"            |
| SchoolYear           | Has SchoolYearCycle/Level/Enrollment       | "Cette année contient des données actives"                      |
| Classroom            | Has StudentEnrollment or TeacherAssignment | "Cette classe a des élèves ou enseignants"                      |
| SchoolYearTeacher    | Has TeacherAssignment                      | "Cet enseignant a des affectations actives"                     |
| Assessment           | Has AssessmentSubject                      | "Cette évaluation contient des épreuves"                        |
| AssessmentSubject    | Has StudentAssessment                      | "Cette épreuve contient des notes"                              |
| StudentEnrollment    | Has StudentAssessment or ReportCard        | "Cet élève a des notes ou bulletins"                            |

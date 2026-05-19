# Portal Pages Implementation — Todo List

> Based on analysis of `docs/tables/` (29 entities) and current codebase state.
> **Legend**: ✅ Done | 🔶 Partial (exists but needs work) | ⬜ Not started

---

## Current State Summary

| Portal       | Route Prefix    | Dashboard       | Data Pages                   |
| ------------ | --------------- | --------------- | ---------------------------- |
| Super Admin  | `/super-admin`  | 🔶 Static shell | 🔶 ~10 pages, mostly shells  |
| Admin        | `/admin`        | 🔶 Static shell | 🔶 2 pages (index, users)    |
| School Admin | `/school-admin` | 🔶 Static shell | 🔶 2 pages (index, students) |
| Teacher      | `/teacher`      | 🔶 Static shell | ⬜ Only index                |
| Student      | `/student`      | 🔶 Static shell | ⬜ Only index                |
| Parent       | `/parent`       | 🔶 Static shell | ⬜ Only index                |

**Data layer**: Geography + Academic adapters exist. Students/Users/Theme adapters exist as stubs.

---

## 🔴 Portal 1: Super Admin

> Platform-wide management of master data, geography, schools, and global config.

### Phase 1 — Geography CRUD (Master Data)

| #   | Task                                                           | Route                          | Entity               | Status                                  |
| --- | -------------------------------------------------------------- | ------------------------------ | -------------------- | --------------------------------------- |
| 1.1 | Countries list + CRUD modal                                    | `/super-admin/geography` (tab) | Country              | 🔶 Geography page exists as single page |
| 1.2 | Regions list + CRUD modal                                      | `/super-admin/geography` (tab) | RegionAdministrative | 🔶 Same page                            |
| 1.3 | Administrative Units list + CRUD modal                         | `/super-admin/geography` (tab) | AdministrativeUnit   | 🔶 Same page                            |
| 1.4 | Localities list + CRUD modal                                   | `/super-admin/geography` (tab) | Locality             | 🔶 Same page                            |
| 1.5 | Wire geography data adapter to real API                        | —                              | All geography        | ⬜ Local adapter exists                 |
| 1.6 | Cascading select component (Country→Region→AdminUnit→Locality) | Shared                         | —                    | ⬜                                      |

### Phase 2 — Academic Config CRUD (Master Data)

| #   | Task                                   | Route                         | Entity         | Status                                |
| --- | -------------------------------------- | ----------------------------- | -------------- | ------------------------------------- |
| 2.1 | Cycles card grid + CRUD                | `/super-admin/cycles`         | Cycle          | 🔶 Page exists                        |
| 2.2 | Tracks list + CRUD                     | `/super-admin/tracks`         | Track          | 🔶 Page exists                        |
| 2.3 | Levels grouped table + CRUD            | `/super-admin/levels`         | Level          | 🔶 Page exists                        |
| 2.4 | Subjects table + CRUD                  | `/super-admin/subjects`       | Subject        | 🔶 Page exists                        |
| 2.5 | TermTypes + Terms expandable CRUD      | `/super-admin/periods`        | TermType, Term | 🔶 Page exists                        |
| 2.6 | Assessment Types table + CRUD          | `/super-admin/configuration`  | AssessmentType | 🔶 Config page exists                 |
| 2.7 | Academic Years with status management  | `/super-admin/academic-years` | AcademicYear   | 🔶 Page exists (31KB — most complete) |
| 2.8 | Wire academic data adapter to real API | —                             | All academic   | ⬜ Local adapter exists               |

### Phase 3 — Schools Management

| #   | Task                                              | Route                            | Entity | Status                |
| --- | ------------------------------------------------- | -------------------------------- | ------ | --------------------- |
| 3.1 | Schools list + CRUD with geography cascade        | `/super-admin/schools`           | School | 🔶 List page exists   |
| 3.2 | School detail page (tabs: overview, years, stats) | `/super-admin/schools/$schoolId` | School | 🔶 Detail page exists |
| 3.3 | Schools data adapter                              | —                                | School | ⬜                    |

### Phase 4 — Users & Platform

| #   | Task                                       | Route                         | Entity     | Status         |
| --- | ------------------------------------------ | ----------------------------- | ---------- | -------------- |
| 4.1 | Users management (all roles)               | `/super-admin/users`          | CustomUser | 🔶 Page exists |
| 4.2 | Global reports dashboard                   | `/super-admin/reports`        | Aggregated | 🔶 Page exists |
| 4.3 | Theme settings                             | `/super-admin/theme-settings` | —          | 🔶 Page exists |
| 4.4 | Live dashboard stats (wire to real counts) | `/super-admin`                | —          | ⬜             |

### Super Admin — Totals

- **Existing pages**: ~12 (mostly shells with local data)
- **Key remaining work**: Wire to real APIs, add form validation, implement cascading selects, real-time stats

---

## 🟠 Portal 2: Admin

> General administration — user management, settings, reports.

| #   | Task                                | Route              | Entity     | Status          |
| --- | ----------------------------------- | ------------------ | ---------- | --------------- |
| 5.1 | Dashboard with live stats           | `/admin`           | —          | 🔶 Static shell |
| 5.2 | Users management (role-scoped)      | `/admin/users`     | CustomUser | 🔶 Page exists  |
| 5.3 | Settings page (system config)       | `/admin/settings`  | —          | ⬜              |
| 5.4 | Reports page (system-level reports) | `/admin/reports`   | —          | ⬜              |
| 5.5 | Audit log viewer                    | `/admin/audit-log` | —          | ⬜              |

### Admin — Totals

- **Existing pages**: 2 (dashboard + users)
- **Remaining**: 3 new pages + live data on dashboard

---

## 🔵 Portal 3: School Admin

> School-level management of years, enrollment, teachers, schedule, assessments, reports.

### Phase 1 — School Year Setup (Critical Path)

| #   | Task                                                                                    | Route                         | Entity                    | Status |
| --- | --------------------------------------------------------------------------------------- | ----------------------------- | ------------------------- | ------ |
| 6.1 | School Year list (CURRENT/FUTURE/ARCHIVE)                                               | `/school-admin/years`         | SchoolYear                | ⬜     |
| 6.2 | School Year Setup Wizard (7-step)                                                       | `/school-admin/years/create`  | SchoolYear + children     | ⬜     |
|     | — Step 1: Create year (name, dates)                                                     |                               | SchoolYear                |        |
|     | — Step 2: Select cycles + term types                                                    |                               | SchoolYearCycle           |        |
|     | — Step 3: Select levels per cycle (+tracks)                                             |                               | SchoolYearLevel           |        |
|     | — Step 4: Assign subjects + coefficients                                                |                               | SchoolYearLevelSubject    |        |
|     | — Step 5: Create classrooms per level                                                   |                               | Classroom                 |        |
|     | — Step 6: Define time slots per cycle                                                   |                               | SchoolYearCycleTimeSlot   |        |
|     | — Step 7: Review & activate                                                             |                               | —                         |        |
| 6.3 | School Year detail (tabbed: overview, cycles, levels, subjects, classrooms, time slots) | `/school-admin/years/$yearId` | SchoolYear + all children | ⬜     |
| 6.4 | Classroom management (cards by level)                                                   | `/school-admin/classrooms`    | Classroom                 | ✅     |

### Phase 2 — Teacher Management

| #   | Task                                   | Route                                    | Entity                       | Status |
| --- | -------------------------------------- | ---------------------------------------- | ---------------------------- | ------ |
| 7.1 | School Year Teachers list + add/status | `/school-admin/teachers`                 | SchoolYearTeacher            | ✅     |
| 7.2 | Teacher Assignments table + CRUD       | `/school-admin/teachers/$id/assignments` | TeacherAssignment            | ✅     |
| 7.3 | Teacher replacement flow (modal)       | Modal                                    | TeacherAssignment            | ✅     |
| 7.4 | Teacher workload calendar view         | `/school-admin/teachers/$id/workload`    | TeacherAssignment + Schedule | ✅     |

### Phase 3 — Student Enrollment

| #   | Task                                     | Route                                 | Entity                          | Status |
| --- | ---------------------------------------- | ------------------------------------- | ------------------------------- | ------ |
| 8.1 | Enrollment list (filterable, searchable) | `/school-admin/students`              | StudentEnrollment               | ✅     |
| 8.2 | Pre-registration form                    | `/school-admin/students/pre-register` | StudentEnrollment               | ✅     |
| 8.3 | Classroom assignment panel (dual-panel)  | `/school-admin/students/assign`       | StudentEnrollment               | ✅     |
| 8.4 | Transfer student modal                   | Modal                                 | StudentEnrollment               | ✅     |
| 8.5 | Student profile detail page              | `/school-admin/students/$id`          | StudentEnrollment + assessments | ✅     |
| 8.6 | Homonym detection component              | Shared                                | —                               | ✅     |

### Phase 4 — Schedule Management

| #   | Task                                              | Route                               | Entity                  | Status |
| --- | ------------------------------------------------- | ----------------------------------- | ----------------------- | ------ |
| 9.1 | Time slot configuration per cycle                 | `/school-admin/schedule/time-slots` | SchoolYearCycleTimeSlot | ✅     |
| 9.2 | Timetable builder (weekly grid per class)         | `/school-admin/schedule`            | Schedule                | ✅     |
| 9.3 | Conflict detection engine (teacher/class overlap) | Shared                              | —                       | ✅     |

### Phase 5 — Assessment & Grading

| #    | Task                                                       | Route                                    | Entity            | Status |
| ---- | ---------------------------------------------------------- | ---------------------------------------- | ----------------- | ------ |
| 10.1 | Assessment dashboard (list with filters)                   | `/school-admin/assessments`              | Assessment        | ✅     |
| 10.2 | Create/Edit assessment form                                | Modal                                    | Assessment        | ✅     |
| 10.3 | Assessment subjects management                             | `/school-admin/assessments/$id/subjects` | AssessmentSubject | ✅     |
| 10.4 | Bulk create assessment subjects                            | Modal                                    | AssessmentSubject | ✅     |
| 10.5 | Grade validation review                                    | `/school-admin/assessments/$id/validate` | StudentAssessment | ✅     |
| 10.6 | Status workflow enforcement (DRAFT→ACTIVE→CLOSED→ARCHIVED) | Shared                                   | —                 | ✅     |

### Phase 6 — Reporting

| #    | Task                                      | Route                                    | Entity     | Status |
| ---- | ----------------------------------------- | ---------------------------------------- | ---------- | ------ |
| 11.1 | Report card generation page               | `/school-admin/reports/report-cards`     | ReportCard | ✅     |
| 11.2 | Individual report card view (print-ready) | `/school-admin/reports/report-cards/$id` | ReportCard | ✅     |
| 11.3 | Transcript view (multi-year)              | `/school-admin/reports/transcripts/$id`  | Transcript | ✅     |
| 11.4 | Statistics dashboard (charts)             | `/school-admin/reports/statistics`       | Aggregated | ✅     |

### Phase 7 — Data Layer

| #     | Task                                        | Status |
| ----- | ------------------------------------------- | ------ |
| 12.1  | SchoolYear data adapter (local + API)       | ⬜     |
| 12.2  | SchoolYearCycle/Level/Subject data adapters | ⬜     |
| 12.3  | Classroom data adapter                      | ⬜     |
| 12.4  | SchoolYearTeacher data adapter              | ✅     |
| 12.5  | TeacherAssignment data adapter              | ✅     |
| 12.6  | StudentEnrollment data adapter              | 🔶     |
| 12.7  | Schedule data adapter                       | ✅     |
| 12.8  | Assessment/AssessmentSubject data adapter   | ✅     |
| 12.9  | StudentAssessment data adapter              | ⬜     |
| 12.10 | ReportCard/Transcript data adapter          | ✅     |

### School Admin — Totals

- **Existing pages**: 2 (dashboard + students list)
- **Remaining**: ~22 new pages/views + 10 data adapters
- **Critical path**: School Year Setup Wizard → Teachers → Enrollment → Schedule → Assessment → Reports

---

## 🟢 Portal 4: Teacher

> Class management, grade entry, schedule, student overview.

| #    | Task                                                                  | Route                                  | Entity                                | Status          |
| ---- | --------------------------------------------------------------------- | -------------------------------------- | ------------------------------------- | --------------- |
| 13.1 | Dashboard with live stats (classes, pending grades, today's schedule) | `/teacher`                             | —                                     | 🔶 Static shell |
| 13.2 | My Classes card grid                                                  | `/teacher/classes`                     | TeacherAssignment (ACTIVE)            | ⬜              |
| 13.3 | Class detail (student list + subject grades)                          | `/teacher/classes/$classId`            | StudentEnrollment + StudentAssessment | ⬜              |
| 13.4 | Grade entry sheet (spreadsheet-like)                                  | `/teacher/grades/$assessmentSubjectId` | StudentAssessment                     | ⬜              |
| 13.5 | Grade entry inline edit + absent/excused toggles                      | Component                              | —                                     | ⬜              |
| 13.6 | Batch submit grades (DRAFT → SUBMITTED)                               | Component                              | StudentAssessment                     | ⬜              |
| 13.7 | My Schedule (weekly calendar)                                         | `/teacher/schedule`                    | Schedule                              | ⬜              |
| 13.8 | My Students overview (across all classes)                             | `/teacher/students`                    | StudentEnrollment                     | ⬜              |
| 13.9 | Update nav links (enable routes)                                      | `NavLinks.tsx`                         | —                                     | ⬜              |

### Teacher — Totals

- **Existing pages**: 1 (dashboard shell)
- **Remaining**: ~7 new pages + grade entry components
- **Critical**: Grade entry sheet is the most complex UI (spreadsheet behavior)

---

## 🟣 Portal 5: Student

> View-only access to grades, schedule, report cards, transcript.

| #    | Task                                                        | Route                       | Entity                        | Status          |
| ---- | ----------------------------------------------------------- | --------------------------- | ----------------------------- | --------------- |
| 14.1 | Dashboard with live stats (class, average, next assessment) | `/student`                  | —                             | 🔶 Static shell |
| 14.2 | My Grades (table grouped by term → subject)                 | `/student/grades`           | StudentAssessment (VALIDATED) | ⬜              |
| 14.3 | My Report Cards (cards per term, view/print)                | `/student/report-cards`     | ReportCard (FINAL/LOCKED)     | ⬜              |
| 14.4 | Individual report card view                                 | `/student/report-cards/$id` | ReportCard                    | ⬜              |
| 14.5 | My Schedule (weekly calendar, read-only)                    | `/student/schedule`         | Schedule                      | ⬜              |
| 14.6 | My Transcript (multi-year academic record)                  | `/student/transcript`       | Transcript                    | ⬜              |
| 14.7 | My Profile                                                  | `/student/profile`          | StudentEnrollment             | ⬜              |
| 14.8 | Update nav links (enable routes)                            | `NavLinks.tsx`              | —                             | ⬜              |

### Student — Totals

- **Existing pages**: 1 (dashboard shell)
- **Remaining**: ~6 new pages (all read-only views)
- **Can reuse**: Report card view component from School Admin portal

---

## 🩷 Portal 6: Parent

> Monitor children's academic progress — read-only with child selector.

| #    | Task                                                            | Route                                    | Entity            | Status          |
| ---- | --------------------------------------------------------------- | ---------------------------------------- | ----------------- | --------------- |
| 15.1 | Dashboard with children overview cards                          | `/parent`                                | —                 | 🔶 Static shell |
| 15.2 | My Children list (linked student accounts)                      | `/parent/children`                       | StudentEnrollment | ⬜              |
| 15.3 | Child selector component (top-level context)                    | Shared                                   | —                 | ⬜              |
| 15.4 | Child Grades (same as student grades, scoped to selected child) | `/parent/children/$childId/grades`       | StudentAssessment | ⬜              |
| 15.5 | Child Report Cards                                              | `/parent/children/$childId/report-cards` | ReportCard        | ⬜              |
| 15.6 | Child Schedule                                                  | `/parent/children/$childId/schedule`     | Schedule          | ⬜              |
| 15.7 | Child Transcript                                                | `/parent/children/$childId/transcript`   | Transcript        | ⬜              |
| 15.8 | Notifications page                                              | `/parent/notifications`                  | —                 | ⬜              |
| 15.9 | Update nav links (enable routes)                                | `NavLinks.tsx`                           | —                 | ⬜              |

### Parent — Totals

- **Existing pages**: 1 (dashboard shell)
- **Remaining**: ~7 new pages
- **Key component**: Child selector (all views scoped to selected child)
- **Can reuse**: Grade/Report/Schedule views from Student portal

---

## Shared Components Needed (Cross-Portal)

| #   | Component                                                        | Used By                                | Status |
| --- | ---------------------------------------------------------------- | -------------------------------------- | ------ |
| S1  | `CascadingSelect` (geography: Country→Region→AdminUnit→Locality) | Super Admin, School                    | ⬜     |
| S2  | `StatusBadge` (universal for all status enums)                   | All portals                            | ⬜     |
| S3  | `DataTable` (sortable, filterable, paginated)                    | All portals                            | ⬜     |
| S4  | `ConfirmationModal` (for status changes, deletes)                | All portals                            | ⬜     |
| S5  | `FormModal` (reusable create/edit modal)                         | All portals                            | ⬜     |
| S6  | `WeeklyCalendar` (timetable grid)                                | School Admin, Teacher, Student, Parent | ⬜     |
| S7  | `GradeSheet` (spreadsheet-like grade entry)                      | Teacher, School Admin                  | ⬜     |
| S8  | `ReportCardDocument` (print-ready report card)                   | School Admin, Student, Parent          | ⬜     |
| S9  | `StepperWizard` (for School Year setup)                          | School Admin                           | ⬜     |
| S10 | `DependencyWarning` (blocked delete explanation)                 | All CRUD pages                         | ⬜     |
| S11 | `ChildSelector` (parent portal context)                          | Parent                                 | ⬜     |

---

## Recommended Implementation Order

```
Phase 1: Foundation (Shared Components)
  S1-S5 → DataTable, StatusBadge, CascadingSelect, Modals

Phase 2: Super Admin — Complete Master Data
  1.1-1.6 → Geography CRUD (wire existing pages to real API)
  2.1-2.8 → Academic Config (wire existing pages to real API)
  3.1-3.3 → Schools CRUD

Phase 3: School Admin — School Year Setup (Critical Path)
  6.1-6.4 → School Year wizard + detail + classrooms
  12.1-12.3 → Data adapters for SchoolYear entities

Phase 4: School Admin — People Management
  7.1-7.4 → Teachers
  8.1-8.6 → Student Enrollment
  12.4-12.6 → Data adapters

Phase 5: School Admin — Schedule
  S6 → WeeklyCalendar component
  9.1-9.3 → Time slots + timetable builder
  12.7 → Schedule data adapter

Phase 6: School Admin — Assessment & Grading
  S7 → GradeSheet component
  10.1-10.6 → Assessment management
  12.8-12.9 → Data adapters

Phase 7: Teacher Portal
  13.1-13.9 → All teacher pages (reuses GradeSheet, WeeklyCalendar)

Phase 8: Reporting
  S8 → ReportCardDocument component
  11.1-11.4 → Report cards, transcripts, statistics
  12.10 → Data adapters

Phase 9: Student Portal
  14.1-14.8 → All student pages (reuses existing components)

Phase 10: Parent Portal
  S11 → ChildSelector
  15.1-15.9 → All parent pages (wraps student views)

Phase 11: Admin Portal
  5.1-5.5 → Settings, reports, audit log
```

---

## Summary Counts

| Portal            | Existing | To Build           | Total   |
| ----------------- | -------- | ------------------ | ------- |
| Super Admin       | ~12      | ~5 (wire + polish) | ~12     |
| Admin             | 2        | 3                  | 5       |
| School Admin      | 2        | ~22                | ~24     |
| Teacher           | 1        | ~7                 | ~8      |
| Student           | 1        | ~6                 | ~7      |
| Parent            | 1        | ~7                 | ~8      |
| Shared Components | 0        | 11                 | 11      |
| Data Adapters     | 3        | ~10                | ~13     |
| **Grand Total**   | **~19**  | **~71**            | **~88** |

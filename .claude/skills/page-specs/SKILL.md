---
name: page-specs
description: Complete page specifications and UX flows for the School Management System. Covers every portal page organized by user role (Admin, Teacher, Student, Parent) and domain module (Geography, Academic Config, School Setup, Enrollment, Pedagogy, Assessment, Reporting). Each page spec includes purpose, data sources, UI components, actions, validation rules, and navigation flows. Use when planning, designing, or implementing any frontend page.
---

# Page Specifications & UX Flows

> Derived from the data model analysis. Every page is mapped to its source entities, required actions, and UX patterns.

---

## Navigation Architecture

### Role-Based Portals

The system serves 4 primary roles, each with a distinct dashboard and navigation:

| Role               | Primary Portal    | Key Modules                                                        |
| ------------------ | ----------------- | ------------------------------------------------------------------ |
| **Super Admin**    | System Dashboard  | Geography, Academic Config, Schools, Users, Reporting              |
| **School Admin**   | School Dashboard  | School Setup, Enrollment, Teachers, Schedule, Assessments, Reports |
| **Teacher**        | Teacher Dashboard | My Classes, Grade Entry, My Schedule, My Students                  |
| **Student/Parent** | Student Dashboard | My Grades, My Schedule, Report Cards, Transcript                   |

### URL Structure

```
/dashboard                          → Role-based landing
/admin/geography/...                → Super Admin: Geography CRUD
/admin/academic/...                 → Super Admin: Academic structure CRUD
/school/setup/...                   → School Admin: Year setup wizard
/school/enrollment/...              → School Admin: Student management
/school/teachers/...                → School Admin: Teacher management
/school/schedule/...                → School Admin: Timetable management
/school/assessments/...             → School Admin: Assessment management
/school/reports/...                 → School Admin: Report cards & transcripts
/teacher/classes/...                → Teacher: Class management
/teacher/grades/...                 → Teacher: Grade entry
/student/grades/...                 → Student: View grades
/student/schedule/...               → Student: View schedule
```

---

## Module 1: Geography Management (Super Admin)

### Page 1.1: Countries List

- **Route**: `/admin/geography/countries`
- **Source**: `Country`
- **Layout**: Data table with search/filter
- **Columns**: Code, Name, Description, # Regions, Actions
- **Actions**: Add, Edit, Soft Delete (blocked if regions exist)
- **UX Notes**:
  - Show warning badge if deletion blocked due to dependencies
  - Inline edit for simple fields

### Page 1.2: Regions List

- **Route**: `/admin/geography/regions`
- **Source**: `RegionAdministrative`
- **Layout**: Data table with country filter dropdown
- **Columns**: Code, Name, Country, Description, # Admin Units, Actions
- **Actions**: Add, Edit, Soft Delete (blocked if admin units exist)
- **UX Notes**:
  - Filter by country (default: Guinea)
  - Show count badge for child admin units

### Page 1.3: Administrative Units

- **Route**: `/admin/geography/administrative-units`
- **Source**: `AdministrativeUnit`
- **Layout**: Data table + tree view toggle
- **Columns**: Code, Name, Type (badge), Region, Parent, # Localities, Actions
- **Filters**: Region, Type (Prefecture/Commune/Subprefecture)
- **Actions**: Add, Edit, Soft Delete
- **Form Logic**:
  - If type = `SUBPREFECTURE` → parent_id required (show parent select, filtered to PREFECTURE)
  - If type = `PREFECTURE` or `COMMUNE` → parent_id hidden/disabled
- **UX Notes**:
  - Tree view shows hierarchy: Prefecture → Subprefectures
  - Cascading: Region selection filters available parents

### Page 1.4: Localities

- **Route**: `/admin/geography/localities`
- **Source**: `Locality`
- **Layout**: Data table with cascading filters
- **Columns**: Code, Name, Administrative Unit, Region, Actions
- **Filters**: Region → Administrative Unit (cascading)
- **Actions**: Add, Edit, Soft Delete (blocked if schools exist)

---

## Module 2: Academic Configuration (Super Admin)

### Page 2.1: Cycles

- **Route**: `/admin/academic/cycles`
- **Source**: `Cycle`
- **Layout**: Card grid (small dataset, ~4 items)
- **Card Content**: Name, Code, has_track indicator, # Levels, # Tracks
- **Actions**: Add, Edit, Soft Delete
- **UX Notes**:
  - Use visual cards with icons (🎓 Maternelle, 📚 Primaire, 🏫 Collège, 🎯 Lycée)
  - Toggle switch for `has_track`

### Page 2.2: Tracks

- **Route**: `/admin/academic/tracks`
- **Source**: `Track`
- **Layout**: Data table, filtered by cycle
- **Columns**: Code, Name, Cycle, # Levels using this track
- **Filters**: Cycle (only those with `has_track = true`)
- **Actions**: Add, Edit, Soft Delete
- **Form Logic**: Cycle dropdown only shows cycles with `has_track = true`

### Page 2.3: Levels

- **Route**: `/admin/academic/levels`
- **Source**: `Level`
- **Layout**: Grouped data table (grouped by Cycle)
- **Columns**: Order, Code, Name, Cycle, Track (if applicable), Actions
- **Sorting**: By cycle then by order
- **Actions**: Add, Edit, Soft Delete, Reorder (drag-and-drop within cycle)
- **Form Logic**:
  - Select Cycle first
  - If selected cycle has `has_track = true` → show Track dropdown (required)
  - Auto-suggest next `order` value

### Page 2.4: Subjects

- **Route**: `/admin/academic/subjects`
- **Source**: `Subject`
- **Layout**: Data table with search
- **Columns**: Code, Name, Description, # Levels using, Actions
- **Actions**: Add, Edit, Soft Delete

### Page 2.5: Term Types

- **Route**: `/admin/academic/term-types`
- **Source**: `TermType` + `Term`
- **Layout**: Expandable card list
- **Card Content**: Name, Code, Period Count
- **Expanded**: Shows child Terms (ordered)
- **Actions**: Add/Edit TermType, Add/Edit/Delete Terms within
- **UX Notes**: Inline term creation within expanded card

### Page 2.6: Assessment Types

- **Route**: `/admin/academic/assessment-types`
- **Source**: `AssessmentType`
- **Layout**: Data table
- **Columns**: Code, Name, Description, Actions
- **Actions**: Add, Edit, Soft Delete

### Page 2.7: Academic Years

- **Route**: `/admin/academic/academic-years`
- **Source**: `AcademicYear`
- **Layout**: Timeline or list view
- **Columns**: Code, Start Year, End Year, Status (badge), Is Current (star), Actions
- **Actions**:
  - Add (auto-fills `end_year = start_year + 1`)
  - Edit (blocked if `ARCHIVED`)
  - Set Current (confirmation modal: "This will deactivate the current year")
  - Archive (confirmation modal)
- **UX Notes**:
  - Highlight current year with accent color
  - Status badges: Draft=gray, Active=green, Archived=muted
  - Archived rows are visually dimmed

---

## Module 3: School Setup (School Admin)

### Page 3.1: Schools List (Super Admin only)

- **Route**: `/admin/schools`
- **Source**: `School`
- **Layout**: Data table or card grid
- **Columns**: Name, Code, Locality (full path), Contact info, Actions
- **Actions**: Add, Edit, View Detail
- **Form**: Cascading geography selects (Country → Region → AdminUnit → Locality)

### Page 3.2: School Year Setup Wizard

- **Route**: `/school/setup/years`
- **Source**: `SchoolYear`
- **Layout**: Stepper wizard or timeline
- **Steps**:
  1. **Create School Year**: Name, dates, link to School
  2. **Add Cycles**: Select which cycles this school teaches (creates SchoolYearCycle), assign TermType per cycle
  3. **Add Levels**: For each cycle, select levels + tracks (creates SchoolYearLevel)
  4. **Add Subjects**: For each level, assign subjects with coefficients (creates SchoolYearLevelSubject)
  5. **Create Classrooms**: For each level, create classrooms with names/capacity
  6. **Add Time Slots**: For each cycle, define period schedule (creates SchoolYearCycleTimeSlot)
  7. **Review & Activate**: Summary view → set status to CURRENT
- **UX Notes**:
  - This is the **critical onboarding flow**
  - Each step should validate before proceeding
  - Allow going back to previous steps
  - Progress indicator at top
  - "Copy from Previous Year" shortcut

### Page 3.3: School Year Detail

- **Route**: `/school/setup/years/:yearId`
- **Source**: `SchoolYear` + all child entities
- **Layout**: Tabbed view
- **Tabs**:
  - Overview (stats: # cycles, levels, classrooms, students, teachers)
  - Cycles & Levels (tree view)
  - Subjects & Coefficients (table per level)
  - Classrooms (cards grouped by level)
  - Time Slots (table per cycle)
  - Teachers (SchoolYearTeacher list)

### Page 3.4: Classroom Management

- **Route**: `/school/setup/classrooms`
- **Source**: `Classroom`
- **Layout**: Cards grouped by SchoolYearLevel
- **Card Content**: Name, Capacity, Room #, # Students enrolled, # Teachers assigned
- **Actions**: Add, Edit, Delete (blocked if students/teachers assigned)
- **UX Notes**: Capacity bar showing fill percentage

---

## Module 4: Teacher Management (School Admin)

### Page 4.1: School Year Teachers

- **Route**: `/school/teachers`
- **Source**: `SchoolYearTeacher`
- **Layout**: Data table with status filters
- **Columns**: Teacher Name, Status (badge), Hire Date, # Assignments, Actions
- **Filters**: Status (Active/Suspended/Left), Search by name
- **Actions**:
  - Add Teacher to Year (select from registered teachers)
  - Change Status (Active ↔ Suspended → Left)
  - View Assignments

### Page 4.2: Teacher Assignments

- **Route**: `/school/teachers/:teacherId/assignments`
- **Source**: `TeacherAssignment`
- **Layout**: Data table
- **Columns**: Classroom, Subject, Status (badge), Start Date, End Date, Replaced By, Actions
- **Actions**:
  - Create Assignment (select classroom + subject, must be ACTIVE teacher)
  - Replace Teacher (creates new assignment, marks current as REPLACED)
  - End Assignment
- **Constraints enforced in UI**:
  - Only ONE active assignment per (classroom, subject)
  - Teacher must be ACTIVE in SchoolYearTeacher
  - Show warning if teacher already has conflicting schedule

### Page 4.3: Teacher Workload View

- **Route**: `/school/teachers/:teacherId/workload`
- **Source**: `TeacherAssignment` + `Schedule`
- **Layout**: Weekly calendar grid
- **Shows**: All classes + subjects + time slots for the teacher
- **UX Notes**: Color-coded by subject, conflict detection highlighted in red

---

## Module 5: Student Enrollment (School Admin)

### Page 5.1: Enrollment List

- **Route**: `/school/enrollment`
- **Source**: `StudentEnrollment`
- **Layout**: Data table with rich filters
- **Columns**: Annual ID, Name, Level, Classroom (or "Pre-registered"), Status (badge), Enrollment Date, Actions
- **Filters**: Level, Classroom, Status, Search by name
- **Actions**:
  - Pre-register Student (classroom_id = NULL)
  - Assign to Classroom (for pre-registered)
  - Transfer to Another Classroom
  - Mark as Completed/Dropped
- **Bulk Actions**: Bulk assign to classroom, Bulk status change

### Page 5.2: Pre-Registration

- **Route**: `/school/enrollment/pre-register`
- **Source**: `StudentEnrollment` (status = PRE_REGISTERED)
- **Layout**: Form page
- **Fields**: Student (select or create), First Name, Last Name, Level, Enrollment Date
- **Auto-generated**: annual_identifier, pre_enroll_level_same_name_identifier
- **UX Notes**:
  - Homonym detection: warn if same first+last name exists at same level
  - classroom_id intentionally left NULL
  - Show pending pre-registrations count in sidebar

### Page 5.3: Classroom Assignment

- **Route**: `/school/enrollment/assign`
- **Source**: `StudentEnrollment` where status = PRE_REGISTERED
- **Layout**: Dual-panel: Left = unassigned students list, Right = classroom cards with capacity
- **UX**: Drag-and-drop or select + assign workflow
- **Validation**:
  - Classroom capacity check
  - Level match between student enrollment and classroom
  - Updates identifiers on assignment

### Page 5.4: Transfer Student

- **Route**: Modal from enrollment list
- **Fields**: New Classroom (same level only), Transfer Reason
- **Logic**:
  - Sets `previous_classroom_id`
  - Updates `classroom_id`
  - Updates identifiers
  - Other students in both classes remain UNCHANGED
  - Existing grades stay with original class (historical)

### Page 5.5: Student Profile

- **Route**: `/school/students/:studentId`
- **Source**: `StudentEnrollment` + `StudentAssessment` + `ReportCard`
- **Layout**: Profile page with tabs
- **Tabs**:
  - Overview (name, class, level, status, enrollment dates)
  - Grades (all assessments with scores)
  - Report Cards (per term)
  - Attendance (future feature)
  - History (previous enrollments across years)

---

## Module 6: Schedule Management (School Admin)

### Page 6.1: Timetable Builder

- **Route**: `/school/schedule`
- **Source**: `Schedule` + `SchoolYearCycleTimeSlot` + `TeacherAssignment`
- **Layout**: Weekly calendar grid per classroom
- **Axes**: Rows = Time Slots, Columns = Days (Mon–Sat)
- **Cell Content**: Subject name, Teacher name
- **Actions**:
  - Click empty cell → Create schedule entry (select from active TeacherAssignments for this class)
  - Click filled cell → Edit/Remove
  - Publish (DRAFT → ACTIVE)
- **Validation (real-time)**:
  - No teacher overlap (same teacher, same time, different class)
  - No classroom overlap (same class, same time)
  - Teacher assignment must be ACTIVE
- **UX Notes**:
  - Color-coded by subject
  - Conflict detection with red highlights
  - Filter by classroom or switch classrooms via dropdown

### Page 6.2: Time Slot Configuration

- **Route**: `/school/schedule/time-slots`
- **Source**: `SchoolYearCycleTimeSlot`
- **Layout**: Table per cycle
- **Columns**: Order, Name, Start Time, End Time, Duration, Status, Actions
- **Actions**: Add, Edit (only if unused), Deactivate
- **Validation**: No overlap within same cycle

---

## Module 7: Assessment & Grading (School Admin + Teacher)

### Page 7.1: Assessment Dashboard

- **Route**: `/school/assessments`
- **Source**: `Assessment`
- **Layout**: Data table with term/cycle filters
- **Columns**: Name, Cycle, Term, Type, Date Range, Status (badge), # Subjects, Actions
- **Filters**: Cycle, Term, Status, Assessment Type
- **Actions**:
  - Create Assessment (select cycle, term, type)
  - Change Status (DRAFT → ACTIVE → CLOSED → ARCHIVED)
  - View Subjects

### Page 7.2: Assessment Subjects

- **Route**: `/school/assessments/:assessmentId/subjects`
- **Source**: `AssessmentSubject`
- **Layout**: Data table, grouped by classroom
- **Columns**: Classroom, Subject, Teacher, Exam Date, Max Score, Coefficient, Status, Actions
- **Actions** (only when Assessment is ACTIVE):
  - Create Subject (auto-populates from SchoolYearLevelSubject + TeacherAssignment)
  - Bulk create (generate for all classrooms + subjects in the level)
  - Edit, Change Status (DRAFT → PUBLISHED → CLOSED → ARCHIVED)
- **UX Notes**: Batch creation wizard for efficiency

### Page 7.3: Grade Entry (Teacher Primary View)

- **Route**: `/teacher/grades/:assessmentSubjectId`
- **Source**: `StudentAssessment` + `AssessmentSubject`
- **Layout**: Grade sheet (spreadsheet-like)
- **Columns**: Student Name, Enrollment ID, Raw Score, Status, Absent, Excused, Remark
- **Features**:
  - Inline editing of raw_score
  - Auto-calculate normalized_score based on max_score
  - Absent toggle (clears score, disables input)
  - Excused toggle (only if absent)
  - Batch submit (DRAFT → SUBMITTED)
  - Max score validation (0 ≤ score ≤ max_score)
- **Status indicators**: Draft=pencil, Submitted=clock, Validated=check, Cancelled=x
- **UX Notes**:
  - Tab/Enter to move between cells
  - Visual indicators for absent students
  - Class average shown at bottom
  - Unsaved changes warning

### Page 7.4: Grade Validation (School Admin)

- **Route**: `/school/assessments/:assessmentSubjectId/validate`
- **Source**: `StudentAssessment` where status = SUBMITTED
- **Layout**: Review table
- **Actions**: Validate (SUBMITTED → VALIDATED), Cancel (→ CANCELLED), Send back to Draft
- **UX Notes**: Summary stats (average, min, max, absent count) at top

---

## Module 8: Reporting (School Admin)

### Page 8.1: Report Card Generation

- **Route**: `/school/reports/report-cards`
- **Source**: `ReportCard`
- **Layout**: Filter + action page
- **Filters**: Term, Level, Classroom
- **Actions**:
  - Generate Report Cards (bulk, checks all assessments are CLOSED + grades VALIDATED)
  - View individual report card
  - Finalize (DRAFT → FINAL)
  - Lock (FINAL → LOCKED, with confirmation)
- **Prerequisites check**: Show warning panel if some assessments still open

### Page 8.2: Individual Report Card View

- **Route**: `/school/reports/report-cards/:id`
- **Source**: `ReportCard` + `StudentAssessment` + `SchoolYearLevelSubject`
- **Layout**: Print-ready document layout
- **Content**:
  - Header: School name, Year, Term, Student info
  - Table: Subject, Coefficient, Score (/20), Weighted Score, Teacher
  - Footer: Average, Rank, Decision, Remarks
- **Actions**: Print, Export PDF, Lock

### Page 8.3: Transcript View

- **Route**: `/school/reports/transcripts/:studentId`
- **Source**: `Transcript` + `ReportCard`
- **Layout**: Multi-year academic record
- **Content**: Year-by-year summary with averages, ranks, and decisions
- **Actions**: Generate, Finalize, Lock, Print, Export PDF

### Page 8.4: Statistics Dashboard

- **Route**: `/school/reports/statistics`
- **Source**: Aggregated from `StudentAssessment`, `ReportCard`
- **Layout**: Dashboard with charts
- **Charts**:
  - Pass/Fail rates by level
  - Average scores by subject
  - Score distribution histograms
  - Classroom comparison
  - Term-over-term trends
- **Filters**: Year, Cycle, Level, Classroom, Term

---

## Module 9: Teacher Portal

### Page 9.1: Teacher Dashboard

- **Route**: `/teacher/dashboard`
- **Layout**: Overview cards
- **Cards**:
  - My Classes (count + list)
  - Pending Grades (assessments needing grade entry)
  - Today's Schedule
  - Quick Actions (Enter Grades, View Schedule)

### Page 9.2: My Classes

- **Route**: `/teacher/classes`
- **Source**: `TeacherAssignment` (ACTIVE only)
- **Layout**: Card grid
- **Card Content**: Classroom name, Subject, Level, # Students
- **Click**: Navigate to class detail (student list + grades)

### Page 9.3: My Schedule

- **Route**: `/teacher/schedule`
- **Source**: `Schedule` filtered by teacher
- **Layout**: Weekly calendar grid
- **Cell**: Subject, Classroom, Time

---

## Module 10: Student/Parent Portal

### Page 10.1: Student Dashboard

- **Route**: `/student/dashboard`
- **Cards**: Current Class, Current Average, Next Assessment, Recent Grades

### Page 10.2: My Grades

- **Route**: `/student/grades`
- **Source**: `StudentAssessment` (VALIDATED only)
- **Layout**: Table grouped by term → by subject
- **Columns**: Subject, Assessment Type, Score, Max, Percentage, Date

### Page 10.3: My Report Cards

- **Route**: `/student/report-cards`
- **Source**: `ReportCard` (FINAL or LOCKED only)
- **Layout**: Cards per term, click to view/print

### Page 10.4: My Schedule

- **Route**: `/student/schedule`
- **Source**: `Schedule` filtered by student's classroom
- **Layout**: Weekly calendar grid

---

## Shared UX Patterns

### Cascading Selects Pattern

Used extensively throughout the app. The cascade order is:

```
Country → Region → AdministrativeUnit → Locality → School
School → SchoolYear → SchoolYearCycle → SchoolYearLevel → Classroom
SchoolYearCycle → Term
SchoolYearLevel → Subject (via SchoolYearLevelSubject)
```

### Status Badge Colors

| Status           | Color      | Icon |
| ---------------- | ---------- | ---- |
| DRAFT            | Gray/Slate | ✏️   |
| ACTIVE / CURRENT | Green      | ✅   |
| PUBLISHED        | Blue       | 📢   |
| SUBMITTED        | Amber      | ⏳   |
| VALIDATED        | Emerald    | ✓✓   |
| CLOSED           | Orange     | 🔒   |
| ARCHIVED         | Muted/Gray | 📦   |
| SUSPENDED        | Red        | ⚠️   |
| REPLACED         | Purple     | 🔄   |
| LEFT / ENDED     | Muted      | ⛔   |
| DROPPED          | Red        | ❌   |
| PRE_REGISTERED   | Cyan       | 📋   |
| COMPLETED        | Green      | 🎓   |
| LOCKED           | Dark       | 🔐   |

### Deletion Protection Pattern

Before any delete:

1. Check dependencies
2. If dependencies exist → show warning modal listing what blocks deletion
3. Only soft delete is allowed (set `is_deleted = true`)

### Form Validation Pattern

- Real-time validation as user types
- Uniqueness checks via debounced API calls
- Required field indicators (\*)
- Constraint explanations as helper text
- Form-level validation before submit
- Optimistic UI with rollback on error

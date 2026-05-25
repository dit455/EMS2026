# Examination Marks Software (EMS)

React + Vite frontend for the Examination Marks Software for the Board of Medical Education and the Board of Examination in Nursing, Government of Puducherry.

## DPR Requirement Mapping

| DPR Ref | DPR Module | Requirement | Frontend Implementation |
| --- | --- | --- | --- |
| 1 | Student Module - Basic Details | Entry of student basic details, Excel upload, template download, mobile and email verification links | `pages/student/StudentModule.jsx` basic details form, required validation, template/download controls, contact verification status |
| 2 | Student Module - Basic Details | Upload documents for name, DOB, student ID, and address | Student document upload cards with PDF/JPG/PNG controls and status badges |
| 3 | Student Module - Education Details | Entry/upload of education details with template download | Education details form/table with Excel upload and template actions |
| 4 | Student Module - Education Details | Mandatory PDF upload against every education detail | Education proof upload panel and required document indicator |
| 5 | Student Module - Data Verification | Board-level maker-checker-approver verification, reject, send back, digital signing, list approval | Data verification queue, approval workflow component, DSC confirmation placeholder, list actions |
| 6 | Student Module - Data Verification | Generation of unique Student Registration Number | Registration number generation screen with approved student table |
| 7 | Examination Module - Examination Subjects | Semester-wise subject selection and add/remove subjects with effective dates | Semester subject selection form and mapping table in `pages/examination/ExaminationModule.jsx` |
| 8 | Examination Module - Examination Subjects | Admin subject creation and course mapping with effective start date | Subject creation and course mapping section with effective date fields |
| 9 | Examination Module - Examination Schedule | Schedule creation for course/semester, mid-semester/end-semester date, time, venue, holiday/weekend alerts, approval | Schedule form, holiday alert strip, approval workflow, publishing status |
| 10 | Examination Module - Examination Schedule | Student portal schedule availability and latest schedule download | Published schedule table with download action and active/archived status |
| 11 | Examination Module - Examination Attendance | Mark examination attendance and upload PDF attendance sheet | Attendance marking table and PDF upload control |
| 12 | Examination Module - Examination Attendance | Competent official attendance editing with correction trail | Attendance correction audit trail table |
| 13 | Marks Module - Subject Marks | Total marks, pass marks, internal/external division, effective start date | Subject marks setup form in `pages/marks/MarksModule.jsx` |
| 14 | Marks Module - Subject Marks | Subject mark changes, verification/approval, digital signing, change trail | Change request panel, approval workflow, subject marks audit table |
| 15 | Marks Module - Student Marks | Student marks entry, absent validation, division-wise marks, pass/fail indication, approval | Marks entry grid with absent lock and auto pass/fail indication |
| 16 | Marks Module - Student Marks | Approved marks changes by competent official with digital signature and trail | Marks change audit trail and DSC placeholder |
| 17 | Marks Module - Marks Sheet | Generate marks sheet with reference number, registration number, division rules | Marksheet generation preview and generated reference table |
| 18 | Marks Module - Marks Sheet | Digitally signed marks sheet | Digital signature placeholder in marksheet panel |
| 19 | Marks Module - Marks Sheet | DigiLocker integration | DigiLocker integration placeholder/status card |
| 20 | Admin Module - User Creation | Create users for colleges/boards with staff details and OTP authentication | User creation form, OTP login page, user table |
| 21 | Admin Module - User Creation | Activation/deactivation of users | User activation/deactivation controls and status badges |
| 22 | Admin Module - User Roles | Admin, staff, feature, report, and Super Admin roles | Role management grids in `pages/admin/AdminModule.jsx` |
| 23 | Admin Module - User Mapping | Office hierarchy mapping for task workflows | Office hierarchy mapping table and workflow cards |
| 24 | Admin Module - User Mapping | Modify hierarchy mapping with pending-task checks before removal | Hierarchy modification panel with task availability check |
| 25 | Admin Module - Feature Configuration | Enable/disable features and workflow configurations | Feature configuration toggles |
| 26 | Admin Module - Feature Configuration | Super Admin authenticated release of new features | Release authentication panel |
| 27 | MIS Module - Student Reports | College, course, age, region, and year-wise student reports | Student report cards and report table in `pages/mis/MisModule.jsx` |
| 28 | MIS Module - Examination Reports | College, course, attendance, year-wise attendance, and postponement reports | Examination reports table and filters |
| 29 | MIS Module - Marks Reports | Pass/fail, division, distribution, trend reports by college/course/student | Marks reports table with download actions |
| 30 | Data Migration - Metadata Consolidation | Study and consolidate metadata, constraints, and validations | Metadata consolidation status card in `pages/migration/MigrationModule.jsx` |
| 31 | Data Migration - Metadata Consolidation | Create database tables from consolidated metadata | Metadata-derived table creation status |
| 32 | Data Migration - Data Cleaning | Clean invalid, blank, incomplete, and duplicate data with trail | Data cleaning checklist and audit status |
| 33 | Data Migration - Data Import | Import clean data into separate staging schema with constraints | Data import status table |
| 34 | Data Migration - Data Integration | Integrate imported data table-by-table into main database with audit | Data integration progress and audit table |

## Active Frontend Structure

```text
src/
  components/
  layouts/
  pages/
    dashboard/
    student/
    examination/
    marks/
    admin/
    mis/
    migration/
  routes/
  services/
  data/
  utils/
  styles/
```

## Run

```bash
npm run dev
npm run build
```

-- ============================================================
--  EXAMINATION MODULE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS course_term_subjects (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  course_id           INT NOT NULL,
  term_id             INT NOT NULL,
  subject_id          INT NOT NULL,
  effective_start_date DATE NOT NULL,
  effective_end_date  DATE NULL,
  is_active           BOOLEAN DEFAULT TRUE,
  created_by          INT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS holidays (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  holiday_date  DATE NOT NULL,
  holiday_name  VARCHAR(100),
  holiday_type  ENUM('general','reserved','weekend')
);

CREATE TABLE IF NOT EXISTS exam_schedules (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  course_id    INT NOT NULL,
  term_id      INT NOT NULL,
  subject_id   INT NOT NULL,
  exam_type    ENUM('midterm','endterm') NOT NULL,
  exam_date    DATE NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  venue        VARCHAR(200),
  status       ENUM('draft','pending_approval','approved','published','disabled') DEFAULT 'draft',
  approved_by  INT NULL,
  approved_at  TIMESTAMP NULL,
  published_at TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_attendance (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  exam_schedule_id  INT NOT NULL,
  student_id        INT NOT NULL,
  is_present        BOOLEAN DEFAULT FALSE,
  attendance_pdf_path VARCHAR(500) NULL,
  is_confirmed      BOOLEAN DEFAULT FALSE,
  confirmed_by      INT NULL,
  confirmed_at      TIMESTAMP NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (exam_schedule_id, student_id)
);

CREATE TABLE IF NOT EXISTS exam_attendance_audit (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  attendance_id   INT NOT NULL,
  old_is_present  BOOLEAN,
  new_is_present  BOOLEAN,
  edited_by       INT NOT NULL,
  edit_reason     TEXT,
  edited_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  MARKS MODULE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS subject_mark_config (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  subject_id          INT NOT NULL,
  course_id           INT NOT NULL,
  term_id             INT NOT NULL,
  division_name       VARCHAR(100) NOT NULL,
  max_marks           INT NOT NULL,
  pass_marks          INT NOT NULL,
  pass_mark_level     ENUM('division','subject') DEFAULT 'subject',
  total_marks         INT NOT NULL,
  effective_start_date DATE NOT NULL,
  is_active           BOOLEAN DEFAULT TRUE,
  created_by          INT
);

CREATE TABLE IF NOT EXISTS subject_mark_config_audit (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  config_id           INT NOT NULL,
  old_max_marks       INT,
  new_max_marks       INT,
  old_pass_marks      INT,
  new_pass_marks      INT,
  effective_start_date DATE,
  changed_by          INT NOT NULL,
  digital_signature   TEXT,
  change_reason       TEXT,
  changed_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_marks (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  exam_schedule_id  INT NOT NULL,
  student_id        INT NOT NULL,
  subject_id        INT NOT NULL,
  division_name     VARCHAR(100) NOT NULL,
  marks_obtained    DECIMAL(5,2) NOT NULL,
  is_pass           BOOLEAN NULL,
  status            ENUM('draft','pending_approval','approved') DEFAULT 'draft',
  approved_by       INT NULL,
  digital_signature TEXT NULL,
  approved_at       TIMESTAMP NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_mark (exam_schedule_id, student_id, subject_id, division_name)
);

CREATE TABLE IF NOT EXISTS student_marks_audit (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  marks_id          INT NOT NULL,
  old_marks         DECIMAL(5,2),
  new_marks         DECIMAL(5,2),
  edited_by         INT NOT NULL,
  digital_signature TEXT NOT NULL,
  edit_reason       TEXT,
  edited_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marksheets (
  id                    INT PRIMARY KEY AUTO_INCREMENT,
  reference_number      VARCHAR(50) UNIQUE,
  student_id            INT NOT NULL,
  course_id             INT NOT NULL,
  term_id               INT NOT NULL,
  exam_id               INT NOT NULL,
  total_marks_obtained  DECIMAL(6,2),
  total_max_marks       INT,
  percentage            DECIMAL(5,2),
  grade_division        ENUM('Distinction','First Class','Second Class','Third Class','Fail'),
  is_digitally_signed   BOOLEAN DEFAULT FALSE,
  signed_by             INT NULL,
  digital_signature     TEXT NULL,
  pdf_path              VARCHAR(500),
  digilocker_doc_id     VARCHAR(200) NULL,
  generated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

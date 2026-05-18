from database import query_db, execute_db

# ---------- Subject Mark Config ----------

def get_subject_mark_config(subject_id, course_id, term_id):
    return query_db(
        """SELECT * FROM subject_mark_config
           WHERE subject_id=%s AND course_id=%s AND term_id=%s AND is_active=1""",
        (subject_id, course_id, term_id)
    )

def create_subject_mark_config(data):
    return execute_db(
        """INSERT INTO subject_mark_config
           (subject_id, course_id, term_id, division_name, max_marks, pass_marks,
            pass_mark_level, total_marks, effective_start_date, created_by)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (data['subject_id'], data['course_id'], data['term_id'],
         data['division_name'], data['max_marks'], data['pass_marks'],
         data.get('pass_mark_level', 'subject'), data['total_marks'],
         data['effective_start_date'], data['created_by'])
    )

def update_subject_mark_config(config_id, data, changed_by, signature, reason):
    old = query_db("SELECT * FROM subject_mark_config WHERE id=%s", (config_id,), one=True)
    if not old:
        return None, 'Config not found'

    execute_db(
        """INSERT INTO subject_mark_config_audit
           (config_id, old_max_marks, new_max_marks, old_pass_marks, new_pass_marks,
            effective_start_date, changed_by, digital_signature, change_reason)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (config_id, old['max_marks'], data.get('max_marks', old['max_marks']),
         old['pass_marks'], data.get('pass_marks', old['pass_marks']),
         data.get('effective_start_date'), changed_by, signature, reason)
    )

    execute_db(
        """UPDATE subject_mark_config
           SET max_marks=%s, pass_marks=%s, effective_start_date=%s WHERE id=%s""",
        (data.get('max_marks', old['max_marks']),
         data.get('pass_marks', old['pass_marks']),
         data.get('effective_start_date'), config_id)
    )
    return config_id, None

def get_config_audit(config_id):
    return query_db(
        "SELECT * FROM subject_mark_config_audit WHERE config_id=%s ORDER BY changed_at DESC",
        (config_id,)
    )

# ---------- Student Marks ----------

def is_student_present(exam_schedule_id, student_id):
    from database import query_db
    record = query_db(
        "SELECT is_present FROM exam_attendance WHERE exam_schedule_id=%s AND student_id=%s",
        (exam_schedule_id, student_id), one=True
    )
    return record and record['is_present']

def save_student_mark(data):
    return execute_db(
        """INSERT INTO student_marks
           (exam_schedule_id, student_id, subject_id, division_name, marks_obtained, is_pass)
           VALUES (%s,%s,%s,%s,%s,%s)
           ON DUPLICATE KEY UPDATE marks_obtained=%s, is_pass=%s""",
        (data['exam_schedule_id'], data['student_id'], data['subject_id'],
         data['division_name'], data['marks_obtained'], data.get('is_pass'),
         data['marks_obtained'], data.get('is_pass'))
    )

def get_marks_for_exam(exam_schedule_id, subject_id=None):
    if subject_id:
        return query_db(
            "SELECT * FROM student_marks WHERE exam_schedule_id=%s AND subject_id=%s",
            (exam_schedule_id, subject_id)
        )
    return query_db(
        "SELECT * FROM student_marks WHERE exam_schedule_id=%s", (exam_schedule_id,)
    )

def get_student_marks(exam_schedule_id, student_id):
    return query_db(
        "SELECT * FROM student_marks WHERE exam_schedule_id=%s AND student_id=%s",
        (exam_schedule_id, student_id)
    )

def approve_student_marks(exam_schedule_id, student_id, approved_by, signature):
    execute_db(
        """UPDATE student_marks
           SET status='approved', approved_by=%s, digital_signature=%s, approved_at=NOW()
           WHERE exam_schedule_id=%s AND student_id=%s""",
        (approved_by, signature, exam_schedule_id, student_id)
    )

def update_student_mark(marks_id, new_marks, edited_by, signature, reason):
    old = query_db("SELECT * FROM student_marks WHERE id=%s", (marks_id,), one=True)
    if not old:
        return None, 'Mark not found'

    execute_db(
        """INSERT INTO student_marks_audit
           (marks_id, old_marks, new_marks, edited_by, digital_signature, edit_reason)
           VALUES (%s,%s,%s,%s,%s,%s)""",
        (marks_id, old['marks_obtained'], new_marks, edited_by, signature, reason)
    )
    execute_db(
        "UPDATE student_marks SET marks_obtained=%s WHERE id=%s", (new_marks, marks_id)
    )
    return marks_id, None

def get_marks_audit(marks_id):
    return query_db(
        "SELECT * FROM student_marks_audit WHERE marks_id=%s ORDER BY edited_at DESC",
        (marks_id,)
    )

# ---------- Marksheet ----------

def create_marksheet(data):
    return execute_db(
        """INSERT INTO marksheets
           (reference_number, student_id, course_id, term_id, exam_id,
            total_marks_obtained, total_max_marks, percentage, grade_division, pdf_path)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (data['reference_number'], data['student_id'], data['course_id'],
         data['term_id'], data['exam_id'], data['total_marks_obtained'],
         data['total_max_marks'], data['percentage'], data['grade_division'],
         data.get('pdf_path', ''))
    )

def get_marksheet(student_id, exam_id):
    return query_db(
        "SELECT * FROM marksheets WHERE student_id=%s AND exam_id=%s",
        (student_id, exam_id), one=True
    )

def sign_marksheet(marksheet_id, signed_by, signature):
    execute_db(
        """UPDATE marksheets
           SET is_digitally_signed=1, signed_by=%s, digital_signature=%s WHERE id=%s""",
        (signed_by, signature, marksheet_id)
    )

def update_digilocker_id(marksheet_id, doc_id):
    execute_db(
        "UPDATE marksheets SET digilocker_doc_id=%s WHERE id=%s", (doc_id, marksheet_id)
    )

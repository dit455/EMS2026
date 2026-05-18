from database import query_db, execute_db

def get_subjects_for_term(course_id, term_id):
    return query_db(
        "SELECT * FROM course_term_subjects WHERE course_id=%s AND term_id=%s AND is_active=1",
        (course_id, term_id)
    )

def add_subject_to_term(data):
    return execute_db(
        """INSERT INTO course_term_subjects
           (course_id, term_id, subject_id, effective_start_date, created_by)
           VALUES (%s,%s,%s,%s,%s)""",
        (data['course_id'], data['term_id'], data['subject_id'],
         data['effective_start_date'], data['created_by'])
    )

def remove_subject_from_term(subject_id, effective_end_date):
    return execute_db(
        "UPDATE course_term_subjects SET effective_end_date=%s, is_active=0 WHERE id=%s",
        (effective_end_date, subject_id)
    )

def get_schedule(course_id, term_id):
    return query_db(
        "SELECT * FROM exam_schedules WHERE course_id=%s AND term_id=%s",
        (course_id, term_id)
    )

def get_schedule_by_id(schedule_id):
    return query_db(
        "SELECT * FROM exam_schedules WHERE id=%s", (schedule_id,), one=True
    )

def create_schedule(data):
    return execute_db(
        """INSERT INTO exam_schedules
           (course_id, term_id, subject_id, exam_type, exam_date, start_time, end_time, venue)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
        (data['course_id'], data['term_id'], data['subject_id'], data['exam_type'],
         data['exam_date'], data['start_time'], data['end_time'], data['venue'])
    )

def update_schedule_status(schedule_id, status, user_id=None):
    if status == 'approved':
        execute_db(
            "UPDATE exam_schedules SET status=%s, approved_by=%s, approved_at=NOW() WHERE id=%s",
            (status, user_id, schedule_id)
        )
    elif status == 'published':
        execute_db(
            "UPDATE exam_schedules SET status=%s, published_at=NOW() WHERE id=%s",
            (status, schedule_id)
        )
    else:
        execute_db(
            "UPDATE exam_schedules SET status=%s WHERE id=%s",
            (status, schedule_id)
        )

def disable_old_schedules(course_id, term_id):
    execute_db(
        "UPDATE exam_schedules SET status='disabled' WHERE course_id=%s AND term_id=%s AND status='published'",
        (course_id, term_id)
    )

def get_attendance(exam_schedule_id):
    return query_db(
        "SELECT * FROM exam_attendance WHERE exam_schedule_id=%s",
        (exam_schedule_id,)
    )

def get_student_attendance(exam_schedule_id, student_id):
    return query_db(
        "SELECT * FROM exam_attendance WHERE exam_schedule_id=%s AND student_id=%s",
        (exam_schedule_id, student_id), one=True
    )

def upsert_attendance(exam_schedule_id, student_id, is_present):
    existing = get_student_attendance(exam_schedule_id, student_id)
    if existing:
        return execute_db(
            "UPDATE exam_attendance SET is_present=%s WHERE exam_schedule_id=%s AND student_id=%s",
            (is_present, exam_schedule_id, student_id)
        )
    return execute_db(
        "INSERT INTO exam_attendance (exam_schedule_id, student_id, is_present) VALUES (%s,%s,%s)",
        (exam_schedule_id, student_id, is_present)
    )

def save_attendance_audit(attendance_id, old_val, new_val, edited_by, reason):
    execute_db(
        """INSERT INTO exam_attendance_audit
           (attendance_id, old_is_present, new_is_present, edited_by, edit_reason)
           VALUES (%s,%s,%s,%s,%s)""",
        (attendance_id, old_val, new_val, edited_by, reason)
    )

def get_attendance_audit(attendance_id):
    return query_db(
        "SELECT * FROM exam_attendance_audit WHERE attendance_id=%s ORDER BY edited_at DESC",
        (attendance_id,)
    )

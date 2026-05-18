from datetime import datetime

def calculate_grade(percentage):
    if percentage > 80:
        return 'Distinction'
    elif percentage >= 60:
        return 'First Class'
    elif percentage >= 45:
        return 'Second Class'
    elif percentage >= 35:
        return 'Third Class'
    else:
        return 'Fail'

def calculate_pass_fail(marks_list, config_list, pass_mark_level):
    if pass_mark_level == 'division':
        for mark in marks_list:
            cfg = next((c for c in config_list if c['division_name'] == mark['division_name']), None)
            if cfg and mark['marks_obtained'] < cfg['pass_marks']:
                return False
        return True
    else:
        total_obtained = sum(m['marks_obtained'] for m in marks_list)
        total_pass     = sum(c['pass_marks'] for c in config_list)
        return total_obtained >= total_pass

def generate_marksheet_ref(course_id, term_id, registration_number):
    year = datetime.now().year
    return f"MS-{course_id:03d}-{term_id:02d}-{year}-{registration_number}"

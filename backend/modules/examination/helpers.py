from database import query_db
from datetime import date

def check_holiday_conflict(exam_date_str):
    exam_date = date.fromisoformat(exam_date_str)

    # Check weekend
    if exam_date.weekday() >= 5:
        day_name = "Saturday" if exam_date.weekday() == 5 else "Sunday"
        return {"warning": True, "reason": f"Date falls on a {day_name} (weekend)"}

    # Check holiday table
    holiday = query_db(
        "SELECT * FROM holidays WHERE holiday_date = %s", (exam_date_str,), one=True
    )
    if holiday:
        return {"warning": True, "reason": f"Date is a {holiday['holiday_type']} holiday: {holiday['holiday_name']}"}

    return {"warning": False, "reason": None}

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import os

def generate_marksheet_pdf(marksheet_data, marks_details, student_info, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    # Header
    elements.append(Paragraph("MARKSHEET", styles['Title']))
    elements.append(Spacer(1, 0.5 * cm))

    # Student info table
    info_data = [
        ["Reference No.", marksheet_data['reference_number']],
        ["Registration No.", student_info.get('registration_number', '')],
        ["Student Name", student_info.get('name', '')],
        ["Course", student_info.get('course_name', '')],
        ["Term", student_info.get('term_name', '')],
    ]
    info_table = Table(info_data, colWidths=[5 * cm, 10 * cm])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 0.5 * cm))

    # Marks table
    marks_header = ["Subject", "Division", "Max Marks", "Marks Obtained", "Result"]
    marks_rows = [marks_header]
    for m in marks_details:
        marks_rows.append([
            m.get('subject_name', ''),
            m.get('division_name', ''),
            str(m.get('max_marks', '')),
            str(m.get('marks_obtained', '')),
            "Pass" if m.get('is_pass') else "Fail"
        ])

    marks_table = Table(marks_rows, colWidths=[5 * cm, 3.5 * cm, 3 * cm, 3.5 * cm, 2.5 * cm])
    marks_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f2f3f4')]),
    ]))
    elements.append(marks_table)
    elements.append(Spacer(1, 0.5 * cm))

    # Summary
    summary_data = [
        ["Total Marks", f"{marksheet_data['total_marks_obtained']} / {marksheet_data['total_max_marks']}"],
        ["Percentage", f"{marksheet_data['percentage']:.2f}%"],
        ["Grade", marksheet_data['grade_division']],
    ]
    summary_table = Table(summary_data, colWidths=[5 * cm, 10 * cm])
    summary_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 1 * cm))

    # Digital signature note
    if marksheet_data.get('is_digitally_signed'):
        elements.append(Paragraph(
            "This marksheet is digitally signed by the competent authority.",
            styles['Italic']
        ))

    doc.build(elements)
    return output_path

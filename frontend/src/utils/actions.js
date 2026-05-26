export function scrollToSection(id) {
  const node = document.getElementById(id);
  if (!node) return false;
  node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

export function downloadTextFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadStudentTemplate() {
  downloadTextFile(
    'MTPG_RIHS_Student_Registration_Template.csv',
    [
      'Student Name,Date of Birth,Email ID,Mobile Number,Student ID,Father Name,Mother Name,Address,Place of Residence,State,Pin Code',
      'Sample Student,2000-01-01,student@example.com,9876543210,STU-001,Parent One,Parent Two,Indira Nagar,Puducherry,Puducherry,605006',
    ].join('\n'),
    'text/csv;charset=utf-8',
  );
}

export function downloadEducationTemplate() {
  downloadTextFile(
    'MTPG_RIHS_Education_Details_Template.csv',
    [
      'Education Level,Board / Exam Name,School / College Name,School / College Address,Place,Pin Code,Year Of Passing,Total Marks,Marks Obtained,Percentage,Student Registration Number,Certificate Serial Number,Mandatory PDF File Name',
      'X,State Board,Government Higher Secondary School,Indira Nagar,Puducherry,605006,2022,500,440,88.00,REG-X-2022-001,CERT-X-001,x-certificate.pdf',
      'XII,State Board,Government Higher Secondary School,Indira Nagar,Puducherry,605006,2024,600,522,87.00,REG-XII-2024-001,CERT-XII-001,xii-certificate.pdf',
      'Other,Recognised University,Example College,College Road,Puducherry,605006,2025,1000,820,82.00,REG-UG-2025-001,CERT-UG-001,other-qualification.pdf',
    ].join('\n'),
    'text/csv;charset=utf-8',
  );
}

export function downloadGuidelines() {
  downloadTextFile(
    'MTPG_RIHS_Student_Registration_Guidelines.txt',
    [
      'MTPG & RIHS Student Registration Guidelines',
      '',
      '1. Complete basic details with valid email and mobile number.',
      '2. Enter education details exactly as shown in certificates.',
      '3. Upload only PDF, JPG, JPEG, or PNG files.',
      '4. Review all details before final submission.',
      '5. College or board officials will verify the submitted application.',
    ].join('\n'),
  );
}

export function downloadExamSchedule() {
  downloadTextFile(
    'MTPG_RIHS_Examination_Schedule.txt',
    [
      'MTPG & RIHS Examination Schedule',
      '',
      'Published schedule placeholder for public student download.',
      'Course: B.Sc. Nursing',
      'Semester: Semester 1',
      'Exam Window: 01-Aug-2026 to 14-Aug-2026',
      'Students should verify final dates from official notifications.',
    ].join('\n'),
  );
}

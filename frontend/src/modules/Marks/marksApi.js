import axios from 'axios';

const BASE = '/api/marks';

export const getSubjectConfig    = (subjectId, courseId, termId) => axios.get(`${BASE}/subject-config`, { params: { subject_id: subjectId, course_id: courseId, term_id: termId } });
export const createSubjectConfig = (data)                         => axios.post(`${BASE}/subject-config`, data);
export const updateSubjectConfig = (id, data)                     => axios.put(`${BASE}/subject-config/${id}`, data);
export const getConfigAudit      = (id)                           => axios.get(`${BASE}/subject-config/${id}/audit`);

export const enterStudentMarks   = (data)                         => axios.post(`${BASE}/student`, data);
export const getExamMarks        = (examScheduleId, subjectId)    => axios.get(`${BASE}/student/exam/${examScheduleId}`, { params: { subject_id: subjectId } });
export const approveMarks        = (examScheduleId, studentId, payload) => axios.put(`${BASE}/student/${examScheduleId}/${studentId}/approve`, payload);
export const editMark            = (marksId, data)                => axios.put(`${BASE}/student/${marksId}`, data);
export const getMarksAudit       = (marksId)                      => axios.get(`${BASE}/student/${marksId}/audit`);

export const generateMarksheet   = (data)                         => axios.post(`${BASE}/marksheet/generate`, data);
export const signMarksheet       = (id, data)                     => axios.put(`${BASE}/marksheet/${id}/sign`, data);
export const getMarksheet        = (studentId, examId)            => axios.get(`${BASE}/marksheet/${studentId}/${examId}`);
export const downloadPDF         = (marksheetId)                  => axios.get(`${BASE}/marksheet/${marksheetId}/pdf`, { responseType: 'blob' });
export const pushToDigilocker    = (marksheetId)                  => axios.post(`${BASE}/marksheet/${marksheetId}/digilocker`);

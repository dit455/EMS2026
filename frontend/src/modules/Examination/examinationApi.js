import axios from 'axios';

const BASE = '/api/examination';

export const getSubjects      = (courseId, termId) => axios.get(`${BASE}/subjects`, { params: { course_id: courseId, term_id: termId } });
export const addSubject       = (data)              => axios.post(`${BASE}/subjects`, data);
export const removeSubject    = (id, effectiveEnd)  => axios.put(`${BASE}/subjects/${id}/remove`, { effective_end_date: effectiveEnd });

export const getSchedule      = (courseId, termId)  => axios.get(`${BASE}/schedule`, { params: { course_id: courseId, term_id: termId } });
export const createSchedule   = (data)              => axios.post(`${BASE}/schedule`, data);
export const submitApproval   = (id)                => axios.put(`${BASE}/schedule/${id}/submit-approval`);
export const approveSchedule  = (id, userId)        => axios.put(`${BASE}/schedule/${id}/approve`, { approved_by: userId });
export const publishSchedule  = (id)                => axios.put(`${BASE}/schedule/${id}/publish`);
export const downloadSchedule = (courseId, termId)  => axios.get(`${BASE}/schedule/download`, { params: { course_id: courseId, term_id: termId } });
export const checkHoliday     = (date)              => axios.get(`${BASE}/holidays`, { params: { date } });

export const getAttendance    = (examScheduleId)    => axios.get(`${BASE}/attendance/${examScheduleId}`);
export const markBulkAttendance = (data)            => axios.post(`${BASE}/attendance/bulk`, data);
export const editAttendance   = (id, payload)       => axios.put(`${BASE}/attendance/${id}/edit`, payload);
export const getAttendanceAudit = (id)              => axios.get(`${BASE}/attendance/${id}/audit`);

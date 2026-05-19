import axios from 'axios';

// These URLs must match your teammates' actual Flask blueprint prefixes
export const getStudents = (courseId, termId) =>
  axios.get('/api/students', { params: { course_id: courseId, term_id: termId } });

export const getCourses = () =>
  axios.get('/api/courses');

export const getTerms = (courseId) =>
  axios.get('/api/terms', { params: { course_id: courseId } });

export const getSubjects = (courseId, termId) =>
  axios.get('/api/subjects', { params: { course_id: courseId, term_id: termId } });

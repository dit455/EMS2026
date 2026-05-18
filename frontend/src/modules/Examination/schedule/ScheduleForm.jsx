import React, { useState } from 'react';
import { createSchedule, checkHoliday } from '../examinationApi';
import HolidayAlert from './HolidayAlert';

export default function ScheduleForm({ courseId, termId, onSuccess }) {
  const [form, setForm] = useState({
    subject_id: '', exam_type: 'endterm',
    exam_date: '', start_time: '', end_time: '', venue: ''
  });
  const [holidayWarning, setHolidayWarning] = useState(null);

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setForm({ ...form, exam_date: date });
    if (date) {
      const res = await checkHoliday(date);
      setHolidayWarning(res.data.warning ? res.data.reason : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createSchedule({ ...form, course_id: courseId, term_id: termId });
      alert(`Schedule created. ${res.data.holiday_warning?.warning ? 'WARNING: ' + res.data.holiday_warning.reason : ''}`);
      setForm({ subject_id: '', exam_type: 'endterm', exam_date: '', start_time: '', end_time: '', venue: '' });
      setHolidayWarning(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create schedule');
    }
  };

  return (
    <div>
      <h3>Create Examination Schedule</h3>
      {holidayWarning && <HolidayAlert message={holidayWarning} />}
      <form onSubmit={handleSubmit}>
        <div><label>Subject ID:</label>
          <input type="number" value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} required /></div>
        <div><label>Exam Type:</label>
          <select value={form.exam_type} onChange={(e) => setForm({ ...form, exam_type: e.target.value })}>
            <option value="midterm">Mid-Term</option>
            <option value="endterm">End-Term</option>
          </select></div>
        <div><label>Exam Date:</label>
          <input type="date" value={form.exam_date} onChange={handleDateChange} required /></div>
        <div><label>Start Time:</label>
          <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required /></div>
        <div><label>End Time:</label>
          <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required /></div>
        <div><label>Venue:</label>
          <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required /></div>
        <button type="submit">Save Schedule</button>
      </form>
    </div>
  );
}

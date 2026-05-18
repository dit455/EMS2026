import React, { useState } from 'react';
import axios from 'axios';

export default function AttendancePDFUpload({ examScheduleId }) {
  const [file, setFile]       = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a PDF file');
    if (!file.name.endsWith('.pdf')) return alert('Only PDF files are allowed');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_schedule_id', examScheduleId);

    setUploading(true);
    try {
      await axios.post('/api/examination/attendance/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('PDF uploaded successfully');
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h4>Upload Attendance Sheet (PDF)</h4>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
}

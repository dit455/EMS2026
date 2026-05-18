import React, { useEffect, useState } from 'react';
import { getMarksheet, generateMarksheet, signMarksheet, pushToDigilocker, downloadPDF } from '../marksApi';

export default function MarksheetView({ studentId, examId, examScheduleId, courseId, termId, currentUserId }) {
  const [sheet, setSheet]       = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => { fetchSheet(); }, [studentId, examId]);

  const fetchSheet = async () => {
    try {
      const res = await getMarksheet(studentId, examId);
      setSheet(res.data);
    } catch {
      setSheet(null);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await generateMarksheet({ student_id: studentId, exam_id: examId, exam_schedule_id: examScheduleId, course_id: courseId, term_id: termId });
      fetchSheet();
    } catch (err) {
      alert(err.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    const sig = prompt('Enter digital signature:');
    if (!sig) return;
    await signMarksheet(sheet.id, { signed_by: currentUserId, digital_signature: sig });
    fetchSheet();
  };

  const handleDownload = async () => {
    const res = await downloadPDF(sheet.id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a   = document.createElement('a');
    a.href = url;
    a.download = `marksheet_${sheet.reference_number}.pdf`;
    a.click();
  };

  const handleDigilocker = async () => {
    await pushToDigilocker(sheet.id);
    alert('Pushed to Digilocker successfully');
    fetchSheet();
  };

  const gradeColor = { Distinction: '#6f42c1', 'First Class': '#0d6efd', 'Second Class': '#198754', 'Third Class': '#fd7e14', Fail: '#dc3545' };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h3>Marksheet</h3>

      {!sheet ? (
        <div>
          <p>No marksheet generated yet.</p>
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Marksheet'}
          </button>
        </div>
      ) : (
        <div style={{ border: '2px solid #dee2e6', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div><strong>Ref No:</strong> {sheet.reference_number}</div>
            <div style={{ background: gradeColor[sheet.grade_division] || '#6c757d', color: '#fff', padding: '4px 12px', borderRadius: '4px' }}>
              {sheet.grade_division}
            </div>
          </div>

          <table style={{ width: '100%', marginBottom: '16px' }}>
            <tbody>
              <tr><td><strong>Total Marks</strong></td><td>{sheet.total_marks_obtained} / {sheet.total_max_marks}</td></tr>
              <tr><td><strong>Percentage</strong></td><td>{parseFloat(sheet.percentage).toFixed(2)}%</td></tr>
              <tr><td><strong>Digitally Signed</strong></td><td>{sheet.is_digitally_signed ? '✅ Yes' : '❌ No'}</td></tr>
              <tr><td><strong>Digilocker</strong></td><td>{sheet.digilocker_doc_id || 'Not pushed yet'}</td></tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleDownload}>Download PDF</button>
            {!sheet.is_digitally_signed && <button onClick={handleSign}>Digitally Sign</button>}
            {sheet.is_digitally_signed && !sheet.digilocker_doc_id && (
              <button onClick={handleDigilocker}>Push to Digilocker</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

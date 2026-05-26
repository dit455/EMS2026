import React from 'react';
import { Card, DataTable, FilterBar, PageHeader } from '../../components/ui';
import { colleges, courses, regions, terms, years } from '../../data/referenceData';
import { reports } from '../../data/mockData';
import { downloadTextFile } from '../../utils/actions';

const filters = [
  { label: 'College', name: 'college', options: colleges },
  { label: 'Course', name: 'course', options: courses },
  { label: 'Term', name: 'term', options: terms },
  { label: 'Year', name: 'year', options: years },
  { label: 'Region', name: 'region', options: regions },
];

const reportCatalog = {
  'Student Reports': [
    ['College-wise enrollment', 'College, course, year, region', 'Download Excel / PDF'],
    ['Course-wise enrollment', 'Course, year, college', 'Download Excel / PDF'],
    ['Age-wise distribution', 'College, course, age band, year', 'Download Excel / PDF'],
    ['Region-wise distribution', 'Region, college, course, year', 'Download Excel / PDF'],
    ['Year-wise enrollment', 'Admission year, college, course', 'Download Excel / PDF'],
  ],
  'Examination Reports': [
    ['College-wise exam report', 'College, course, semester, subject', 'Download Excel / PDF'],
    ['Course-wise exam report', 'Course, semester, subject, year', 'Download Excel / PDF'],
    ['Attendance reports', 'College, course, semester, subject', 'Download Excel / PDF'],
    ['Year-wise attendance', 'Year, college, course, semester', 'Download Excel / PDF'],
    ['Exam postponement report', 'Course, semester, date range, reason', 'Download PDF'],
  ],
  'Marks Reports': [
    ['Pass/Fail reports', 'College, course, semester, subject', 'Download Excel / PDF'],
    ['Division reports', 'Distinction, first, second, third, fail', 'Download Excel / PDF'],
    ['Marks distribution', 'Subject, course, marks band', 'Download Excel / PDF'],
    ['Student marks trends', 'Registration number, semester, year', 'Download PDF'],
    ['Course-wise performance reports', 'Course, semester, pass percentage', 'Download Excel / PDF'],
  ],
};

export default function MisModule() {
  return (
    <div className="ems-page-stack">
      <PageHeader
        title="MIS Module"
        description="Workflow 4.5: student reports, examination reports, marks reports, filters by college/course/term/year/region, and report downloads."
      />

      <Card title="Report Filters" subtitle="Apply official filters before generating student, examination, or marks reports." icon="filter">
        <FilterBar filters={filters} />
      </Card>

      <div className="ems-report-grid">
        {[
          ['Student Reports', 'College-wise, course-wise, age-wise, region-wise, and year-wise enrollment.'],
          ['Examination Reports', 'College-wise, course-wise, attendance, year-wise attendance, and postponement reports.'],
          ['Marks Reports', 'Pass/fail, division, marks distribution, student trends, and course performance.'],
        ].map(([title, detail]) => (
          <Card key={title} title={title} icon="barChart">
            <p className="ems-card-copy">{detail}</p>
            <div className="ems-action-row">
              <button className="ems-btn ems-btn-secondary" type="button" onClick={() => downloadTextFile(`${title.replace(/\s+/g, '-')}.csv`, `${title}\n${detail}`, 'text/csv;charset=utf-8')}>Download Excel</button>
              <button className="ems-btn ems-btn-secondary" type="button" onClick={() => downloadTextFile(`${title.replace(/\s+/g, '-')}.txt`, `${title}\n${detail}`)}>Download PDF</button>
            </div>
          </Card>
        ))}
      </div>

      {Object.entries(reportCatalog).map(([title, rows]) => (
        <Card key={title} title={`${title} Catalog`} subtitle="Requirement-ready report list with official filters and export actions." icon="fileText">
          <DataTable columns={['Report Name', 'Filters', 'Download']} rows={rows} />
        </Card>
      ))}

      <Card title="Available Reports" subtitle="Official report previews with download actions." icon="fileText">
        <DataTable columns={['Report Type', 'Report Name', 'Filters', 'Download']} rows={reports} />
      </Card>
    </div>
  );
}

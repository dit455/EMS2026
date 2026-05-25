export const dataMigrationModel = {
  dprSection: 'Workflow 4.6 Data Migration',
  requirements: [
    { ref: 30, title: 'Consolidate existing database metadata', screen: 'Metadata Consolidation', complexity: 'Medium' },
    { ref: 31, title: 'Create database tables from metadata', screen: 'Metadata Consolidation', complexity: 'Low', manDays: 6 },
    { ref: 32, title: 'Clean existing data with audit trail', screen: 'Data Cleaning', complexity: 'Medium', manDays: 10 },
    { ref: 33, title: 'Import clean data into staging schema', screen: 'Data Import', complexity: 'High', manDays: 16 },
    { ref: 34, title: 'Integrate imported data into main database', screen: 'Data Integration', complexity: 'Medium', manDays: 20 },
  ],
  stages: [
    'Consolidation of metadata, constraints and validations',
    'Creation of staging tables based on consolidated metadata',
    'Cleaning of incomplete, inconsistent and repetitive data',
    'Import into separate database schema',
    'Table-wise integration into main database with documented results',
  ],
};

export const migrationRows = [
  ['Metadata Consolidation', 'Tables, constraints, validations', 'Consolidated', 'Audit notes ready'],
  ['Database Table Creation', 'Staging schema', 'Ready', '6 man-days'],
  ['Data Cleaning', 'Incomplete, inconsistent, repetitive data', 'Pending', 'Cleaning trail required'],
  ['Data Import', 'Separate database schema', 'Pending', 'Relations and constraints checked'],
  ['Data Integration', 'Main EMS database', 'Pending', 'Table-wise verification'],
];

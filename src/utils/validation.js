export function validateRequired(values, fields) {
  return fields.reduce((errors, field) => {
    const value = values[field.name];
    if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
      errors[field.name] = `${field.label} is required`;
    }
    return errors;
  }, {});
}

export function isHolidayOrWeekend(dateValue) {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  const day = date.getDay();
  const fixedHolidays = ['2026-01-26', '2026-08-15', '2026-10-02'];
  return day === 0 || day === 6 || fixedHolidays.includes(dateValue);
}

export function getDivision(percentage) {
  const value = Number(percentage);
  if (Number.isNaN(value)) return 'Pending';
  if (value > 80) return 'Distinction';
  if (value >= 60) return 'First Class';
  if (value >= 45) return 'Second Class';
  if (value >= 35) return 'Third Class';
  return 'Fail';
}

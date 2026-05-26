import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const baseSuggestions = [
  { title: 'Student registration status', meta: 'Student Module', path: '/student-module' },
  { title: 'B.Sc. Nursing Semester 1 schedule', meta: 'Examination Module', path: '/examination' },
  { title: 'Marks entry batch approval', meta: 'Marks Module', path: '/marks' },
  { title: 'MIS college-wise report', meta: 'MIS Reports', path: '/mis' },
  { title: 'Official templates and downloads', meta: 'Downloads', path: '/downloads' },
  { title: 'Helpdesk support ticket', meta: 'Helpdesk', path: '/helpdesk' },
];

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return baseSuggestions;
    return baseSuggestions.filter((item) =>
      `${item.title} ${item.meta}`.toLowerCase().includes(term)
    );
  }, [query]);

  const openSuggestion = (item) => {
    setQuery(item.title);
    setOpen(false);
    navigate(item.path);
  };

  return (
    <div className="ems-search" role="search">
      <label className="sr-only" htmlFor="ems-global-search">Search EMS portal</label>
      <Search size={18} aria-hidden="true" />
      <input
        id="ems-global-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 130)}
        placeholder="Search students, exams, reports..."
        aria-autocomplete="list"
        aria-controls="ems-search-suggestions"
        aria-expanded={open}
      />
      {open && (
        <div className="ems-search-suggestions" id="ems-search-suggestions" role="listbox">
          {suggestions.length > 0 ? suggestions.map((item) => (
            <button
              type="button"
              role="option"
              aria-selected="false"
              key={item.title}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => openSuggestion(item)}
            >
              <span>{item.title}</span>
              <small>{item.meta}</small>
            </button>
          )) : (
            <div className="ems-search-empty">No matching portal records</div>
          )}
        </div>
      )}
    </div>
  );
}

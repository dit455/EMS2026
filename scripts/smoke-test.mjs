import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const checks = [
  ['src/components/home/PublicNavbar.jsx', 'portal-desktop-nav', 'public navigation uses the polished desktop menu'],
  ['src/components/home/PublicNavbar.jsx', 'whitespace-nowrap', 'public navigation labels stay on one line'],
  ['src/components/home/PublicNavbar.jsx', "target: 'exam-schedule'", 'exam schedule has its own navigation target'],
  ['src/pages/Home.jsx', 'student-dashboard-preview-shell', 'home page includes the improved student dashboard preview'],
  ['src/pages/Home.jsx', 'portal-content-shell', 'home page uses the wider shared content shell'],
  ['src/pages/Home.jsx', 'Student Registration</span>', 'registration section uses the requested student registration label'],
  ['src/pages/Home.jsx', 'registration-download-button', 'download excel CTA uses the refined no-wrap button style'],
  ['src/pages/Home.jsx', 'student-announcement-bar', 'announcements render as a compact top strip'],
  ['src/pages/Home.jsx', 'mx-auto max-w-6xl', 'student announcement strip is centered'],
  ['src/pages/Home.jsx', 'HomeCommandBand', 'home page includes the modern priority service strip'],
  ['src/pages/Home.jsx', 'home-command-card', 'priority service cards use the modern card style'],
  ['src/pages/Home.jsx', 'home-service-card', 'student service cards use the modern card style'],
  ['src/pages/Home.jsx', '<NotificationsSection />\r\n\r\n        <HomeCommandBand', 'announcements appear directly below the carousel before the priority service strip'],
  ['src/components/home/DownloadsQuickLinks.jsx', "id={link.toLowerCase().includes('schedule') ? 'exam-schedule' : undefined}", 'schedule download button exposes a unique anchor'],
  ['src/components/home/HomeCarousel.jsx', 'portal-content-shell', 'hero content uses the wider shared content shell'],
  ['src/components/home/HomeCarousel.jsx', 'home-quick-panel', 'hero quick actions use the modern quick panel style'],
  ['src/components/home/HomeCarousel.jsx', 'lg:max-w-[430px]', 'quick action panel width is reduced on desktop'],
  ['src/components/home/HomeCarousel.jsx', 'h-10 sm:h-11', 'quick action buttons use a compact height'],
  ['src/styles/ems.css', '.portal-content-shell', 'shared content shell styles are defined'],
  ['src/styles/ems.css', '.student-announcement-bar', 'compact announcement strip styles are defined'],
  ['src/styles/ems.css', '.student-announcement-bar::before', 'announcement strip has a polished accent rule'],
  ['src/styles/ems.css', '.home-command-band', 'modern priority service strip styles are defined'],
  ['src/styles/ems.css', '.home-service-hub::before', 'student services hub has a polished accent rule'],
  ['src/pages/Home.jsx', 'mtpg-home', 'home page carries the scoped public portal class'],
  ['src/components/home/PublicFooter.jsx', 'Portal Status', 'footer exposes portal status information'],
  ['src/pages/dashboard/Dashboard.jsx', 'admin-dashboard-hero', 'admin dashboard includes the command hero'],
  ['src/pages/admin/AdminModule.jsx', 'admin-module-command', 'admin module includes the improved super admin overview'],
];

const failures = checks.filter(([file, expected]) => {
  const source = readFileSync(resolve(root, file), 'utf8').replace(/\r\n/g, '\n');
  const normalizedExpected = expected.replace(/\r\n/g, '\n');
  return !source.includes(normalizedExpected);
});

if (failures.length) {
  for (const [file, expected, message] of failures) {
    console.error(`Smoke check failed: ${message} (${file} missing "${expected}")`);
  }
  process.exit(1);
}

console.log(`Smoke checks passed: ${checks.length} UI surfaces verified.`);

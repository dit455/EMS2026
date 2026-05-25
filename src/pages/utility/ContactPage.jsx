import React from 'react';
import { Card, DataTable, PageHeader } from '../../components/ui';

const contactRows = [
  ['Institution Office', 'Mother Theresa Post Graduate and Research Institute of Health Sciences, Indira Nagar, Gorimedu, Puducherry-605 006'],
  ['Administrative Helpdesk', '0413-2271201'],
  ['Technical Helpdesk', 'support@mtpgrihs.py.gov.in'],
  ['Student Services', 'studentcell@mtpgrihs.py.gov.in'],
];

export default function ContactPage() {
  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Contact"
        description="Official contact points for EMS administration, student services, technical support, and workflow assistance."
      />

      <Card title="Contact Directory" subtitle="Reach the right office for faster follow-up." icon="phone">
        <DataTable columns={['Office / Desk', 'Contact Details']} rows={contactRows} />
      </Card>

      <Card title="Portal Assistance" subtitle="Common routing for user-friendly support." icon="message">
        <div className="ems-action-row">
          <a className="ems-btn ems-btn-primary" href="mailto:support@mtpgrihs.py.gov.in">Email Technical Support</a>
          <a className="ems-btn ems-btn-secondary" href="tel:04132271201">Call Administrative Helpdesk</a>
        </div>
      </Card>
    </div>
  );
}

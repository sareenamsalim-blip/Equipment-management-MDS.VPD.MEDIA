import React, { useState, useMemo } from 'react';
import { Equipment, VendorContract, ActiveRole } from '../types';

interface CalibrationViewProps {
  equipmentList: Equipment[];
  vendorContracts: VendorContract[];
  currentRole: ActiveRole;
  onOpenCalibModal: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  equipmentList,
  vendorContracts,
  currentRole,
  onOpenCalibModal,
  onShowToast
}) => {
  const [calibSearch, setCalibSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All Sections');
  const [statusFilter, setStatusFilter] = useState('Status: Due & Critical First');
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Filtered upcoming calibration items
  const filteredSchedule = useMemo(() => {
    return equipmentList.filter((item) => {
      const q = calibSearch.toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.make.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.barcode.toLowerCase().includes(q);

      const matchSection =
        sectionFilter === 'All Sections' || item.section === sectionFilter;

      let matchStatus = true;
      if (statusFilter === 'Critical Overdue Only') {
        matchStatus = item.calibrationDueDate === '2026-02-22' || item.calibrationDueDate === 'EXPIRED';
      } else if (statusFilter === 'Expiring <60 Days') {
        matchStatus =
          item.calibrationDueDate.toLowerCase().includes('due') ||
          item.calibrationDueDate.toLowerCase().includes('expired') ||
          item.calibrationDueDate <= '2026-04-30';
      } else if (statusFilter === 'Compliant') {
        matchStatus = item.calibrationDueDate > '2026-04-30' && item.calibrationDueDate !== 'EXPIRED';
      }

      return matchSearch && matchSection && matchStatus;
    });
  }, [equipmentList, calibSearch, sectionFilter, statusFilter]);

  const handleDownloadCert = (certNo?: string, equipmentName?: string) => {
    onShowToast(
      'NABL Certificate Verified',
      `Loading traceable certificate ${certNo || 'CAL-2025-QS5'} for ${equipmentName || 'Asset'} (ISO/IEC 17025).`,
      'verified'
    );
  };

  const handleScheduleBatch = () => {
    onShowToast(
      'Calibration Batch Scheduled',
      'Dispatched metrology calibration work orders for 5 high-priority diagnostic instruments.',
      'outgoing_mail'
    );
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Page Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Calibration &amp; AMC/CMC Master Management
            </h1>
            <span className="bg-primary text-on-primary font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT tracking-wider uppercase">
              NABL ISO 15189: 5.3
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Traceable calibration schedules, vendor service contracts &amp; NABL 5.3 compliance monitoring for surveillance &amp; diagnostics.
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onShowToast('Calibration Log Import', 'Select raw metrology calibration curve file (.csv, .xlsx)...')}
            className="bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-colors px-3 py-2 rounded-DEFAULT font-label-md text-label-md shadow-sm flex items-center gap-1.5 cursor-pointer border border-[#e0e3e5]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">upload_file</span>
            <span>Import Calibration Log</span>
          </button>
          <button
            onClick={() => onShowToast('NABL Audit Export', 'Generated official ISO 15189 Calibration & PM Dossier (PDF).')}
            className="bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-colors px-3 py-2 rounded-DEFAULT font-label-md text-label-md shadow-sm flex items-center gap-1.5 cursor-pointer border border-[#e0e3e5]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">picture_as_pdf</span>
            <span>Export NABL PDF/CSV</span>
          </button>
          <button
            onClick={onOpenCalibModal}
            className="bg-primary text-on-primary hover:bg-primary-container transition-colors px-3.5 py-2 rounded-DEFAULT font-label-md text-label-md flex items-center gap-1.5 shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Log Calibration / PM</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('vendor-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-secondary text-on-secondary hover:bg-primary transition-colors px-3 py-2 rounded-DEFAULT font-label-md text-label-md flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">handshake</span>
            <span>AMC / Vendor Portal</span>
          </button>
        </div>
      </div>

      {/* Immediate Regulatory Action Alert Banner */}
      {!alertDismissed && (
        <div className="bg-surface-container-lowest rounded-lg p-3.5 shadow-sm mb-5 relative overflow-hidden border border-[#eceef0]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-DEFAULT bg-error-container text-on-error-container flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-headline-sm text-headline-sm text-error font-semibold">
                    Immediate Compliance Action Required
                  </span>
                  <span className="bg-error text-on-error font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT">
                    1 OVERDUE
                  </span>
                  <span className="bg-surface-container-highest text-on-surface font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT">
                    4 EXPIRING SOON
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">
                  <strong className="text-error font-semibold">Critical:</strong> Applied Biosystems QuantStudio 5 is{' '}
                  <span className="text-error font-medium underline">overdue since 2026-02-22</span> (Molecular Diagnostic PCR Room). Additionally, 4 equipment units have calibration expiring within 30–60 days:{' '}
                  <span className="font-medium text-primary">Vestfrost -20°C, Healforce Biosafety Cabinet, Shimadzu Balance, Rotek Centrifuge</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
              <button
                onClick={handleScheduleBatch}
                className="bg-error text-on-error hover:bg-on-error-container transition-colors px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md flex items-center gap-1 shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
                Schedule Calibration Batch
              </button>
              <button
                onClick={() => setAlertDismissed(true)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                title="Dismiss Notice"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Calibration Compliance</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">97.5%</span>
            <span className="font-mono-data text-mono-data text-secondary">39 / 40 Active</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-secondary h-full rounded-full" style={{ width: '97.5%' }}></div>
          </div>
          <span className="font-mono-badge text-mono-badge text-outline truncate text-[10px]">
            Traceable to National Standards (NPL/NABL)
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Expiring &lt;60 Days</span>
            <span className="material-symbols-outlined text-error text-[20px]">schedule</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-error font-bold">4</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Units</span>
            </div>
            <span className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-1.5 py-0.5 rounded-DEFAULT">
              1 Overdue
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-error h-full rounded-full" style={{ width: '25%' }}></div>
          </div>
          <span className="font-mono-badge text-mono-badge text-outline text-[10px]">Action notices dispatched to QA Officer</span>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Preventive Maintenance</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">build_circle</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">95.0%</span>
            <span className="font-mono-data text-mono-data text-on-surface">38 / 40 Up-to-date</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-secondary-container h-full rounded-full" style={{ width: '95%' }}></div>
          </div>
          <span className="font-mono-badge text-mono-badge text-outline text-[10px]">Next: Labline LAF due 2026-04-21</span>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Active AMC / CMC / OEM</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">assignment_turned_in</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">38</span>
            <span className="font-mono-data text-mono-data text-on-surface-variant">40 Covered</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono-badge text-mono-badge text-on-surface-variant mb-1 text-[10px]">
            <span className="bg-surface-container px-1 rounded-DEFAULT text-primary font-semibold">32 AMC</span>
            <span>+</span>
            <span className="bg-surface-container px-1 rounded-DEFAULT text-secondary font-semibold">6 OEM</span>
            <span>+</span>
            <span className="bg-error-container text-on-error-container px-1 rounded-DEFAULT font-semibold">2 Renewal</span>
          </div>
          <span className="font-mono-badge text-mono-badge text-outline text-[10px]">Annual contract budget variance: 0.0%</span>
        </div>
      </div>

      {/* SECTION 1: Upcoming Calibration & PM Schedule Matrix */}
      <div className="bg-surface-container-lowest rounded-lg shadow-sm mb-8 overflow-hidden border border-[#eceef0]">
        {/* Header of Schedule Table */}
        <div className="p-4 bg-surface-container-lowest flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#eceef0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
              <h2 className="font-headline-md text-headline-md text-primary">Upcoming Calibration &amp; PM Schedule Matrix</h2>
              <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-2 py-0.5 rounded-DEFAULT">
                Filtered: {filteredSchedule.length} Monitored Rows
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Real-time tracking of NABL Clause 5.3 traceable calibration certificates and maintenance windows across surveillance labs.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="relative">
              <input
                type="text"
                value={calibSearch}
                onChange={(e) => setCalibSearch(e.target.value)}
                className="bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-8 pr-3 py-1.5 rounded-DEFAULT w-52 focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
                placeholder="Filter equipment, make, SN..."
              />
              <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-outline">search</span>
            </div>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-surface-container-low text-on-surface font-label-md text-label-md px-2.5 py-1.5 rounded-DEFAULT focus:outline-none border border-[#e0e3e5]"
            >
              <option>All Sections</option>
              <option>Molecular Diagnostic</option>
              <option>VPD Surveillance</option>
              <option>Media</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-low text-on-surface font-label-md text-label-md px-2.5 py-1.5 rounded-DEFAULT focus:outline-none border border-[#e0e3e5]"
            >
              <option>Status: Due &amp; Critical First</option>
              <option>Critical Overdue Only</option>
              <option>Expiring &lt;60 Days</option>
              <option>Compliant</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-[#eceef0]">
                <th className="py-2.5 px-4">Equipment &amp; Identifier</th>
                <th className="py-2.5 px-3">Lab Section &amp; Location</th>
                <th className="py-2.5 px-3">Make &amp; Model</th>
                <th className="py-2.5 px-3">Last Calibrated / Agency</th>
                <th className="py-2.5 px-3">Calibration Due</th>
                <th className="py-2.5 px-3">PM Due Window</th>
                <th className="py-2.5 px-3 text-center">NABL Cert</th>
                <th className="py-2.5 px-3">Compliance Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0] font-body-md text-body-md">
              {filteredSchedule.slice(0, 10).map((item) => {
                const isOverdue = item.calibrationDueDate === '2026-02-22' || item.calibrationDueDate === 'EXPIRED';
                const isUrgent = item.calibrationDueDate === '2026-03-10';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-surface-container-low/70 transition-colors ${
                      isOverdue ? 'bg-error-container/20' : isUrgent ? 'bg-error-container/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          {item.name}
                        </span>
                        <span className="font-mono-badge text-mono-badge text-on-surface-variant">
                          BARCODE: <span className="text-primary font-semibold">{item.barcode || 'N/A'}</span>
                        </span>
                        <span className="font-mono-data text-mono-data text-outline text-[11px]">
                          SN: {item.serialNumber}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-label-md text-label-md text-on-surface block">{item.section}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{item.location}</span>
                      <div className="mt-0.5">
                        <span className="inline-block bg-secondary-fixed/50 text-on-secondary-fixed font-mono-badge text-mono-badge px-1 py-0.2 rounded-DEFAULT">
                          {item.programs.join('|')}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-label-md text-label-md text-primary">{item.make}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block">{item.model}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono-data text-mono-data text-on-surface">{item.calibrationDate}</span>
                      <span className="font-body-sm text-body-sm text-outline block text-xs">
                        {item.calibratingAgency || 'NABL Lab Agency'}
                      </span>
                      <span className="font-mono-badge text-mono-badge text-secondary">
                        {item.calibrationCertNo || 'CAL-CERT-VERIFIED'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`font-mono-data text-mono-data ${isOverdue ? 'text-error font-bold' : 'text-primary font-semibold'}`}>
                          {item.calibrationDueDate}
                        </span>
                        {isOverdue && (
                          <span className="bg-error text-on-error font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                            OVERDUE
                          </span>
                        )}
                        {isUrgent && (
                          <span className="bg-error-container text-on-error-container font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT">
                            DUE &lt;14 DAYS
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono-data text-mono-data text-on-surface">{item.pmDueDate}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block text-xs">
                        {isOverdue ? 'PM scheduled OEM' : 'Routine PM Verification'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDownloadCert(item.calibrationCertNo, item.name)}
                        className="p-1 rounded hover:bg-surface-container-high text-primary cursor-pointer"
                        title="View PDF Certificate"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">description</span>
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      {isOverdue ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-error shrink-0 animate-ping"></span>
                            <span className="font-label-sm text-label-sm text-error uppercase">Critical Overdue</span>
                          </div>
                          <span className="font-mono-badge text-mono-badge text-outline">Testing Quarantined</span>
                        </div>
                      ) : isUrgent ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-error shrink-0"></span>
                            <span className="font-label-sm text-label-sm text-error uppercase">Urgent Notice</span>
                          </div>
                          <span className="font-mono-badge text-mono-badge text-outline">PO Placed #6042</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                            <span className="font-label-sm text-label-sm text-secondary uppercase">Compliant</span>
                          </div>
                          <span className="font-mono-badge text-mono-badge text-outline">Traceability Verified</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={onOpenCalibModal}
                          className="bg-primary text-on-primary hover:bg-primary-container px-2 py-1 rounded-DEFAULT font-label-sm text-label-sm cursor-pointer"
                          type="button"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => onShowToast('Vendor Dispatched', `Contacted service partner for ${item.make}.`)}
                          className="bg-surface-container hover:bg-surface-container-high text-primary px-2 py-1 rounded-DEFAULT font-label-sm text-label-sm cursor-pointer"
                          type="button"
                        >
                          Vendor
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant border-t border-[#eceef0]">
          <div className="flex items-center gap-3 font-mono-badge text-mono-badge text-xs">
            <span>NABL Standard: <strong>ISO/IEC 17025 Certified Agencies</strong></span>
            <span>•</span>
            <span>Audit Evidence: <strong>ISO 15189:2022 Cl. 5.3.3</strong></span>
          </div>
          <div className="flex items-center gap-2 font-label-md text-label-md">
            <span>Showing {Math.min(10, filteredSchedule.length)} of {equipmentList.length} Total Surveillance Assets</span>
            <button
              onClick={() => {
                setCalibSearch('');
                setSectionFilter('All Sections');
                setStatusFilter('Status: Due & Critical First');
              }}
              className="bg-surface-container-lowest text-primary px-2.5 py-1 rounded-DEFAULT shadow-sm hover:bg-surface-container-high cursor-pointer border border-[#e0e3e5]"
              type="button"
            >
              View All 40 Units
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: AMC / CMC Vendor & Service Contract Master Tracker */}
      <div className="flex flex-col gap-3 mb-6" id="vendor-section">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <h2 className="font-headline-md text-headline-md text-primary">AMC / CMC Vendor &amp; Service Contract Master Tracker</h2>
              <span className="font-mono-badge text-mono-badge bg-primary text-on-primary px-2 py-0.5 rounded-DEFAULT">
                38 ACTIVE CONTRACTS
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Comprehensive maintenance contracts, OEM warranty coverage, and authorized biomedical service engineers directory.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onShowToast('Vendor Portal', 'Contract wizard opening for new AMC/CMC onboarding...')}
              className="bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-md text-label-md px-3 py-1.5 rounded-DEFAULT shadow-sm flex items-center gap-1 cursor-pointer border border-[#e0e3e5]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Vendor Contract
            </button>
            <button
              onClick={() => onShowToast('Contract Audit', 'Generating comprehensive SLA performance and renewal audit sheet.')}
              className="bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-md text-label-md px-3 py-1.5 rounded-DEFAULT shadow-sm flex items-center gap-1 cursor-pointer border border-[#e0e3e5]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">history_edu</span>
              Renewal Audit Report
            </button>
          </div>
        </div>

        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {vendorContracts.map((vendor) => {
            const isRenewalPending = vendor.status === 'RENEWAL PENDING' || vendor.isOverdue;

            return (
              <div
                key={vendor.id}
                className="bg-surface-container-lowest rounded-lg p-3.5 shadow-sm flex flex-col justify-between border border-[#eceef0]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono-badge text-mono-badge bg-primary-container text-on-primary px-2 py-0.5 rounded-DEFAULT">
                        {vendor.contractType}
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                        {vendor.vendorName}
                      </h3>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        {vendor.division}
                      </span>
                    </div>

                    <span
                      className={`font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT uppercase ${
                        isRenewalPending
                          ? 'bg-error-container text-on-error-container font-semibold'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>

                  {/* Covered Equipment */}
                  <div className="bg-surface-container-low rounded-DEFAULT p-2 mb-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1 text-[10px]">
                      Covered Laboratory Equipment
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {vendor.coveredEquipment.map((eq, idx) => (
                        <span
                          key={idx}
                          className="font-mono-badge text-mono-badge bg-surface-container-lowest text-on-surface px-1.5 py-0.5 rounded-DEFAULT border border-[#e0e3e5]"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 text-on-surface text-xs">
                    <div className="flex items-center justify-between font-body-sm">
                      <span className="text-on-surface-variant">Assigned Engineer:</span>
                      <span className="font-semibold text-primary">{vendor.assignedEngineer}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm">
                      <span className="text-on-surface-variant">Direct Helpline:</span>
                      <span className="font-mono-data text-mono-data text-secondary text-[11px] font-semibold">{vendor.phone}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm">
                      <span className="text-on-surface-variant">Contract Validity:</span>
                      <span className={`font-mono-data text-mono-data ${isRenewalPending ? 'text-error font-semibold' : 'text-primary'}`}>
                        {vendor.validityStart} to {vendor.validityEnd} ({vendor.validityNote})
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm">
                      <span className="text-on-surface-variant">PM Frequency:</span>
                      <span className="font-semibold text-primary">{vendor.pmFrequency}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-2 border-t border-[#eceef0] flex items-center justify-between">
                  <button
                    onClick={() => onShowToast('Agreement Download', `Downloading signed SLA agreement for ${vendor.vendorName} (PDF).`)}
                    className="text-secondary hover:text-primary font-label-md text-label-md flex items-center gap-1 cursor-pointer text-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">file_download</span>
                    Download Agreement
                  </button>

                  {isRenewalPending ? (
                    <button
                      onClick={() => onShowToast('Renewal Initiated', `Sent formal contract extension request to ${vendor.vendorName}.`)}
                      className="bg-error text-on-error hover:bg-on-error-container font-label-md text-label-md px-2.5 py-1 rounded-DEFAULT cursor-pointer text-xs"
                      type="button"
                    >
                      Initiate Renewal
                    </button>
                  ) : (
                    <button
                      onClick={() => onShowToast('Visit Requested', `Field PM visit logged for ${vendor.vendorName}.`)}
                      className="bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md px-2.5 py-1 rounded-DEFAULT cursor-pointer text-xs"
                      type="button"
                    >
                      Request Visit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

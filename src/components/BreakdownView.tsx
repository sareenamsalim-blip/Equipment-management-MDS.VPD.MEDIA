import React, { useState, useEffect, useMemo } from 'react';
import { BreakdownRecord, ActiveRole } from '../types';

interface BreakdownViewProps {
  currentRole: ActiveRole;
  historicalBreakdowns: BreakdownRecord[];
  onOpenReportModal: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const BreakdownView: React.FC<BreakdownViewProps> = ({
  currentRole,
  historicalBreakdowns,
  onOpenReportModal,
  onShowToast
}) => {
  const isAdmin = currentRole === 'ADMIN';

  // Live ticking downtime clock
  const [secondsElapsed, setSecondsElapsed] = useState(268 * 3600 + 14 * 60 + 22);
  const [directorSigned, setDirectorSigned] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDowntime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(3, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const handleDirectorSignoff = () => {
    if (!isAdmin) {
      onShowToast('Action Locked', 'Only Laboratory Director / Admin can apply the statutory financial seal.', 'lock');
      return;
    }
    setDirectorSigned(true);
    onShowToast(
      'Statutory Seal Applied',
      'Director of Public Health & CAO approved Sanction Order No. 41/2026 for ELISA Reader condemnation.',
      'verified'
    );
  };

  const handleIssueCondemnationCert = () => {
    onShowToast(
      'Form-06 Certificate Generated',
      'Biohazard decontamination & E-Waste Manifest issued for Bio-Rad iMark (MR-BR-091).',
      'picture_as_pdf'
    );
  };

  // Filter historical table
  const filteredHistory = useMemo(() => {
    return historicalBreakdowns.filter((item) => {
      const q = historySearch.toLowerCase();
      const matchSearch =
        !q ||
        item.equipmentName.toLowerCase().includes(q) ||
        item.ticketId.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.natureOfFault.toLowerCase().includes(q);

      const matchSec = sectionFilter === 'all' || item.section === sectionFilter;
      return matchSearch && matchSec;
    });
  }, [historicalBreakdowns, historySearch, sectionFilter]);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-1.5 font-mono-badge text-mono-badge text-on-surface-variant uppercase tracking-wider text-[11px]">
            <span>Asset Governance</span>
            <span className="text-outline-variant">/</span>
            <span>Maintenance &amp; Engineering</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">Breakdown &amp; Condemnation</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Breakdown Downtime, RBER &amp; Condemnation Board
            </h1>
            <span className="bg-error-container text-on-error-container font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT uppercase font-semibold">
              1 Critical Outage
            </span>
            <span className="bg-secondary-container text-on-secondary-container font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
              ISO 15189:2022 §6.4
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onOpenReportModal}
            className="bg-error text-on-error font-label-md text-label-md px-3 py-2 rounded-DEFAULT shadow-sm hover:bg-on-error-container transition-all flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">emergency</span>
            <span>+ Report New Equipment Breakdown</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('rber-panel');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-primary text-on-primary font-label-md text-label-md px-3 py-2 rounded-DEFAULT shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">calculate</span>
            <span>Initiate RBER Assessment</span>
          </button>
          <button
            onClick={() => onShowToast('NABL Form-04 Export', 'Exported breakdown and corrective action incident ledger (CSV).')}
            className="bg-surface-container-lowest text-primary font-label-md text-label-md px-3 py-2 rounded-DEFAULT shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-1 border border-[#e0e3e5] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>NABL Form-04 Log</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles 5-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {/* Active Incidents */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-[#eceef0] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Incidents</span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-error font-bold tracking-tight">01</span>
              <span className="font-mono-data text-mono-data text-error font-semibold">CRITICAL</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface truncate mt-0.5">Bio-Rad iMark ELISA (Molecular)</p>
          </div>
          <div className="bg-surface-container-low px-2 py-1 rounded-DEFAULT flex items-center justify-between font-mono-badge text-mono-badge text-on-surface-variant text-[10px]">
            <span>Asset ID: BR-IMK-40</span>
            <span className="text-error font-semibold">MR Surveillance</span>
          </div>
        </div>

        {/* Cumulative Downtime */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-[#eceef0] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cumulative Downtime</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">timer</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">78.4</span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">Hrs</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Cycle: Feb 2026 (&lt;120h limit)</p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-secondary h-1.5 rounded-full" style={{ width: '65.3%' }}></div>
          </div>
        </div>

        {/* MTTR */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-[#eceef0] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Mean Time to Repair</span>
            <span className="material-symbols-outlined text-primary text-[20px]">build_circle</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">4.2</span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">Days</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Rolling 12-Month Median</p>
          </div>
          <div className="flex items-center gap-1 font-mono-badge text-mono-badge text-on-tertiary-container text-[10px]">
            <span className="material-symbols-outlined text-[13px]">trending_down</span>
            <span>-0.8 days vs 2025 avg</span>
          </div>
        </div>

        {/* RBER Assessment */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-[#eceef0] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">RBER Assessment</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">assignment_late</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">01</span>
              <span className="font-mono-data text-mono-data text-error font-semibold">&gt;64.6% Cost</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Exceeds 50% RBER standard</p>
          </div>
          <div className="bg-surface-container-low px-2 py-1 rounded-DEFAULT font-mono-badge text-mono-badge text-on-surface-variant truncate text-[10px]">
            Stage: {directorSigned ? 'Fully Approved' : 'Pending Director Seal'}
          </div>
        </div>

        {/* Decommissioned Assets */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-[#eceef0] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Decommissioned Assets</span>
            <span className="material-symbols-outlined text-outline text-[20px]">delete_sweep</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">00</span>
              <span className="font-mono-data text-mono-data text-secondary font-semibold">Active Dep.</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">03 units in pre-scrap pipeline</p>
          </div>
          <div className="bg-surface-container-low px-2 py-1 rounded-DEFAULT font-mono-badge text-mono-badge text-outline text-[10px]">
            Decontamination: 100% compliant
          </div>
        </div>
      </div>

      {/* SECTION 1: LIVE ACTIVE BREAKDOWN & RECTIFICATION PIPELINE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 mb-6">
        {/* Hero Card (8 Cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-[#eceef0] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error animate-ping"></span>
                <span className="font-mono-badge text-mono-badge bg-error text-on-error px-2 py-0.5 rounded-DEFAULT font-semibold">
                  INCIDENT ACTIVE
                </span>
                <span className="font-mono-data text-mono-data text-primary font-semibold">#EQ-BRK-2026-014</span>
                <span className="bg-surface-container-low text-on-surface font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                  NABL CLAUSE 6.4.7
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Impact Program:</span>
                <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT font-semibold">
                  MR Surveillance
                </span>
              </div>
            </div>

            {/* Main Instrument Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 bg-surface-container-low p-3 rounded-lg border border-[#e0e3e5]/60">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block text-[10px]">Target Instrument</span>
                <h2 className="font-headline-md text-headline-md text-primary font-bold mt-0.5">Elisa Reader</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-mono-data text-mono-data text-secondary">Bio-Rad</span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-mono-data text-mono-data text-on-surface">Model: iMark</span>
                </div>
                <span className="font-mono-badge text-mono-badge text-outline mt-1 block text-[10px]">
                  Serial: MR-BR-091 | Barcode: BIO-RD-IMK
                </span>
              </div>

              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block text-[10px]">Operational Location</span>
                <p className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Molecular Diagnostic</p>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">
                  Installed: 2017-10-13 (Age: ~8.5 Years)
                </span>
                <span className="font-mono-badge text-mono-badge bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded-DEFAULT mt-1 inline-block text-[10px]">
                  Asset Lifecycle: Post-Depreciation
                </span>
              </div>

              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block text-[10px]">Reported By &amp; Timestamp</span>
                <p className="font-label-md text-label-md text-primary mt-0.5">vpdsurveillancesphcl@gmail.com</p>
                <div className="font-mono-data text-mono-data text-on-surface-variant mt-1 text-xs">2026-02-18 09:34:10 IST</div>
                <div className="flex items-center gap-1 mt-1 text-error font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">timer</span>
                  <span>11 Days, 04 Hours Total Downtime</span>
                </div>
              </div>
            </div>

            {/* Problem Description Narrative */}
            <div className="mt-3">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1 text-[10px]">
                Incident Symptom &amp; Diagnostic Log
              </span>
              <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm border border-[#eceef0]">
                <p className="font-body-md text-body-md text-on-surface">
                  <span className="font-semibold text-error">Operator Report:</span> "Optical filter wheel error during absorbance reading at 450nm; system halting during MR surveillance run. Re-initialization failed with error code ERR_OPT_304. Service engineer visited, main board damaged."
                </p>
                <div className="mt-2 pt-2 border-t border-[#eceef0] flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono-badge text-on-surface-variant">
                  <span>Technician Call Report Ref: <strong className="text-primary font-mono-data">BIO-SRV-2026-881</strong></span>
                  <span>OEM Visit: 2026-02-21 by Bio-Rad Field Specialist</span>
                  <span className="text-error font-semibold">Verdict: Optical Stepper Failure &amp; Main Circuit Short</span>
                </div>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="bg-surface-container-low p-2 rounded-DEFAULT border border-[#e0e3e5]/60">
                  <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Breakdown Reported</span>
                  </div>
                  <span className="font-mono-badge text-mono-badge text-on-surface-variant block mt-0.5 text-[10px]">Feb 18, 2026 • 09:34</span>
                </div>

                <div className="bg-surface-container-low p-2 rounded-DEFAULT border border-[#e0e3e5]/60">
                  <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>OEM Field Visit</span>
                  </div>
                  <span className="font-mono-badge text-mono-badge text-on-surface-variant block mt-0.5 text-[10px]">Feb 21, 2026 • Board Inspected</span>
                </div>

                <div className="bg-surface-container-high p-2 rounded-DEFAULT border border-[#e0e3e5]">
                  <div className="flex items-center gap-1 text-primary font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] animate-spin text-secondary">sync</span>
                    <span>RBER Escalated</span>
                  </div>
                  <span className="font-mono-badge text-mono-badge text-on-surface-variant block mt-0.5 text-[10px]">Feb 23, 2026 • 64.6% Cost</span>
                </div>

                <div className="bg-surface-container-low p-2 rounded-DEFAULT border border-[#e0e3e5]/60">
                  <div className="flex items-center gap-1 text-primary font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">
                      {directorSigned ? 'check_circle' : 'pending_actions'}
                    </span>
                    <span>Condemnation Order</span>
                  </div>
                  <span className="font-mono-badge text-mono-badge text-on-surface-variant block mt-0.5 text-[10px]">
                    {directorSigned ? 'Signed & Authorized' : 'Pending Accounts Sign-off'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-[#eceef0] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Current Status:</span>
              <span className="bg-error-container text-on-error-container font-mono-badge text-mono-badge px-2.5 py-1 rounded-DEFAULT font-bold flex items-center gap-1 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                PENDING SPARE PARTS / UNDER RBER REVIEW
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onShowToast('Progress Updated', 'Added note to service log. Biomedical engineer notified.')}
                className="bg-surface-container-lowest text-primary font-label-md text-label-md px-3 py-1.5 rounded-DEFAULT shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-1 border border-[#e0e3e5] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                <span>Update Progress</span>
              </button>
              <button
                onClick={() => onShowToast('Call Report Logged', 'Service call logged into Bio-Rad regional service portal.')}
                className="bg-surface-container-lowest text-primary font-label-md text-label-md px-3 py-1.5 rounded-DEFAULT shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-1 border border-[#e0e3e5] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
                <span>Log Call Report</span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('rber-panel');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-primary text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center gap-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Admin RBER Sign-off</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Downtime Clock & Telemetry (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          {/* Cumulative Downtime Clock */}
          <div className="bg-primary p-4 rounded-xl text-on-primary shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary-container text-[20px]">timelapse</span>
                <span className="font-headline-sm text-headline-sm uppercase tracking-wider text-secondary-fixed">
                  Downtime Meter
                </span>
              </div>
              <span className="font-mono-badge text-mono-badge bg-primary-container px-2 py-0.5 rounded-DEFAULT">
                LIVE COUNTER
              </span>
            </div>

            <div className="my-4 text-center">
              <div className="font-mono-data text-[32px] lg:text-[36px] leading-[40px] font-bold text-tertiary-fixed tracking-tight">
                {formatDowntime(secondsElapsed)}
              </div>
              <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-widest mt-1 block text-[10px]">
                HOURS : MINUTES : SECONDS
              </span>
            </div>

            <div className="bg-primary-container p-2.5 rounded-lg flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-primary-container">Surveillance Impact Rate</span>
                <span className="font-mono-data text-error font-semibold">18 ELISA Tests / Day Postponed</span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-primary-container">Backup Routine</span>
                <span className="font-mono-data text-tertiary-fixed truncate">Routed to Thermo Multiscan FC</span>
              </div>
            </div>
          </div>

          {/* Compliance Form Tracking */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-[#eceef0] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline-sm text-headline-sm text-primary">Compliance Form Tracking</h3>
                <span className="font-mono-badge text-mono-badge bg-surface-container-high px-1.5 py-0.5 rounded-DEFAULT text-[10px]">
                  NABL CLINICAL
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2 bg-surface-container-low rounded-DEFAULT flex items-center justify-between border border-[#e0e3e5]/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-[18px]">picture_as_pdf</span>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface block leading-none">
                        Form-04_Breakdown_iMark.pdf
                      </span>
                      <span className="font-mono-badge text-mono-badge text-on-surface-variant text-[10px]">
                        Logged by sareena.m.salim@gmail.com
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onShowToast('Download Complete', 'Downloaded Form-04_Breakdown_iMark.pdf')}
                    className="text-secondary hover:text-primary transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>

                <div className="p-2 bg-surface-container-low rounded-DEFAULT flex items-center justify-between border border-[#e0e3e5]/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">build</span>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface block leading-none">
                        OEM_Field_Service_Report.pdf
                      </span>
                      <span className="font-mono-badge text-mono-badge text-on-surface-variant text-[10px]">
                        Bio-Rad Quote: ₹4,20,000 + GST
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onShowToast('Download Complete', 'Downloaded OEM_Field_Service_Report.pdf')}
                    className="text-secondary hover:text-primary transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-surface-container-high rounded-DEFAULT text-on-surface flex items-start gap-2 border border-[#e0e3e5]">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">verified_user</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                NABL 15189 requires quarantine signage pasted physically on the ELISA reader: <strong className="text-on-surface font-semibold">"DO NOT USE - UNDER CONDEMNATION"</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: RBER TECHNICAL & FINANCIAL ASSESSMENT PANEL */}
      <div className="bg-surface-container-lowest p-4 lg:p-5 rounded-xl shadow-sm mb-6 border border-[#eceef0]" id="rber-panel">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 gap-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-primary font-bold">
                  RBER Technical &amp; Financial Assessment Panel
                </h2>
                <span className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-2 py-0.5 rounded-DEFAULT font-bold">
                  RBER THRESHOLD TRIGGERED
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Institutional evaluation protocol under CPWD &amp; Public Health Biomedical Equipment Policy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowToast('RBER Report PDF', 'Generated official Form-05 RBER Assessment Report for Bio-Rad iMark.')}
              className="bg-surface-container-low text-primary font-label-md text-label-md px-3 py-2 rounded-DEFAULT hover:bg-surface-container-high transition-colors flex items-center gap-1.5 border border-[#e0e3e5] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Generate Form-05 RBER Report (PDF)</span>
            </button>
            <button
              onClick={handleDirectorSignoff}
              className="bg-primary text-on-primary font-label-md text-label-md px-3 py-2 rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">rule</span>
              <span>Submit for Committee Final Seal</span>
            </button>
          </div>
        </div>

        {/* Financial Model Breakdown & 3-Tier Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          {/* Financial Calculation (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-low p-4 rounded-lg flex flex-col justify-between border border-[#e0e3e5]/70">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs">
                  Financial Viability Ratio
                </span>
                <span className="font-mono-data text-mono-data text-error font-bold">
                  64.62% of Original Value
                </span>
              </div>

              {/* Graphic Bar */}
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm mb-1">
                    <span className="font-semibold text-primary">Original Capital Procurement Cost (2017)</span>
                    <span className="font-mono-data text-mono-data text-on-surface font-bold">₹6,50,000</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm mb-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-error">OEM Repair Estimate Quote (Optical + Mainboard)</span>
                      <span className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-1 py-0.2 rounded-DEFAULT text-[10px]">
                        Exceeds 50%
                      </span>
                    </div>
                    <span className="font-mono-data text-mono-data text-error font-bold">₹4,20,000</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
                    <div className="bg-error h-3 rounded-full" style={{ width: '64.62%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm mb-1">
                    <span className="text-on-surface-variant font-medium">Estimated Depreciated Book Value (8.5 Years @ 10% SLM)</span>
                    <span className="font-mono-data text-mono-data text-on-surface-variant font-bold">₹97,500</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
                    <div className="bg-outline h-3 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>

              {/* Criteria logic */}
              <div className="mt-4 p-2.5 bg-surface-container-lowest rounded-DEFAULT font-mono-badge text-mono-badge text-on-surface-variant space-y-1 text-xs border border-[#eceef0]">
                <div className="flex items-center justify-between">
                  <span>Standard Criteria:</span>
                  <span className="text-on-surface">If Single Repair Cost &gt; 50% of Book / Replacement Value =&gt; Declare RBER</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Calculated Ratio:</span>
                  <span className="text-error font-semibold">Repair (₹4.20L) / Book (₹0.975L) = 430.7% | Repair / Original = 64.62%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#eceef0]">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1 text-[11px]">
                Biomedical Engineer Recommendation Note
              </span>
              <p className="font-body-md text-body-md text-on-surface bg-surface-container-lowest p-2.5 rounded-DEFAULT italic text-xs leading-relaxed border border-[#eceef0]">
                "Due to age (~8.5 years) and non-availability of OEM micro-optic board, repair is not economically viable. Optical sensor alignment cannot be recalibrated to ISO 15189 optical density tolerances. Strongly recommended for official condemnation and replacement with modern multi-mode reader under MR Surveillance funding."
              </p>
              <div className="flex items-center justify-between mt-1.5 font-mono-badge text-mono-badge text-on-surface-variant text-[10px]">
                <span>Bio-Medical Engineer: Er. R. Narayanan (Reg #BME-2019-918)</span>
                <span>Date: 2026-02-23</span>
              </div>
            </div>
          </div>

          {/* 3-Tier Workflow (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-4 rounded-lg shadow-sm flex flex-col justify-between border border-[#eceef0]">
            <div>
              <span className="font-headline-sm text-headline-sm text-primary block mb-1">
                Statutory Condemnation Sign-off Workflow
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 text-xs">
                Required approvals before asset can be struck from public health registry.
              </p>

              <div className="space-y-3">
                {/* 1. Lab In-Charge */}
                <div className="flex items-start gap-2.5 p-2.5 bg-surface-container-low rounded-lg border border-[#e0e3e5]/60">
                  <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-primary font-semibold">1. Laboratory In-Charge</span>
                      <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-DEFAULT text-[10px]">
                        APPROVED
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-0.5 text-xs">Dr. Sareena M. Salim (Quality Manager / In-Charge)</p>
                    <div className="flex items-center gap-1 font-mono-badge text-mono-badge text-outline mt-1 text-[10px]">
                      <span>sareena.m.salim@gmail.com</span>
                      <span>•</span>
                      <span>Signed 2026-02-24 11:20 IST</span>
                    </div>
                  </div>
                </div>

                {/* 2. Biomedical Engineer */}
                <div className="flex items-start gap-2.5 p-2.5 bg-surface-container-low rounded-lg border border-[#e0e3e5]/60">
                  <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-primary font-semibold">2. State Biomedical Engineer</span>
                      <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-DEFAULT text-[10px]">
                        CERTIFIED RBER
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-0.5 text-xs">Biomedical Engineering Unit (SPHCL)</p>
                    <div className="flex items-center gap-1 font-mono-badge text-mono-badge text-outline mt-1 text-[10px]">
                      <span>Cert #RBER-2026-BME-04</span>
                      <span>•</span>
                      <span>Signed 2026-02-25 15:04 IST</span>
                    </div>
                  </div>
                </div>

                {/* 3. Head of Institution */}
                <div className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${
                  directorSigned ? 'bg-secondary-container/20 border-secondary' : 'bg-surface-container-high border-[#e0e3e5]'
                }`}>
                  <span className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${
                    directorSigned ? 'text-secondary' : 'text-primary animate-pulse'
                  }`}>
                    {directorSigned ? 'verified' : 'hourglass_top'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-primary font-semibold">
                        3. Head of Institution / Finance
                      </span>
                      <span className={`font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT font-semibold text-[10px] ${
                        directorSigned ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface'
                      }`}>
                        {directorSigned ? 'SANCTIONED' : 'PENDING SEAL'}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-0.5 text-xs">Director of Public Health &amp; Chief Accounts Officer</p>
                    {directorSigned ? (
                      <span className="font-mono-badge text-mono-badge text-secondary mt-1 block text-[10px] font-semibold">
                        Sanction Order No. 41/2026 Applied
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 font-mono-badge text-mono-badge text-error mt-1 text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">pending</span>
                        <span>Awaiting formal Sanction Order No. 41/2026</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#eceef0] flex items-center justify-between">
              <span className="font-mono-badge text-mono-badge text-on-surface-variant text-[10px]">
                Auth Key: SHA256: 4e9a...71fc
              </span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                Status: {directorSigned ? '100% Completed' : '66% Complete'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: CONDEMNATION & SAFE DISPOSAL PROTOCOL BOARD */}
      <div className="bg-surface-container-lowest p-4 lg:p-5 rounded-xl shadow-sm mb-6 border border-[#eceef0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 gap-3 border-b border-[#eceef0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">
                Condemnation &amp; Safe Disposal Protocol Board
              </h2>
              <span className="font-mono-badge text-mono-badge bg-surface-container-high text-on-surface px-2 py-0.5 rounded-DEFAULT">
                ISO 15189:2022 §6.4.8
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Stepwise statutory decommission, biohazard clearance, data sanitization, and e-waste certified handover.
            </p>
          </div>

          <button
            onClick={handleIssueCondemnationCert}
            className="bg-primary text-on-primary font-label-md text-label-md px-3.5 py-2 rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Issue Final Condemnation Certificate</span>
          </button>
        </div>

        {/* 4 Protocol Phases Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col justify-between border border-[#e0e3e5]/60">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono-badge text-mono-badge bg-primary text-on-primary px-2 py-0.5 rounded-DEFAULT">PHASE 01</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mt-2 font-semibold">Technical Approval</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">
                RBER assessment logged with OEM non-repairability certificate.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#eceef0] font-mono-badge text-mono-badge text-secondary font-semibold text-[10px]">
              Completed • Ref: #RBER-04
            </div>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col justify-between border border-[#e0e3e5]/60">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono-badge text-mono-badge bg-primary text-on-primary px-2 py-0.5 rounded-DEFAULT">PHASE 02</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">sanitizer</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mt-2 font-semibold">Hazardous Clearance</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">
                Biohazard bleach decontamination, halogen lamp disposal &amp; memory wipe.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#eceef0]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input checked readOnly className="w-3.5 h-3.5 rounded-DEFAULT accent-primary" type="checkbox" />
                <span className="font-mono-badge text-mono-badge text-on-surface font-semibold text-[10px]">
                  Decon Certificate Issued
                </span>
              </label>
            </div>
          </div>

          <div className="bg-surface-container-high p-3.5 rounded-lg flex flex-col justify-between border border-[#e0e3e5]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono-badge text-mono-badge bg-primary text-on-primary px-2 py-0.5 rounded-DEFAULT">PHASE 03</span>
                <span className="material-symbols-outlined text-primary text-[20px] animate-spin">sync</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mt-2 font-semibold">Registry Strike-off</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">
                Delist from active Master Inventory CSV and update NABL 40-asset register.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#eceef0] font-mono-badge text-mono-badge text-on-surface font-semibold text-[10px]">
              Status: In Progress
            </div>
          </div>

          <div className="bg-surface-container-low/60 p-3.5 rounded-lg flex flex-col justify-between opacity-70 border border-[#e0e3e5]/40">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono-badge text-mono-badge bg-outline text-on-primary px-2 py-0.5 rounded-DEFAULT">PHASE 04</span>
                <span className="material-symbols-outlined text-outline text-[20px]">recycling</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-outline mt-2 font-semibold">E-Waste Scrap Auction</h3>
              <p className="font-body-sm text-body-sm text-outline mt-1 text-xs">
                Handover to State Pollution Control Board authorized recycler.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#eceef0] font-mono-badge text-mono-badge text-outline text-[10px]">
              Pending Phase 03 Close
            </div>
          </div>
        </div>

        {/* Candidate Pipeline Table */}
        <div className="mt-5">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-2 text-xs">
            Pipelines &amp; Candidates Under Review (03 Units Identified in Master Register)
          </span>

          <div className="overflow-x-auto rounded-lg border border-[#eceef0]">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container-low text-on-surface font-label-sm text-label-sm uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Asset &amp; Model</th>
                  <th className="py-2.5 px-3">Section &amp; Program</th>
                  <th className="py-2.5 px-3">Installation Date</th>
                  <th className="py-2.5 px-3">Assessment Reason</th>
                  <th className="py-2.5 px-3">Est. Replacement Value</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef0]">
                <tr className="hover:bg-surface-container-low/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-headline-sm text-headline-sm text-primary font-semibold">
                      Elisa Reader (Bio-Rad iMark)
                    </div>
                    <div className="font-mono-data text-mono-data text-outline text-xs">
                      Serial: MR-BR-091 • Barcode: BIO-RD-IMK
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-body-sm text-body-sm text-on-surface">Molecular Diagnostic</div>
                    <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-1 py-0.2 rounded-DEFAULT text-[10px]">
                      MR Surveillance
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface">2017-10-13</td>
                  <td className="py-2.5 px-3 text-error font-medium text-xs">
                    Mainboard &amp; Optical Motor Burnout (64.6% repair cost)
                  </td>
                  <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface font-semibold">₹6,50,000</td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-2 py-0.5 rounded-DEFAULT font-bold text-[10px]">
                      RBER Confirmed
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onShowToast('Dossier Opened', 'Viewing Bio-Rad iMark statutory condemnation file.')}
                      className="text-primary font-label-sm text-label-sm hover:underline font-semibold cursor-pointer"
                      type="button"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-headline-sm text-headline-sm text-primary font-semibold">
                      RT PCR Machine 7500 Fast (Applied Biosystems)
                    </div>
                    <div className="font-mono-data text-mono-data text-outline text-xs">
                      Serial: 27500391 • Barcode: AB-7500-01
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-body-sm text-body-sm text-on-surface">Molecular Diagnostic</div>
                    <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-1 py-0.2 rounded-DEFAULT text-[10px]">
                      NRCP | MR Surveillance
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface">2012-11-26</td>
                  <td className="py-2.5 px-3 text-on-surface-variant font-medium text-xs">
                    End-of-Support from OEM, Laser block calibration drift
                  </td>
                  <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface font-semibold">₹28,00,000</td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono-badge text-mono-badge bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-DEFAULT text-[10px]">
                      Pre-RBER Technical Audit
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onShowToast('Unit Inspection', 'Scheduling engineering appraisal for ABI 7500 Fast.')}
                      className="text-secondary font-label-sm text-label-sm hover:underline font-semibold cursor-pointer"
                      type="button"
                    >
                      Inspect Unit
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-headline-sm text-headline-sm text-primary font-semibold">
                      Biosafety Cabinet (Esco AIRSTREAM)
                    </div>
                    <div className="font-mono-data text-mono-data text-outline text-xs">
                      Serial: ESCO-AC2-2014 • Barcode: BSC-ESC-01
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-body-sm text-body-sm text-on-surface">Molecular Diagnostic</div>
                    <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-1 py-0.2 rounded-DEFAULT text-[10px]">
                      NRCP | NVHCP
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface">2014-01-31</td>
                  <td className="py-2.5 px-3 text-on-surface-variant font-medium text-xs">
                    Motor blower failure, duct velocity non-compliant to EN12469
                  </td>
                  <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface font-semibold">₹4,80,000</td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono-badge text-mono-badge bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-DEFAULT text-[10px]">
                      Under BME Assessment
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onShowToast('Unit Inspection', 'Esco Airstream duct velocity measurement scheduled.')}
                      className="text-secondary font-label-sm text-label-sm hover:underline font-semibold cursor-pointer"
                      type="button"
                    >
                      Inspect Unit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 4: HISTORICAL BREAKDOWN & CAPA AUDIT LOG */}
      <div className="bg-surface-container-lowest p-4 lg:p-5 rounded-xl shadow-sm border border-[#eceef0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 gap-3 border-b border-[#eceef0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">
                Historical Breakdown, Downtime &amp; RCA / CAPA Audit Log
              </h2>
              <span className="font-mono-badge text-mono-badge bg-surface-container-low text-on-surface px-2 py-0.5 rounded-DEFAULT font-mono">
                ALL 40 ASSETS
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Archived service tickets with Root Cause Analysis (RCA) and Corrective &amp; Preventive Action (CAPA) compliance.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[17px] text-outline">search</span>
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="bg-surface-container-low pl-8 pr-3 py-1.5 rounded-DEFAULT text-body-sm font-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-sm w-60 border border-[#e0e3e5]"
                placeholder="Search ticket, serial, fault..."
              />
            </div>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-body-sm font-body-sm text-on-surface focus:outline-none border border-[#e0e3e5]"
            >
              <option value="all">All Sections (Molecular, Media, VPD)</option>
              <option value="Molecular Diagnostic">Molecular Diagnostic</option>
              <option value="VPD Surveillance">VPD Surveillance</option>
              <option value="Media">Media Room</option>
            </select>
          </div>
        </div>

        {/* Historical Table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left font-body-sm text-body-sm border-collapse">
            <thead className="bg-surface-container-low text-on-surface font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Ticket ID &amp; Reported</th>
                <th className="py-2.5 px-3">Equipment &amp; Section</th>
                <th className="py-2.5 px-3">Nature of Fault / Root Cause (RCA)</th>
                <th className="py-2.5 px-3">Service Agency &amp; Eng. Call</th>
                <th className="py-2.5 px-3">Downtime Hours</th>
                <th className="py-2.5 px-3">Resolution &amp; CAPA</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0]">
              {filteredHistory.map((item) => (
                <tr key={item.ticketId} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono-data text-mono-data text-primary font-bold">{item.ticketId}</span>
                    <span className="font-mono-badge text-mono-badge text-outline block mt-0.5 text-[10px]">
                      {item.reportedDate}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                      By: {item.reportedBy}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {item.equipmentName}
                    </div>
                    <div className="font-mono-data text-mono-data text-secondary text-xs">SN: {item.serialNumber}</div>
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface-variant px-1 rounded-DEFAULT text-[10px]">
                      {item.section}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-body-sm text-body-sm text-on-surface font-medium">{item.natureOfFault}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
                      <strong className="font-semibold text-primary">RCA:</strong> {item.rootCause}
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-body-sm text-body-sm text-on-surface font-medium">{item.serviceAgency}</div>
                    <div className="font-mono-data text-mono-data text-outline text-[11px]">{item.engineerCallRef}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-mono-data text-mono-data text-primary font-bold">
                      <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                      <span>{item.downtimeHours} Hrs</span>
                    </div>
                    <span className="font-mono-badge text-mono-badge text-secondary font-semibold text-[10px]">
                      Zero Sample Loss
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      <strong className="font-semibold text-primary">CAPA:</strong> {item.correctiveAction}
                    </p>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-1 rounded-DEFAULT font-semibold inline-flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      CLOSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-2 font-body-sm text-body-sm text-on-surface-variant text-xs">
          <span>Showing {filteredHistory.length} resolved breakdown records across 40 assets (ISO 15189 Retention: 5 Years)</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 bg-surface-container-low rounded-DEFAULT text-on-surface cursor-pointer" type="button">Prev</button>
            <span className="px-2 py-1 bg-primary text-on-primary rounded-DEFAULT font-semibold">1</span>
            <button className="px-2 py-1 bg-surface-container-low rounded-DEFAULT text-on-surface cursor-pointer" type="button">2</button>
            <button className="px-2 py-1 bg-surface-container-low rounded-DEFAULT text-on-surface cursor-pointer" type="button">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

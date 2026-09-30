import React from 'react';
import { ActiveRole } from '../types';

interface HeaderProps {
  currentRole: ActiveRole;
  onOpenEntryModal: () => void;
  onOpenBreakdownModal: () => void;
  onExportMaster: () => void;
  onToggleRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onOpenEntryModal,
  onOpenBreakdownModal,
  onExportMaster,
  onToggleRole
}) => {
  const isAdmin = currentRole === 'ADMIN';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 border-b border-[#eceef0]">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3 min-w-[280px]">
          <img
            alt="NABL Lab Equipment Portal Logo"
            className="h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VHyXixVBMmBj2bcTVqZTcBd-9UDw_qwWnwCpyO6iIQn-IcidfximAc3YFpETezqnSzvLBVjt8g2gGW3UdkIORVqKJMJrlVlVczrSPmdbY9yZuqie0yZXVbgs1Eah_hTY8VS77efDmtgUDqherZNnox2j_7Haf_pbZ_j7r508a1iz9AnkNzmxKLFX7udSYxT58hiyPPpdQoNDHe1O8LwfUiTHYFbQxnt3QMh_N6RHK3IAaqPl3BGP4t2uk"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-tight">
                NABL LabEquip Master
              </span>
              <span className="bg-primary-container text-on-primary font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT uppercase">
                ISO 15189
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Clinical &amp; Public Health Equipment Monitoring
            </span>
          </div>
        </div>

        {/* Center Audit Indicator & Action Buttons */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-[#e0e3e5]/60">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0"></span>
            <span className="font-label-sm text-label-sm text-on-surface">Audit Mode: Cycle 2026</span>
            <span className="text-outline-variant">|</span>
            <span className="font-mono-data text-mono-data text-secondary font-semibold">Traceability: 98.4%</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onExportMaster}
              className="bg-surface-container-lowest text-primary font-label-md text-label-md px-3 py-1.5 rounded-DEFAULT shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:bg-surface-container-high transition-colors flex items-center gap-1 border border-[#e0e3e5]/80 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              Export
            </button>
            <button
              onClick={onOpenEntryModal}
              className="bg-primary text-on-primary font-label-md text-label-md px-3 py-1.5 rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Equipment
            </button>
            <button
              onClick={onOpenBreakdownModal}
              className="bg-error text-on-error font-label-md text-label-md px-3 py-1.5 rounded-DEFAULT hover:bg-on-error-container transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Report Breakdown
            </button>
          </div>
        </div>

        {/* Right Authenticated User & Google SSO */}
        <div className="flex items-center gap-3">
          <div
            onClick={onToggleRole}
            className="hidden sm:flex flex-col items-end cursor-pointer group"
            title="Click to toggle between Admin and Staff"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT font-semibold ${
                  isAdmin ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {currentRole}
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-secondary transition-colors">
                {isAdmin ? 'sareena.m.salim@gmail.com' : 'vpdsurveillancesphcl@gmail.com'}
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Google Workspace SSO
            </span>
          </div>

          <button
            onClick={onToggleRole}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer text-white shadow-sm"
            title={`Logged in as ${currentRole} - Click to switch`}
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};

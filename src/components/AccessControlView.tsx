import React, { useState } from 'react';
import { ActiveRole, AuditLogItem } from '../types';

interface AccessControlViewProps {
  currentRole: ActiveRole;
  onChangeRole: (role: ActiveRole) => void;
  auditLogs: AuditLogItem[];
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const AccessControlView: React.FC<AccessControlViewProps> = ({
  currentRole,
  onChangeRole,
  auditLogs,
  onShowToast
}) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoProvisionEnabled, setAutoProvisionEnabled] = useState(true);
  const [auditFilter, setAuditFilter] = useState('');

  const isAdmin = currentRole === 'ADMIN';

  const handleCopyClientId = () => {
    navigator.clipboard?.writeText('849102847291-labequip-prod.apps.googleusercontent.com');
    onShowToast('OAuth Client ID Copied', 'Copied Google Workspace OAuth 2.0 Client ID to clipboard.', 'content_copy');
  };

  const handleExportAudit = () => {
    onShowToast('Audit Log Exported', 'Downloaded cryptographically signed 21 CFR Part 11 audit ledger (CSV).', 'download');
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      !auditFilter ||
      log.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.targetEquipment.toLowerCase().includes(auditFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Operational Banner & Meta Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-mono-badge text-mono-badge bg-primary text-on-primary px-2 py-0.5 rounded-DEFAULT tracking-wider uppercase">
              NABL ISO 15189:2022
            </span>
            <span className="font-mono-badge text-mono-badge bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
              21 CFR PART 11
            </span>
            <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              AUTH SERVER: ONLINE
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Access Control, User Roles &amp; Google SSO Configuration
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Manage laboratory staff credentials, Google Workspace authentication, role permissions, and NABL 21 CFR Part 11 compliant audit trail logs.
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-[#eceef0] self-start lg:self-center">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-container-low rounded-lg border border-[#e0e3e5]/60">
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface leading-none">OAuth 2.0 PKCE</span>
              <span className="font-mono-badge text-mono-badge text-on-surface-variant text-[10px]">Google Identity v3</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-surface-container-high"></div>

          <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-container-low rounded-lg border border-[#e0e3e5]/60">
            <span className="material-symbols-outlined text-[18px] text-primary">timer</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface leading-none">Idle Timeout</span>
              <span className="font-mono-badge text-mono-badge text-on-surface-variant text-[10px]">15m (NABL Compliant)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Active Role Switcher Simulator & Google IDP Engine */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-5">
        {/* Module 1: Interactive Active Session & Simulator (8 cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-4 lg:p-5 flex flex-col justify-between border border-[#eceef0] relative overflow-hidden">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Active User Session &amp; Quick Role Switcher</h2>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Live simulator for testing role-specific permissions and authorization barriers
                  </span>
                </div>
              </div>

              <span
                className={`font-mono-badge text-mono-badge px-2.5 py-1 rounded-DEFAULT tracking-wide font-semibold ${
                  isAdmin ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                CURRENT SESSION: {currentRole}
              </span>
            </div>

            {/* Dynamic User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* User A: Admin Card */}
              <div
                onClick={() => onChangeRole('ADMIN')}
                className={`relative p-3.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isAdmin
                    ? 'bg-surface-container-low border-secondary shadow-md ring-1 ring-secondary'
                    : 'bg-surface-container-lowest border-[#eceef0] opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm shadow-sm">
                      SS
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          Dr. Sareena M. Salim
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-secondary" title="Google Workspace Verified Identity">
                          verified
                        </span>
                      </div>
                      <span className="font-mono-data text-mono-data text-on-surface-variant block text-xs">
                        sareena.m.salim@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-badge text-mono-badge bg-primary text-on-primary px-1.5 py-0.5 rounded-DEFAULT text-[10px]">
                    ADMIN
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-[#eceef0]/60 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">Institutional Role:</span>
                    <span className="text-on-surface font-semibold">Lab Director / Quality Manager</span>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">SSO Status:</span>
                    <span className="font-mono-badge text-mono-badge text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Verified Google SSO
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">Full R/W</span>
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">Condemn Approval</span>
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">CSV Batch Master</span>
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">Role Delegation</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between font-label-sm text-label-sm text-secondary font-semibold text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      {isAdmin ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    {isAdmin ? 'Active In Shell' : 'Click to switch role'}
                  </span>
                  <span className="font-mono-badge text-mono-badge text-on-surface-variant">UID: #SSO-001-ADM</span>
                </div>
              </div>

              {/* User B: Staff Card */}
              <div
                onClick={() => onChangeRole('STAFF')}
                className={`relative p-3.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                  !isAdmin
                    ? 'bg-surface-container-low border-secondary shadow-md ring-1 ring-secondary'
                    : 'bg-surface-container-lowest border-[#eceef0] opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-headline-sm text-headline-sm shadow-sm">
                      VP
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          VPD Surveillance Lab
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-secondary" title="Google Workspace Verified Identity">
                          verified
                        </span>
                      </div>
                      <span className="font-mono-data text-mono-data text-on-surface-variant block text-xs">
                        vpdsurveillancesphcl@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-badge text-mono-badge bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded-DEFAULT text-[10px]">
                    STAFF
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-[#eceef0]/60 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">Institutional Role:</span>
                    <span className="text-on-surface font-semibold">Technical Officer / Lab Operator</span>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">SSO Status:</span>
                    <span className="font-mono-badge text-mono-badge text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Verified Google SSO
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">Inventory View</span>
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">Breakdown Log</span>
                    <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">Calibration Input</span>
                    <span className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-1.5 py-0.5 rounded-DEFAULT text-[10px]">Delete Locked</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      {!isAdmin ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    {!isAdmin ? 'Active In Shell' : 'Click to switch role'}
                  </span>
                  <span className="font-mono-badge text-mono-badge text-on-surface-variant">UID: #SSO-042-STF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Simulation Strip */}
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low p-3 rounded-lg border border-[#e0e3e5]/70">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
              <span className="font-body-sm text-body-sm text-on-surface">
                {isAdmin ? (
                  <>
                    Currently authenticated as <strong>Dr. Sareena M. Salim (ADMIN)</strong>. All condemnation, delete, and master commit locks unlocked.
                  </>
                ) : (
                  <>
                    Currently authenticated as <strong>VPD Surveillance Lab (STAFF)</strong>. Decommissioning, Delete, and RBER approvals are strictly locked.
                  </>
                )}
              </span>
            </div>

            <button
              onClick={() => {
                const nextRole = isAdmin ? 'STAFF' : 'ADMIN';
                onChangeRole(nextRole);
                onShowToast('Session Switched', `Active user simulated as ${nextRole}.`);
              }}
              className="bg-primary text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              Switch Active Simulated User
            </button>
          </div>
        </div>

        {/* Module 2: Google SSO & IdP Configuration (4 cols) */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm p-4 lg:p-5 flex flex-col justify-between border border-[#eceef0]">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" fill="#4285F4"></path>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
                  <path d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z" fill="#FBBC05"></path>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" fill="#EA4335"></path>
                </svg>
                <h2 className="font-headline-sm text-headline-sm text-primary">Identity Provider (IdP)</h2>
              </div>
              <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 mt-3">
              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-[#e0e3e5]/60">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">Authorized Google Domains</span>
                <div className="flex items-center gap-1.5 font-mono-data text-mono-data text-on-surface font-semibold text-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">domain</span>
                  sphcl.gov.in, gmail.com
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-[#e0e3e5]/60">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">OAuth 2.0 Client ID</span>
                <div className="flex items-center justify-between font-mono-badge text-mono-badge text-on-surface bg-surface-container-lowest px-2 py-1.5 rounded-DEFAULT border border-[#e0e3e5]">
                  <span className="truncate text-[10px]">849102847291-labequip-prod.apps.googleusercontent.com</span>
                  <button
                    onClick={handleCopyClientId}
                    className="text-secondary hover:text-primary transition-colors ml-1 cursor-pointer"
                    title="Copy Client ID"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-[#e0e3e5]/60">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface text-xs font-semibold">Mandatory 2FA / MFA</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Hardware key or Google Authenticator</span>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-10 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${
                    twoFactorEnabled ? 'bg-secondary' : 'bg-surface-container-high'
                  }`}
                  type="button"
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-[#e0e3e5]/60">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface text-xs font-semibold">Auto-Provisioning</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Allow lab staff SSO domain sync</span>
                </div>
                <button
                  onClick={() => setAutoProvisionEnabled(!autoProvisionEnabled)}
                  className={`w-10 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${
                    autoProvisionEnabled ? 'bg-secondary' : 'bg-surface-container-high'
                  }`}
                  type="button"
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      autoProvisionEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#eceef0]">
            <button
              onClick={() => onShowToast('Google Cloud Console', 'Opening Google Cloud Console API & Services configuration panel...')}
              className="w-full bg-surface-container text-primary hover:bg-surface-container-high transition-colors font-label-md text-label-md py-2 rounded-DEFAULT flex items-center justify-center gap-1.5 cursor-pointer text-xs border border-[#e0e3e5]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">settings</span>
              Manage Google Cloud Console API Credentials
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Role Permission Matrix (NABL ISO 15189 Security Standard) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 lg:p-5 mb-5 border border-[#eceef0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-3 border-b border-[#eceef0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">policy</span>
              <h2 className="font-headline-sm text-headline-sm text-primary">
                Role Permission Matrix (ISO 15189:2022 §5.3 / 21 CFR Part 11)
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
              Strict authorization boundaries enforced across Clinical, Media Room, and Molecular Diagnostic sections.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant text-xs">Immutable Audit Mode:</span>
            <span className="font-mono-badge text-mono-badge bg-surface-container-high text-primary px-2 py-0.5 rounded-DEFAULT font-bold">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Tabular Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md text-body-md">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider text-xs">
                <th className="py-2.5 px-3">Clinical Laboratory Action / Capability</th>
                <th className="py-2.5 px-3">Scope &amp; NABL Impact</th>
                <th className="py-2.5 px-3 text-center bg-primary-container text-on-primary rounded-t-DEFAULT">
                  Admin (sareena.m.salim@gmail.com)
                </th>
                <th className="py-2.5 px-3 text-center">
                  Staff (vpdsurveillancesphcl@gmail.com)
                </th>
                <th className="py-2.5 px-3 text-center">
                  External Assessor / Auditor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0] text-xs">
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">inventory_2</span>
                  View Equipment Master &amp; Detail Logs
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Inspect all 40 assets (Molecular, Media, VPD Surveillance)
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Allowed
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Allowed
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Read-Only
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">add_box</span>
                  Add Single / Batch Equipment (CSV Upload)
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Instantiate asset barcodes, serials, and installation dates
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Full Access
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Single Item Only
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">block</span> Denied
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">edit_note</span>
                  Edit Equipment Metadata &amp; Program Tagging
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Modify location, program pills (NRCP, NVHCP, VPD), serials
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Direct Edit
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">pending_actions</span> Approval Req.
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">block</span> Denied
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-error">delete_forever</span>
                  Permanent Equipment Deletion
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Purge record from live registry (Requires dual confirmation)
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-primary text-on-primary px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">lock_open</span> Admin Only
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-error-container text-on-error-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">lock</span> Strict Locked
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">block</span> Denied
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-error">report_problem</span>
                  Log Breakdown Ticket &amp; Clinical Impact
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Halt test runs, trigger biomedical downtime clock
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Allowed
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Allowed
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">block</span> Denied
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">gavel</span>
                  Approve RBER &amp; Decommission / Condemnation
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Certify Repair Beyond Economic Repair &amp; scrap disposal
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-primary text-on-primary px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">shield</span> Quality Sign-off
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-error-container text-on-error-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">lock</span> Unauthorized
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">visibility</span> View Only
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">download_for_offline</span>
                  Download NABL Certificates &amp; Master SOPs
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Access signed PDF certificates and calibration records
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Unlimited
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Section Docs
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Full Review
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">file_download</span>
                  Export Immutable Audit Trail &amp; Regulatory Log
                </td>
                <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface-variant">
                  Cryptographically signed CSV / PDF extraction for accreditation
                </td>
                <td className="py-2.5 px-3 text-center bg-primary-container/5">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Full Export
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">block</span> Restricted
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT">
                    <span className="material-symbols-outlined text-[14px]">check</span> Export Audit
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Live Audit Trail & Google SSO Modal Preview Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-5">
        {/* Module 4: Regulatory Audit Trail Log (8 cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-4 lg:p-5 flex flex-col justify-between border border-[#eceef0]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-[#eceef0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Regulatory Audit Trail Log</h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
                  Time-stamped, user-attributed activity ledger satisfying NABL ISO 15189 clause 5.3 equipment control.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  placeholder="Filter audit log..."
                  className="bg-surface-container-low text-xs px-2.5 py-1 rounded-DEFAULT border border-[#e0e3e5] focus:outline-none"
                />
                <button
                  onClick={handleExportAudit}
                  className="bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-DEFAULT flex items-center gap-1 hover:bg-primary-container transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span> Export Audit CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-md text-body-md">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider text-xs">
                    <th className="py-2 px-3">Timestamp (IST)</th>
                    <th className="py-2 px-3">Authenticated User</th>
                    <th className="py-2 px-3">Action &amp; Target Equipment</th>
                    <th className="py-2 px-3">Origin IP / Ref</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceef0] text-xs">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono-badge text-mono-badge px-1 rounded-DEFAULT text-[10px] ${
                              log.userRole === 'ADMIN'
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {log.userRole === 'ADMIN' ? 'ADM' : 'STF'}
                          </span>
                          <span className="font-mono-data text-mono-data text-on-surface truncate max-w-[150px]">
                            {log.userEmail}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-body-sm text-body-sm text-on-surface">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 font-mono-badge text-mono-badge text-on-surface-variant text-[11px]">
                        {log.originIp}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span
                          className={`font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT text-[10px] font-semibold ${
                            log.status === 'SUCCESS' || log.status === 'COMPLETE'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-error-container text-on-error-container'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#eceef0] font-label-sm text-label-sm text-on-surface-variant text-xs">
            <span>Showing {filteredLogs.length} audit events in Cycle 2026</span>
            <button
              onClick={() => onShowToast('Ledger Integrity', '21 CFR Part 11 ledger validated with zero gaps in chain of custody.')}
              className="text-secondary hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              View Full 21 CFR Audit Ledger <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Module 5: Google SSO Sign-In Component Preview (4 cols) */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm p-4 lg:p-5 flex flex-col justify-between border border-[#eceef0]">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">login</span>
                <h2 className="font-headline-sm text-headline-sm text-primary">SSO Modal Preview</h2>
              </div>
              <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">
                CLIENT UI
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 text-xs">
              Live simulation of the laboratory Google Workspace Single Sign-On picker displayed on login.
            </p>

            {/* Google Sign-In Card Container */}
            <div className="bg-surface-container-low p-3.5 rounded-xl shadow-inner flex flex-col items-center border border-[#e0e3e5]/70">
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" fill="#4285F4"></path>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
                  <path d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z" fill="#FBBC05"></path>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" fill="#EA4335"></path>
                </svg>
              </div>

              <span className="font-headline-sm text-headline-sm text-on-surface">Sign in with Google</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mb-3 text-xs">
                to continue to NABL LabEquip Master
              </span>

              {/* Account Selectors */}
              <div className="w-full flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    onChangeRole('ADMIN');
                    onShowToast('SSO Login Success', 'Logged in as Dr. Sareena M. Salim (ADMIN).');
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer shadow-sm text-left border border-[#e0e3e5]"
                  type="button"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center text-xs font-bold">
                    S
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-label-md text-label-md text-on-surface truncate text-xs">Dr. Sareena M. Salim</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate text-[11px]">sareena.m.salim@gmail.com</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                </button>

                <button
                  onClick={() => {
                    onChangeRole('STAFF');
                    onShowToast('SSO Login Success', 'Logged in as VPD Surveillance Lab (STAFF).');
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer shadow-sm text-left border border-[#e0e3e5]"
                  type="button"
                >
                  <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center text-xs font-bold">
                    V
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-label-md text-label-md text-on-surface truncate text-xs">VPD Surveillance Lab</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate text-[11px]">vpdsurveillancesphcl@gmail.com</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                </button>

                <button
                  onClick={() => onShowToast('Google Account Picker', 'Enter institutional Google Workspace email ID...')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest/60 hover:bg-surface-container transition-colors cursor-pointer text-left text-xs"
                  type="button"
                >
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface text-xs">Use another account</span>
                </button>
              </div>

              <div className="mt-3 text-center">
                <span className="font-mono-badge text-mono-badge text-on-surface-variant text-[9px]">
                  Protected by Google Cloud Identity SSO • Strict SSL SHA-256
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#eceef0]">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm text-xs">
              <span>Security Token TTL:</span>
              <span className="font-mono-data text-mono-data font-semibold text-primary">54m 12s remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Program Coverage & Section Compliance Bar */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-3.5 flex flex-wrap items-center justify-between gap-3 border border-[#eceef0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              Certified Institutional Accreditation Status
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
              Role-Based Access Control (RBAC) covers 40 verified items across NRCP, NVHCP, VPD, PPCL &amp; State Programs.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono-badge text-mono-badge bg-surface-container-low text-on-surface px-2.5 py-1 rounded-DEFAULT text-[11px]">
            VPD SURVEILLANCE
          </span>
          <span className="font-mono-badge text-mono-badge bg-surface-container-low text-on-surface px-2.5 py-1 rounded-DEFAULT text-[11px]">
            MOLECULAR DIAGNOSTIC
          </span>
          <span className="font-mono-badge text-mono-badge bg-surface-container-low text-on-surface px-2.5 py-1 rounded-DEFAULT text-[11px]">
            MEDIA ROOM
          </span>
          <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-DEFAULT font-semibold text-[11px]">
            COMPLIANT 2026
          </span>
        </div>
      </div>
    </div>
  );
};

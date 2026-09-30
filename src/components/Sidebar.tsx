import React from 'react';
import { ActiveRole } from '../types';

export type NavigationTab = 
  | 'inventory'
  | 'calibration'
  | 'breakdown'
  | 'documents'
  | 'access';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentRole: ActiveRole;
  onChangeRole: (role: ActiveRole) => void;
  equipmentCount: number;
  calibrationDueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  onChangeRole,
  equipmentCount,
  calibrationDueCount
}) => {
  const navItems: { id: NavigationTab; label: string; badge?: string; badgeColor?: string }[] = [
    {
      id: 'inventory',
      label: 'Equipment Inventory',
      badge: `${equipmentCount}`,
      badgeColor: 'bg-surface-container text-on-surface'
    },
    {
      id: 'calibration',
      label: 'Calibration & AMC/CMC',
      badge: `${calibrationDueCount} DUE`,
      badgeColor: 'bg-error-container text-on-error-container font-bold'
    },
    {
      id: 'breakdown',
      label: 'Breakdown, Downtime & RBER'
    },
    {
      id: 'documents',
      label: 'NABL Documents & SOPs'
    },
    {
      id: 'access',
      label: 'Access Control & Roles'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-low z-40 flex flex-col justify-between py-3 border-r border-[#eceef0]">
      <div className="flex flex-col gap-3">
        {/* Active Program Card */}
        <div className="px-3">
          <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e0e3e5]/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block text-[10px]">
              Active Program
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0"></span>
              <span className="font-headline-sm text-headline-sm text-on-surface truncate text-[14px]">
                VPD &amp; PPCL Surveillance
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors text-left font-label-md text-label-md cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`font-mono-badge text-mono-badge px-1.5 py-0.5 rounded-DEFAULT shrink-0 ml-1.5 ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher Pill */}
      <div className="px-3">
        <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-1.5 border border-[#e0e3e5]/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">
              Role Switcher
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          </div>

          <div className="flex items-center justify-between bg-surface-container-low p-1 rounded-DEFAULT">
            <button
              onClick={() => onChangeRole('ADMIN')}
              className={`flex-1 font-mono-badge text-mono-badge py-1 text-center rounded-DEFAULT transition-all cursor-pointer ${
                currentRole === 'ADMIN'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              ADMIN
            </button>
            <button
              onClick={() => onChangeRole('STAFF')}
              className={`flex-1 font-mono-badge text-mono-badge py-1 text-center rounded-DEFAULT transition-all cursor-pointer ${
                currentRole === 'STAFF'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              STAFF
            </button>
          </div>

          <span className="font-mono-badge text-mono-badge text-outline text-[10px] text-center truncate">
            {currentRole === 'ADMIN' ? 'sareena.m.salim@gmail.com' : 'vpdsurveillancesphcl@gmail.com'}
          </span>
        </div>
      </div>
    </aside>
  );
};

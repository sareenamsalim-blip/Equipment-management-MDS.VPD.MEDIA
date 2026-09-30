import React, { useState, useMemo } from 'react';
import { Equipment, ActiveRole } from '../types';

interface InventoryViewProps {
  equipmentList: Equipment[];
  currentRole: ActiveRole;
  onOpenEntryModal: (item?: Equipment) => void;
  onOpenBatchModal: () => void;
  onDeleteEquipment: (id: string) => void;
  onOpenBreakdown: () => void;
  onSelectTab: (tab: any) => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  equipmentList,
  currentRole,
  onOpenEntryModal,
  onOpenBatchModal,
  onDeleteEquipment,
  onOpenBreakdown,
  onSelectTab,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const isAdmin = currentRole === 'ADMIN';

  // Filtered list
  const filteredList = useMemo(() => {
    return equipmentList.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.make.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.barcode.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      const matchSection = sectionFilter === 'ALL' || item.section === sectionFilter;
      const matchProgram = programFilter === 'ALL' || item.programs.some((p) => p.includes(programFilter));

      let matchStatus = true;
      if (statusFilter === 'working') {
        matchStatus = item.status === 'working';
      } else if (statusFilter === 'not_working') {
        matchStatus = item.status === 'not_working' || item.status === 'under_rber';
      } else if (statusFilter === 'cal_due') {
        matchStatus =
          item.calibrationDueDate.toLowerCase().includes('due') ||
          item.calibrationDueDate.toLowerCase().includes('expired') ||
          item.calibrationDueDate <= '2026-04-30';
      } else if (statusFilter === 'pm_due') {
        matchStatus = item.pmDueDate.includes('2026-04') || item.pmDueDate.includes('2026-03');
      }

      return matchSearch && matchSection && matchProgram && matchStatus;
    });
  }, [equipmentList, searchTerm, sectionFilter, programFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const pagedList = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredList.slice(start, start + rowsPerPage);
  }, [filteredList, currentPage, rowsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(pagedList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSectionFilter('ALL');
    setProgramFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
    onShowToast('Filters Reset', 'Displaying all 40 assets in master registry.');
  };

  const handleExport = (format: string) => {
    setExportMenuOpen(false);
    onShowToast(
      `Exporting Master (${format})`,
      `Downloaded NABL Form-02 master ledger for ${equipmentList.length} surveillance assets.`
    );
  };

  // KPIs
  const totalAssets = equipmentList.length;
  const workingCount = equipmentList.filter((e) => e.status === 'working').length;
  const healthPercent = totalAssets ? ((workingCount / totalAssets) * 100).toFixed(1) : '100.0';
  const calQueueCount = equipmentList.filter(
    (e) =>
      e.calibrationDueDate.toLowerCase().includes('due') ||
      e.calibrationDueDate.toLowerCase().includes('expired') ||
      e.calibrationDueDate <= '2026-04-30'
  ).length;

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Operational Banner */}
      <div className="mb-4 p-3 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-[#eceef0]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-DEFAULT bg-primary flex items-center justify-center shrink-0 text-white">
            <span className="material-symbols-outlined text-on-primary text-[18px]">verified_user</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-headline-sm text-headline-sm text-primary">
                Master Equipment Registry (NABL Form-EQ-02)
              </span>
              <span className="bg-primary text-on-primary font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                LIVE AUDIT ACCESS
              </span>
              <span className="bg-secondary/15 text-secondary font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                ISO 15189:2022 §5.3
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {isAdmin ? (
                <>
                  Logged in as <strong className="font-semibold text-primary">Admin (sareena.m.salim@gmail.com)</strong>: Full operational privileges granted to register, decommission, recalibrate, or assess RBER. Staff account (<span className="font-mono-data text-mono-data">vpdsurveillancesphcl@gmail.com</span>) restricted to View &amp; Incident Log.
                </>
              ) : (
                <>
                  Logged in as <strong className="font-semibold text-secondary">Staff (vpdsurveillancesphcl@gmail.com)</strong>: Operator mode active. Decommissioning and permanent deletes are locked to Quality Manager.
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
          <span className="font-mono-badge text-mono-badge text-outline uppercase tracking-wider text-[10px]">
            Node: SPHCL-KL-01
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-mono-data text-mono-data text-secondary text-[11px]">Real-Time Sync</span>
        </div>
      </div>

      {/* Bento Grid: 5 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {/* Card 1: Total Registry */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Total Registry
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">precision_manufacturing</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">{totalAssets}</span>
              <span className="font-mono-data text-mono-data text-on-surface-variant">Assets</span>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-1">
              <span>3 Divisions</span>
              <span className="font-mono-badge text-mono-badge bg-surface-container px-1.5 py-0.5 rounded-DEFAULT text-primary">
                100% Accounted
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full w-full"></div>
          </div>
        </div>

        {/* Card 2: Operational Health */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Operational Status
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">{healthPercent}%</span>
              <span className="font-mono-data text-mono-data text-on-surface-variant">{workingCount}/{totalAssets}</span>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm mt-1">
              <span className="text-error font-semibold text-[11px]">1 Breakdown Active</span>
              <button
                onClick={onOpenBreakdown}
                className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-1 py-0.5 rounded-DEFAULT hover:opacity-80"
              >
                TICKET #081
              </button>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden flex">
            <div className="bg-secondary h-full" style={{ width: `${healthPercent}%` }}></div>
            <div className="bg-error h-full" style={{ width: `${100 - parseFloat(healthPercent)}%` }}></div>
          </div>
        </div>

        {/* Card 3: Calibration Queue */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Calibration Queue
            </span>
            <span className="material-symbols-outlined text-error text-[20px]">history_edu</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-error font-bold">04</span>
              <span className="font-mono-data text-mono-data text-error font-medium">Due &lt;60 Days</span>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-1 truncate">
              <span className="truncate text-[11px]">Vestfrost, Healforce, +2</span>
              <button
                onClick={() => onSelectTab('calibration')}
                className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-1.5 py-0.5 rounded-DEFAULT font-bold hover:opacity-80 cursor-pointer"
              >
                ACTION
              </button>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-error h-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Card 4: AMC / CMC Status */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Contractual Cover
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">34</span>
              <span className="font-mono-data text-mono-data text-on-surface-variant">Active AMC/CMC</span>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-1">
              <span className="text-[11px]">6 Dept Warranty</span>
              <span className="font-mono-badge text-mono-badge bg-surface-container text-primary px-1.5 py-0.5 rounded-DEFAULT">
                0 Lapsed
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Card 5: Condemnation / RBER */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              RBER Assessment
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">rule_folder</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">01</span>
              <span className="font-mono-data text-mono-data text-on-surface-variant">In Review</span>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-1">
              <span className="text-[11px]">0 Condemned</span>
              <button
                onClick={() => onSelectTab('breakdown')}
                className="font-mono-badge text-mono-badge bg-surface-container-high text-primary px-1.5 py-0.5 rounded-DEFAULT hover:underline"
              >
                Bio-Rad iMark
              </button>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      {/* Operational Filter Toolbar & Global Action Drawer */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm mb-3.5 flex flex-col gap-3 border border-[#eceef0]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input with barcode hints */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-16 py-2 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest shadow-inner border border-transparent focus:border-secondary transition-all"
              placeholder="Search 40 assets by Equipment Name, Make, Model, Barcode (e.g., BIO-RD-IMK) or Serial..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
              <kbd className="font-mono-badge text-mono-badge bg-surface-container px-1 py-0.5 rounded text-outline-variant text-[10px]">
                CTRL + K
              </kbd>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap shrink-0">
            {/* Batch Upload Trigger */}
            <button
              onClick={onOpenBatchModal}
              className="bg-surface-container-low text-primary hover:bg-surface-container-high font-label-md text-label-md px-3 py-2 rounded-DEFAULT transition-colors flex items-center gap-1.5 border border-[#e0e3e5]/70 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Batch / Dropzone</span>
            </button>

            {/* New Single Entry Trigger */}
            <button
              onClick={() => onOpenEntryModal()}
              className="bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md px-3 py-2 rounded-DEFAULT shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ Single Equipment</span>
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-md text-label-md px-3 py-2 rounded-DEFAULT shadow-sm flex items-center gap-1 border border-[#e0e3e5]/80 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export Master</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-surface-container-lowest shadow-xl rounded-lg py-1 z-30 border border-[#eceef0]">
                  <button
                    onClick={() => handleExport('CSV')}
                    className="w-full px-3 py-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[16px]">table_view</span>
                      Full Master (CSV)
                    </span>
                    <span className="font-mono-badge text-mono-badge text-outline">40 ROWS</span>
                  </button>
                  <button
                    onClick={() => handleExport('PDF')}
                    className="w-full px-3 py-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">picture_as_pdf</span>
                      NABL Form-02 PDF
                    </span>
                    <span className="font-mono-badge text-mono-badge text-secondary">ISO 15189</span>
                  </button>
                  <button
                    onClick={() => handleExport('Calibration Due Sheet')}
                    className="w-full px-3 py-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-error text-[16px]">alarm</span>
                      Calibration Due Sheet
                    </span>
                    <span className="font-mono-badge text-mono-badge text-error">4 ASSETS</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#eceef0]/60">
          {/* Section Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-DEFAULT border border-[#e0e3e5]/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Section:</span>
            <select
              value={sectionFilter}
              onChange={(e) => {
                setSectionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-label-md text-label-md text-primary focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Sections (3)</option>
              <option value="Molecular Diagnostic">Molecular Diagnostic</option>
              <option value="VPD Surveillance">VPD Surveillance</option>
              <option value="Media">Media Room</option>
            </select>
          </div>

          {/* Program Multi-filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-DEFAULT border border-[#e0e3e5]/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Program:</span>
            <select
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-label-md text-label-md text-primary focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Linked Programs (6)</option>
              <option value="NRCP">NRCP (Rabies Surveillance)</option>
              <option value="MR Surveillance">MR (Measles-Rubella)</option>
              <option value="NVHCP">NVHCP (Viral Hepatitis)</option>
              <option value="NVBDCP">NVBDCP (Vector Borne)</option>
              <option value="PPCL">PPCL (Polio Surveillance)</option>
              <option value="State Program">State Surveillance</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-DEFAULT border border-[#e0e3e5]/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-label-md text-label-md text-primary focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="working">Working Only ({workingCount})</option>
              <option value="not_working">Breakdown / Not Working</option>
              <option value="cal_due">Calibration Overdue / Due &lt;60d ({calQueueCount})</option>
              <option value="pm_due">PM Scheduled</option>
            </select>
          </div>

          {/* Quick Reset / Summary */}
          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono-badge text-mono-badge text-outline uppercase text-[10px]">
              Active Results: <span className="font-bold text-primary">{filteredList.length} displayed</span> / {equipmentList.length} total
            </span>
            <button
              onClick={handleResetFilters}
              className="font-label-sm text-label-sm text-secondary hover:underline cursor-pointer text-xs"
              type="button"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Primary Equipment Master Data Grid */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-[#eceef0]">
        {/* Batch action floating strip when items selected */}
        <div className="bg-primary px-4 py-2 text-on-primary flex items-center justify-between text-body-sm font-body-sm">
          <div className="flex items-center gap-3">
            <span className="font-mono-data text-mono-data font-semibold">
              {pagedList.length} of {equipmentList.length} Equipments Displayed
            </span>
            <span className="text-on-primary-container">|</span>
            <span className="text-on-primary-container text-body-sm">
              {selectedIds.length > 0 ? (
                <strong className="text-tertiary-fixed">{selectedIds.length} items selected</strong>
              ) : (
                'Active Filter: Showing Authentic Surveillance Inventory'
              )}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onShowToast('Barcode Labels Generated', `Ready to print thermal labels for ${selectedIds.length || pagedList.length} items.`)}
              className="bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-DEFAULT flex items-center gap-1 cursor-pointer transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">qr_code_2</span> Print Barcode Labels
            </button>
            <button
              onClick={() => onShowToast('Bulk Schedule Triggered', `Calibration work orders dispatched to biomedical agency.`)}
              className="bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-DEFAULT flex items-center gap-1 cursor-pointer transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">event_repeat</span> Bulk Schedule Calibration
            </button>
          </div>
        </div>

        {/* Scrollable Table Canvas */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase select-none border-b border-[#eceef0]">
                <th className="p-2.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === pagedList.length && pagedList.length > 0}
                    onChange={handleSelectAll}
                    className="rounded-DEFAULT accent-primary cursor-pointer w-3.5 h-3.5"
                  />
                </th>
                <th className="py-2.5 px-3 min-w-[190px]">Equipment &amp; Make</th>
                <th className="py-2.5 px-3 min-w-[160px]">Model &amp; Serial / Barcode</th>
                <th className="py-2.5 px-3 min-w-[150px]">Section &amp; Location</th>
                <th className="py-2.5 px-3 min-w-[110px]">Installed</th>
                <th className="py-2.5 px-3 min-w-[130px]">Calibration Due</th>
                <th className="py-2.5 px-3 min-w-[110px]">PM Due</th>
                <th className="py-2.5 px-3 min-w-[190px]">Linked Programs</th>
                <th className="py-2.5 px-3 min-w-[130px]">Status</th>
                <th className="py-2.5 px-3 text-right min-w-[110px]">Actions ({currentRole})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0] font-body-md text-body-md text-on-surface">
              {pagedList.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isBreakdown = item.status === 'not_working' || item.status === 'under_rber';
                const isDue =
                  item.calibrationDueDate.toLowerCase().includes('due') ||
                  item.calibrationDueDate.toLowerCase().includes('expired') ||
                  item.calibrationDueDate <= '2026-03-31';

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isBreakdown
                        ? 'bg-error-container/10 hover:bg-error-container/20'
                        : isSelected
                        ? 'bg-primary-container/5 hover:bg-primary-container/10'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <td className="p-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        className="rounded-DEFAULT accent-primary cursor-pointer w-3.5 h-3.5"
                      />
                    </td>

                    {/* Equipment & Make */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          {item.name}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.make}
                        </span>
                        {item.activeTicket && (
                          <span className="font-mono-badge text-mono-badge text-error mt-0.5 flex items-center gap-1 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                            Ticket {item.activeTicket} Active
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Model & Serial / Barcode */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-mono-data text-mono-data font-semibold text-primary">
                          {item.model}
                        </span>
                        <span className="font-mono-badge text-mono-badge bg-surface-container px-1 py-0.5 rounded text-outline mt-0.5 inline-block w-fit">
                          SN: {item.serialNumber}
                        </span>
                        {item.barcode && (
                          <span className="font-mono-badge text-mono-badge text-outline-variant mt-0.5">
                            BC: {item.barcode}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Section & Location */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          {item.section}
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium italic">
                          {item.location}
                        </span>
                      </div>
                    </td>

                    {/* Installed Date */}
                    <td className="py-2.5 px-3 font-mono-data text-mono-data text-on-surface-variant">
                      {item.installedDate}
                    </td>

                    {/* Calibration Due */}
                    <td className="py-2.5 px-3">
                      {item.calibrationDueDate === 'EXPIRED' ? (
                        <span className="font-mono-data text-mono-data bg-error-container text-on-error-container px-2 py-0.5 rounded-DEFAULT font-bold block w-fit">
                          EXPIRED
                        </span>
                      ) : isDue ? (
                        <div className="flex flex-col">
                          <span className="font-mono-data text-mono-data text-error font-bold">
                            {item.calibrationDueDate}
                          </span>
                          <span className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-1 py-0.5 rounded-DEFAULT w-fit">
                            DUE NOW
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono-data text-mono-data text-on-surface-variant">
                          {item.calibrationDueDate}
                        </span>
                      )}
                    </td>

                    {/* PM Due */}
                    <td className="py-2.5 px-3 font-mono-data text-mono-data text-secondary">
                      {item.pmDueDate}
                    </td>

                    {/* Linked Programs */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.programs.map((prog, idx) => (
                          <span
                            key={idx}
                            className="font-mono-badge text-mono-badge bg-surface-container-high text-primary px-1.5 py-0.5 rounded-DEFAULT"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Operational Status */}
                    <td className="py-2.5 px-3">
                      {isBreakdown ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-mono-badge text-mono-badge bg-error text-on-error px-2 py-0.5 rounded-DEFAULT font-bold flex items-center gap-1 w-fit">
                            <span className="material-symbols-outlined text-[13px]">report</span> NOT WORKING
                          </span>
                          {item.rberReview && (
                            <span className="font-label-sm text-label-sm text-error font-medium">
                              Under RBER Review
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="font-mono-badge text-mono-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-DEFAULT font-bold flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> WORKING
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.rberReview && (
                          <button
                            onClick={() => onSelectTab('breakdown')}
                            className="p-1 rounded hover:bg-error-container text-error transition-colors cursor-pointer"
                            title="Assess RBER / Repair vs Condemn"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">balance</span>
                          </button>
                        )}
                        <button
                          onClick={() => onOpenEntryModal(item)}
                          className="p-1 rounded hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
                          title="Edit Equipment Record"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (!isAdmin) {
                              onShowToast('Action Restricted', 'Staff account is unauthorized to permanently delete or decommission equipment.', 'lock');
                              return;
                            }
                            if (confirm(`Permanently decommission and delete record for ${item.name} (${item.serialNumber})?`)) {
                              onDeleteEquipment(item.id);
                              onShowToast('Equipment Deleted', `${item.name} removed from active registry.`);
                            }
                          }}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isAdmin ? 'hover:bg-error-container text-error' : 'text-outline opacity-40 hover:opacity-70'
                          }`}
                          title={isAdmin ? 'Admin Decommission' : 'Delete Locked (Admin only)'}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination & Master Count Bar */}
        <div className="p-3.5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 select-none border-t border-[#eceef0]">
          <div className="flex items-center gap-3">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing <span className="font-semibold text-primary">{(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredList.length)}</span> of <span className="font-semibold text-primary">{filteredList.length}</span> Equipment Records
            </span>
            <span className="text-outline-variant">|</span>
            <div className="flex items-center gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-surface-container-lowest font-mono-data text-mono-data text-primary px-2 py-1 rounded shadow-inner text-xs focus:outline-none border border-[#e0e3e5]"
              >
                <option value={12}>12</option>
                <option value={25}>25</option>
                <option value={40}>40 (All)</option>
              </select>
            </div>
          </div>

          {/* Page Nav Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded bg-surface-container text-on-surface ${
                currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container-high cursor-pointer'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-2.5 py-1 rounded font-mono-data text-mono-data cursor-pointer ${
                  currentPage === idx + 1
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'hover:bg-surface-container text-on-surface'
                }`}
                type="button"
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded bg-surface-container text-on-surface ${
                currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container-high cursor-pointer'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Laboratory Context Visual Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
        {/* Visual 1: Molecular Wing Station */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase">Molecular Wing Station</span>
              <span className="font-mono-badge text-mono-badge bg-surface-container px-1.5 py-0.5 rounded-DEFAULT text-on-surface">26 Devices</span>
            </div>
            <div
              className="bg-cover bg-center w-full h-32 rounded-lg mb-2 shadow-inner"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZSWEXCPAMoHGJdAoEt-Lc2avgcI1bYM4r0aVAS0gxnEyNS-ak_q-qagwDwLU6d0huxlZ-fLwdwX16rZ4wu7zA89ayXzdT6EKSObMKbLD2FEXSCLDMFAcEvDkuYOjhFqoyYLtVefOGAglObxWAm-ABjy3r4ilhZqpKI0HW3lcBrp0_FH8ocYZfkUNChhs7zD7ZMkj2NWbaFjpWm_uZ-cvMHJm5GQYDK4u4tT90MlsBvuGv5wql5oK8TQ')`
              }}
            ></div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Real-time PCR QuantStudio 5 and Bio-Rad CFX Opus 96 actively monitoring State Viral Surveillance &amp; Rabies Control protocols.
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#eceef0]/60">
            <span className="font-mono-data text-mono-data text-[11px] text-on-surface font-semibold">Log: PCR-W2-ACTIVE</span>
            <button
              onClick={() => onShowToast('Bench Mapping', 'Loading high-resolution spatial schematic for Molecular Wing...')}
              className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Bench Map <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Visual 2: Cold Chain Surveillance */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase">Cold Chain &amp; Deep Freezers</span>
              <span className="font-mono-badge text-mono-badge bg-surface-container px-1.5 py-0.5 rounded-DEFAULT text-on-surface">Ultra-Low Storage</span>
            </div>
            <div
              className="bg-cover bg-center w-full h-32 rounded-lg mb-2 shadow-inner"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDO-RmCFCe7_3OmTgHtk3mqPKO-G52hW3Vm5YXCEYGbkU0qB8a3CAh97du09d7B2WcdlZeIWAgx2-KOAWykk2khF4iQKpWUV5LHfzUDd8LzOOfeX7S6HGo1dH2Z_LrBrtWc4Zw6rXuP-TLhXCRhinkyB44nNMm1kvFlwaDDgn66cito8UnlvSrcrgFroQxGEPWNdSKWhKjk3_a_64FcbyoXAdi6FLHfEqTS33UCEeAQdoGyWRkeTaYtqg')`
              }}
            ></div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Continuous temperature monitoring with NIST-traceable sensors across Eppendorf -80°C and Vestfrost -20°C repositories.
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#eceef0]/60">
            <span className="font-mono-data text-mono-data text-[11px] text-on-surface font-semibold">NIST Cert: #2026-CC-89</span>
            <button
              onClick={() => onShowToast('Telemetry Graph', 'NIST real-time telemetry stream active: -81.2°C nominal.')}
              className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Temp Graph <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Visual 3: RBER & Incident Investigation */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex flex-col justify-between border border-[#eceef0]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm text-error font-semibold uppercase">Active Incident Breakdown</span>
              <span className="font-mono-badge text-mono-badge bg-error-container text-on-error-container px-1.5 py-0.5 rounded-DEFAULT font-bold">1 In Queue</span>
            </div>
            <div
              className="bg-cover bg-center w-full h-32 rounded-lg mb-2 shadow-inner"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxK9LA-ILk2lA1mbhJOK4cX2birFBV8HJPDHDGiXTm_Ymg8MDMh35PR6N6duuNCHphWP5hT6zJWFbrzZlmjjO6APan2STyQGAyZdiv2acJH6NXfL7Eaxi2zD7KrC1JMp-ctDTEMdNcwmFe_WFR32oWswjRVjyA1wsnwwGNzAykTf7KLpe5SzvuoBzfmG3O8qV_f5AfFfvcNJo_MOaisW90j6n72bL_GY8TykcCrM0Aane_o80JQCjolw')`
              }}
            ></div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Bio-Rad iMark ELISA Reader optics failure logged. Quotation for spare assembly exceeds 64.6% of book value; RBER condemnation initiated.
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#eceef0]/60">
            <span className="font-mono-badge text-mono-badge text-error font-bold">TICKET #EQ-2026-081</span>
            <button
              onClick={() => onSelectTab('breakdown')}
              className="font-label-sm text-label-sm text-error hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
            >
              Open RBER File <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Audit Compliance Footnote */}
      <div className="mt-5 p-3.5 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 border border-[#eceef0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
            <span className="material-symbols-outlined text-[22px]">policy</span>
          </div>
          <div>
            <p className="font-headline-sm text-headline-sm text-primary">NABL Calibration &amp; Traceability Integrity Statement</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Equipment records are cryptographically timestamped. Overdue calibration status triggers auto-locking of diagnostic report authoring for associated assay lines.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono-badge text-mono-badge bg-surface-container text-primary px-2.5 py-1.5 rounded-DEFAULT">
            Audit Ver. 2026.4
          </span>
          <button
            className="p-2 rounded bg-surface-container-low hover:bg-surface-container text-primary cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            type="button"
            title="Scroll to Top"
          >
            <span className="material-symbols-outlined text-[18px]">vertical_align_top</span>
          </button>
        </div>
      </div>
    </div>
  );
};

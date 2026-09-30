import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { InventoryView } from './components/InventoryView';
import { CalibrationView } from './components/CalibrationView';
import { BreakdownView } from './components/BreakdownView';
import { DocumentsView } from './components/DocumentsView';
import { AccessControlView } from './components/AccessControlView';
import { EntryModal } from './components/Modals/EntryModal';
import { BatchModal } from './components/Modals/BatchModal';
import { CalibrationModal } from './components/Modals/CalibrationModal';
import { BreakdownModal } from './components/Modals/BreakdownModal';
import { ImportSopModal } from './components/Modals/ImportSopModal';
import { Toast } from './components/Toast';

import {
  Equipment,
  VendorContract,
  ControlledDocument,
  BreakdownRecord,
  AuditLogItem,
  ActiveRole
} from './types';

import {
  INITIAL_EQUIPMENT_DATA,
  VENDOR_CONTRACTS_DATA,
  CONTROLLED_DOCUMENTS_DATA,
  HISTORICAL_BREAKDOWN_DATA,
  INITIAL_AUDIT_LOGS
} from './data/equipmentData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('inventory');
  const [currentRole, setCurrentRole] = useState<ActiveRole>('ADMIN');

  // Main Datastores
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(INITIAL_EQUIPMENT_DATA);
  const [vendorContracts, setVendorContracts] = useState<VendorContract[]>(VENDOR_CONTRACTS_DATA);
  const [controlledDocs, setControlledDocs] = useState<ControlledDocument[]>(CONTROLLED_DOCUMENTS_DATA);
  const [breakdownLogs, setBreakdownLogs] = useState<BreakdownRecord[]>(HISTORICAL_BREAKDOWN_DATA);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Modals state
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isCalibModalOpen, setIsCalibModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [isImportSopModalOpen, setIsImportSopModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string; icon?: string }>({
    show: false,
    title: '',
    message: '',
    icon: 'check_circle'
  });

  const showToast = (title: string, message: string, icon: string = 'check_circle') => {
    setToast({ show: true, title, message, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3800);
  };

  const addAuditLog = (action: string, target: string, status: 'SUCCESS' | 'OPEN TICKET' | 'COMPLETE' = 'SUCCESS') => {
    const newLog: AuditLogItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userEmail: currentRole === 'ADMIN' ? 'sareena.m.salim@gmail.com' : 'vpdsurveillancesphcl@gmail.com',
      userRole: currentRole,
      action,
      targetEquipment: target,
      originIp: '192.168.1.42',
      hash: Math.random().toString(36).substring(2, 10),
      status
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentTab('inventory');
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save / Update Equipment
  const handleSaveEquipment = (equipment: Equipment) => {
    setEquipmentList((prev) => {
      const exists = prev.some((e) => e.id === equipment.id);
      if (exists) {
        addAuditLog(`Updated specifications for ${equipment.name} (${equipment.serialNumber})`, equipment.name);
        showToast('Equipment Record Updated', `${equipment.name} (${equipment.serialNumber}) saved to master.`);
        return prev.map((e) => (e.id === equipment.id ? equipment : e));
      } else {
        addAuditLog(`Registered new equipment ${equipment.name} (${equipment.serialNumber})`, equipment.name);
        showToast('New Equipment Registered', `${equipment.name} added with barcode ${equipment.barcode}.`);
        return [equipment, ...prev];
      }
    });
    setEditingEquipment(null);
  };

  // Delete Equipment
  const handleDeleteEquipment = (id: string) => {
    const target = equipmentList.find((e) => e.id === id);
    if (!target) return;
    setEquipmentList((prev) => prev.filter((e) => e.id !== id));
    addAuditLog(`Decommissioned and deleted ${target.name} (${target.serialNumber})`, target.name);
  };

  // Save Calibration
  const handleSaveCalibration = (equipId: string, certNo: string, nextDueDate: string, agency: string) => {
    setEquipmentList((prev) =>
      prev.map((e) => {
        if (e.id === equipId) {
          return {
            ...e,
            calibrationDate: new Date().toISOString().slice(0, 10),
            calibrationDueDate: nextDueDate,
            calibratingAgency: agency,
            calibrationCertNo: certNo,
            status: 'working'
          };
        }
        return e;
      })
    );
    const target = equipmentList.find((e) => e.id === equipId);
    addAuditLog(`Logged calibration verification for ${target?.name || 'Equipment'} (${certNo})`, target?.name || 'Equipment');
  };

  // Submit Emergency Breakdown
  const handleSubmitBreakdown = (equipName: string, desc: string, impact: string) => {
    const target = equipmentList.find((e) => e.name === equipName);
    const ticketId = `#EQ-BRK-${Date.now().toString().slice(-4)}`;

    const newBreakdown: BreakdownRecord = {
      ticketId,
      equipmentId: target?.id || 'EQ-01',
      equipmentName: equipName,
      serialNumber: target?.serialNumber || 'SN-UNKNOWN',
      section: target?.section || 'Molecular Diagnostic',
      program: target?.programs[0] || 'VPD Surveillance',
      reportedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reportedBy: currentRole === 'ADMIN' ? 'sareena.m.salim@gmail.com' : 'vpdsurveillancesphcl@gmail.com',
      natureOfFault: desc,
      rootCause: 'Under Diagnostic Investigation',
      correctiveAction: 'Biomedical emergency ticket dispatched to OEM support',
      serviceAgency: target?.make || 'OEM Service Support',
      engineerCallRef: `Call #${Math.floor(1000 + Math.random() * 9000)}`,
      downtimeHours: 0.1,
      status: 'OPEN',
      impactLevel: impact.includes('Critical') ? 'Critical' : 'Moderate'
    };

    setBreakdownLogs((prev) => [newBreakdown, ...prev]);

    // Flag equipment as not_working
    setEquipmentList((prev) =>
      prev.map((e) => {
        if (e.name === equipName) {
          return { ...e, status: 'not_working', activeTicket: ticketId };
        }
        return e;
      })
    );

    addAuditLog(`Reported emergency breakdown for ${equipName} [Ticket ${ticketId}]`, equipName, 'OPEN TICKET');
    showToast('Breakdown Broadcasted', `Incident ticket ${ticketId} created. Clock initiated.`, 'warning');
  };

  // Import SOP
  const handleImportSop = (title: string, category: string) => {
    const code = `SOP-EQ-${(controlledDocs.length + 1).toString().padStart(2, '0')}`;
    const newDoc: ControlledDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      code,
      category: category as any,
      title,
      version: '1.0 (2026)',
      clause: '5.3.1.2',
      status: 'Controlled',
      description: 'Departmental operational standard indexed into NABL ISO 15189 document registry.',
      scope: 'Active Surveillance Laboratory',
      effectiveDate: 'Mar 2026',
      reviewCycle: 'Annual',
      author: 'Laboratory Quality Officer',
      verifiedBy: 'Section In-Charge',
      approvedBy: 'Dr. Sareena M. Salim',
      designation: 'Quality Manager / Lab Director',
      purpose: `Prescribes standard laboratory instructions and maintenance guidelines for ${title}.`,
      keyPoints: [
        'Mandatory operator sign-off before instrument operation.',
        'Routine calibration check intervals defined according to manufacturer guidelines.',
        'Immediate incident reporting in case of operational excursion.'
      ],
      pdfFileName: `${code}_Controlled.pdf`,
      altFileName: `${code}_Controlled.docx`,
      altFileType: 'DOCX',
      fileSize: '290 KB'
    };

    setControlledDocs((prev) => [...prev, newDoc]);
    addAuditLog(`Indexed controlled document ${code} (${title})`, code);
    showToast('Document Registered', `${code}: "${title}" has been indexed into the ISO 15189 repository.`);
  };

  // Batch commit 40 rows
  const handleBatchCommit = () => {
    addAuditLog('Batch imported and re-indexed 40 equipment records via CSV payload', 'Master Inventory Ledger', 'COMPLETE');
    showToast('40 Assets Verified', 'Re-indexed into ISO 15189 Master Database successfully.');
  };

  // Calibration due count
  const calibrationDueCount = equipmentList.filter(
    (e) =>
      e.calibrationDueDate.toLowerCase().includes('due') ||
      e.calibrationDueDate.toLowerCase().includes('expired') ||
      e.calibrationDueDate <= '2026-03-31'
  ).length;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      {/* Header */}
      <Header
        currentRole={currentRole}
        onOpenEntryModal={() => {
          setEditingEquipment(null);
          setIsEntryModalOpen(true);
        }}
        onOpenBreakdownModal={() => setIsBreakdownModalOpen(true)}
        onExportMaster={() => showToast('Master Export Ready', 'Exported 40 assets in CSV & ISO 15189 PDF format.')}
        onToggleRole={() => {
          const next = currentRole === 'ADMIN' ? 'STAFF' : 'ADMIN';
          setCurrentRole(next);
          showToast('Role Switched', `Active session persona changed to ${next}.`);
        }}
      />

      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          showToast('Role Switched', `Active session persona changed to ${role}.`);
        }}
        equipmentCount={equipmentList.length}
        calibrationDueCount={calibrationDueCount}
      />

      {/* Main Content Pane */}
      <div className="pl-64">
        <main className="relative pt-16 bg-surface min-h-screen w-full px-4 lg:px-6 py-5">
          {currentTab === 'inventory' && (
            <InventoryView
              equipmentList={equipmentList}
              currentRole={currentRole}
              onOpenEntryModal={(item) => {
                setEditingEquipment(item || null);
                setIsEntryModalOpen(true);
              }}
              onOpenBatchModal={() => setIsBatchModalOpen(true)}
              onDeleteEquipment={handleDeleteEquipment}
              onOpenBreakdown={() => setCurrentTab('breakdown')}
              onSelectTab={setCurrentTab}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'calibration' && (
            <CalibrationView
              equipmentList={equipmentList}
              vendorContracts={vendorContracts}
              currentRole={currentRole}
              onOpenCalibModal={() => setIsCalibModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'breakdown' && (
            <BreakdownView
              currentRole={currentRole}
              historicalBreakdowns={breakdownLogs}
              onOpenReportModal={() => setIsBreakdownModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsView
              documentsList={controlledDocs}
              equipmentList={equipmentList}
              onOpenImportModal={() => setIsImportSopModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'access' && (
            <AccessControlView
              currentRole={currentRole}
              onChangeRole={(role) => {
                setCurrentRole(role);
                showToast('Role Switched', `Active session persona changed to ${role}.`);
              }}
              auditLogs={auditLogs}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setEditingEquipment(null);
        }}
        onSave={handleSaveEquipment}
        initialData={editingEquipment}
      />

      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onCommit={handleBatchCommit}
        onShowToast={showToast}
      />

      <CalibrationModal
        isOpen={isCalibModalOpen}
        onClose={() => setIsCalibModalOpen(false)}
        equipmentList={equipmentList}
        onSaveCalibration={handleSaveCalibration}
        onShowToast={showToast}
      />

      <BreakdownModal
        isOpen={isBreakdownModalOpen}
        onClose={() => setIsBreakdownModalOpen(false)}
        equipmentList={equipmentList}
        onSubmitBreakdown={handleSubmitBreakdown}
      />

      <ImportSopModal
        isOpen={isImportSopModalOpen}
        onClose={() => setIsImportSopModalOpen(false)}
        onImport={handleImportSop}
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        icon={toast.icon}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Equipment, LabSection, EquipmentStatus } from '../../types';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Equipment) => void;
  initialData?: Equipment | null;
}

export const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [section, setSection] = useState<LabSection>('Molecular Diagnostic');
  const [location, setLocation] = useState('');
  const [installedDate, setInstalledDate] = useState('');
  const [calibrationDueDate, setCalibrationDueDate] = useState('');
  const [pmDueDate, setPmDueDate] = useState('');
  const [status, setStatus] = useState<EquipmentStatus>('working');
  const [warrantyType, setWarrantyType] = useState<Equipment['warrantyType']>('Comprehensive AMC');
  const [programs, setPrograms] = useState<string[]>(['NRCP', 'MR Surveillance']);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMake(initialData.make);
      setModel(initialData.model);
      setSerialNumber(initialData.serialNumber);
      setBarcode(initialData.barcode);
      setSection(initialData.section);
      setLocation(initialData.location);
      setInstalledDate(initialData.installedDate);
      setCalibrationDueDate(initialData.calibrationDueDate);
      setPmDueDate(initialData.pmDueDate);
      setStatus(initialData.status);
      setWarrantyType(initialData.warrantyType);
      setPrograms(initialData.programs || []);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setMake('');
      setModel('');
      setSerialNumber('');
      setBarcode('');
      setSection('Molecular Diagnostic');
      setLocation('');
      setInstalledDate('2023-01-15');
      setCalibrationDueDate('2026-06-30');
      setPmDueDate('2026-06-30');
      setStatus('working');
      setWarrantyType('Comprehensive AMC');
      setPrograms(['NRCP', 'MR Surveillance']);
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleProgram = (prog: string) => {
    setPrograms((prev) =>
      prev.includes(prog) ? prev.filter((p) => p !== prog) : [...prev, prog]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEquip: Equipment = {
      id: initialData?.id || `EQ-${Date.now().toString().slice(-4)}`,
      name,
      make,
      model: model || 'Standard Spec',
      serialNumber,
      barcode: barcode || `BAR-${section.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      section,
      location: location || 'Laboratory Bench',
      installedDate: installedDate || '2023-01-15',
      calibrationDate: '2025-06-30',
      calibrationDueDate: calibrationDueDate || '2026-06-30',
      pmDueDate: pmDueDate || '2026-06-30',
      status,
      warrantyType,
      programs: programs.length > 0 ? programs : ['NRCP'],
      notes,
      activeTicket: initialData?.activeTicket,
      rberReview: initialData?.rberReview
    };

    onSave(newEquip);
    onClose();
  };

  const programOptions = [
    'NRCP',
    'MR Surveillance',
    'NVHCP',
    'NVBDCP',
    'PPCL',
    'State Program',
    'Diphtheria Pertussis Surveillance'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-3xl w-full p-5 relative border border-[#eceef0] my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-DEFAULT bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">add_box</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                {initialData ? 'Edit Equipment Master Entry' : 'New Equipment Master Entry (NABL Log Record)'}
              </h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                Mandatory verification per NABL Accreditation Checklist Section 5.3
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container cursor-pointer transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-xs">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Equipment Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. RT PCR Machine QuantStudio 5"
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Make / Manufacturer *</label>
            <input
              type="text"
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Applied Biosystems / Bio-Rad"
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Model Number</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. QuantStudio 5 / CFX Opus 96"
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Serial Number *</label>
            <input
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. 795BR04085 or AB-QS5-2018"
              className="w-full font-mono-data text-mono-data bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Assigned Barcode / Tag ID</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g. SC082944 (Auto-generates if empty)"
              className="w-full font-mono-data text-mono-data bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Laboratory Section *</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as LabSection)}
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            >
              <option value="Molecular Diagnostic">Molecular Diagnostic</option>
              <option value="VPD Surveillance">VPD Surveillance</option>
              <option value="Media">Media</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Specific Room / Bench Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. PCR Room, Cold Room, Hall Near PCR"
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Date of Installation</label>
            <input
              type="date"
              value={installedDate}
              onChange={(e) => setInstalledDate(e.target.value)}
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Calibration Due Date</label>
            <input
              type="text"
              value={calibrationDueDate}
              onChange={(e) => setCalibrationDueDate(e.target.value)}
              placeholder="YYYY-MM-DD or EXPIRED"
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Preventive Maintenance (PM) Due</label>
            <input
              type="text"
              value={pmDueDate}
              onChange={(e) => setPmDueDate(e.target.value)}
              placeholder="YYYY-MM-DD or Valid"
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Operational Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            >
              <option value="working">Working</option>
              <option value="not_working">Not Working / Under Breakdown</option>
              <option value="under_pm">Under Preventive Maintenance</option>
              <option value="under_rber">Under RBER Technical Review</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Service Contract / Warranty</label>
            <select
              value={warrantyType}
              onChange={(e) => setWarrantyType(e.target.value as any)}
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            >
              <option value="Comprehensive AMC">Comprehensive AMC</option>
              <option value="Non-Comprehensive CMC">Non-Comprehensive CMC</option>
              <option value="Under OEM Warranty">Under OEM Warranty</option>
              <option value="Departmental Coverage">Departmental Coverage</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Linked Public Health Surveillance Programs</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {programOptions.map((prog) => (
                <label
                  key={prog}
                  className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded cursor-pointer hover:bg-surface-container border border-[#e0e3e5]/60"
                >
                  <input
                    type="checkbox"
                    checked={programs.includes(prog)}
                    onChange={() => toggleProgram(prog)}
                    className="rounded-DEFAULT accent-primary"
                  />
                  <span>{prog}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block font-label-sm text-label-sm text-on-surface mb-1">Equipment Notes / History</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Relocated to PCR clean area. Filter replaced on last PM."
              rows={2}
              className="w-full bg-surface-container-low px-3 py-1.5 rounded-DEFAULT text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            ></textarea>
          </div>

          <div className="md:col-span-3 flex items-center justify-end gap-2 pt-3 border-t border-[#eceef0]">
            <button
              onClick={onClose}
              className="px-4 py-2 font-label-md text-label-md text-outline hover:text-on-surface cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              className="bg-primary text-on-primary hover:bg-primary-container px-5 py-2 font-label-md text-label-md rounded-DEFAULT shadow-sm flex items-center gap-1 cursor-pointer"
              type="submit"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              Save &amp; Generate NABL Asset Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

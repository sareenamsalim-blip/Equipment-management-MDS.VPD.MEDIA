import React, { useState } from 'react';
import { Equipment } from '../../types';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  onSaveCalibration: (equipId: string, certNo: string, nextDueDate: string, agency: string) => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  onSaveCalibration,
  onShowToast
}) => {
  const [selectedEquipId, setSelectedEquipId] = useState(equipmentList[1]?.id || 'EQ-02');
  const [calibDate, setCalibDate] = useState('2026-03-04');
  const [validUntil, setValidUntil] = useState('2027-03-03');
  const [agency, setAgency] = useState('TUV SUD South Asia Pvt Ltd');
  const [certNo, setCertNo] = useState('CC-2841 / CAL-2026-9042');
  const [traceability, setTraceability] = useState('Traceable to National Physical Laboratory (NPL) / NIST Standard Reference Materials (SRM 2034)');
  const [result, setResult] = useState('PASS');
  const [scope, setScope] = useState('Full Traceable Metrological Calibration');
  const [notes, setNotes] = useState('Expanded uncertainty U = ±0.04°C at k=2 (95% confidence level). Cleaned optical filter sensors.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCalibration(selectedEquipId, certNo, validUntil, agency);
    onShowToast('Calibration Log Recorded', `Compliance index updated for ${certNo}.`, 'verified');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden max-h-[92vh] flex flex-col border border-[#eceef0] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">verified</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-primary">
                Log Calibration / PM Verification Event
              </h3>
              <span className="font-mono-badge text-mono-badge text-secondary-fixed block text-[10px]">
                NABL ISO 15189:2022 Clause 5.3 Compliance Entry
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-primary hover:text-secondary-fixed transition-colors cursor-pointer p-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Equipment Select */}
            <div className="md:col-span-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Target Laboratory Asset *
              </label>
              <select
                value={selectedEquipId}
                onChange={(e) => setSelectedEquipId(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2 rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5] text-xs"
              >
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} - {eq.make} {eq.model} ({eq.serialNumber}) [{eq.calibrationDueDate === '2026-02-22' ? 'OVERDUE' : eq.calibrationDueDate}]
                  </option>
                ))}
              </select>
            </div>

            {/* Calibration Date */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Calibration Execution Date *
              </label>
              <input
                type="date"
                required
                value={calibDate}
                onChange={(e) => setCalibDate(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
              />
            </div>

            {/* Valid Until Date */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Valid Until (Expiry Date) *
              </label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
              />
            </div>

            {/* Calibrating Agency Name */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                NABL Accredited Agency *
              </label>
              <input
                type="text"
                required
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="e.g. TUV SUD South Asia Pvt Ltd"
                className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
              />
            </div>

            {/* Accreditation Certificate No */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Agency NABL Accr. / Cert No. *
              </label>
              <input
                type="text"
                required
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                placeholder="e.g. CC-2841 / CAL-2026-9042"
                className="w-full bg-surface-container-low text-on-surface font-mono-data text-mono-data px-3 py-2 rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
              />
            </div>

            {/* Metrological Traceability Standard */}
            <div className="md:col-span-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Metrological Traceability Standard Used *
              </label>
              <input
                type="text"
                required
                value={traceability}
                onChange={(e) => setTraceability(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
              />
            </div>

            {/* Calibration Result */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Verification Result *
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    checked={result === 'PASS'}
                    onChange={() => setResult('PASS')}
                    className="accent-primary"
                  />
                  <span className="font-label-md text-label-md text-primary">PASSED</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    checked={result === 'CONDITIONAL'}
                    onChange={() => setResult('CONDITIONAL')}
                    className="accent-primary"
                  />
                  <span className="font-label-md text-label-md text-on-surface-variant">Conditional</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    checked={result === 'FAIL'}
                    onChange={() => setResult('FAIL')}
                    className="accent-primary"
                  />
                  <span className="font-label-md text-label-md text-error">FAILED</span>
                </label>
              </div>
            </div>

            {/* Calibration Type */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Activity Scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5]"
              >
                <option>Full Traceable Metrological Calibration</option>
                <option>Preventive Maintenance (PM) Verification</option>
                <option>Post-Breakdown Recalibration</option>
                <option>IQ/OQ/PQ Performance Verification</option>
              </select>
            </div>

            {/* Certificate File Upload */}
            <div className="md:col-span-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Upload NABL Certificate (PDF / Scanned) *
              </label>
              <div className="bg-surface-container-low p-3.5 rounded-DEFAULT flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container border border-dashed border-[#c3c6ce]">
                <span className="material-symbols-outlined text-[28px] text-secondary mb-1">upload_file</span>
                <span className="font-label-md text-label-md text-primary">Click to select or drag and drop certified PDF</span>
                <span className="font-mono-badge text-mono-badge text-outline mt-0.5 text-[10px]">
                  Maximum size 15MB • Digital signature preferred
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Audit Notes / Uncertainty Values
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5]"
              ></textarea>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#eceef0] flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-DEFAULT cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md rounded-DEFAULT shadow-sm cursor-pointer flex items-center gap-1.5"
              type="submit"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Save &amp; Generate NABL Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

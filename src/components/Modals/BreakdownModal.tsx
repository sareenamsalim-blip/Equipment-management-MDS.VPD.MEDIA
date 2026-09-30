import React, { useState } from 'react';
import { Equipment } from '../../types';

interface BreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  onSubmitBreakdown: (equipName: string, desc: string, impact: string) => void;
}

export const BreakdownModal: React.FC<BreakdownModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  onSubmitBreakdown
}) => {
  const [selectedName, setSelectedName] = useState(equipmentList[0]?.name || 'Elisa Reader');
  const [impact, setImpact] = useState('Critical - Halts Current Surveillance Runs');
  const [description, setDescription] = useState('Optical filter wheel sensor halted with error ERR_OPT_304.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBreakdown(selectedName, description, impact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest max-w-2xl w-full rounded-xl shadow-2xl p-5 flex flex-col gap-3.5 border border-[#eceef0] my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[24px]">warning</span>
            <h3 className="font-headline-md text-headline-md text-primary font-bold">
              Emergency Equipment Breakdown Ticket (NABL Form-04)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
          Submitting this form immediately flags the equipment as <span className="text-error font-semibold">'not_working'</span> on the active master dashboard, alerts the biomedical engineering unit via automated dispatch, and starts the NABL ISO 15189 downtime counter.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface block mb-1">Target Equipment *</label>
              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5] text-xs"
              >
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.name}>
                    {eq.name} ({eq.make} - {eq.section})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-sm text-label-sm text-on-surface block mb-1">Reported By *</label>
              <input
                type="email"
                readOnly
                value="vpdsurveillancesphcl@gmail.com"
                className="w-full bg-surface-container-low text-on-surface-variant font-mono-data text-mono-data px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5] cursor-not-allowed text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface block mb-1">Date &amp; Time of Breakdown *</label>
              <input
                type="datetime-local"
                defaultValue="2026-03-01T10:30"
                className="w-full bg-surface-container-low text-on-surface font-mono-data text-mono-data px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5] text-xs"
              />
            </div>

            <div>
              <label className="font-label-sm text-label-sm text-on-surface block mb-1">Impact Level on Testing</label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5] text-xs"
              >
                <option value="Critical - Halts Current Surveillance Runs">Critical - Halts Current Surveillance Runs</option>
                <option value="Moderate - Alternate Equipment Available">Moderate - Alternate Equipment Available</option>
                <option value="Low - Non-clinical utility equipment">Low - Non-clinical utility equipment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">
              Observed Failure / Error Code / Symptoms *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe error messages on LCD, mechanical jams, abnormal noises, temperature excursion..."
              className="w-full bg-surface-container-low text-on-surface p-2.5 rounded-DEFAULT focus:outline-none border border-[#e0e3e5] text-xs"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eceef0]">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-container text-on-surface font-label-md text-label-md rounded-DEFAULT hover:bg-surface-container-high transition-colors cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-error text-on-error font-label-md text-label-md rounded-DEFAULT hover:bg-on-error-container transition-colors font-semibold flex items-center gap-1 cursor-pointer"
              type="submit"
            >
              <span className="material-symbols-outlined text-[16px]">report</span>
              <span>Submit Emergency Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

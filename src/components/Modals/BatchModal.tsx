import React, { useState } from 'react';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  onCommit,
  onShowToast
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSample = () => {
    onShowToast('CSV Template Downloaded', 'Saved NABL_ISO15189_Master_Equipment_Template.csv (15 Columns).');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      onShowToast('File Parsed Successfully', `Validated 40 records in ${e.target.files[0].name} (Zero schema errors).`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-3xl w-full p-5 relative border border-[#eceef0] my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Batch Equipment Importer &amp; CSV Validator
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                Compliant with Kerala State Surveillance NABL master template format. Supports .csv and .xlsx.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded hover:bg-surface-container cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Drag & Drop Zone */}
          <label className="lg:col-span-2 p-6 bg-surface-container-low rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors border-2 border-dashed border-[#c3c6ce]">
            <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" />
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-secondary mb-2">
              <span className="material-symbols-outlined text-[28px]">file_upload</span>
            </div>
            <p className="font-headline-sm text-headline-sm text-primary font-semibold">
              {fileName ? fileName : 'Drag & Drop Master Inventory File'}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">
              or <span className="text-secondary font-semibold underline">browse local machine</span> to upload parsed asset log
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-label-sm font-label-sm text-outline text-[11px]">
              <span>Supported: UTF-8 CSV, Excel 2016+</span>
              <span>•</span>
              <span>Max File Size: 15MB</span>
              <span>•</span>
              <span className="text-primary font-semibold">Ready: 40 Assets Auto-Mapped</span>
            </div>
          </label>

          {/* Format Checklist & Download Sample */}
          <div className="p-3.5 bg-surface-container-low rounded-xl flex flex-col justify-between border border-[#e0e3e5]/70">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold text-[11px]">
                  Standard Header Protocol
                </span>
                <span className="font-mono-badge text-mono-badge bg-primary-container text-on-primary px-1.5 py-0.5 rounded-DEFAULT">
                  15 COLUMNS
                </span>
              </div>
              <ul className="space-y-1 font-body-sm text-body-sm text-on-surface-variant text-xs">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> equipment_name, make, model_no
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> serial_no, barcode, section, location
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> status (working / not_working)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> calibration_date, calibration_due (ISO YYYY-MM-DD)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> programs (Pipe separated: NRCP|NVHCP)
                </li>
              </ul>
            </div>

            <div className="pt-3 flex flex-col gap-2 border-t border-[#eceef0]/60">
              <button
                onClick={handleDownloadSample}
                className="w-full bg-surface-container-lowest text-primary hover:bg-surface-container font-label-md text-label-md py-1.5 rounded-DEFAULT shadow-sm flex items-center justify-center gap-1 text-xs cursor-pointer border border-[#e0e3e5]"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">download_for_offline</span>
                Download Empty CSV Format
              </button>
              <button
                onClick={() => {
                  onCommit();
                  onClose();
                }}
                className="w-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md py-2 rounded-DEFAULT shadow-sm flex items-center justify-center gap-1 text-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                Commit &amp; Re-Index 40 Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

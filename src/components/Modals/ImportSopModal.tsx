import React, { useState } from 'react';

interface ImportSopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (title: string, category: string) => void;
}

export const ImportSopModal: React.FC<ImportSopModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [category, setCategory] = useState('sop');
  const [title, setTitle] = useState('');
  const [program, setProgram] = useState('All Laboratories (General)');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onImport(title, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-3.5 border border-[#eceef0] my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">upload_file</span>
            <h3 className="font-headline-md text-headline-md text-primary font-bold">Import Custom Lab SOP / Form</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
          Upload department-specific calibration protocols or instrument instruction manuals (.pdf, .docx, .xlsx). Documents will be indexed into the ISO 15189 surveillance repository.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-container-low text-body-sm font-body-sm px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5]"
            >
              <option value="sop">Standard Operating Procedure (SOP)</option>
              <option value="forms">Controlled Form / Log Sheet</option>
              <option value="checklists">Audit Checklist</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1">Document Code &amp; Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SOP-EQ-06: Maintenance of Ultra-Centrifuges"
              className="w-full bg-surface-container-low text-body-sm font-body-sm px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1">Associated Surveillance Program</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-surface-container-low text-body-sm font-body-sm px-3 py-2 rounded-DEFAULT focus:outline-none border border-[#e0e3e5]"
            >
              <option>All Laboratories (General)</option>
              <option>Molecular Diagnostic (NRCP / NVHCP)</option>
              <option>VPD Surveillance (MR / Diphtheria)</option>
              <option>Media &amp; Cell Culture (PPCL)</option>
            </select>
          </div>

          <label className="p-5 rounded-lg bg-surface-container-low text-center cursor-pointer hover:bg-surface-container transition-colors border border-dashed border-[#c3c6ce] flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-outline text-[32px]">cloud_upload</span>
            <div className="font-label-md text-label-md text-primary mt-1">
              {selectedFile ? selectedFile : 'Drag & Drop file here, or browse'}
            </div>
            <span className="font-mono-badge text-mono-badge text-outline mt-0.5 text-[10px]">
              PDF, DOCX, XLSX (Max 25MB)
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.xlsx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0].name);
                }
              }}
              className="hidden"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eceef0]">
            <button
              onClick={onClose}
              className="font-label-md text-label-md px-4 py-2 rounded-DEFAULT hover:bg-surface-container-high transition-colors cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2 rounded-DEFAULT transition-colors shadow-sm cursor-pointer"
              type="submit"
            >
              Upload &amp; Index Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

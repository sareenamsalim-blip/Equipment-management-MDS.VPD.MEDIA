import React, { useState } from 'react';
import { ControlledDocument, Equipment } from '../types';

interface DocumentsViewProps {
  documentsList: ControlledDocument[];
  equipmentList: Equipment[];
  onOpenImportModal: () => void;
  onShowToast: (title: string, msg: string, icon?: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documentsList,
  equipmentList,
  onOpenImportModal,
  onShowToast
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('DOC-01');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'sop' | 'forms' | 'checklists'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedDoc = documentsList.find((d) => d.id === selectedDocId) || documentsList[0];

  const filteredDocs = documentsList.filter((doc) => {
    const matchCat = categoryFilter === 'all' || doc.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.code.toLowerCase().includes(q) ||
      doc.clause.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q);

    return matchCat && matchSearch;
  });

  const handleDownload = (fileName: string, type: string) => {
    onShowToast(`Downloading ${type} File`, `Initiating controlled download for ${fileName}.`, 'download');
  };

  const handleDownloadKit = () => {
    onShowToast('Packaging Complete NABL Kit', 'Compiled 12 ISO 15189 controlled SOPs, forms, and audit checklists into .ZIP.', 'folder_zip');
  };

  const handleAuditDossier = () => {
    onShowToast('Audit Dossier Exported', 'Assembled 64-page Cycle 2026 NABL Comprehensive Audit Binder (PDF).', 'picture_as_pdf');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header Banner */}
      <section className="relative bg-surface-container-lowest rounded-xl p-4 lg:p-5 shadow-sm border border-[#eceef0] mb-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="max-w-3xl space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="bg-primary text-on-primary font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                ISO 15189:2022 CLAUSE 5.3
              </span>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                NABL 112 COMPLIANT
              </span>
              <span className="bg-surface-container-high text-on-surface-variant font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                DOC-REP-V4.1
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              NABL &amp; ISO 15189 Equipment Documentation Repository
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Standardized equipment management procedures, master history cards, calibration protocols, and statutory audit forms ready for laboratory implementation and auditor inspection. Covers 40 surveillance assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadKit}
              className="bg-primary text-on-primary font-label-md text-label-md px-3.5 py-2.5 rounded-DEFAULT hover:bg-primary-container transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px] text-tertiary-fixed">inventory_2</span>
              <span>Download Complete Kit (.ZIP - 12 Docs)</span>
            </button>
            <button
              onClick={handleAuditDossier}
              className="bg-surface-container-high text-primary font-label-md text-label-md px-3 py-2.5 rounded-DEFAULT hover:bg-surface-variant transition-colors flex items-center gap-1.5 border border-[#e0e3e5] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">picture_as_pdf</span>
              <span>Audit Dossier (PDF)</span>
            </button>
            <button
              onClick={onOpenImportModal}
              className="bg-surface-container-lowest text-secondary font-label-md text-label-md px-3 py-2.5 rounded-DEFAULT hover:bg-surface-container-low transition-colors flex items-center gap-1.5 border border-[#e0e3e5] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">upload_file</span>
              <span>Import SOP</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#eceef0]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">Controlled Docs</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">12 / 12 READY</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">biotech</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">Active Assets Linked</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">40 Units</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[22px]">schedule</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">Audit Compliance</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">98.4% Ready</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">Sign-Off Status</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold truncate">Dr. Sareena Salim</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 mb-5 border border-[#eceef0]">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2 text-outline text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low pl-9 pr-3 py-1.5 rounded-DEFAULT text-on-surface font-body-sm text-body-sm outline-none focus:bg-surface-container-lowest border border-[#e0e3e5]"
            placeholder="Search SOP, Form, Clause..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`font-label-sm text-label-sm px-3 py-1.5 rounded-DEFAULT transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All (12)
          </button>
          <button
            onClick={() => setCategoryFilter('sop')}
            className={`font-label-sm text-label-sm px-3 py-1.5 rounded-DEFAULT transition-all cursor-pointer ${
              categoryFilter === 'sop'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            SOPs (5)
          </button>
          <button
            onClick={() => setCategoryFilter('forms')}
            className={`font-label-sm text-label-sm px-3 py-1.5 rounded-DEFAULT transition-all cursor-pointer ${
              categoryFilter === 'forms'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Controlled Forms &amp; Logs (6)
          </button>
          <button
            onClick={() => setCategoryFilter('checklists')}
            className={`font-label-sm text-label-sm px-3 py-1.5 rounded-DEFAULT transition-all cursor-pointer ${
              categoryFilter === 'checklists'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Audit Checklists (1)
          </button>
        </div>
      </div>

      {/* Main Split Layout: Documents Grid & Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Document Cards (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;

              return (
                <article
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-surface-container-lowest border-secondary shadow-md ring-1 ring-secondary'
                      : 'bg-surface-container-lowest border-[#eceef0] shadow-sm hover:shadow'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-badge text-mono-badge bg-primary-container text-on-primary px-2 py-0.5 rounded-DEFAULT font-bold">
                          {doc.code}
                        </span>
                        <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-1.5 py-0.5 rounded-DEFAULT text-[10px]">
                          {doc.version}
                        </span>
                      </div>
                      <span className="font-mono-badge text-mono-badge text-secondary font-semibold text-[10px]">
                        {doc.status}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-primary leading-tight mt-1 hover:text-secondary transition-colors">
                      {doc.title}
                    </h3>

                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mt-1.5 text-xs">
                      {doc.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#eceef0] text-[11px] font-mono-badge text-on-surface-variant">
                      <span>Scope: <strong>{doc.scope}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#eceef0]/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(doc.pdfFileName, 'PDF');
                      }}
                      className="flex-1 bg-primary text-on-primary font-label-sm text-label-sm py-1.5 rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center justify-center gap-1 text-xs cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(doc.altFileName, doc.altFileType);
                      }}
                      className="flex-1 bg-surface-container-high text-primary font-label-sm text-label-sm py-1.5 rounded-DEFAULT hover:bg-surface-variant transition-colors flex items-center justify-center gap-1 text-xs cursor-pointer border border-[#e0e3e5]"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">description</span>
                      <span>{doc.altFileType}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Cross-Reference Mapping Table */}
          <section className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-[#eceef0] mt-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Lab Equipment Cross-Reference Mapping
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Live audit matrix linking active surveillance equipment records with statutory compliance dossiers.
                </p>
              </div>
              <span className="font-mono-badge text-mono-badge bg-surface-container text-on-surface px-2 py-0.5 rounded-DEFAULT text-[10px]">
                Real-Time Traceability
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Equipment Name</th>
                    <th className="py-2 px-3">Model / Serial</th>
                    <th className="py-2 px-3">Section</th>
                    <th className="py-2 px-3">Program</th>
                    <th className="py-2 px-3">Calibration Due</th>
                    <th className="py-2 px-3">Required Compliance Dossier</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceef0]">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-semibold text-primary">Biosafety Cabinet (Healforce)</td>
                    <td className="py-2 px-3 font-mono-data text-mono-data text-xs">HFCARE 121812LCJ4106E</td>
                    <td className="py-2 px-3">Molecular Diagnostic</td>
                    <td className="py-2 px-3"><span className="bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded font-mono-badge text-[10px]">NRCP|NVHCP</span></td>
                    <td className="py-2 px-3 font-mono-data text-mono-data text-error font-semibold">2026-03-10 (DUE)</td>
                    <td className="py-2 px-3 font-mono-badge text-mono-badge text-primary">SOP-EQ-04 / FORM-EQ-01</td>
                    <td className="py-2 px-3 text-right"><span className="bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-mono-badge text-[10px]">RE-CALIBRATE</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-semibold text-primary">Centrifuge (Rotek 8 tube)</td>
                    <td className="py-2 px-3 font-mono-data text-mono-data text-xs">XX190</td>
                    <td className="py-2 px-3">Sample opening room</td>
                    <td className="py-2 px-3"><span className="bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded font-mono-badge text-[10px]">NRCP|MR Surv</span></td>
                    <td className="py-2 px-3 font-mono-data text-mono-data">2026-04-15</td>
                    <td className="py-2 px-3 font-mono-badge text-mono-badge text-primary">FORM-EQ-06 / SOP-EQ-02</td>
                    <td className="py-2 px-3 text-right"><span className="bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-mono-badge text-[10px]">VALID</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-semibold text-primary">RT PCR Machine (QuantStudio 5)</td>
                    <td className="py-2 px-3 font-mono-data text-mono-data text-xs">AB-QS5-2018</td>
                    <td className="py-2 px-3">PCR Room</td>
                    <td className="py-2 px-3"><span className="bg-primary-container text-on-primary px-1.5 py-0.5 rounded font-mono-badge text-[10px]">NVHCP|NVBDCP</span></td>
                    <td className="py-2 px-3 font-mono-data text-mono-data text-error font-semibold">2026-02-22 (OVERDUE)</td>
                    <td className="py-2 px-3 font-mono-badge text-mono-badge text-primary">SOP-EQ-01 / IQ-OQ-PQ</td>
                    <td className="py-2 px-3 text-right"><span className="bg-error text-on-error px-1.5 py-0.5 rounded font-mono-badge text-[10px]">AUDIT RED</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-semibold text-primary">Elisa Reader (Bio-Rad iMark)</td>
                    <td className="py-2 px-3 font-mono-data text-mono-data text-xs">MR-BR-091</td>
                    <td className="py-2 px-3">Molecular Diagnostic</td>
                    <td className="py-2 px-3"><span className="bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded font-mono-badge text-[10px]">MR Surveillance</span></td>
                    <td className="py-2 px-3 font-mono-data text-mono-data text-outline">N/A (Breakdown)</td>
                    <td className="py-2 px-3 font-mono-badge text-mono-badge text-error font-semibold">FORM-EQ-05 / RBER Active</td>
                    <td className="py-2 px-3 text-right"><span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded font-mono-badge text-[10px]">RBER REVIEW</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Live Document Inspector (4 cols sticky) */}
        <div className="lg:col-span-4 sticky top-20 flex flex-col gap-3">
          <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-[#eceef0]">
            {/* Inspector Header */}
            <div className="bg-primary text-on-primary px-3.5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-headline-sm text-headline-sm">Live Document Dossier</span>
              </div>
              <span className="bg-primary-container text-on-primary font-mono-badge text-mono-badge px-2 py-0.5 rounded-DEFAULT">
                {selectedDoc.code}
              </span>
            </div>

            {/* Document Sheet Simulator */}
            <div className="p-3 bg-surface-container-low flex flex-col gap-2.5">
              <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm flex flex-col gap-2.5 border border-[#eceef0]">
                {/* Official Letterhead */}
                <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
                  <div className="flex flex-col">
                    <span className="font-mono-badge text-mono-badge text-primary uppercase font-bold text-[10px]">
                      STATE PUBLIC HEALTH CLINICAL LAB
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[9px]">
                      VPD &amp; PPCL Surveillance Laboratory Services
                    </span>
                    <span className="font-mono-badge text-mono-badge text-secondary text-[9px]">
                      NABL ACCREDITATION ISO 15189:2022
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-badge text-mono-badge bg-surface-container px-1 py-0.5 rounded-DEFAULT block text-primary font-bold text-[9px]">
                      CONTROLLED COPY
                    </span>
                    <span className="font-mono-data text-mono-data text-outline text-[8px] mt-0.5 block">
                      STAMP #L-9402
                    </span>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="bg-surface-container-low p-2 rounded font-mono-data text-mono-data text-[10px] grid grid-cols-2 gap-1 text-on-surface-variant border border-[#e0e3e5]/60">
                  <div>DOC ID: <strong className="text-primary">{selectedDoc.code}</strong></div>
                  <div>VER: <span className="text-primary font-semibold">{selectedDoc.version}</span></div>
                  <div>CLAUSE: <span className="text-primary">5.3 Equipment</span></div>
                  <div>STATUS: <span className="text-secondary font-semibold">{selectedDoc.status}</span></div>
                </div>

                {/* Title & Excerpt */}
                <div className="flex flex-col gap-1">
                  <h4 className="font-headline-sm text-headline-sm text-primary leading-tight text-xs font-bold">
                    {selectedDoc.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs leading-relaxed">
                    {selectedDoc.purpose}
                  </p>
                </div>

                {/* Acceptance Criteria List */}
                <div className="bg-surface-container-low p-2 rounded flex flex-col gap-1 border border-[#e0e3e5]/60">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-[10px]">
                    <span className="text-on-surface-variant font-semibold">ISO 15189 Checklist</span>
                    <span className="text-secondary font-mono-badge text-mono-badge font-bold">100% COMPLETE</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-full"></div>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant list-disc pl-3 text-[10px] font-mono-data mt-1">
                    {selectedDoc.keyPoints.slice(0, 3).map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Sign-off Stamps */}
                <div className="pt-2 border-t border-[#eceef0] flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <div className="text-secondary font-mono-badge text-mono-badge italic text-[9px]">
                      [Verified Digitally]
                    </div>
                    <span className="font-label-sm text-label-sm text-primary text-[10px]">Dr. Sareena M. Salim</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[9px]">Quality Manager</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <div className="text-primary font-mono-badge text-mono-badge italic text-[9px]">
                      [Approved e-Sign]
                    </div>
                    <span className="font-label-sm text-label-sm text-primary text-[10px]">Biomedical Lead Eng.</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[9px]">Technical Assessor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Footer in Drawer */}
            <div className="p-3 bg-surface-container-lowest flex flex-col gap-1.5 border-t border-[#eceef0]">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleDownload(selectedDoc.pdfFileName, 'PDF')}
                  className="bg-primary text-on-primary font-label-md text-label-md py-2 rounded-DEFAULT hover:bg-primary-container transition-colors flex items-center justify-center gap-1 text-xs cursor-pointer shadow-sm"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => handleDownload(selectedDoc.altFileName, selectedDoc.altFileType)}
                  className="bg-surface-container-high text-primary font-label-md text-label-md py-2 rounded-DEFAULT hover:bg-surface-variant transition-colors flex items-center justify-center gap-1 text-xs cursor-pointer border border-[#e0e3e5]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">description</span>
                  <span>{selectedDoc.altFileType} Format</span>
                </button>
              </div>

              <button
                onClick={() => onShowToast('Controlled Link Copied', `Official NABL hash link for ${selectedDoc.code} copied.`, 'link')}
                className="w-full bg-surface-container-low text-on-surface font-label-sm text-label-sm py-1 rounded-DEFAULT hover:bg-surface-container transition-colors flex items-center justify-center gap-1 mt-0.5 cursor-pointer text-[11px]"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">link</span>
                <span>Copy Controlled Link for NABL Portal</span>
              </button>
            </div>
          </div>

          {/* Guidance Note */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-[#eceef0] flex flex-col gap-1">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-secondary text-[18px]">info</span>
              <h4 className="font-headline-sm text-headline-sm text-xs font-bold">Auditor Verification Note</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-relaxed">
              Per NABL 112 requirement, ensure all physical equipment history cards (FORM-EQ-01) affixed near instruments carry identical identification numbers as recorded in the master register (FORM-EQ-02).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

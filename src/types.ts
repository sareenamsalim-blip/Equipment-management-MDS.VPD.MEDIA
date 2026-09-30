export type LabSection = 'Molecular Diagnostic' | 'VPD Surveillance' | 'Media';

export type SurveillanceProgram = 
  | 'NRCP'
  | 'MR Surveillance'
  | 'NVHCP'
  | 'NVBDCP'
  | 'PPCL'
  | 'State Program'
  | 'Diphtheria Pertussis Surveillance';

export type EquipmentStatus = 
  | 'working'
  | 'not_working'
  | 'under_pm'
  | 'under_rber';

export interface Equipment {
  id: string;
  name: string;
  make: string;
  model: string;
  serialNumber: string;
  barcode: string;
  section: LabSection;
  location: string;
  installedDate: string;
  calibrationDate: string;
  calibrationDueDate: string;
  pmDueDate: string;
  status: EquipmentStatus;
  warrantyType: 'Comprehensive AMC' | 'Non-Comprehensive CMC' | 'Under OEM Warranty' | 'Departmental Coverage';
  programs: string[];
  notes?: string;
  activeTicket?: string;
  calibratingAgency?: string;
  calibrationCertNo?: string;
  rberReview?: boolean;
}

export interface VendorContract {
  id: string;
  vendorName: string;
  division: string;
  contractType: 'CMC COMPREHENSIVE' | 'OEM WARRANTY' | 'ANNUAL AMC';
  status: 'ACTIVE' | 'RENEWAL PENDING' | 'ACTIVE GOOD';
  coveredEquipment: string[];
  assignedEngineer: string;
  phone: string;
  validityStart: string;
  validityEnd: string;
  validityNote: string;
  pmFrequency: string;
  isOverdue?: boolean;
}

export interface BreakdownRecord {
  ticketId: string;
  equipmentId: string;
  equipmentName: string;
  serialNumber: string;
  section: LabSection;
  program: string;
  reportedDate: string;
  reportedBy: string;
  natureOfFault: string;
  rootCause: string;
  correctiveAction: string;
  serviceAgency: string;
  engineerCallRef: string;
  downtimeHours: number;
  resolutionDate?: string;
  status: 'OPEN' | 'RESOLVED' | 'UNDER_RBER';
  impactLevel: 'Critical' | 'Moderate' | 'Low';
}

export interface ControlledDocument {
  id: string;
  code: string;
  category: 'sop' | 'forms' | 'checklists';
  title: string;
  version: string;
  clause: string;
  status: string;
  description: string;
  scope: string;
  effectiveDate: string;
  reviewCycle: string;
  author: string;
  verifiedBy: string;
  approvedBy: string;
  designation: string;
  purpose: string;
  keyPoints: string[];
  pdfFileName: string;
  altFileName: string;
  altFileType: 'DOCX' | 'XLSX';
  fileSize: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: 'ADMIN' | 'STAFF';
  action: string;
  targetEquipment: string;
  originIp: string;
  hash: string;
  status: 'SUCCESS' | 'OPEN TICKET' | 'COMPLETE';
}

export type ActiveRole = 'ADMIN' | 'STAFF';

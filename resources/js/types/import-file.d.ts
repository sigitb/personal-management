export interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
  error: string | null;
  id: string;
  preview: string | null;
}

export interface ValidatedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

export interface FileImportConfig {
  allowedTypes: string[];
  maxSize: number; // in bytes
  accept?: string; // untuk input accept attribute
  description?: string;
  uploadUrl?: string; // URL endpoint untuk upload
  uploadMethod?: 'POST' | 'PUT'; // HTTP method
  uploadHeaders?: Record<string, string>; // Custom headers
  uploadFieldName?: string; // Field name untuk FormData (default: 'file' atau 'files')
}

export interface MultipleFileImportProps {
  config?: FileImportConfig;
  onImport?: (files: ValidatedFile[]) => void;
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: Error) => void;
}

export interface SingleFileImportProps {
  config?: FileImportConfig;
  onImport?: (file: ValidatedFile) => void;
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: Error) => void;
}

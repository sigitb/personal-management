import React, { useState, useCallback } from 'react';
import { Upload, X, File, CheckCircle2, FileSpreadsheet, ImageIcon, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FileData, FileImportConfig, MultipleFileImportProps, SingleFileImportProps, ValidatedFile } from '@/types/import-file';

// Types


// Component untuk Multiple Import
function MultipleFileImport({ config = DEFAULT_CONFIG, onImport, onUploadSuccess, onUploadError }: MultipleFileImportProps) {
    const [files, setFiles] = useState<FileData[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { allowedTypes, maxSize, accept, description, uploadUrl, uploadMethod = 'POST', uploadHeaders, uploadFieldName = 'files' } = { ...DEFAULT_CONFIG, ...config };

    const validateFile = (file: File): string | null => {
        if (file.size > maxSize) {
            const maxSizeMB = Math.round(maxSize / (1024 * 1024));
            return `File terlalu besar. Maksimal ${maxSizeMB}MB`;
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Tipe file tidak didukung';
        }

        return null;
    };

    const handleFiles = useCallback((newFiles: FileList): void => {
        setError('');
        const fileArray: File[] = Array.from(newFiles);

        const validatedFiles: FileData[] = fileArray.map((file: File) => {
            const error = validateFile(file);
            return {
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                error,
                id: Math.random().toString(36).substr(2, 9),
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
            };
        });

        const hasErrors: boolean = validatedFiles.some((f: FileData) => f.error);
        if (hasErrors) {
            setError('Beberapa file tidak valid. Silakan periksa kembali.');
        }

        setFiles((prev: FileData[]) => [...prev, ...validatedFiles]);
    }, [allowedTypes, maxSize]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles: FileList = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFiles(droppedFiles);
        }
    }, [handleFiles]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            handleFiles(selectedFiles);
        }
    };

    const removeFile = (id: string): void => {
        const fileToRemove = files.find((f: FileData) => f.id === id);
        if (fileToRemove?.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setFiles((prev: FileData[]) => prev.filter((f: FileData) => f.id !== id));
        if (files.length === 1) {
            setError('');
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k: number = 1024;
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
        const i: number = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleImport = async (): Promise<void> => {
        const validFiles: FileData[] = files.filter((f: FileData) => !f.error);
        if (validFiles.length === 0) {
            setError('Tidak ada file valid untuk diimport');
            return;
        }

        const filesToImport: ValidatedFile[] = validFiles.map(f => ({
            file: f.file,
            name: f.name,
            size: f.size,
            type: f.type,
            preview: f.preview
        }));

        // Jika ada uploadUrl, upload ke server
        if (uploadUrl) {
            setIsUploading(true);
            try {
                const formData = new FormData();

                // Append semua files
                filesToImport.forEach((fileData) => {
                    formData.append(uploadFieldName, fileData.file);
                });

                const response = await fetch(uploadUrl, {
                    method: uploadMethod,
                    headers: uploadHeaders,
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.statusText}`);
                }

                const result = await response.json();

                if (onUploadSuccess) {
                    onUploadSuccess(result);
                }

                alert(`Berhasil upload ${validFiles.length} file ke server!`);
            } catch (err) {
                const error = err as Error;
                console.error('Upload error:', error);

                if (onUploadError) {
                    onUploadError(error);
                }

                setError(`Upload gagal: ${error.message}`);
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        } else if (onImport) {
            // Callback jika tidak ada uploadUrl
            onImport(filesToImport);
        } else {
            console.log('Importing files:', filesToImport);
            alert(`Berhasil import ${validFiles.length} file!`);
        }

        setIsOpen(false);
        files.forEach((f: FileData) => f.preview && URL.revokeObjectURL(f.preview));
        setFiles([]);
        setError('');
    };

    const resetDialog = (): void => {
        files.forEach((f: FileData) => f.preview && URL.revokeObjectURL(f.preview));
        setFiles([]);
        setError('');
        setIsDragging(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open: boolean) => {
            setIsOpen(open);
            if (!open) resetDialog();
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-[7px] border-primary text-primary hover:bg-primary" size={"sm"}>
                    <FileUp className="w-4 h-4" />
                    Import
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[7px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Import Files</AlertDialogTitle>
                    <AlertDialogDescription>
                        Upload beberapa file sekaligus
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <Card
                        className={`border-2 border-dashed transition-colors ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <CardContent className="flex flex-col items-center justify-center py-10 px-6">
                            <Upload className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className="text-lg font-medium mb-2">
                                Drag & drop file di sini
                            </p>
                            <p className="text-sm text-gray-500 mb-4">atau</p>

                            <label htmlFor="multiple-file-input">
                                <Button variant="outline" className="cursor-pointer" asChild>
                                    <span>Pilih File</span>
                                </Button>
                            </label>
                            <input
                                id="multiple-file-input"
                                type="file"
                                multiple
                                accept={accept}
                                className="hidden"
                                onChange={handleFileInput}
                            />

                            <p className="text-xs text-gray-500 mt-4">
                                Mendukung: {description}
                            </p>
                        </CardContent>
                    </Card>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {files.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">
                                    File Terpilih ({files.length})
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        files.forEach((f: FileData) => f.preview && URL.revokeObjectURL(f.preview));
                                        setFiles([]);
                                        setError('');
                                    }}
                                >
                                    Hapus Semua
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {files.map((fileData: FileData) => (
                                    <Card key={fileData.id} className={fileData.error ? 'border-red-300' : ''}>
                                        <CardContent className="flex items-center justify-between p-3">
                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                {fileData.error ? (
                                                    <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                                                ) : (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                )}

                                                {fileData.preview ? (
                                                    <img
                                                        src={fileData.preview}
                                                        alt={fileData.name}
                                                        className="w-12 h-12 object-cover rounded flex-shrink-0"
                                                    />
                                                ) : (
                                                    <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{fileData.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(fileData.size)}
                                                    </p>
                                                    {fileData.error && (
                                                        <p className="text-xs text-red-500">{fileData.error}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFile(fileData.id)}
                                                className="ml-2 flex-shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={resetDialog} className='rounded-[7px] text-primary hover:bg-primary border-primary'>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='rounded-[7px]'
                        onClick={handleImport}
                        disabled={files.length === 0 || files.every((f: FileData) => f.error) || isUploading}
                    >
                        {isUploading ? 'Uploading...' : `Import ${files.filter((f: FileData) => !f.error).length > 0 ? `${files.filter((f: FileData) => !f.error).length} File` : ''}`}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Component untuk Single Import
function SingleFileImport({ config = DEFAULT_CONFIG, onImport, onUploadSuccess, onUploadError }: SingleFileImportProps) {
    const [file, setFile] = useState<ValidatedFile | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { allowedTypes, maxSize, accept, description, uploadUrl, uploadMethod = 'POST', uploadHeaders, uploadFieldName = 'file' } = { ...DEFAULT_CONFIG, ...config };

    const validateFile = (file: File): string | null => {
        if (file.size > maxSize) {
            const maxSizeMB = Math.round(maxSize / (1024 * 1024));
            return `File terlalu besar. Maksimal ${maxSizeMB}MB`;
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Tipe file tidak didukung';
        }

        return null;
    };

    const handleFile = useCallback((selectedFile: File): void => {
        setError('');
        const error = validateFile(selectedFile);

        if (error) {
            setError(error);
            setFile(null);
            return;
        }

        setFile({
            file: selectedFile,
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            preview: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null
        });
    }, [allowedTypes, maxSize]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile: File | undefined = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }, [handleFile]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFile(selectedFile);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k: number = 1024;
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
        const i: number = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleImport = async (): Promise<void> => {
        if (!file) {
            setError('Silakan pilih file terlebih dahulu');
            return;
        }

        // Jika ada uploadUrl, upload ke server
        if (uploadUrl) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append(uploadFieldName, file.file);

                const response = await fetch(uploadUrl, {
                    method: uploadMethod,
                    headers: uploadHeaders,
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.statusText}`);
                }

                const result = await response.json();

                if (onUploadSuccess) {
                    onUploadSuccess(result);
                }

                alert(`Berhasil upload file: ${file.name}`);
            } catch (err) {
                const error = err as Error;
                console.error('Upload error:', error);

                if (onUploadError) {
                    onUploadError(error);
                }

                setError(`Upload gagal: ${error.message}`);
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        } else if (onImport) {
            // Callback jika tidak ada uploadUrl
            onImport(file);
        } else {
            console.log('Importing file:', file);
            alert(`Berhasil import file: ${file.name}`);
        }

        setIsOpen(false);
        if (file.preview) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
        setError('');
    };

    const resetDialog = (): void => {
        if (file?.preview) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
        setError('');
        setIsDragging(false);
    };

    const removeFile = (): void => {
        if (file?.preview) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open: boolean) => {
            setIsOpen(open);
            if (!open) resetDialog();
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-[7px] border-primary text-primary hover:bg-primary" size={"sm"}>
                    <FileUp className="w-4 h-4" />
                    Import
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-2xl rounded-[7px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Import File</AlertDialogTitle>
                    <AlertDialogDescription>
                        Upload file
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <Card
                        className={`border-2 border-dashed transition-colors ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <CardContent className="flex flex-col items-center justify-center py-10 px-6">
                            <Upload className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className="text-lg font-medium mb-2">
                                Drag & drop file di sini
                            </p>
                            <p className="text-sm text-gray-500 mb-4">atau</p>

                            <label htmlFor="single-file-input">
                                <Button variant="outline" className="cursor-pointer" asChild>
                                    <span>Pilih File</span>
                                </Button>
                            </label>
                            <input
                                id="single-file-input"
                                type="file"
                                accept={accept}
                                className="hidden"
                                onChange={handleFileInput}
                            />

                            <p className="text-xs text-gray-500 mt-4">
                                Mendukung: {description}
                            </p>
                        </CardContent>
                    </Card>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {file && (
                        <Card className="border-green-300 bg-green-50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />

                                        {file.preview ? (
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-16 h-16 object-cover rounded flex-shrink-0"
                                            />
                                        ) : (
                                            <File className="w-6 h-6 text-gray-600 flex-shrink-0" />
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{file.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeFile}
                                        className="ml-2 flex-shrink-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                {file.preview && (
                                    <div className="mt-4">
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className="w-full h-48 object-contain rounded border bg-white"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={resetDialog} className='rounded-[7px] text-primary hover:bg-primary border-primary'>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='rounded-[7px]'
                        onClick={handleImport}
                        disabled={!file || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Import File'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Preset Configurations

export const DEFAULT_CONFIG: FileImportConfig = {
    allowedTypes: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: '.xlsx,.xls,.csv,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.svg',
    description: 'Excel, CSV, PDF, DOC, DOCX, JPG, PNG, GIF, WEBP, SVG (Max. 10MB)'
};

export const FILE_CONFIGS = {
    // Hanya Gambar
    IMAGES_ONLY: {
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: '.jpg,.jpeg,.png,.gif,.webp',
        description: 'JPG, PNG, GIF, WEBP (Max. 5MB)',
        uploadUrl: '/api/upload/images', // Example endpoint
        uploadFieldName: 'image'
    },

    // Hanya Excel & CSV
    EXCEL_ONLY: {
        allowedTypes: [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ],
        maxSize: 10 * 1024 * 1024, // 10MB
        accept: '.xlsx,.xls',
        description: 'Excel (.xlsx, .xls)'
    },

    // Hanya Dokumen
    DOCUMENTS_ONLY: {
        allowedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        maxSize: 15 * 1024 * 1024, // 15MB
        accept: '.pdf,.doc,.docx',
        description: 'PDF, DOC, DOCX (Max. 15MB)'
    },

    // Semua Tipe (Default)
    ALL_FILES: DEFAULT_CONFIG
};

// Export components
export { SingleFileImport, MultipleFileImport };
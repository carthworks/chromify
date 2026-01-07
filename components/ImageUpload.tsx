'use client';

import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
    onImageUpload: (file: File, dataUrl: string) => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a JPG, PNG, or WebP image');
            return false;
        }

        // Check file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return false;
        }

        setError(null);
        return true;
    };

    const handleFile = useCallback((file: File) => {
        if (!validateFile(file)) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setPreview(dataUrl);
            onImageUpload(file, dataUrl);
        };
        reader.readAsDataURL(file);
    }, [onImageUpload]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const clearImage = () => {
        setPreview(null);
        setError(null);
    };

    return (
        <div className="w-full">
            {!preview ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative border-2 border-dashed rounded-xl p-12 text-center
            transition-all duration-300 cursor-pointer
            ${isDragging
                            ? 'border-indigo-500 bg-indigo-500/10 scale-105'
                            : 'border-gray-600 hover:border-indigo-400 hover:bg-white/5'
                        }
          `}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-indigo-500/20">
                            <Upload className="w-12 h-12 text-indigo-400" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Drop your image here
                            </h3>
                            <p className="text-gray-400">
                                or click to browse
                            </p>
                        </div>

                        <div className="text-sm text-gray-500">
                            Supports JPG, PNG, WebP • Max 10MB
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative group">
                    <div className="glass rounded-xl p-4 overflow-hidden">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>

                    <button
                        onClick={clearImage}
                        className="absolute top-6 right-6 p-2 bg-red-500 rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     hover:bg-red-600 hover:scale-110 active:scale-95"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}

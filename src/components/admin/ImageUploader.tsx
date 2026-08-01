"use client";

import React, { useState, useRef } from 'react';
import { Upload, Trash2, AlertTriangle, X } from 'lucide-react';
import { compressImage } from '@/utils/imageCompression';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket: 'rubros' | 'categorias' | 'negocios';
  label?: string;
}

export function ImageUploader({ value, onChange, bucket, label }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [stats, setStats] = useState<{
    originalSize: string;
    compressedSize: string;
    percent: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formateador de bytes a unidades legibles
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado debe ser una imagen válida.');
      return;
    }

    setIsUploading(true);
    setError('');
    setStats(null);

    try {
      // 1. Comprimir la imagen en el cliente
      const { compressedFile, originalSize, compressedSize } = await compressImage(file, 1200, 0.8);
      
      const savedPercent = (((originalSize - compressedSize) / originalSize) * 100).toFixed(0);
      
      // 2. Preparar FormData para subir al backend
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('bucket', bucket);

      // 3. Petición POST al backend
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al subir la imagen.');
      }

      // 4. Guardar URL pública y establecer estadísticas
      onChange(data.url);
      setStats({
        originalSize: formatSize(originalSize),
        compressedSize: formatSize(compressedSize),
        percent: `${savedPercent}%`,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  // Manejo de eventos de Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar abrir selector de archivos
    onChange('');
    setStats(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="font-label text-xs uppercase font-bold text-on-background">
          {label}
        </label>
      )}

      {/* Input de archivo invisible */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed border-on-background p-5 bg-slate-50 transition-all flex flex-col items-center justify-center min-h-[150px] text-center cursor-pointer select-none hover:bg-slate-100/80 ${
          dragActive ? 'bg-slate-200 border-solid border-primary' : ''
        } ${isUploading ? 'cursor-wait pointer-events-none' : ''}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-8 h-8 border-4 border-on-background border-t-transparent rounded-full animate-spin"></div>
            <span className="font-sans font-bold text-xs uppercase text-on-background">
              Comprimiendo y subiendo...
            </span>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="border-2 border-on-background p-1 w-44 aspect-video bg-white relative overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <img
                src={value}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={removeImage}
                className="bg-tertiary text-white border-2 border-on-background px-3 py-1.5 font-sans text-xs font-bold uppercase shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Quitar Imagen
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-white text-on-background border-2 border-on-background px-3 py-1.5 font-sans text-xs font-bold uppercase shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="bg-white border-2 border-on-background p-2 rounded shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <Upload className="w-5 h-5 text-on-background" />
            </div>
            <p className="font-sans font-bold text-xs uppercase text-on-background">
              Arrastra una imagen aquí o <span className="underline text-primary">haz clic para buscar</span>
            </p>
            <p className="font-sans text-[10px] text-slate-500 font-medium uppercase">
              Formatos soportados: JPG, PNG, WEBP
            </p>
          </div>
        )}
      </div>

      {/* Información/Estadísticas de Compresión */}
      {stats && value && (
        <div className="bg-emerald-50 border-2 border-on-background text-on-background p-2.5 font-sans text-[10px] font-bold uppercase flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <span className="bg-secondary-fixed text-on-background px-1.5 py-0.5 border border-on-background font-mono text-[9px]">
            COMPRIMIDO: -{stats.percent}
          </span>
          <span>
            De {stats.originalSize} a {stats.compressedSize} (¡Optimizado!)
          </span>
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-tertiary text-white border-2 border-on-background p-2.5 font-sans text-xs font-semibold flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="ml-auto cursor-pointer">
            <X className="w-4 h-4 hover:opacity-80" />
          </button>
        </div>
      )}
    </div>
  );
}

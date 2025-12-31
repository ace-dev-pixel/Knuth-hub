"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, File as FileIcon, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onChange: (url: string) => void;
  value?: string;
  disabled?: boolean;
}

export const FileUpload = ({ onChange, value, disabled }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        onChange(response.data.secure_url);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed. Check your Cloudinary keys.");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  // 1. If an image is already uploaded, show the preview
  if (value) {
    return (
      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/10 group">
        <Image src={value} alt="Upload" fill className="object-cover" />
        <button
          onClick={() => onChange("")}
          className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 2. Otherwise, show the Drag & Drop Zone
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300",
        isDragActive
          ? "border-neon-cyan bg-neon-cyan/5 scale-[1.01]"
          : "border-white/10 bg-slate/30 hover:bg-slate/50 hover:border-white/20"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={cn(
            "p-4 rounded-full transition-colors",
            isDragActive ? "bg-neon-cyan/20 text-neon-cyan" : "bg-white/5 text-gray-400"
        )}>
          {isUploading ? (
            <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <CloudUpload className="w-8 h-8" />
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">
            {isUploading ? "Uploading to Cloud..." : "Drop poster here"}
          </p>
          <p className="text-xs text-gray-500">
            SVG, PNG, JPG or GIF (Max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
};
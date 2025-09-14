"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { updateMedia, setErrors, clearError } from "@/lib/slices/propertySlice";
import { mediaSchema } from "@/lib/schemas/propertySchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

interface FileWithPreview {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video" | "document";
}

const MediaTab: React.FC = () => {
  const dispatch = useDispatch();
  const { media, errors } = useSelector((state: RootState) => state.property);

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<FileWithPreview[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // File validation
  const validateFile = (
    file: File,
    type: "image" | "video" | "document"
  ): string | null => {
    const maxSizes = {
      image: 5 * 1024 * 1024, // 5MB
      video: 50 * 1024 * 1024, // 50MB
      document: 10 * 1024 * 1024, // 10MB
    };

    const allowedTypes = {
      image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      video: ["video/mp4", "video/avi", "video/mov", "video/wmv"],
      document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    };

    if (file.size > maxSizes[type]) {
      return `File size must be less than ${maxSizes[type] / (1024 * 1024)}MB`;
    }

    if (!allowedTypes[type].includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes[type].join(
        ", "
      )}`;
    }

    return null;
  };

  // Create file preview
  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0);
          resolve(canvas.toDataURL());
        };
        video.src = URL.createObjectURL(file);
      } else {
        // For documents, create a generic preview
        resolve("/file-icon.png"); // You can add a default document icon
      }
    });
  };

  // Handle file upload
  const handleFileUpload = async (
    files: FileList,
    type: "image" | "video" | "document"
  ) => {
    const newFiles: FileWithPreview[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file, type);

      if (validationError) {
        setLocalErrors((prev) => ({
          ...prev,
          [`${type}_${file.name}`]: validationError,
        }));
        continue;
      }

      try {
        const preview = await createFilePreview(file);
        newFiles.push({
          id: `${Date.now()}_${Math.random()}`,
          file,
          preview,
          type,
        });
      } catch (error) {
        console.error("Error creating preview:", error);
      }
    }

    if (newFiles.length > 0) {
      setUploadingFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files;
      // Auto-detect file type based on MIME type
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          handleFileUpload({ [i]: file, length: 1 } as FileList, "image");
        } else if (file.type.startsWith("video/")) {
          handleFileUpload({ [i]: file, length: 1 } as FileList, "video");
        } else {
          handleFileUpload({ [i]: file, length: 1 } as FileList, "document");
        }
      }
    }
  }, []);

  // Remove file from uploading list
  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // Save files to media state
  const saveFiles = (type: "image" | "video" | "document") => {
    const filesToSave = uploadingFiles.filter((file) => file.type === type);
    const fileUrls = filesToSave.map((file) => URL.createObjectURL(file.file));

    dispatch(
      updateMedia({
        [type === "image"
          ? "images"
          : type === "video"
          ? "videos"
          : "documents"]: [
          ...(media[
            type === "image"
              ? "images"
              : type === "video"
              ? "videos"
              : "documents"
          ] || []),
          ...fileUrls,
        ],
      })
    );

    // Remove saved files from uploading list
    setUploadingFiles((prev) => prev.filter((file) => file.type !== type));
  };

  // Remove saved file
  const removeSavedFile = (
    type: "image" | "video" | "document",
    index: number
  ) => {
    const currentFiles =
      media[
        type === "image" ? "images" : type === "video" ? "videos" : "documents"
      ] || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);

    dispatch(
      updateMedia({
        [type === "image"
          ? "images"
          : type === "video"
          ? "videos"
          : "documents"]: updatedFiles,
      })
    );
  };

  // Validate form
  const validateForm = useCallback(() => {
    try {
      mediaSchema.parse(media);
      setLocalErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: Record<string, string> = {};
      if (error && typeof error === "object" && "errors" in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>;
        };
        zodError.errors.forEach((err) => {
          const fieldPath = err.path.join(".");
          newErrors[fieldPath] = err.message;
        });
      }
      setLocalErrors(newErrors);
      return false;
    }
  }, [media]);

  // Trigger file input
  const triggerFileInput = (type: "image" | "video" | "document") => {
    const inputRef =
      type === "image"
        ? imageInputRef
        : type === "video"
        ? videoInputRef
        : documentInputRef;
    inputRef.current?.click();
  };

  const getFieldError = (field: string) => {
    return errors[field] || localErrors[field];
  };

  const hasErrors = Object.keys(localErrors).length > 0;

  return (
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the validation errors below before proceeding.
          </AlertDescription>
        </Alert>
      )}

      {/* Drag and Drop Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media Files</CardTitle>
          <CardDescription>
            Drag and drop files here or click the buttons below to select files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop files here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Images (JPG, PNG, WebP), Videos (MP4, AVI, MOV), Documents (PDF,
              DOC, DOCX)
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => triggerFileInput("image")}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Add Images
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => triggerFileInput("video")}
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Add Videos
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => triggerFileInput("document")}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Add Documents
              </Button>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              e.target.files && handleFileUpload(e.target.files, "image")
            }
            className="hidden"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={(e) =>
              e.target.files && handleFileUpload(e.target.files, "video")
            }
            className="hidden"
          />
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={(e) =>
              e.target.files && handleFileUpload(e.target.files, "document")
            }
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Files Ready to Upload</CardTitle>
            <CardDescription>
              Review and save the selected files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["image", "video", "document"].map((type) => {
              const filesOfType = uploadingFiles.filter(
                (file) => file.type === type
              );
              if (filesOfType.length === 0) return null;

              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">
                      {type}s ({filesOfType.length})
                    </h4>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        saveFiles(type as "image" | "video" | "document")
                      }
                    >
                      Save {type}s
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filesOfType.map((file) => (
                      <div
                        key={file.id}
                        className="relative border rounded-lg p-2"
                      >
                        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-2">
                          {file.type === "image" ? (
                            <img
                              src={file.preview}
                              alt={file.file.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : file.type === "video" ? (
                            <video
                              src={file.preview}
                              className="w-full h-full object-cover rounded"
                              muted
                            />
                          ) : (
                            <FileText className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <p
                          className="text-xs text-gray-600 truncate"
                          title={file.file.name}
                        >
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(file.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadingFile(file.id)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Saved Files */}
      {((media.images && media.images.length > 0) ||
        (media.videos && media.videos.length > 0) ||
        (media.documents && media.documents.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Media</CardTitle>
            <CardDescription>Your uploaded media files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            {media.images && media.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Images ({media.images.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {media.images.map((url, index) => (
                    <div key={index} className="relative border rounded-lg p-2">
                      <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-2">
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedFile("image", index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {media.videos && media.videos.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Videos ({media.videos.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {media.videos.map((url, index) => (
                    <div key={index} className="relative border rounded-lg p-2">
                      <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-2">
                        <video
                          src={url}
                          className="w-full h-full object-cover rounded"
                          muted
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedFile("video", index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {media.documents && media.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">
                  Documents ({media.documents.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {media.documents.map((url, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg p-3 flex items-center gap-3"
                    >
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Document {index + 1}
                        </p>
                        <p className="text-xs text-gray-500">PDF/DOC file</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedFile("document", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaTab;

"use client";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn, useConstructUrl } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadingState,
  UploadedState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progess: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string | null;
  fileType: "image" | "video";
}

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Uploader = ({ onChange, value }: iAppProps) => {
  const fileURL = useConstructUrl(value);
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progess: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
    key: value,
    objectUrl: fileURL,
  });

  async function uploadFiles(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progess: 0,
    }));

    try {
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned url");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progess: 0,
          error: true,
        }));

        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pecentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              uploading: true,
              progess: Math.round(pecentageCompleted),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 200) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progess: 100,
              key: key,
            }));
            toast.success("file uploaded successfully");

            onChange?.(key);

            resolve();
          } else {
            reject(new Error("Upload failed..."));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed..."));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("something went wrong...");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progess: 0,
        error: true,
        objectUrl: null,
      }));
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          file: file,
          uploading: false,
          progess: 0,
          isDeleting: false,
          error: false,
          id: uuidv4(),
          objectUrl: URL.createObjectURL(file),
          fileType: "image",
        });

        uploadFiles(file);
      }
    },
    [fileState.objectUrl]
  );

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to remove file from storage");

        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        file: null,
        uploading: false,
        progess: 0,
        objectUrl: undefined,
        error: false,
        fileType: "image",
        id: null,
        isDeleting: false,
      }));

      toast.success("File removed Successfully");
    } catch {
      toast.error("error removing file, Try Again");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const toManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (toManyFiles) {
        toast.error("Too many files selected, max is 1");
      }
      if (fileSizeTooBig) {
        toast.error("File Size Too Big");
      }
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progess}
          file={fileState.file as File}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.objectUrl) {
      return (
        <UploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, //5mb calucation,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  return (
    <Card
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "broder-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
      {...getRootProps()}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Uploader;

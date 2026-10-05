import React, { forwardRef, useId, useRef, useState } from "react";
import "./CandyFileUpload.css";

export interface CandyFileUploadProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "size"
  | "value"
  | "defaultValue"
  | "onChange"
  | "children"
  | "onError"
> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onError?: (message: string, file?: File) => void;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept?.trim()) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept.split(",").some((entry) => {
    const rule = entry.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

export const CandyFileUpload = forwardRef<
  HTMLInputElement,
  CandyFileUploadProps
>(
  (
    {
      label = "Click or drop files here",
      description,
      children,
      maxSize = 10 * 1024 * 1024,
      maxFiles = Infinity,
      onFilesChange,
      onError,
      accept,
      multiple = false,
      disabled = false,
      id,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || `candy-file-upload-${generatedId.replace(/:/g, "")}`;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const dragDepth = useRef(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const sizeLimit = Number.isFinite(maxSize)
      ? Math.max(0, maxSize)
      : Infinity;
    const fileLimit = Number.isFinite(maxFiles)
      ? Math.max(0, Math.floor(maxFiles))
      : Infinity;

    function selectFiles(incoming: File[]) {
      if (disabled) return;
      const candidates = multiple ? incoming : incoming.slice(0, 1);
      const accepted: File[] = [];
      const errors: string[] = [];
      for (const file of candidates) {
        let message = "";
        if (!matchesAccept(file, accept)) {
          message = `${file.name}: this file type is not supported.`;
        } else if (file.size > sizeLimit) {
          message = `${file.name}: file exceeds the ${Math.round((sizeLimit / (1024 * 1024)) * 10) / 10} MB limit.`;
        } else if (accepted.length >= fileLimit) {
          message = `You can select up to ${fileLimit} files.`;
        }
        if (message) {
          errors.push(message);
          onError?.(message, file);
        } else {
          accepted.push(file);
        }
      }
      const transfer = new DataTransfer();
      accepted.forEach((file) => transfer.items.add(file));
      if (inputRef.current) inputRef.current.files = transfer.files;
      setError(errors.join(" "));
      setFiles(accepted);
      onFilesChange?.(accepted);
    }

    const describedBy =
      [
        rest["aria-describedby"],
        description ? descriptionId : undefined,
        error ? errorId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div
        className={`candy-file-upload${dragging && !disabled ? " candy-file-upload-dragging" : ""}${disabled ? " candy-file-upload-disabled" : ""}${error ? " candy-file-upload-invalid" : ""} ${className}`}
        style={style}
      >
        <div
          className="candy-file-upload-target"
          onDragEnter={(event) => {
            event.preventDefault();
            if (disabled) return;
            dragDepth.current += 1;
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = disabled ? "none" : "copy";
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (!dragDepth.current) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            dragDepth.current = 0;
            setDragging(false);
            selectFiles(Array.from(event.dataTransfer.files));
          }}
        >
          <input
            {...rest}
            ref={(element) => {
              inputRef.current = element;
              if (typeof ref === "function") ref(element);
              else if (ref) ref.current = element;
            }}
            id={inputId}
            className="candy-file-upload-input"
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            aria-labelledby={
              rest["aria-labelledby"] ||
              (rest["aria-label"] ? undefined : `${inputId}-label`)
            }
            aria-describedby={describedBy}
            aria-invalid={error ? true : rest["aria-invalid"]}
            onChange={(event) =>
              selectFiles(Array.from(event.target.files ?? []))
            }
          />
          {children || (
            <svg
              className="candy-file-upload-icon"
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17H5a4 4 0 0 1-.5-7.97A7 7 0 0 1 18 7a5 5 0 0 1 1 9.9h-2M12 21V10m-4 4 4-4 4 4" />
            </svg>
          )}
          <label
            id={`${inputId}-label`}
            htmlFor={inputId}
            className="candy-file-upload-label"
          >
            {label}
          </label>
          {description && (
            <span id={descriptionId} className="candy-file-upload-description">
              {description}
            </span>
          )}
        </div>
        {files.length > 0 && (
          <ul className="candy-file-upload-files" aria-label="Selected files">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <span>{file.name}</span>
                <span>{(file.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        )}
        {error && (
          <div id={errorId} className="candy-file-upload-error" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  },
);

CandyFileUpload.displayName = "CandyFileUpload";

import React, { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../../components';

const defaultAllowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const defaultAllowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

function isAllowed(file, allowedTypes, allowedExtensions) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(file.type) || allowedExtensions.includes(extension);
}

export default function FileUpload({
  label,
  name,
  value,
  error,
  onChange,
  required,
  accept = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png',
  allowedTypes = defaultAllowedTypes,
  allowedExtensions = defaultAllowedExtensions,
  helperText = 'Allowed formats: PDF, JPG, PNG',
  buttonLabel = 'Choose File',
  icon = 'upload',
  maxSizeMb = 5,
}) {
  const id = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(value?.name ? 100 : 0);
  const previewUrlRef = useRef('');

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const setFile = (file) => {
    if (!file) return;
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      onChange(name, null, `File must be ${maxSizeMb} MB or smaller.`);
      setProgress(0);
      return;
    }
    if (!isAllowed(file, allowedTypes, allowedExtensions)) {
      onChange(name, null, `Allowed formats: ${allowedExtensions.map((extension) => extension.toUpperCase()).join(', ')}.`);
      setProgress(0);
      return;
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    }
    const previewUrl = file.type?.startsWith('image/') ? URL.createObjectURL(file) : '';
    previewUrlRef.current = previewUrl;
    setProgress(72);
    onChange(name, {
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop()?.toUpperCase(),
      previewUrl,
    });
    window.setTimeout(() => setProgress(100), 220);
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    setFile(file);
    if (event.target) event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    setFile(event.dataTransfer.files?.[0]);
  };

  const extensions = allowedExtensions.map((extension) => extension.toUpperCase()).join(', ');
  const isPdf = value?.name?.toLowerCase().endsWith('.pdf');
  const uploaded = Boolean(value?.name && progress === 100 && !error);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={`mtpg-file-upload ${dragging ? 'is-dragging' : ''} ${uploaded ? 'is-uploaded' : ''} ${error ? 'has-error' : ''}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${label} upload. ${helperText}`}
    >
      <div className="mtpg-file-upload__head">
        <strong>
          {label}
          {required ? <span className="mtpg-required-mark" aria-hidden="true">*</span> : ''}
        </strong>
        <span>{helperText}</span>
      </div>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
      />
      <div className="mtpg-upload-dropzone">
        <span className="mtpg-upload-dropzone__icon"><Icon name={uploaded ? 'checkCircle' : icon} size={18} /></span>
        <div>
          <b>{uploaded ? 'Uploaded successfully' : 'Drag and drop file here'}</b>
          <small>Max {maxSizeMb} MB</small>
        </div>
      </div>
      <div className="mtpg-format-chips" aria-label="Supported formats">
        {allowedExtensions.map((extension) => <span key={extension}>{extension.toUpperCase()}</span>)}
      </div>
      <button type="button" onClick={(event) => {
        event.stopPropagation();
        inputRef.current?.click();
      }}>
        <Icon name={icon} size={16} /> {buttonLabel}
      </button>
      {value?.name && (
        <div className="mtpg-file-preview">
          <span className="mtpg-file-thumb">
            {value.previewUrl ? <img src={value.previewUrl} alt="" /> : <Icon name={isPdf ? 'fileText' : 'fileCheck'} size={18} />}
          </span>
          <span>{value.name}</span>
          <small>{Math.max(1, Math.round(value.size / 1024))} KB</small>
          <b>{uploaded ? 'Uploaded' : 'Uploading'}</b>
        </div>
      )}
      {(value?.name || progress > 0) && (
        <div className="mtpg-upload-progress" aria-label={`Upload progress ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <small className="mtpg-file-error">{error}</small>}
    </div>
  );
}

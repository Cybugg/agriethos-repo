import React, { useRef, useEffect } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {autoResize?: boolean;}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({ value, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to content height
    }
  }, [value]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      value={value}
      style={{ overflow: 'hidden', resize: 'none' }}
    />
  );
};

export default AutoResizeTextarea;

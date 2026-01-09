// FILE: src/components/RepliqStudio/components/CreateButton.jsx
import React from 'react';

export default function CreateButton({
  onClick,
  isCreating,
  progress,
  leadsCount,
  hasVideo
}) {
  const isDisabled = isCreating || leadsCount === 0 || !hasVideo;
  
  let buttonText;
  if (isCreating) {
    buttonText = `Creating... ${progress}%`;
  } else if (leadsCount === 0) {
    buttonText = '🚀 Upload CSV First';
  } else if (!hasVideo) {
    buttonText = '🚀 Upload Video First';
  } else {
    buttonText = `🚀 Create ${leadsCount} Landing Pages`;
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="create-button"
    >
      {buttonText}
    </button>
  );
}
import React from 'react';

export const AriaLiveRegion: React.FC = () => {
  return (
    <>
      <div
        id="imagefit-aria-polite"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="imagefit-aria-assertive"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
};

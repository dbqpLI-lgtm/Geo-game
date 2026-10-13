import React, { useState } from 'react';

interface FlagImageProps {
  countryCode: string;
  emoji: string;
  alt: string;
  className: string;
}

export const FlagImage: React.FC<FlagImageProps> = ({ countryCode, emoji, alt, className }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={className} role="img" aria-label={alt}>{emoji}</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

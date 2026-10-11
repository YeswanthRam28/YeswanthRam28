import React, { useState } from 'react';
import PreloadPro from './components/PreloadPro';
import BlankSpace from './components/BlankSpace';

export default function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* The destination scene: always mounted so it's revealed as strips slide up */}
      <BlankSpace />

      {/* PreloadPro leading animation overlay */}
      {isPreloading && (
        <PreloadPro
          leftText="We build"
          scrollingWords={["Creative", "Modern", "Dynamic", "Elegant", "Unique"]}
          stripColor="#0d0d11"
          textColor="#ffffff"
          accentColor="#a8eb0c"
          fontSizeDesktop={56}
          fontSizeMobile={32}
          wordInterval={0.5}
          stripExitDelay={0.11}
          stripExitDuration={0.75}
          onComplete={() => setIsPreloading(false)}
        />
      )}
    </div>
  );
}

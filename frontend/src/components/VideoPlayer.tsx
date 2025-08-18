import React, { useEffect, useState, useRef } from 'react';
interface VideoPlayerProps {
  youtubeId: string;
  title: string;
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  title
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // Responsive container sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  return <div className="rounded-xl overflow-hidden bg-black shadow-lg" ref={containerRef}>
      <div className="relative">
        {/* YouTube iframe with responsive height */}
        <div className="relative pb-[56.25%] h-0">
          <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        {/* Watermark overlay (optional) */}
        <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
          Learning MS
        </div>
      </div>
      <div className="bg-white dark:bg-dark-card p-4">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
    </div>;
};
export default VideoPlayer;
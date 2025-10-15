import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Esempio 3: Player Video Personalizzato con useRef
 * 
 * Questo esempio dimostra:
 * - useRef per controllare elementi video HTML5
 * - Gestione eventi video e timeline
 * - Controlli personalizzati e keyboard shortcuts
 * - Gestione fullscreen e picture-in-picture
 * - Integrazione con API del browser
 * - Gestione stati complessi del player
 */

// Hook personalizzato per gestire il video
function useVideoPlayer(videoRef) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const updateTime = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, [videoRef]);
  
  const updateDuration = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, [videoRef]);
  
  const updateVolume = useCallback(() => {
    if (videoRef.current) {
      setVolume(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
    }
  }, [videoRef]);
  
  const updateBuffered = useCallback(() => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const bufferedPercent = (bufferedEnd / videoRef.current.duration) * 100;
      setBuffered(bufferedPercent);
    }
  }, [videoRef]);
  
  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [videoRef]);
  
  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [videoRef]);
  
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);
  
  const seek = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [videoRef]);
  
  const setVideoVolume = useCallback((newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0) {
        setIsMuted(false);
      }
    }
  }, [videoRef]);
  
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted, videoRef]);
  
  const setVideoPlaybackRate = useCallback((rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, [videoRef]);
  
  const toggleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
          videoRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  }, [isFullscreen, videoRef]);
  
  const togglePictureInPicture = useCallback(() => {
    if (videoRef.current) {
      if (!isPictureInPicture) {
        if (videoRef.current.requestPictureInPicture) {
          videoRef.current.requestPictureInPicture();
        }
      } else {
        if (document.exitPictureInPicture) {
          document.exitPictureInPicture();
        }
      }
    }
  }, [isPictureInPicture, videoRef]);
  
  // Event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = updateTime;
    const handleLoadedMetadata = updateDuration;
    const handleVolumeChange = updateVolume;
    const handleProgress = updateBuffered;
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const handleEnterPictureInPicture = () => setIsPictureInPicture(true);
    const handleLeavePictureInPicture = () => setIsPictureInPicture(false);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('enterpictureinpicture', handleEnterPictureInPicture);
    video.addEventListener('leavepictureinpicture', handleLeavePictureInPicture);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('enterpictureinpicture', handleEnterPictureInPicture);
      video.removeEventListener('leavepictureinpicture', handleLeavePictureInPicture);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [videoRef, updateTime, updateDuration, updateVolume, updateBuffered]);
  
  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPictureInPicture,
    buffered,
    isLoading,
    play,
    pause,
    togglePlay,
    seek,
    setVolume: setVideoVolume,
    toggleMute,
    setPlaybackRate: setVideoPlaybackRate,
    toggleFullscreen,
    togglePictureInPicture
  };
}

// Componente per la timeline del video
function VideoTimeline({ 
  currentTime, 
  duration, 
  buffered, 
  onSeek, 
  videoRef 
}) {
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleMouseDown = (e) => {
    if (timelineRef.current) {
      setIsDragging(true);
      const rect = timelineRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      onSeek(newTime);
    }
  };
  
  const handleMouseMove = (e) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const time = percent * duration;
      setHoverTime(time);
    }
  };
  
  const handleMouseLeave = () => {
    setHoverTime(null);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div style={{ position: 'relative', margin: '10px 0' }}>
      <div
        ref={timelineRef}
        style={{
          height: '6px',
          backgroundColor: '#333',
          borderRadius: '3px',
          cursor: 'pointer',
          position: 'relative'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Buffered progress */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${buffered}%`,
            backgroundColor: '#666',
            borderRadius: '3px'
          }}
        />
        
        {/* Current progress */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: '#007bff',
            borderRadius: '3px'
          }}
        />
        
        {/* Progress handle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${progressPercent}%`,
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            cursor: 'grab'
          }}
        />
      </div>
      
      {/* Time display */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#ccc',
        marginTop: '5px'
      }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      {/* Hover time tooltip */}
      {hoverTime !== null && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: `${(hoverTime / duration) * 100}%`,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          pointerEvents: 'none',
          marginBottom: '5px'
        }}>
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
}

// Componente per i controlli del volume
function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }) {
  const volumeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = (e) => {
    if (volumeRef.current) {
      setIsDragging(true);
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = (e.clientY - rect.top) / rect.height;
      const newVolume = Math.max(0, Math.min(1, 1 - percent));
      onVolumeChange(newVolume);
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && volumeRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = (e.clientY - rect.top) / rect.height;
      const newVolume = Math.max(0, Math.min(1, 1 - percent));
      onVolumeChange(newVolume);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  const volumePercent = isMuted ? 0 : volume * 100;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={onToggleMute}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
      </button>
      
      <div
        ref={volumeRef}
        style={{
          width: '4px',
          height: '60px',
          backgroundColor: '#333',
          borderRadius: '2px',
          cursor: 'pointer',
          position: 'relative'
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${volumePercent}%`,
            backgroundColor: '#007bff',
            borderRadius: '2px'
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            bottom: `${volumePercent}%`,
            left: '50%',
            transform: 'translate(-50%, 50%)',
            width: '8px',
            height: '8px',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            cursor: 'grab'
          }}
        />
      </div>
    </div>
  );
}

// Componente principale del player
function CustomVideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  
  const player = useVideoPlayer(videoRef);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          player.togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          player.seek(Math.max(0, player.currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          player.seek(Math.min(player.duration, player.currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          player.setVolume(Math.min(1, player.volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          player.setVolume(Math.max(0, player.volume - 0.1));
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          player.toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          player.toggleFullscreen();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          player.togglePictureInPicture();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [player]);
  
  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      if (player.isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  }, [controlsTimeout, player.isPlaying]);
  
  const handleMouseMove = () => {
    resetControlsTimeout();
  };
  
  const handleMouseLeave = () => {
    if (player.isPlaying) {
      setShowControls(false);
    }
  };
  
  const handlePlaybackRateChange = (rate) => {
    player.setPlaybackRate(rate);
  };
  
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '800px',
        margin: '0 auto'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
        onClick={player.togglePlay}
      />
      
      {/* Loading indicator */}
      {player.isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: '18px'
        }}>
          ⏳ Caricamento...
        </div>
      )}
      
      {/* Controls overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          padding: '20px',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        {/* Timeline */}
        <VideoTimeline
          currentTime={player.currentTime}
          duration={player.duration}
          buffered={player.buffered}
          onSeek={player.seek}
          videoRef={videoRef}
        />
        
        {/* Control buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Play/Pause */}
            <button
              onClick={player.togglePlay}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '24px'
              }}
            >
              {player.isPlaying ? '⏸️' : '▶️'}
            </button>
            
            {/* Volume */}
            <VolumeControl
              volume={player.volume}
              isMuted={player.isMuted}
              onVolumeChange={player.setVolume}
              onToggleMute={player.toggleMute}
            />
            
            {/* Time display */}
            <span style={{ color: '#fff', fontSize: '14px' }}>
              {Math.floor(player.currentTime / 60)}:{(player.currentTime % 60).toFixed(0).padStart(2, '0')} / 
              {Math.floor(player.duration / 60)}:{(player.duration % 60).toFixed(0).padStart(2, '0')}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Playback rate */}
            <select
              value={player.playbackRate}
              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px'
              }}
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
            
            {/* Picture in Picture */}
            <button
              onClick={player.togglePictureInPicture}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              title="Picture in Picture"
            >
              📺
            </button>
            
            {/* Fullscreen */}
            <button
              onClick={player.toggleFullscreen}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              title="Schermo intero"
            >
              {player.isFullscreen ? '⤓' : '⤢'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Title overlay */}
      {title && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          {title}
        </div>
      )}
    </div>
  );
}

// Componente demo principale
function VideoPlayerDemo() {
  const [currentVideo, setCurrentVideo] = useState(0);
  
  const videos = [
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      title: 'Big Buck Bunny'
    },
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      title: 'Elephants Dream'
    },
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      title: 'For Bigger Blazes'
    }
  ];
  
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        🎬 Player Video Personalizzato
      </h2>
      
      {/* Video selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideo(index)}
            style={{
              padding: '8px 16px',
              backgroundColor: currentVideo === index ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {video.title}
          </button>
        ))}
      </div>
      
      {/* Video player */}
      <CustomVideoPlayer
        src={videos[currentVideo].src}
        poster={videos[currentVideo].poster}
        title={videos[currentVideo].title}
      />
      
      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
          ⌨️ Controlli da Tastiera
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div><strong>Spazio</strong> - Play/Pause</div>
          <div><strong>← →</strong> - Indietro/Avanti 10s</div>
          <div><strong>↑ ↓</strong> - Volume +/-</div>
          <div><strong>M</strong> - Muto</div>
          <div><strong>F</strong> - Schermo intero</div>
          <div><strong>P</strong> - Picture in Picture</div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerDemo;

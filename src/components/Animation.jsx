import { useContext, useRef, useEffect, useState } from 'react';
import { MyContext } from '../App';
import video from '../assets/Yapix.mp4';

function Animation() {
    const { isPlaying, current, showResults } = useContext(MyContext);
    const videoRef = useRef(null);
    const [showAnimation, setShowAnimation] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    useEffect(() => {
        if (current) {
            setShowAnimation(true); // Show the animation when a new song is selected
        }
    }, [current]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying && isVideoLoaded) {
                videoRef.current.play().catch(error => {
                    console.log('Error trying to play video:', error);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, current, isVideoLoaded]);

    const handleVideoReady = () => {
        setIsVideoLoaded(true);
        if (isPlaying && videoRef.current) {
            videoRef.current.play();
        }
    };

    const videoStyle = showResults ? { filter: 'blur(100px)' } : {};

    return (
        showAnimation && (
            <div className='animate-fade-down mx-auto p-10'>
                {!isVideoLoaded && (
                    <div className="loading-spinner">Loading...</div>
                )}
                <video
                    className='rounded-md'
                    ref={videoRef}
                    src={video}
                    type="video/mp4"
                    loop
                    style={videoStyle}
                    onLoadedData={handleVideoReady}
                    preload="auto" // Ensures video preloads
                />
            </div>
        )
    );
}

export default Animation;

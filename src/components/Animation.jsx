import { useContext, useRef, useEffect, useState } from 'react';
import { MyContext } from '../App';
import video from '../assets/RPReplay_Final1722438518 2.mp4';

function Animation() {
    const { isPlaying, current, showResults } = useContext(MyContext);
    const videoRef = useRef(null);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (current) {
            setShowAnimation(true); // Show the animation when a new song is selected
        }
    }, [current]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(error => {
                    console.log('Error trying to play video:', error);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, current]);

    // Handle video readiness
    const handleVideoReady = () => {
        if (isPlaying && videoRef.current) {
            videoRef.current.play();
        }
    };

    // Conditional style for blur effect
    const videoStyle = showResults ? { filter: 'blur(100px)' } : {};

    return (
        showAnimation && (
            <div className='animate-fade-down mx-auto p-10'>
                <video
                    ref={videoRef}
                    src={video}
                    type="video/mp4"
                    loop
                    style={videoStyle}
                    onLoadedData={handleVideoReady} // Ensure video is ready to play
                />
            </div>
        )
    );
}

export default Animation;



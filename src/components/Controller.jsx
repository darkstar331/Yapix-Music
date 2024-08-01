import { useContext, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { MyContext } from '../App';

function Controller() {
    const { current, liked, setLiked, setCurrent, isPlaying, setIsPlaying, played, setPlayed, duration, setDuration } = useContext(MyContext);
    const playerRef = useRef(null);

    useEffect(() => {
        if (current) {
            setPlayed(0); // Reset the seek bar
            setIsPlaying(true); // Start playback when the current song changes
        }
    }, [current, setPlayed, setIsPlaying]);

    const isLiked = liked.some(song => song.videoId === current?.videoId);

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleNext = () => {
        if (liked.length === 0) return;
        const currentIndex = liked.findIndex(song => song.videoId === current.videoId);
        const nextIndex = (currentIndex + 1) % liked.length;
        setCurrent(liked[nextIndex]);
    };

    const skipPrevious = () => {
        if (liked.length === 0) return;
        const currentIndex = liked.findIndex(song => song.videoId === current.videoId);
        const previousIndex = (currentIndex - 1 + liked.length) % liked.length;
        setCurrent(liked[previousIndex]);
    };

    const toggleLike = () => {
        if (isLiked) {
            setLiked(liked.filter(song => song.videoId !== current.videoId));
        } else {
            setLiked([...liked, current]);
        }
    };

    const handleSeekChange = (e) => {
        const newPlayed = parseFloat(e.target.value);
        setPlayed(newPlayed);
        if (playerRef.current) {
            playerRef.current.seekTo(newPlayed);
        }
    };

    const handleProgress = (state) => {
        if (isPlaying) {
            setPlayed(state.played);
        }
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="container absolute bottom-8 ">
            {current && (
                <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/watch?v=${current.videoId}`}
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={handleNext} // Auto-play next song when current song ends
                    style={{ display: 'none' }} // Hide the player UI
                    key={current.videoId} // Ensure reinitialization on song change
                />
            )}

            {current && (
                <div className='flex h-24 mx-auto justify-between items-center w-full gap-4'>
                    <div className="song-details flex items-center w-[30%] overflow-y-hidden gap-3">
                        <img src={current.thumbnail} alt="Song Thumbnail" className="w-24" />
                        <span className="songinfo text-md h-24 w-44 text-wrap text-colordarkg">{current.title}</span>
                        <button onClick={toggleLike} className="like-button ml-3">
                            {isLiked ? <FavoriteIcon className='text-white' /> : <FavoriteBorderIcon className='text-white' />}
                        </button>
                    </div>
                    <div className="controls w-[40%] flex justify-center gap-3">
                        <button className='text-white' onClick={skipPrevious}>
                            <SkipPreviousIcon style={{ fontSize: '40px' }} />
                        </button>
                        <button className='text-white' onClick={togglePlayPause}>
                            {isPlaying ? <PauseIcon style={{ fontSize: '40px' }} /> : <PlayArrowIcon style={{ fontSize: '40px' }} />}
                        </button>
                        <button className='text-white' onClick={handleNext}>
                            <SkipNextIcon style={{ fontSize: '40px' }} />
                        </button>
                    </div>
                    <div className="seekbar flex flex-col w-[30%] items-center p-2 mr-5"> {/* Increased width here */}
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step="any"
                            value={played}
                            onChange={handleSeekChange}
                            className="seekbar-range w-full" // Ensure the seekbar takes full width
                        />
                        <div className="time text-white text-sm mt-1">
                            {formatTime(played * duration)} | {formatTime(duration)}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Controller;


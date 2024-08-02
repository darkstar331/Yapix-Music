import { useContext, useState } from 'react';
import { MyContext } from '../App';
// import YouTubeAudioPlayer from './YouTubeAudioPlayer'; // Import the player component
import searchIcon from '../assets/Music search.svg';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function NavBar() {
    const { user, songs, setSongs, setCurrent, setIsPlaying, showResults, setShowResults } = useContext(MyContext);
    const [query, setQuery] = useState('');



    const handleSearch = async (event) => {
        if (event.key === 'Enter' && query.trim()) {
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${API_KEY}`);
                const data = await response.json();
                // console.log(data)
                const songsList = data.items.map(item => ({
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.default.url,
                    liked: false,
                }));

                setSongs(songsList);
                setShowResults(true);
                setQuery(''); // Clear the input field
            } catch (error) {
                console.error('Error fetching YouTube data:', error);
            }
        }
    };

    const handleClick = (song) => {

        setShowResults(false);
        setQuery('');
        setCurrent(song);
        setIsPlaying(true)
        // Set the current song in the context
    };

    return (
        <div className="flex justify-between items-center p-3">
            <div className="user flex items-center gap-2">
                <img src={user.image} alt={`${user.username}'s profile`} className="w-9 h-9 rounded-full" />
                <div className="username text-lg font-bold text-white">{user.username}</div>
            </div>

            <div className="search  flex items-center rounded-sm border border-colordarkg flex-grow max-w-[500px]">
                <img className="p-2" src={searchIcon} alt="Search icon" />
                <input
                    type="text"
                    placeholder="Enter song name here"
                    className="flex-grow font-bold p-2 outline-none bg-transparent text-colordarkg "
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            {/* Displaying songs */}
            {showResults && (
                <div className="search-results bg-transparent p-3 w-[31rem] max-h-60 absolute right-9 top-20 z-50 fade-down">
                    <ul className="border-colordarkg border-2 border-double">
                        {songs.map((item) => (
                            <li
                                key={item.videoId}
                                className="flex border-b-2 border-colordarkg text-colordarkg items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                onClick={() => handleClick(item)} // Handle click on the item
                            >
                                <img src={item.thumbnail} alt={item.title} className="w-12 h-12" />
                                <div className="flex-1">
                                    <p className="text-sm text-justify font-medium">{item.title}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default NavBar;

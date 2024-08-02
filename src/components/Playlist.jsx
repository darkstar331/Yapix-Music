import { useContext, useEffect } from 'react';
import { MyContext } from '../App';
import { auth, db } from '../firebase';
import { signOut } from "firebase/auth";
import line from '../assets/Music Line.svg';
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from "firebase/firestore";

function Playlist() {
    const { setUser, setShowResults, setIsLoggedIn, liked, setCurrent, user, setLiked } = useContext(MyContext);

    // Fetch liked songs from Firestore when the component mounts or when the user changes
    useEffect(() => {
        const fetchLikedSongs = async () => {
            if (user && user.email) {
                try {
                    const docRef = doc(db, "users", user.email);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setLiked(docSnap.data().likedSongs || []);
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching liked songs:", error);
                }
            }
        };

        fetchLikedSongs();
    }, [user, setLiked]);

    const handleLogout = async () => {
        try {
            if (!user.email) {
                throw new Error('User email is undefined or null');
            }

            // Store updated user data in Firestore
            await setDoc(doc(db, "users", user.email), {
                username: user.username,
                email: user.email,
                image: user.image,
                likedSongs: liked
            }, { merge: true });

            await signOut(auth);

            // Update state
            setIsLoggedIn(false);
            setUser({ username: '', email: '', image: '' });
            setLiked([]);
            setCurrent(null);

            toast.success('Logged out successfully and data saved!');
        } catch (error) {
            console.error('Error during logout or saving data:', error);
            toast.error('Failed to logout or save data. Please try again.');
        }
    };

    const handleClick = (song) => {
        console.log('Song clicked:', song);
        setCurrent(song);
        setShowResults(false)
    };

    return (
        <div className="h-screen flex flex-col bg-slate-950 relative">
            <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))] z-0"></div>
            <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))] z-0"></div>
            <div className="header p-6 text-center z-10">
                <h1 className="text-3xl text-gold">Yapix</h1>
                <img className='mt-5' src={line} alt="" />
                <p className="text-lg p-2 text-white">My Playlist</p>
                <img src={line} alt="" />
            </div>

            <div className="main flex flex-col gap-3 mt-3 flex-1 mx-auto overflow-y-auto border-colordarkg border-2 border-double w-[90%] z-10">
                <ul className="song mx-auto z-10">
                    {liked.length > 0 ? (
                        liked.map((item) => (
                            <li
                                key={item.videoId}
                                className="songinfo flex animate-fade-left justify-between gap-4 p-2 h-24 text-wrap border-colordarkg border-b-2 hover:bg-yellow-700 cursor-pointer z-10"
                                onClick={() => handleClick(item)}
                            >
                                <img className='w-20' src={item.thumbnail} />
                                <span className='text-colordarkg hover:text-white text-wrap overflow-y-hidden text-md'>{item.title}</span>
                            </li>
                        ))
                    ) : (
                        <div className="text-center text-white p-4">No songs in your playlist.</div>
                    )}
                </ul>
            </div>

            <div className="footer p-4 text-center z-10">
                <button onClick={handleLogout} className="text-white  hover:underline p-3 rounded-lg bg-red-900">
                    Lot Out
                </button>
            </div>
        </div>
    );
}

export default Playlist;

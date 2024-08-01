import { useState, useEffect, createContext } from 'react';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase'; // Ensure you have the correct path

export const MyContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    image: ''
  });
  const [liked, setLiked] = useState([]);
  const [songs, setSongs] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here you can check if a user is already logged in (session persists)
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set the state accordingly
        setUser({
          username: user.displayName,
          email: user.email,
          image: user.photoURL,
          likedSongs: [] // Or fetch likedSongs from Firestore if needed
        });
        setIsLoggedIn(true);
      } else {
        // User is not signed in
        setIsLoggedIn(false);
      }
      setLoading(false); // Stop loading once the auth state is checked
    });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>; // Add your own loading indicator
  }

  return (
    <div className='bg-black'>
      <MyContext.Provider value={{
        isLoggedIn, setIsLoggedIn, user, setUser, liked, setLiked,
        songs, setSongs, current, setCurrent, isPlaying, setIsPlaying,
        played, setPlayed, duration, setDuration, showResults, setShowResults
      }}>
        {isLoggedIn ? (
          <Home />
        ) : (
          <Login />
        )}
        <ToastContainer
          position="top-right"
          autoClose={500}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
        />
      </MyContext.Provider>
    </div>
  );
}

export default App;

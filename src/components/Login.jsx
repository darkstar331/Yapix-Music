import { useContext, useEffect } from 'react';
import { FiArrowRight } from "react-icons/fi";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { MyContext } from '../App';
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from '../firebase'; // Ensure the correct path to your firebase.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

function Login() {
    const { setUser, setLiked } = useContext(MyContext);
    const color = useMotionValue(COLORS_TOP[0]);

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });

        generateStars();
    }, [color]);

    const generateStars = () => {
        const starsContainer = document.getElementById('stars-container');
        starsContainer.innerHTML = ''; // Clear previous stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;
            starsContainer.appendChild(star);
        }
    };

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 0px 10px 0px ${color}`;

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, "users", user.email);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // If user exists, get the data and set it to state
                const userData = userDoc.data();
                setUser({
                    username: userData.username,
                    email: userData.email,
                    image: userData.image,
                    likedSongs: userData.likedSongs || [] // Initialize likedSongs if undefined
                });
                setLiked(userData.likedSongs || []);
            } else {
                // If user does not exist, create a new document
                await setDoc(userDocRef, {
                    username: user.displayName,
                    email: user.email,
                    image: user.photoURL,
                    likedSongs: []
                });
                setUser({
                    username: user.displayName,
                    email: user.email,
                    image: user.photoURL,
                    likedSongs: []
                });
                setLiked([]);
            }


            toast.success('Logged in successfully!');
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('Failed to login. Please try again.');
        }
    };

    return (
        <motion.section
            style={{ backgroundImage }}
            className="place-content-center overflow-hidden bg-gray-950 w-[100%] h-[100vh] text-gray-200 relative"
        >
            <div id="stars-container" className="stars"></div>
            <div className="relative z-10 flex flex-col items-center mt-8">
                <h1 className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
                    Welcome To Yapix
                </h1>
                <div className="info flex flex-col md:flex-row justify-center gap-8 mt-6">
                    <div className="Userregister flex flex-col items-center">
                        <h2 className="text-2xl mb-4">Login With</h2>
                        <div className="accounts flex flex-col space-y-3">
                            <motion.button
                                style={{ border, boxShadow }}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
                                onClick={handleGoogleLogin}
                            >
                                <span>Google</span>
                                <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

export default Login;


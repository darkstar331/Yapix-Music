import Playlist from "./Playlist";
import NavBar from "./NavBar";
import Controller from "./Controller";
import Animation from "./Animation";

function Home() {
    // const { current } = useContext(MyContext);

    return (
        <div className="flex gap-1">
            <div className="playlist hidden md:block md:w-[25vw] bg-color1">
                <Playlist />
            </div>

            <div className="navbar w-[75vw] relative overflow-hidden">
                <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>

                <div className="header p-6 text-center">
                    <NavBar />
                    <Animation />
                    <Controller />
                </div>
            </div>
        </div>
    );
}

export default Home;

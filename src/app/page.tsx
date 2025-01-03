'use client';

// import Chess from "@/components/Chess";
import LandingDisplay from "@/components/LandingDisplay";
import LoadingScreen from "@/components/Loading";
import Profile from "@/components/Profile";
import BookReader from "@/components/audiobookReader";
import Chatbots from "@/components/chatbots";
import Images from "@/components/images";
import { getGuest } from "@/functionality/supabase";
import { Guest } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRef, useEffect, useState } from "react";

export default function Main() {
  const [guest, setGuest] = useState<Guest>({
    'email': '',
    'id': 1,
    'medicine': '',
    'law': '',
    'misc': '',
    'name': '',
    'psych': '',
    'user_id': '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  // Refs for each section
  const homeRef = useRef(null);
  const chatbotsRef = useRef(null);
  const traderRef = useRef(null);
  const audiobookRef = useRef(null);
  const imagesRef = useRef(null);
  const profileRef = useRef(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
      async function getInfo() {
          const {data: {user}} = await supabase.auth.getUser()
          if (user) {
            try {
              const res = await getGuest(user.id);
              if (res) {
                setGuest(res);
      
              }
            } catch (error) {
              console.error("Error fetching user:", error);
            } 
          } 
          setLoading(false);
      }

      getInfo();
  }, [supabase])

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="h-screen w-screen relative">
      {/* Home Section */}
      <section
        ref={homeRef}
        id="home"
        className="h-screen w-screen bg-black flex justify-center items-center"
      >
        <LandingDisplay />
      </section>

      {/* ChatBots Section */}
      <section
        ref={chatbotsRef}
        id="Chatbots"
        className="relative h-screen w-screen bg-gradient-to-b from-black to-blue-600 flex justify-center items-center"
      >
        <Chatbots guest={guest} setGuest={setGuest} />
        <span className="absolute bottom-0 pb-8 text-xs text-center text-gray-400">
          * For general informational purposes only. This is for fun and should not be used as guidance. Consult an appropriate professional for reliable advice. *
        </span>
      </section>

      {/* Trading AI Section */}
      <section
        ref={traderRef}
        id="trader"
        aria-labelledby="trader-title"
        className="h-screen w-screen bg-gradient-to-b from-blue-600 to-yellow-200 flex justify-center items-center"
      >
        <h2 id="trader-title" className="text-white text-4xl font-bold">
          Trading AI Coming Soon
        </h2>
        {/* <Test/> */}
      </section>

      {/* Images Section */}
      <section
        ref={imagesRef}
        id="images"
        aria-labelledby="images-title"
        className="h-screen w-screen bg-gradient-to-b from-yellow-200 to-orange-300 flex justify-center items-center"
      >
        <Images/>
      </section>

      {/* Audiobook Section */}
      <section
        ref={audiobookRef}
        id="audiobook"
        aria-labelledby="audiobook-title"
        className=" h-screen w-screen bg-gradient-to-b from-orange-300 to-red-400 flex justify-center items-center"
      >
        {/* will uncomment when I get the js library to work with my ts types for it */}
        <BookReader/>
      </section>

      {/* Contact Me Section */}
      <section
        ref={profileRef}
        id="profile"
        className="h-screen w-screen bg-gradient-to-b from-red-400 to-purple-500 flex justify-center items-center"
      >
        <Profile />
      </section>
    </main>
  );
}

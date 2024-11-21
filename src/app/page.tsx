'use client';

import LandingDisplay from "@/components/LandingDisplay";
import LoadingScreen from "@/components/Loading";
import Profile from "@/components/Profile";
import Chatbots from "@/components/chatbots";
import { getGuest } from "@/functionality/supabase";
import { Guest } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
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
  const imageGenRef = useRef(null);
  const chessRef = useRef(null);
  const imagesRef = useRef(null);
  const realtimeRef = useRef(null);
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
        className="h-screen w-screen bg-gradient-to-b from-blue-500 to-blue-400 flex justify-center items-center"
      >
        <LandingDisplay/>
      </section>

      {/* ChatBots Section */}
      <section
        ref={chatbotsRef}
        id="Chatbots"
        className=" relative h-screen w-screen bg-gradient-to-b from-blue-400 to-green-400 flex justify-center items-center"
      >
        <Chatbots guest={guest} setGuest={setGuest}/>
        <span className="absolute bottom-0 pb-8 text-xs text-center text-gray-500">
          * For general informational purposes only. This is for fun and should not be used as guidance. Consult an appropriate professional for reliable advice. *
        </span>
      </section>

      {/* Trading AI Section */}
      <section
        ref={traderRef}
        id="trader"
        aria-labelledby="trader-title"
        className="h-screen w-screen bg-gradient-to-b from-green-400 to-yellow-400 flex justify-center items-center"
      >
        <h2 id="trader-title" className="text-white text-4xl font-bold">
          Trading AI
        </h2>
      </section>

      {/* Image Generator Section */}
      <section
        ref={imageGenRef}
        id="imageGen"
        aria-labelledby="imageGen-title"
        className="h-screen w-screen bg-gradient-to-b from-yellow-400 to-orange-400 flex justify-center items-center"
      >
        <h2 id="imageGen-title" className="text-white text-4xl font-bold">
          Image Generator
        </h2>
      </section>

      {/* Chess Section */}
      <section
        ref={chessRef}
        id="chess"
        aria-labelledby="chess-title"
        className="h-screen w-screen bg-gradient-to-b from-orange-400 to-red-400 flex justify-center items-center"
      >
        <h2 id="chess-title" className="text-white text-4xl font-bold">
          Chess
        </h2>
      </section>

      {/* Images Section */}
      <section
        ref={imagesRef}
        id="images"
        aria-labelledby="images-title"
        className="h-screen w-screen bg-gradient-to-b from-red-400 to-purple-400 flex justify-center items-center"
      >
        <h2 id="images-title" className="text-white text-4xl font-bold">
          Images
        </h2>
      </section>

      {/* Contact Me Section */}
      <section
        ref={realtimeRef}
        id="realtime"
        className="h-screen w-screen bg-gradient-to-b from-purple-400 to-indigo-400 flex justify-center items-center"
      >
        <Profile/>
      </section>
    </main>
  );
}

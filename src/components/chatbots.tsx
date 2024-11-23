'use client';

import { useEffect, useState } from "react";
import LoadingScreen from "./Loading";
import { Assistants, Guest } from "@/lib/types";
import Chat from "./regularChat";
import axios from "axios";
import { getAssistants } from "@/functionality/assistants";
import { addThreads } from "@/functionality/supabase";

interface ChatbotsProps {
  guest: Guest;
  setGuest: React.Dispatch<React.SetStateAction<Guest>>;
}

export default function Chatbots({ guest, setGuest }: ChatbotsProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const assistants: Assistants = getAssistants();


    useEffect(() => {
      const handleBeforeUnload = () => {
        const payload = JSON.stringify({
          law: guest.law,
          medicine: guest.medicine,
          psych: guest.psych,
          misc: guest.misc,
        });
        navigator.sendBeacon("/api/delete-threads", payload);
      };
    
      const checkGuestStatus = async () => {
        if (!guest.law || !guest.medicine || !guest.psych || !guest.misc) {
          try {
            const response = await axios.get("/api/openai/make-threads");
            const updatedGuest: Guest = {
              ...guest,
              medicine: response.data.threads[0],
              law: response.data.threads[1],
              misc: response.data.threads[2],
              psych: response.data.threads[3],
            };
    
            setGuest(updatedGuest);
    
            if (guest.user_id) {
              addThreads(updatedGuest);
            }
          } catch (error) {
            console.error("Error creating threads:", error);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false); 
        }
      };
    
      checkGuestStatus();
      window.addEventListener("beforeunload", handleBeforeUnload);
    
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, []);
    

    const tabs = [
        { id: 0, label: "Lawyer", content: <Chat assistantId={assistants.law} threadId={guest.law}/> },
        { id: 1, label: "Psychologist", content: <Chat assistantId={assistants.psych} threadId={guest.psych}/> },
        { id: 2, label: "Doctor", content: <Chat assistantId={assistants.medicine} threadId={guest.medicine}/> },
        { id: 3, label: "Misc", content: <Chat assistantId={assistants.misc} threadId={guest.misc}/> }
    ];
  
    if (loading) {
      return <LoadingScreen />;
    }

    return (
    <div className="flex flex-col w-full h-full p-[10%] rounded-xl shadow-lg shadow-black">
      <div className="flex justify-start space-x-8 pt-2 pl-16">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl bg-black ${
              activeTab === index ? "text-blue-300 border-b-2 border-blue-300" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex flex-grow w-full h-full bg-white rounded-xl">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Login from "./login";
import { Button } from "./ui/button";
import axios from "axios";
import { Weather, NewsArticle} from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from 'next/image';
import { useRouter } from "next/navigation";


type ScrollingTextProps = {
  weather: Weather | null; // Weather data or null
  news: NewsArticle[] | null; // Array of news articles or null
};

const kelvinToFahrenheit = (kelvin: number) => {
  return ((kelvin - 273.15) * 9) / 5 + 32;
};

const ScrollingText = ({ weather, news }: ScrollingTextProps) => {
  return (
    <div className="relative overflow-hidden flex-grow h-6  flex items-center justify-center">
      { weather && news &&
      <div className="absolute whitespace-nowrap h-fit flex flex-row space-x-4 animate-scroll-text">
        <span className="flex items-center text-xl text-black">
          <Image
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt='Weather icon'
            width={48} 
            height={48}
            className="mr-2"
          />
            Weather Update: {weather.description}, {weather.temp}°F but feels like {weather.feels}°F
        </span>

        <div className="w-4"></div>
        { news.map((article: { url: string; headline: string | null; }, index: Key) => (
            <span key={index} className=" flex items-center">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 text-black items-center text-xl"
              >
                | {article.headline}
              </a>
            </span>
          ))}
      </div>}
    </div>
  );
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [news, setNews] = useState<NewsArticle[] | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
      async function getInfo() {
          const {data: {user}} = await supabase.auth.getUser()
          console.log(user);
          if (user) {
              setIsLoggedIn(true)
          }
      }

      getInfo();
  }, [supabase])

// get the weather
  useEffect(() => {
    const getWeather = async () => {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Geolocation not supported"));
        }
      });
    };
  
    const fetchWeather = async () => {
      try {
        const position: any = await getWeather();
        const { latitude, longitude } = position.coords;
  
        // Fetch weather data
        const weatherResponse = await axios.post("/api/open-weather", {
          lat: latitude,
          lon: longitude,
        });
        setWeather({
          temp: kelvinToFahrenheit(weatherResponse.data.temp).toFixed(0),
          feels: kelvinToFahrenheit(weatherResponse.data.feels).toFixed(0),
          description: weatherResponse.data.description,
          icon: weatherResponse.data.icon,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeather(null);
      }
    };
  
    fetchWeather();
  }, []); 

  // get the news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsResponse = await axios.get("/api/times");
        setNews(
          newsResponse.data.articles.map((article: any) => ({
            headline: article.title,
            url: article.url,
          }))
        );
      } catch (error) {
        console.error("Error fetching news data:", error);
        setNews(null);
      }
    };
  
    fetchNews();
  }, []); 
  
  const handleLogOut = async () => {
    await supabase.auth.signOut();  
    router.push('/');
    router.refresh();
}

  return (
    <nav className="bg-[#FFF8E7] text-black w-full shadow-md">
      <div className="flex items-center w-full p-4">
        {/* Left: Name linking to #profile */}
        <Link href="#profile" className="text-2xl  pl-2 pr-4 w-fit font-bold hover:text-blue-300">
          Jack Yurkanin
        </Link>

        {/* Center: Breaking Info */}
        <ScrollingText weather={weather} news={news} />

        {/* Hamburger Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-3xl w-fit items-center justify-center">
          ☰
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50 z-20 bg-black items-center justify-center border border-custom-green">
          <DropdownMenuItem asChild>
            <a href="/" className=" text-white hover:text-gray-400">Home</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#Chatbots" className=" text-white hover:text-blue-300">ChatBots</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#trader" className=" text-white hover:text-blue-300">Trading AI</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#images" className=" text-white hover:text-blue-300">Images</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#audiobook" className=" text-white hover:text-blue-300">Audiobook</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#profile" className=" text-white hover:text-blue-300">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white"/>
          {isLoggedIn ? (
            <>
              <DropdownMenuItem asChild>
              <a href="/home" className=" text-white hover:text-blue-300">Home</a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut} className=" text-white hover:text-blue-300">
                Logout
              </DropdownMenuItem>
            </>
            
          ) : (
            <DropdownMenuItem asChild>
              <Sheet>
                <SheetTrigger className="text-white text-sm ml-2 hover:text-gray-400">Login</SheetTrigger>
                <SheetContent className="bg-black">
                  <SheetHeader>
                    <SheetTitle>Welcome</SheetTitle>
                    <SheetDescription>
                      Sign in to your private page and start using the tools.
                    </SheetDescription>
                  </SheetHeader>
                  <Login />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Login from "./login";
import { Button } from "./ui/button";
import Logout from "./logout";
import axios from "axios";
import { Weather, NewsArticle} from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


type ScrollingTextProps = {
  weather: Weather | null; // Weather data or null
  news: NewsArticle[] | null; // Array of news articles or null
};

const kelvinToFahrenheit = (kelvin: number) => {
  return ((kelvin - 273.15) * 9) / 5 + 32;
};

const ScrollingText = ({ weather, news }: ScrollingTextProps) => {
  return (
    <div className="relative overflow-hidden flex-grow h-6 mx-4 flex items-center justify-center">
      { weather && news &&
      <div className="absolute whitespace-nowrap flex animate-scroll-text">
        <span className="pr-8 flex items-center text-xl text-blue-600">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="Icon description"
            className="w-6 h-6 mr-2"
          />
            Weather Update: {weather.description}, {weather.temp}°F but feels like {weather.feels}°F
        </span>

        { news.map((article: { url: string; headline: string | null; }, index: Key) => (
            <span key={index} className="pr-4">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-900 text-blue-600 text-xl"
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

  useEffect(() => {
      async function getInfo() {
          const {data: {user}} = await supabase.auth.getUser()
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
  

  return (
    <nav className="bg-[#FFF8E7] text-blue-600 w-full shadow-md">
      <div className="flex items-center w-full p-4">
        {/* Left: Name linking to #profile */}
        <Link href="#profile" className="text-2xl  pl-2 pr-4 w-fit font-bold hover:text-gray-300">
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
            <a href="/#Chatbots" className=" text-white hover:text-gray-400">ChatBots</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#trader" className=" text-white hover:text-gray-400">Trading AI</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#images" className=" text-white hover:text-gray-400">Images</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#audiobook" className=" text-white hover:text-gray-400">Chess</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/#profile" className=" text-white hover:text-gray-400">Contact Me</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white"/>
          {isLoggedIn ? (
            <div>
              <DropdownMenuItem asChild>
                <Logout />
              </DropdownMenuItem>
            </div>
            
          ) : (
            <DropdownMenuItem asChild>
              <Sheet>
                <SheetTrigger className="text-white text-sm ml-2 hover:text-gray-400">Login</SheetTrigger>
                <SheetContent className="bg-black">
                  <SheetHeader>
                    <SheetTitle>Welcome to Your Page</SheetTitle>
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

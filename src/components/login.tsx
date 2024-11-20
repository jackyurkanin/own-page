'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {  signUp } from "@/functionality/supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        signUp(data.user.id, email);
        toast.success("Check your email for verification instructions.");
        router.push("/home");
        
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="pt-16 rounded-lg shadow-md w-full h-full">
      <ToastContainer /> {/* This displays the toasts */}
      <div className="flex flex-col  space-y-4 py-4">
        <h1 className="text-3xl font-bold text-center">Welcome</h1>
        <div className="flex flex-col items-start space-y-2 pl-4">
          {/* Label */}
          <Label htmlFor="email" className="text-left">
            Email
          </Label>

          {/* Input */}
          <Input
            id="email"
            type="email"
            className="w-3/4 text-black placeholder-gray-500 focus:outline-none focus:border-gray-500"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-start space-y-2 pl-4">
          <Label htmlFor="password" className="text-left">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/4 text-black placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>
      


      <div className="flex flex-row items-center justify-center p-4 space-x-10">
        <Button
          variant="outline"
          onClick={handleSignup}
          className="w-full pr-4 text-white hover:bg-gray-700 focus:outline-none"
        >
          Sign Up
        </Button>
        <Button
          variant="outline"
          onClick={handleSignIn}
          className="w-full text-white hover:bg-gray-700 focus:outline-none"
        >
          Sign In
        </Button>
      </div>

      <ToastContainer/>
    </div>
  );
}

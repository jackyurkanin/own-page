"use server";

import { createClient } from "@supabase/supabase-js";
import {Guest} from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


export const getGuest = async (user_id: string): Promise<Guest|null> => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: Guest, error } = await supabase
    .from("Guest")
    .select("*")
    .eq("user_id", user_id)
    .single(); 
  
  if (error) {
    console.error("Error fetching Guest: ", error);
    return null; // Return an empty string if there's an error
  }
  return Guest as Guest;
}

export const updateGuest =async (guest: Guest) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const {data, error} = await supabase
    .from("Guest")
    .update(guest)
    .eq('user_id', guest.user_id)
    .select();

  if (error) {
    console.error("Error updating lawyer: ", error);
  }
    
    console.log("update successful");
}

export const newMessage = async (email: string, message: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('Messages')
    .insert({ 'msg': message, 'email': email,})
    .select();
          
  
  if (error) {
    console.error("Error updating message: ", error);
    return {status: 500, error: error}
  }
  
  console.log("update successful");
  return {status: 200, error: error}
}

export const signUp = async (id: string, email: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase 
    .from('Guest')
    .insert([
      { 'user_id': id, 'email': email},
    ])
    .select();
    
  if (error) {
    console.error("Error adding User: ", error);
    throw error
  }
  console.log("User addded successfully");
}

export const addThreads = async (guest: Guest) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("Guest")
    .insert([
      { 'law': guest.law, 'psych': guest.psych, 'medicine': guest.medicine, 'misc': guest.misc},
    ])
    .eq("user_id", guest.user_id)
    .select(); 
  
  if (error) {
    console.error("Error fetching Guest: ", error);
    return null; // Return an empty string if there's an error
  }
  console.log('Update of ids was successful')
}
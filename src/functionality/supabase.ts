"use server";

import { createClient } from "@supabase/supabase-js";
import {Guest} from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


export const getGuest = async (name: string): Promise<Guest|null> => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: Guest, error } = await supabase
    .from("Guest")
    .eq("name", name)
    .select("*")
    .single(); 
  
  if (error) {
    console.error("Error fetching Guest: ", error);
    return null; // Return an empty string if there's an error
  }
  return Guest as Guest;
}

export const updateLawyer =async (guest: Guest) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const {data, error} = await supabase
    .from("Guest")
    .update(guest)
    .eq('lawyerId', guest.guest_id)
    .select();

  if (error) {
    console.error("Error updating lawyer: ", error);
  }
    
    console.log("update successful");
}

export const newMessage = async (name: string, message: string, guest_id: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('Messages')
    .insert({ 'msg': message, 'guest_name': name, 'guest_id': guest_id})
    .select();
          
  
  if (error) {
    console.error("Error updating message: ", error);
    return false
  }
  
  console.log("update successful");
  return true
}

export const signUp = async (id: string, name: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase 
    .from('Guest')
    .insert([
      { 'id': id, 'name': name},
    ])
    .select()
    
  if (error) {
    console.error("Error adding User: ", error);
    throw error
  }
  console.log("User addded successfully");
}
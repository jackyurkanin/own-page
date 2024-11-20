"use server";

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        // Create a new thread using the OpenAI API
        const body = await req.json();
        const thread_id: string = body.thread_id;
        // console.log('thread: ', thread_id)
        const response = await openai.beta.threads.del(thread_id);
     // Return a 204 status to indicate successful deletion
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      console.error('Error deleting thread:', error.message || error);
  
      // Return a 500 status with an error message
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
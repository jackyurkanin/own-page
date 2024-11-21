"use server";

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { law, medicine, psych, misc } = await req.json();
        const thread_ids = [law, medicine, psych, misc].filter(Boolean);

      
        const responses = await Promise.all(
          thread_ids.map(thread_id => openai.beta.threads.del(thread_id))
        );
        console.log("Deleted threads:", responses);
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      console.error('Failed to delete one or more threads:', error.message || error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
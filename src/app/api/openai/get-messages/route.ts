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
        const response = await openai.beta.threads.messages.list(thread_id);
        const messages = response.data;
        // Return the conversation in the response
        return NextResponse.json({ messages }, { status: 200 });
    } catch (error: any) {
        console.error('Error calling getting messages:', error.message || error);

        // Return a 500 status with an error message
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

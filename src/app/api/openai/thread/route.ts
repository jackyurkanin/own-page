"use server";

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!, // Using non-null assertion to ensure the API key is not null or undefined
});

export async function POST() {
    try {
        // Create a new thread using the OpenAI API
        const thread = await openai.beta.threads.create();
        const thread_id = thread.id;
        // console.log('thread: ', thread)


        // Return the thread ID in the response
        return NextResponse.json({ thread_id }, { status: 200 });
    } catch (error: any) {
        console.error('Error calling OpenAI API:', error.message || error);

        // Return a 500 status with an error message
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

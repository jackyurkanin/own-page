"use server";

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!, 
});

export async function GET() {
    try {
        // Create a new thread using the OpenAI API
        const threads = [];

        for (let i = 0; i < 4; i++) {
        try {
            const thread = await openai.beta.threads.create();
            threads.push(thread.id);
        } catch (error) {
            console.error(`Failed to create thread ${i + 1}:`, error);
        }
        }

        console.log("All threads created:", threads);

        // Return the thread ID in the response
        return NextResponse.json({ threads }, { status: 200 });
    } catch (error: any) {
        console.error('Error calling OpenAI API:', error.message || error);

        // Return a 500 status with an error message
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

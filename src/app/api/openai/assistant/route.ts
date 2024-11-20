"use server";

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!, 
});

export async function POST(req: Request) {
    try {
        const myAssistant = await openai.beta.assistants.retrieve("asst_MeeUThGPRxBLqkUO2OtbbcGN");

        return NextResponse.json({ myAssistant }, { status: 200 });
    } catch (error: any) {
        console.error('Error calling OpenAI API:', error);

        // Provide more detailed error information if available
        const errorMessage = error?.message || 'Internal Server Error';
        return new NextResponse(errorMessage, { status: 500 });
    }
}

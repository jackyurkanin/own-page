"use server";

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!, // Non-null assertion
});

type Data = {
    response?: string;
    error?: string;
};

export async function POST(req: Request) {
    const body = await req.json();
    const messages: string = body.message;
    const thread_id: string = body.id;
    const assistant_id: string = body.assistant;

    console.log('thread:', thread_id);
    console.log('assistant:', assistant_id);
    console.log('message:', messages);

    if (!messages || !thread_id || !assistant_id) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        // Send user message to the thread
        await openai.beta.threads.messages.create(thread_id, {
            role: "user",
            content: messages,
        });

        // Create and poll the run
        const run = await openai.beta.threads.runs.createAndPoll(thread_id, {
            assistant_id,
        });

        console.log('Passed run', run)


        if (run.status === 'completed') {
            // Retrieve the latest messages in the thread
            const fetchedMessages = await openai.beta.threads.messages.list(run.thread_id);

            // const conversation = fetchedMessages.data.map(msg => `${msg.role}: ${msg.content[0].text.value}`).join('\n');
            // console.log('Full Conversation History:', conversation);

            // Extract the assistant's latest response
            const latestMessage = fetchedMessages.data.find(msg => msg.role === 'assistant');

            if (latestMessage) {
                const firstContentBlock = latestMessage.content[0];
            
                if ("text" in firstContentBlock && firstContentBlock.text) {
                    const assistantResponse = firstContentBlock.text.value;
                    return NextResponse.json({ response: assistantResponse }, { status: 200 });
                }
            } else {
                console.error('No assistant response found');
                return NextResponse.json({ error: 'No assistant response found' }, { status: 500 });
            }
        } else {
            console.log(`Run status: ${run.status}`);
            return NextResponse.json({ error: `Run status: ${run.status}` }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error calling OpenAI API:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

"use server";

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

const key = process.env.HF_API_KEY;

export async function POST(req: Request) {
    const body = await req.json();
    const prompt: string = body.prompt;

    if (!prompt) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const input = {"inputs": prompt};

        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(input),
            }
        );

        // Handle non-200 responses from the HF API
        if (!response.ok) {
            console.error(`HF API returned status ${response.status}`);
            const errorDetails = await response.text();
            return new NextResponse(errorDetails, { status: response.status });
        }

        const result = await response.blob();
        // Save to a temporary file
        const buffer = Buffer.from(await result.arrayBuffer());
        const name = `output_${Date.now()}.png`;
        const tempFilePath = path.join(process.cwd(), 'public','temp', `${name}`);
        console.log('made file at: ', tempFilePath);
        await writeFile(tempFilePath, buffer);

        const temp_path = `/temp/${name}`;
        // Return the temporary file path
        return NextResponse.json({ temp_path: temp_path }, { status: 200 });
    } catch (error: any) {
        console.error('Error calling HF API:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

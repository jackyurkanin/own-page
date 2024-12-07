"use server";

import { NextResponse } from 'next/server';

const key = process.env.PICSART_API_KEY!;

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    if (file.size === 0) {
        return NextResponse.json({ error: 'File blank' }, { status: 400 });
    }

    try {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'JPG'; // Default to JPG if no extension

        // Ensure only valid extensions are used
        const validFormats = ['JPG', 'PNG', 'WEBP'];
        const format = validFormats.includes(fileExtension) ? fileExtension : 'JPG';

        const form = new FormData();
        form.append('upscale_factor', '2');
        form.append('format', format);
        form.append('image', file);

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'X-Picsart-API-Key': key,
            },
            body: form
        };

        const response = await fetch('https://api.picsart.io/tools/1.0/upscale/enhance', options)
        const data = await response.json(); 
        const imageUrl = data.data.url;

        return NextResponse.json({ imgUrl: imageUrl }, { status:  200});
    } catch (error) {
      console.error('Error handling file upload:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
}
"use server";

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const formData = await req.formData();

  const thread_id = formData.get("thread_id") as string;
  const assistant_id = formData.get("assistant_id") as string;
  const file = formData.get("file");

  if (!thread_id || !assistant_id || !file) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }


  
  // Save the file temporarily to disk
  const tempDir = path.resolve('temp-uploads'); // Use path.resolve to create a consistent path

  // Create the directory if it doesn't exist
  await fsPromises.mkdir(tempDir, { recursive: true });
  console.log('Directory created at:', tempDir);
  
  
  if (file instanceof File) {
    const fileName = file.name;

    // Set the path for the temporary file with the original file extension
    const tempFilePath = path.join(tempDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fsPromises.writeFile(tempFilePath, buffer);
    
    
    try {
      // Upload the file to OpenAI
      const fileUploadResponse = await openai.files.create({
        file: fs.createReadStream(tempFilePath),
        purpose: 'assistants',
      });
  
      console.log('fileUploadResponse', fileUploadResponse);

      // Clean up the temporary file
      await fsPromises.unlink(tempFilePath);

  
      // Send a message to the thread to indicate the file has been uploaded and to use the file search tool
      const respon = await openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: "Use this file as a resource for responding to the user and performing given tasks!",
        attachments: [
          {
            file_id: fileUploadResponse.id,
            tools: [{ type: 'file_search' }],
          },
        ],
      });
  
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Error handling file upload:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  } else {
    console.error('The file is not of type `File`');
  }
}

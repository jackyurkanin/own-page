"use server";

import fs from "fs";
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const temp_path: string = body.path;
    console.log('deleteing path: ', temp_path);
    if (!temp_path) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

        const absolutePath = path.join(process.cwd(), "public", temp_path);    try {
        fs.unlink(absolutePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
            return NextResponse.json({ error: `Error deleting this file: ${temp_path}` }, { status: 400 });
        }
        });
       

        return NextResponse.json('Successfully deleted', { status: 200 });
    } catch (error: any) {
        console.error('Error Deleting:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

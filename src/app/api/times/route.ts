"use server";

import { NextResponse } from 'next/server';

const path: string = `https://api.nytimes.com/svc/news/v3/content/nyt/all.json?api-key=${process.env.NYT_API_KEY}`;

export async function GET() {
    try {
        // Make the GET request to the NYT API
        const response = await fetch(path, {
            method: "GET",
        });

        // Handle non-200 responses from the NYT API
        if (!response.ok) {
            console.error(`NYT API returned status ${response.status}`);
            const errorDetails = await response.text();
            return new NextResponse(errorDetails, { status: response.status });
        }

        // Parse and return the response data
        const data = await response.json();
        // console.log(data);
        return NextResponse.json({ articles: data.results }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching NYT API data:", error.message || error);

        // Return a 500 status for unexpected errors
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error", details: error.message }),
            { status: 500 }
        );
    }
}

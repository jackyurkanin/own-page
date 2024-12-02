"use server";

import { NextResponse } from 'next/server';

const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const nasa_path = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${getCurrentDate()}`;


export async function GET() {
    try {
        // Make the GET request to the NASA API
        const nasa_response = await fetch(nasa_path, {
            method: "GET",
        });

        if (!nasa_response.ok) {
            console.error(`NASA APOD API returned status ${nasa_response.status}`);
            const errorDetails = await nasa_response.text();
            return new NextResponse(errorDetails, { status: nasa_response.status });
        }

        // Parse and return the response data
        const nasa_data = await nasa_response.json();
        console.log("nasa_data: ", nasa_data);
        return NextResponse.json({ nasa_data  }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching IMAGE API data:", error.message || error);

        // Return a 500 status for unexpected errors
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error", details: error.message }),
            { status: 500 }
        );
    }
}

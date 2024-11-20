"use server";

import { NextResponse } from 'next/server';

const key = process.env.OPEN_WEATHER_API_KEY;

export async function POST(req: Request) {
    const body = await req.json();
    const lat: string = body.lat;
    const lon: string = body.lon;

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const url: string = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Handle non-200 responses from the OpenWeather API
        if (!response.ok) {
            console.error(`OpenWeather API returned status ${response.status}`);
            const errorDetails = await response.text();
            return new NextResponse(errorDetails, { status: response.status });
        }

        // Parse and return the response data
        const data = await response.json();

        return NextResponse.json({ temp: data.main.temp, feels: data.main.feels_like, description: data.weather[0].description, icon: data.weather[0].icon}, { status: 200 });
    } catch (error: any) {
        console.error('Error calling Open Weather API:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

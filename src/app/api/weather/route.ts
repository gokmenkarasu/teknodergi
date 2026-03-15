import { NextResponse } from "next/server";

interface WeatherData {
  city: string;
  temp: number;
  icon: string;
}

/**
 * Lightweight weather proxy.
 * Uses wttr.in (no API key needed) with optional lat/lon from client geolocation.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const location = lat && lon ? `${lat},${lon}` : "Istanbul";

  try {
    const res = await fetch(
      `https://wttr.in/${location}?format=j1`,
      { next: { revalidate: 1800 } } // cache 30 min
    );

    if (!res.ok) throw new Error("Weather API failed");

    const data = await res.json();
    const current = data.current_condition?.[0];
    const area = data.nearest_area?.[0];

    const cityName =
      area?.areaName?.[0]?.value ?? area?.region?.[0]?.value ?? "Istanbul";

    const weather: WeatherData = {
      city: cityName,
      temp: parseInt(current?.temp_C ?? "0", 10),
      icon: mapWeatherIcon(current?.weatherCode ?? "113"),
    };

    return NextResponse.json(weather);
  } catch {
    return NextResponse.json(
      { city: "Istanbul", temp: 15, icon: "☀️" },
      { status: 200 }
    );
  }
}

function mapWeatherIcon(code: string): string {
  const c = parseInt(code, 10);
  if (c === 113) return "☀️";
  if (c === 116) return "⛅";
  if (c === 119 || c === 122) return "☁️";
  if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359].includes(c))
    return "🌧️";
  if ([200, 386, 389, 392, 395].includes(c)) return "⛈️";
  if (
    [179, 182, 185, 227, 230, 323, 326, 329, 332, 335, 338, 368, 371].includes(
      c
    )
  )
    return "🌨️";
  if ([143, 248, 260].includes(c)) return "🌫️";
  return "☀️";
}

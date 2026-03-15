"use server";

import { auth } from "@/lib/auth";

export interface FreepikImage {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  previewUrl: string;
}

export async function searchFreepikImages(
  query: string
): Promise<FreepikImage[]> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) throw new Error("FREEPIK_API_KEY is not set");

  const params = new URLSearchParams({
    locale: "en",
    page: "1",
    limit: "12",
    term: query,
    "filters[orientation][landscape]": "1",
    "filters[content_type][photo]": "1",
  });

  const res = await fetch(
    `https://api.freepik.com/v1/resources?${params.toString()}`,
    {
      headers: { "x-freepik-api-key": apiKey },
    }
  );

  if (!res.ok) {
    throw new Error(`Freepik API error: ${res.status}`);
  }

  const json = await res.json();

  return (json.data ?? []).map(
    (item: {
      id: number;
      title: string;
      image?: { source?: { url?: string } };
    }) => ({
      id: item.id,
      title: item.title,
      url: item.image?.source?.url ?? "",
      thumbnailUrl: item.image?.source?.url ?? "",
      previewUrl: item.image?.source?.url ?? "",
    })
  );
}

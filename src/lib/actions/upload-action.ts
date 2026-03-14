"use server";

import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function uploadImage(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const blob = await put(`articles/${file.name}`, file, {
    access: "public",
  });

  return { url: blob.url };
}

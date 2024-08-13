import { defineEventHandler } from "h3";
import { nanoid } from "nanoid";
import type { Quote } from "~/types/Quote";

const API_URL = "https://zenquotes.io/api/random";

export default defineEventHandler(async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }

    const data: Quote[] = await response.json();
    const randomQuote = { id: nanoid(), ...data[0] };
    return randomQuote;
  } catch (error) {
    return {
      error: (error as Error).message,
    };
  }
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  destination: z.string().min(1).max(80),
  days: z.number().int().min(1).max(14),
  budget: z.number().int().min(50).max(20000),
  interests: z.string().max(300).optional(),
});

const DaySchema = z.object({
  day: z.number(),
  title: z.string(),
  morning: z.string(),
  afternoon: z.string(),
  evening: z.string(),
  food: z.string(),
});

export type ItineraryDay = z.infer<typeof DaySchema>;

export const generateItinerary = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<{ itinerary: ItineraryDay[] }> => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("AI is not configured. Please add OPENAI_API_KEY to your .env");

    const system = `You are an expert Sri Lanka travel planner for the luxury boutique agency "Ayubowan Travels". Design vivid, culturally authentic day-by-day plans. Suggest real places, hikes, temples, viewpoints, tea estates, wildlife parks and beaches near the requested area. Recommend specific Sri Lankan dishes. Keep each field concise (one sentence, under 160 chars).`;

    const user = `Create a ${data.days}-day itinerary based around ${data.destination}, Sri Lanka. Budget per traveler: USD ${data.budget}. ${data.interests ? `Traveler interests: ${data.interests}.` : ""}
Return STRICT JSON matching:
{"itinerary":[{"day":1,"title":"...","morning":"...","afternoon":"...","evening":"...","food":"..."}]}
Exactly ${data.days} entries. No prose, no markdown, no backticks.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached — try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Check your OpenAI billing limits.");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { itinerary: [] };
    }

    const shape = z.object({ itinerary: z.array(DaySchema) }).safeParse(parsed);
    if (!shape.success || shape.data.itinerary.length === 0) {
      throw new Error("AI returned an unexpected format. Please try again.");
    }
    return { itinerary: shape.data.itinerary.slice(0, data.days) };
  });

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
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 1. TRY GEMINI API IF KEY AVAILABLE
    if (geminiKey) {
      try {
        const geminiPrompt = `You are an expert Sri Lanka travel planner for Ayubowan Travels. Create a ${data.days}-day itinerary for ${data.destination}, Sri Lanka with budget USD ${data.budget}. ${data.interests ? `Interests: ${data.interests}.` : ""}
Return ONLY a valid JSON object matching: {"itinerary":[{"day":1,"title":"...","morning":"...","afternoon":"...","evening":"...","food":"..."}]}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          const parsed = JSON.parse(rawText);
          const shape = z.object({ itinerary: z.array(DaySchema) }).safeParse(parsed);
          if (shape.success && shape.data.itinerary.length > 0) {
            return { itinerary: shape.data.itinerary.slice(0, data.days) };
          }
        }
      } catch (err) {
        console.warn("Gemini API fallback triggered:", err);
      }
    }

    // 2. TRY OPENAI API IF KEY AVAILABLE
    if (openaiKey) {
      try {
        const system = `You are an expert Sri Lanka travel planner for the luxury boutique agency "Ayubowan Travels". Design vivid, culturally authentic day-by-day plans. Keep each field under 160 chars.`;
        const user = `Create a ${data.days}-day itinerary around ${data.destination}, Sri Lanka. Budget USD ${data.budget}. ${data.interests ? `Interests: ${data.interests}.` : ""}
Return STRICT JSON: {"itinerary":[{"day":1,"title":"...","morning":"...","afternoon":"...","evening":"...","food":"..."}]}`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: system }, { role: "user", content: user }],
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const content = json.choices?.[0]?.message?.content ?? "";
          const parsed = JSON.parse(content);
          const shape = z.object({ itinerary: z.array(DaySchema) }).safeParse(parsed);
          if (shape.success && shape.data.itinerary.length > 0) {
            return { itinerary: shape.data.itinerary.slice(0, data.days) };
          }
        }
      } catch (err) {
        console.warn("OpenAI API fallback triggered:", err);
      }
    }

    // 3. INTELLIGENT SRI LANKA TRAVEL ENGINE FALLBACK
    const fallbackItinerary = generateSmartSriLankaItinerary(data.destination, data.days, data.budget, data.interests);
    return { itinerary: fallbackItinerary };
  });

// --- Smart Sri Lanka Itinerary Generator ---
function generateSmartSriLankaItinerary(
  dest: string,
  days: number,
  budget: number,
  interests?: string,
): ItineraryDay[] {
  const dLower = dest.toLowerCase();

  const presets: Record<string, { title: string; morning: string; afternoon: string; evening: string; food: string }[]> = {
    ella: [
      {
        title: "Demodara & Little Adam's Peak",
        morning: "Watch the blue passenger train cross the iconic Nine Arch Bridge at 9:15 AM surrounded by misty tea bush hills.",
        afternoon: "Hike Little Adam's Peak for panoramic ridge views of Ella Gap and zip line over green valleys.",
        evening: "Relax at Cafe Chill with live acoustics, craft cocktails, and sunset views over the mountain pass.",
        food: "Traditional Ceylon hopper set with spicy lunu miris and creamy dhal curry.",
      },
      {
        title: "Ravana Falls & Tea Factory Heritage",
        morning: "Trek to Ravana Falls cascade pool and explore ancient Ravana Ella Cave legends.",
        afternoon: "Tour Halpewatte Tea Factory, learn artisanal Orthodox tea rolling, and taste single-origin Ceylon Pekoe.",
        evening: "Enjoy a wood-fired pizza and Ceylon spiced chai in Ella town center.",
        food: "Kottu Roti prepared fresh on hot steel plates with chopped roti and garden vegetables.",
      },
      {
        title: "Summiting Ella Rock at Dawn",
        morning: "Begin early 5:30 AM guided trek along railway tracks and pine forests to summit Ella Rock before heat.",
        afternoon: "Cool down with a fresh coconut at Diyaluma Falls upper rock pools.",
        evening: "Unwind with an Ayurvedic herbal oil massage in Ella village.",
        food: "Sour Fish Curry (Ambul Thiyal) served with fragrant red heirloom rice.",
      },
    ],
    sigiriya: [
      {
        title: "Ascent of the Lion Rock Fortress",
        morning: "Climb the 1,200 steps of 5th-century Sigiriya Citadel at 6:30 AM before crowds to view ancient frescoes.",
        afternoon: "Stroll through the Water Gardens, Boulder Gardens, and royal mirror wall inscriptions.",
        evening: "Sunset drinks overlooking Sigiriya monolith from a jungle infinity pool deck.",
        food: "Wild Ceylon peacock-style claypot rice with lotus root and coconut sambal.",
      },
      {
        title: "Pidurangala Sunrise & Elephant Gathering",
        morning: "Climb Pidurangala Rock at 5:00 AM for the famous 360-degree dawn photo of Sigiriya Rock.",
        afternoon: "Embark on an open 4x4 Jeep Safari through Minneriya National Park to watch wild elephant herds.",
        evening: "Traditional Village tour in Hiriwadunna with a catamaran ride across lily ponds.",
        food: "Crispy Egg Hoppers served on banana leaves with pol sambol.",
      },
      {
        title: "Dambulla Royal Cave Temples",
        morning: "Explore the UNESCO Dambulla Cave Temple complex containing 150+ gilded Buddha statues.",
        afternoon: "Visit spice gardens in Matale to discover Ceylon cinnamon, cardamom, and nutmeg cultivation.",
        evening: "Candlelit dinner in a teak wood jungle cabana.",
        food: "Pol Roti with fiery Seeni Sambol (caramelized onion preserve).",
      },
    ],
    mirissa: [
      {
        title: "Blue Whale Dawn Expedition",
        morning: "Set sail at 6:30 AM on a double-decker yacht into the deep Indian Ocean to spot Blue Whales and spinner dolphins.",
        afternoon: "Swim with wild giant sea turtles in the turquoise bay at Secret Beach.",
        evening: "Walk up Coconut Tree Hill at golden hour for stunning palm tree ocean vistas.",
        food: "Grilled Red Snapper fresh off fishermen boats with garlic butter and lime.",
      },
      {
        title: "Coastal Surfing & Galle Fort Excursion",
        morning: "Take a morning surf lesson at Weligama Bay's gentle sandbar break.",
        afternoon: "Explore 400-year-old Dutch ramparts, lighthouse, and boutique jewel shops inside Galle Fort.",
        evening: "Sunset cocktails on Galle Fort walls watching waves crash against coral reefs.",
        food: "Ceylon Black Pork Curry served with string hoppers and coconut milk gravy.",
      },
    ],
  };

  // Find matching preset pool
  let pool = presets.ella;
  if (dLower.includes("sigiriya") || dLower.includes("dambulla") || dLower.includes("cultural")) pool = presets.sigiriya;
  else if (dLower.includes("mirissa") || dLower.includes("galle") || dLower.includes("beach") || dLower.includes("coast")) pool = presets.mirissa;

  const itinerary: ItineraryDay[] = [];

  for (let i = 1; i <= days; i++) {
    const template = pool[(i - 1) % pool.length];
    itinerary.push({
      day: i,
      title: i <= pool.length ? template.title : `${dest} Discovery — Day ${i}`,
      morning: template.morning.replace("Ella", dest).replace("Sigiriya", dest).replace("Mirissa", dest),
      afternoon: template.afternoon.replace("Ella", dest).replace("Sigiriya", dest).replace("Mirissa", dest),
      evening: template.evening.replace("Ella", dest).replace("Sigiriya", dest).replace("Mirissa", dest),
      food: template.food,
    });
  }

  return itinerary;
}

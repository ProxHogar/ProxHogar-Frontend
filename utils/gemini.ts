const GEMINI_API_KEY = ""

export const callGeminiLLM = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return new Promise((resolve) => setTimeout(() => resolve(`(IA): Descripción mejorada para: "${prompt}"`), 1000))
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    )

    if (!response.ok) throw new Error("Error Gemini")

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar."
  } catch (error) {
    console.error("Gemini Error:", error)
    return "Error al conectar con IA."
  }
}

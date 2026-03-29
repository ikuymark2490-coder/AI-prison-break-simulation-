export default async function handler(req, res) {
  // 1. ตั้งค่า CORS Headers เพื่ออนุญาตให้ itch.io เข้าถึง API นี้ได้
  res.setHeader('Access-Control-Allow-Origin', '*'); // อนุญาตทุกเว็บไซต์
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // อนุญาตเฉพาะ POST และ OPTIONS
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. จัดการคำขอแบบ OPTIONS (Preflight request)
  // เบราว์เซอร์จะส่ง OPTIONS มาก่อนเพื่อเช็กว่า Vercel ยอมรับ itch.io มั้ย
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. กรองให้รับแค่ POST สำหรับการคุยกับ AI
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API Key is missing in environment variables" });
    }

    // ยิงตรงไปหา Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // ส่งคำตอบกลับไปที่หน้าเว็บ itch.io
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

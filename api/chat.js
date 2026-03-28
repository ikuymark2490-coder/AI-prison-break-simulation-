export default async function handler(req, res) {
  // กรองให้รับแค่ POST เท่านั้น
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    // ยิงตรงไปหา Groq โดยใช้ fetch ของ Node.js โดยตรง
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // ส่งคำตอบกลับไปที่หน้าเว็บ
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

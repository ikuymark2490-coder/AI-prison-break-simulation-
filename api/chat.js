const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  // รับเฉพาะคำสั่ง POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.GROQ_API_KEY,
        "Content-Type": "application/json"
      },
      // ส่งข้อมูลทั้งหมดที่ได้จากหน้าเว็บไปให้ Groq
      body: JSON.stringify(req.body)
    });

    const data = await r.json();
    res.status(200).json(data);
    
  } catch (error) {
    // พิมพ์ Error ลง Log ของ Vercel เผื่อพังจะได้เข้ามาดูได้
    console.error("API Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

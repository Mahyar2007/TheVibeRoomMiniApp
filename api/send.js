import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { message, user_id } = req.body;

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          telegram_id: user_id,
          message: message
        }
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // ارسال به تلگرام خودت
    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: 8812851173,
          text:
`📩 Secret جدید

👤 User ID: ${user_id}

💬 ${message}`
        })
      }
    );

    return res.json({
      success: true
    });

  } catch (e) {

    return res.status(500).json({
      error: e.message
    });

  }

}

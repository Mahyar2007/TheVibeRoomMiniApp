import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {

    const { message, user_id } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "پیام خالی است"
      });
    }

    // ذخیره در Supabase
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          telegram_id: user_id,
          message: message
        }
      ]);

    if (error) {
      throw error;
    }

    // ارسال پیام به تلگرام
    const telegram = await fetch(
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

    const telegramResult = await telegram.json();

    console.log("Telegram:", telegramResult);

    return res.status(200).json({
      success: true,
      message: "پیام ارسال شد"
    });

  } catch (e) {

    console.error(e);

    return res.status(500).json({
      success: false,
      error: e.message
    });

  }

}

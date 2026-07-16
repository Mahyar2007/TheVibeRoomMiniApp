import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { message, user_id } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message required"
    });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const { error } = await supabase
    .from("messages")
    .insert([
      {
        telegram_id: user_id,
        message: message
      }
    ]);

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  return res.status(200).json({
    success: true
  });
}

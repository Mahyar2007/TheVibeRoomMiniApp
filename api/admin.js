export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: "Admin API is working"
  });
}

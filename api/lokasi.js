export default async function handler(req, res) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
        return res.status(200).json({ lat: null, lon: null, error: "Brankas belum siap" });
    }

    try {
        const response = await fetch(`${url}/get/lokasiTarget`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const dbData = await response.json();
        
        if (dbData.result) {
            const lokasi = typeof dbData.result === 'string' ? JSON.parse(dbData.result) : dbData.result;
            res.status(200).json(lokasi);
        } else {
            res.status(200).json({ lat: null, lon: null });
        }
    } catch (e) {
        res.status(500).json({ error: "Gagal membaca brankas" });
    }
}
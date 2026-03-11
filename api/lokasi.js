export default async function handler(req, res) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) return res.status(500).json({ error: "Database belum terhubung" });

    try {
        const response = await fetch(`${url}/hgetall/data_perangkat`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const dbData = await response.json();
        
        let hasil = {};
        if (dbData.result) {
            if (Array.isArray(dbData.result)) {
                for (let i = 0; i < dbData.result.length; i += 2) {
                    hasil[dbData.result[i]] = JSON.parse(dbData.result[i + 1]);
                }
            } else {
                for (const key in dbData.result) {
                    hasil[key] = typeof dbData.result[key] === 'string' ? JSON.parse(dbData.result[key]) : dbData.result[key];
                }
            }
        }
        res.status(200).json(hasil);
    } catch (e) {
        res.status(500).json({ error: "Gagal membaca database" });
    }
}
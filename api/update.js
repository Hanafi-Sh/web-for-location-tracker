export default async function handler(req, res) {
    const { lat, lon } = req.query;
    
    // Deteksi otomatis nama kunci dari Vercel/Upstash
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
        return res.status(500).json({ error: "Brankas Upstash belum terhubung di Vercel!" });
    }
    
    if (lat && lon) {
        const data = {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            waktu: new Date().toLocaleTimeString('id-ID')
        };
        
        try {
            await fetch(`${url}/set/lokasiTarget`, {
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
                method: 'POST',
            });
            res.status(200).json({ pesan: "Lokasi berhasil diamankan di brankas!", data });
        } catch (e) {
            res.status(500).json({ error: "Gagal menyimpan ke brankas" });
        }
    } else {
        res.status(400).json({ error: "Koordinat tidak lengkap" });
    }
}
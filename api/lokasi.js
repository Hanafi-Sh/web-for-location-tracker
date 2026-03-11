export default async function handler(req, res) {
    try {
        // Mengambil data dari Brankas Vercel (KV)
        const response = await fetch(`${process.env.KV_REST_API_URL}/get/lokasiTarget`, {
            headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
        });
        const kvData = await response.json();
        
        // Membaca isi brankas
        if (kvData.result) {
            const lokasi = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
            res.status(200).json(lokasi);
        } else {
            res.status(200).json({ lat: null, lon: null });
        }
    } catch (e) {
        res.status(500).json({ error: "Gagal membaca brankas" });
    }
}
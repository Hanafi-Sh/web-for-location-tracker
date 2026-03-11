export default async function handler(req, res) {
    // Sekarang menerima 'id' dan 'nama'
    const { id, nama, lat, lon } = req.query; 
    
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) return res.status(500).json({ error: "Brankas Upstash belum terhubung!" });
    
    // Wajib ada ID, Lat, dan Lon
    if (id && lat && lon) {
        // Jika nama kosong, gunakan ID sebagai nama
        const namaTarget = nama ? decodeURIComponent(nama) : id;
        
        const data = {
            nama: namaTarget,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            waktu: new Date().toLocaleTimeString('id-ID')
        };
        
        try {
            // HSET: Menyimpan data ke dalam laci khusus berdasarkan ID HP
            await fetch(`${url}/hset/semuaTarget/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
                method: 'POST',
            });
            res.status(200).json({ pesan: `Lokasi ${namaTarget} diamankan!`, data });
        } catch (e) {
            res.status(500).json({ error: "Gagal menyimpan ke brankas" });
        }
    } else {
        res.status(400).json({ error: "Data tidak lengkap. Butuh id, lat, lon." });
    }
}
export default async function handler(req, res) {
    const { id, nama, lat, lon } = req.query; 
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) return res.status(500).json({ error: "Database belum terhubung" });
    
    // Wajib ada id, lat, dan lon
    if (id && lat && lon) {
        const namaPerangkat = nama ? decodeURIComponent(nama) : id;
        const data = {
            nama: namaPerangkat,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            waktu: new Date().toLocaleTimeString('id-ID')
        };
        
        try {
            // Menggunakan folder baru 'data_perangkat' agar tidak bentrok dengan data lama
            await fetch(`${url}/hset/data_perangkat/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
                method: 'POST',
            });
            res.status(200).json({ pesan: `Data ${namaPerangkat} berhasil disimpan`, data });
        } catch (e) {
            res.status(500).json({ error: "Gagal menyimpan ke database" });
        }
    } else {
        res.status(400).json({ error: "Parameter id, lat, dan lon wajib diisi." });
    }
}
export default async function handler(req, res) {
    const { id, nama, lat, lon } = req.query;
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) return res.status(500).json({ error: "Database belum terhubung" });

    if (id && lat && lon) {
        try {
            // === FITUR BARU: STEMPEL WAKTU JAKARTA (WIB) ===
            const waktuJakarta = new Date().toLocaleString('id-ID', { 
                timeZone: 'Asia/Jakarta',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });

            const dataTarget = {
                nama: nama || id,
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                waktu: waktuJakarta
            };

            // Simpan ke brankas
            await fetch(`${url}/hset/data_perangkat/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(dataTarget),
                method: 'POST',
            });

            res.status(200).json({ pesan: "Lokasi berhasil diperbarui!" });
        } catch (e) {
            res.status(500).json({ error: "Gagal menyimpan data" });
        }
    } else {
        res.status(400).json({ error: "Data tidak lengkap" });
    }
}
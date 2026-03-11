export default async function handler(req, res) {
    const { id } = req.query; // Menangkap ID target yang mau dihapus
    
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) return res.status(500).json({ error: "Database belum terhubung" });

    if (id) {
        try {
            // HDEL: Menghapus 1 laci data berdasarkan ID-nya
            await fetch(`${url}/hdel/data_perangkat/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            res.status(200).json({ pesan: `Target ${id} berhasil dihilangkan dari radar!` });
        } catch (e) {
            res.status(500).json({ error: "Gagal menghapus dari database" });
        }
    } else {
        res.status(400).json({ error: "ID target tidak ditemukan." });
    }
}
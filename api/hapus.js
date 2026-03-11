export default async function handler(req, res) {
    const { id } = req.query; 
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) return res.status(500).json({ error: "Database belum terhubung" });

    if (id) {
        try {
            // 1. Ambil data target dari laci aktif
            const getResp = await fetch(`${url}/hget/data_perangkat/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const getData = await getResp.json();

            if (getData.result) {
                // 2. Pindahkan data tersebut ke laci sampah (data_trash)
                const dataString = typeof getData.result === 'string' ? getData.result : JSON.stringify(getData.result);
                await fetch(`${url}/hset/data_trash/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    body: dataString,
                    method: 'POST',
                });

                // 3. Hapus data dari laci aktif
                await fetch(`${url}/hdel/data_perangkat/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                res.status(200).json({ pesan: `Target ${id} diamankan ke Trash!` });
            } else {
                res.status(404).json({ error: "Target tidak ditemukan." });
            }
        } catch (e) {
            res.status(500).json({ error: "Gagal memindah ke sampah" });
        }
    } else {
        res.status(400).json({ error: "ID target tidak valid." });
    }
}
export default async function handler(req, res) {
    const { lat, lon } = req.query;
    
    if (lat && lon) {
        const data = {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            waktu: new Date().toLocaleTimeString('id-ID')
        };
        
        try {
            // Memasukkan data ke dalam Brankas Vercel (KV)
            await fetch(`${process.env.KV_REST_API_URL}/set/lokasiTarget`, {
                headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
                body: JSON.stringify(data),
                method: 'POST',
            });
            res.status(200).json({ pesan: "Lokasi diamankan di Brankas Vercel!", data });
        } catch (e) {
            res.status(500).json({ error: "Gagal menyimpan ke brankas" });
        }
    } else {
        res.status(400).json({ error: "Koordinat tidak lengkap" });
    }
}
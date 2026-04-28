// ============================================================
// TYPES — ganti sesuai topik & data kamu
// ============================================================

// Konfigurasi utama web story — ganti di sini untuk topik baru
export interface StoryConfig {
  title: string; // judul utama hero
  subtitle: string; // subjudul hero
  description: string; // deskripsi singkat
  region: string; // nama wilayah (misal: "Pulau Jawa")
  mapCenter: [number, number]; // [longitude, latitude]
  mapZoom: number; // zoom awal peta
  year: number; // tahun data
}

// Data per wilayah (provinsi / kabupaten)
export interface RegionData {
  id: string; // kode BPS / kode unik
  name: string; // nama wilayah
  value: number; // nilai utama (% kemiskinan, dll)
  value2?: number; // nilai tambahan opsional
  category?: string; // kategori (tinggi/sedang/rendah)
  lat?: number;
  lng?: number;
}

// Data tren waktu
export interface TrendData {
  year: number;
  value: number;
  region: string;
}

// Satu section dalam scrollytelling
export interface StorySection {
  id: string;
  title: string;
  body: string;
  mapFlyTo?: {
    center: [number, number];
    zoom: number;
  };
  highlightRegion?: string; // id wilayah yang di-highlight
}

// Statistik ringkasan untuk metric cards
export interface SummaryStats {
  label: string;
  value: string;
  unit?: string;
  change?: number; // perubahan dari tahun sebelumnya
  changeLabel?: string;
}


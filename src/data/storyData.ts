import type {
  StoryConfig,
  RegionData,
  TrendData,
  StorySection,
  SummaryStats,
} from "../types";

export const storyConfig: StoryConfig = {
  title: "Stunting di Indonesia: Ancaman yang Tak Terlihat",
  subtitle: "Memahami Sebaran dan Faktor Stunting di Nusa Tenggara Timur",
  description:
    "Sebuah perjalanan data untuk memahami kondisi stunting anak di Provinsi Nusa Tenggara Timur melalui visualisasi interaktif.",
  region: "Nusa Tenggara Timur",
  mapCenter: [121.5, -8.8],
  mapZoom: 7.0,
  year: 2023,
};

export const regionData: RegionData[] = [
  { id: "5301", name: "Kupang", value: 38.2, category: "tinggi" },
  { id: "5302", name: "Timor Tengah Sel", value: 42.1, category: "tinggi" },
  { id: "5303", name: "Timor Tengah Utr", value: 39.8, category: "tinggi" },
  { id: "5304", name: "Belu", value: 35.6, category: "sedang" },
  { id: "5305", name: "Alor", value: 41.3, category: "tinggi" },
  { id: "5306", name: "Lembata", value: 37.9, category: "sedang" },
  { id: "5307", name: "Flores Timur", value: 33.4, category: "sedang" },
  { id: "5308", name: "Sikka", value: 31.2, category: "sedang" },
  { id: "5309", name: "Ende", value: 29.7, category: "sedang" },
  { id: "5310", name: "Ngada", value: 28.5, category: "rendah" },
  { id: "5371", name: "Kota Kupang", value: 22.1, category: "rendah" },
];

export const trendData: TrendData[] = [
  { year: 2018, value: 42.6, region: "NTT" },
  { year: 2019, value: 43.8, region: "NTT" },
  { year: 2020, value: 41.2, region: "NTT" },
  { year: 2021, value: 37.8, region: "NTT" },
  { year: 2022, value: 35.3, region: "NTT" },
  { year: 2023, value: 33.1, region: "NTT" },
  { year: 2018, value: 30.8, region: "Nasional" },
  { year: 2019, value: 27.7, region: "Nasional" },
  { year: 2020, value: 26.9, region: "Nasional" },
  { year: 2021, value: 24.4, region: "Nasional" },
  { year: 2022, value: 21.6, region: "Nasional" },
  { year: 2023, value: 21.5, region: "Nasional" },
];

// ── DATA CHART untuk HeroSection ──────────────────────────────
export interface ChartPoint {
  year: number;
  ntt: number;
  nasional: number;
}

export const stuntingChartData: ChartPoint[] = [
  { year: 2019, ntt: 43.8, nasional: 27.7 },
  { year: 2020, ntt: 41.2, nasional: 26.9 },
  { year: 2021, ntt: 37.8, nasional: 24.4 },
  { year: 2022, ntt: 35.3, nasional: 21.6 },
  { year: 2023, ntt: 33.1, nasional: 21.5 },
  { year: 2024, ntt: 30.2, nasional: 19.8 },
];

export const summaryStats: SummaryStats[] = [
  {
    label: "Prevalensi stunting NTT",
    value: "33.1",
    unit: "%",
    change: -2.2,
    changeLabel: "vs 2022",
  },
  {
    label: "Rata-rata nasional",
    value: "21.5",
    unit: "%",
    change: -0.1,
    changeLabel: "vs 2022",
  },
  { label: "Kabupaten di atas rata-rata", value: "8", unit: "kab/kota" },
  { label: "Tahun data", value: "2023" },
];

export const storySections: StorySection[] = [
  {
    id: "intro",
    title: "NTT dan Beban Stunting",
    body: "Nusa Tenggara Timur konsisten menjadi provinsi dengan angka stunting tertinggi di Indonesia. Lebih dari sepertiga anak balita di NTT mengalami stunting — jauh di atas rata-rata nasional 21,5%.",
    mapFlyTo: { center: [121.5, -8.8], zoom: 7.0 },
  },
  {
    id: "timor",
    title: "Timor Tengah Selatan: Episentrum Stunting",
    body: "Kabupaten Timor Tengah Selatan mencatat angka stunting tertinggi di NTT sebesar 42,1%. Keterbatasan akses air bersih, sanitasi, dan layanan kesehatan menjadi faktor utama.",
    mapFlyTo: { center: [124.2, -9.6], zoom: 9 },
    highlightRegion: "5302",
  },
  {
    id: "kupang",
    title: "Kota Kupang: Relatif Lebih Baik",
    body: "Sebagai ibu kota provinsi, Kota Kupang mencatat stunting 22,1% — terendah di NTT namun masih di atas target nasional 14% pada 2024.",
    mapFlyTo: { center: [123.6, -10.2], zoom: 11 },
    highlightRegion: "5371",
  },
  {
    id: "trend",
    title: "Tren Menurun, Masih Jauh dari Target",
    body: "Angka stunting NTT turun dari 42,6% (2018) menjadi 33,1% (2023). Meski membaik, NTT masih tertinggal 11,6 poin dari rata-rata nasional.",
    mapFlyTo: { center: [121.5, -8.8], zoom: 7.0 },
  },
];

// ── DATA PROTEIN ──────────────────────────────────────────────
export interface ProteinPoint {
  kabupaten: string;
  value: number;
}

export const proteinData: ProteinPoint[] = [
  { kabupaten: "Manggarai", value: 64.1 },
  { kabupaten: "Ngada", value: 61.8 },
  { kabupaten: "Ende", value: 59.3 },
  { kabupaten: "Sikka", value: 57.6 },
  { kabupaten: "Flores Timur", value: 56.2 },
  { kabupaten: "Manggarai Barat", value: 54.9 },
  { kabupaten: "Manggarai Timur", value: 53.7 },
  { kabupaten: "Nagekeo", value: 52.4 },
  { kabupaten: "Sumba Timur", value: 51.8 },
  { kabupaten: "Lembata", value: 50.3 },
  { kabupaten: "Sumba Tengah", value: 49.6 },
  { kabupaten: "Belu", value: 48.9 },
  { kabupaten: "Sumba Barat", value: 48.1 },
  { kabupaten: "Timor Tengah Utara", value: 47.5 },
  { kabupaten: "Alor", value: 46.8 },
  { kabupaten: "Kupang", value: 46.2 },
  { kabupaten: "Kota Kupang", value: 45.9 },
  { kabupaten: "Timor Tengah Selatan", value: 45.3 },
  { kabupaten: "Sumba Barat Daya", value: 44.9 },
  { kabupaten: "Sabu Raijua", value: 44.8 },
  { kabupaten: "Malaka", value: 44.77 },
  { kabupaten: "Rote Ndao", value: 44.73 },
];

// ── DATA PIE CHART 3D — Protein NTT vs Provinsi Lain ─────────
export interface PieChartData {
  label: string;
  value: number;   // gram/kapita/hari
  pct: number;     // persentase relatif untuk visual
}

// Rata-rata protein NTT vs rata-rata nasional tanpa NTT
// NTT: 54.7 g/hari | Nasional (tanpa NTT): 68.4 g/hari
// Divisualisasikan sebagai proporsi dari total keduanya
export const proteinPieData: PieChartData[] = [
  { label: "NTT", value: 54.7, pct: 54.7 / (54.7 + 68.4) },
  { label: "Provinsi Lain", value: 68.4, pct: 68.4 / (54.7 + 68.4) },
];

// ── GANTI interface & data ini di storyData.ts ───────────────

// Interface baru — 1 baris = 1 kategori pengeluaran
export interface PengeluaranPoint {
  kategori: string;  // "Makanan" | "Non-Makanan"
  value: number;     // Rp/kapita/bulan
  short: string;     // label pendek
  color: string;     // warna bar
}

// Data NTT 2023 — rata-rata provinsi (Susenas 2023)
// Total pengeluaran: Rp838.467/kapita/bulan
// Makanan 61,3% | Non-makanan 38,7%
export const pengeluaranData: PengeluaranPoint[] = [
  {
    kategori: "Pengeluaran Makanan",
    value: 514309,
    short: "Makanan",
    color: "#7c3aed",
  },
  {
    kategori: "Pengeluaran Non-Makanan",
    value: 324157,
    short: "Non-Makanan",
    color: "#0891b2",
  },
];
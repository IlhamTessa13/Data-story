import type {
  StoryConfig,
  RegionData,
  TrendData,
  StorySection,
  SummaryStats,
} from "../types";

export const storyConfig: StoryConfig = {
  title: "Akses Kesehatan di Sulawesi Barat",
  subtitle: "Memahami Sebaran Layanan Kesehatan di Provinsi Sulawesi Barat",
  description:
    "Sebuah perjalanan data untuk memahami kondisi akses kesehatan masyarakat di Provinsi Sulawesi Barat melalui visualisasi interaktif.",
  region: "Sulawesi Barat",
  mapCenter: [119.4, -2.8],
  mapZoom: 8.0,
  year: 2023,
};

export const regionData: RegionData[] = [
  { id: "7601", name: "Mamuju Utara", value: 82.1, category: "sedang" },
  { id: "7602", name: "Mamuju", value: 92.66, category: "tinggi" },
  { id: "7603", name: "Mamasa", value: 78.4, category: "sedang" },
  { id: "7604", name: "Polewali Mandar", value: 88.2, category: "tinggi" },
  { id: "7605", name: "Majene", value: 85.9, category: "tinggi" },
  { id: "7606", name: "Mamuju Tengah", value: 75.43, category: "rendah" },
];

export const trendData: TrendData[] = [
  { year: 2019, value: 68.2, region: "Sulbar" },
  { year: 2020, value: 71.4, region: "Sulbar" },
  { year: 2021, value: 74.8, region: "Sulbar" },
  { year: 2022, value: 79.3, region: "Sulbar" },
  { year: 2023, value: 83.1, region: "Sulbar" },
  { year: 2019, value: 73.5, region: "Nasional" },
  { year: 2020, value: 76.8, region: "Nasional" },
  { year: 2021, value: 79.1, region: "Nasional" },
  { year: 2022, value: 82.4, region: "Nasional" },
  { year: 2023, value: 86.7, region: "Nasional" },
];

// ── DATA CHART BPJS ───────────────────────────────────────────
export interface ChartPoint {
  year: number;
  sulbar: number;
  nasional: number;
}

export const bpjsChartData: ChartPoint[] = [
  { year: 2019, sulbar: 68.2, nasional: 73.5 },
  { year: 2020, sulbar: 71.4, nasional: 76.8 },
  { year: 2021, sulbar: 74.8, nasional: 79.1 },
  { year: 2022, sulbar: 79.3, nasional: 82.4 },
  { year: 2023, sulbar: 83.1, nasional: 86.7 },
];

// Alias untuk kompatibilitas HeroSection
export const stuntingChartData = bpjsChartData.map((d) => ({
  year: d.year,
  ntt: d.sulbar,
  nasional: d.nasional,
}));

export const summaryStats: SummaryStats[] = [
  {
    label: "Cakupan BPJS Sulbar",
    value: "83.1",
    unit: "%",
    change: 3.8,
    changeLabel: "vs 2022",
  },
  {
    label: "Rata-rata nasional",
    value: "86.7",
    unit: "%",
    change: 4.3,
    changeLabel: "vs 2022",
  },
  { label: "Kabupaten di bawah rata-rata", value: "2", unit: "kabupaten" },
  { label: "Tahun data", value: "2023" },
];

export const storySections: StorySection[] = [
  {
    id: "intro",
    title: "Sulawesi Barat dan Akses Kesehatan",
    body: "Sulawesi Barat terus meningkatkan cakupan BPJS, namun masih terdapat kesenjangan antar kabupaten. Mamuju Tengah menjadi daerah dengan cakupan terendah.",
    mapFlyTo: { center: [119.4, -2.8], zoom: 8.0 },
  },
  {
    id: "mamuju",
    title: "Mamuju: Cakupan BPJS Tertinggi",
    body: "Kabupaten Mamuju mencatat cakupan BPJS tertinggi di Sulbar sebesar 92,66%. Sebagai ibu kota provinsi, Mamuju memiliki akses fasilitas kesehatan yang lebih baik.",
    mapFlyTo: { center: [119.1, -2.7], zoom: 10 },
    highlightRegion: "7602",
  },
  {
    id: "mamuju-tengah",
    title: "Mamuju Tengah: Perlu Perhatian Lebih",
    body: "Mamuju Tengah mencatat cakupan BPJS terendah (75,43%) sekaligus jumlah tenaga medis dan fasilitas kesehatan paling sedikit. Intervensi terpadu sangat diperlukan.",
    mapFlyTo: { center: [119.6, -2.5], zoom: 10 },
    highlightRegion: "7606",
  },
  {
    id: "trend",
    title: "Tren Membaik, Masih Ada Gap",
    body: "Cakupan BPJS Sulbar naik dari 68,2% (2019) menjadi 83,1% (2023). Meski tren positif, Sulbar masih 3,6 poin di bawah rata-rata nasional.",
    mapFlyTo: { center: [119.4, -2.8], zoom: 8.0 },
  },
];

// ── DATA PIE CHART ─────────────────────────────────────────────
export interface PieChartData {
  label: string;
  value: number;
  pct: number;
}

export const proteinPieData: PieChartData[] = [
  { label: "Sulbar", value: 83.1, pct: 83.1 / (83.1 + 86.7) },
  { label: "Nasional", value: 86.7, pct: 86.7 / (83.1 + 86.7) },
];

// ── DATA PENGELUARAN (tetap untuk HeroSection) ─────────────────
export interface PengeluaranPoint {
  kabupaten: string;
  value: number;
  short: string;
}

export const pengeluaranData: PengeluaranPoint[] = [
  { kabupaten: "Mamuju", value: 645882, short: "Mamuju" },
  { kabupaten: "Majene", value: 598430, short: "Majene" },
  { kabupaten: "Polewali Mandar", value: 572860, short: "Polman" },
  { kabupaten: "Mamasa", value: 534760, short: "Mamasa" },
  { kabupaten: "Mamuju Utara", value: 498320, short: "Mam Utara" },
  { kabupaten: "Mamuju Tengah", value: 450209, short: "Mam Tengah" },
];

// ── DATA SULBAR UNTUK SCROLLYSECTION ──────────────────────────
export interface SulbarKabData {
  kabupaten: string;
  bpjsPct: number; // % penduduk ber-BPJS
  tenagaMedis: number; // jumlah tenaga medis
  faskes: number; // jumlah fasilitas kesehatan
}

export const sulbarData: SulbarKabData[] = [
  { kabupaten: "Mamuju", bpjsPct: 92.66, tenagaMedis: 198, faskes: 29 },
  { kabupaten: "Polewali Mandar", bpjsPct: 88.2, tenagaMedis: 241, faskes: 26 },
  { kabupaten: "Majene", bpjsPct: 85.9, tenagaMedis: 187, faskes: 22 },
  { kabupaten: "Mamuju Utara", bpjsPct: 82.1, tenagaMedis: 143, faskes: 18 },
  { kabupaten: "Mamasa", bpjsPct: 78.4, tenagaMedis: 112, faskes: 15 },
  { kabupaten: "Mamuju Tengah", bpjsPct: 75.43, tenagaMedis: 53, faskes: 12 },
];

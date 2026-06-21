import type { Watch } from "@/data/types";

/**
 * "Màu/tên đặc biệt này nằm ở ĐÂU?" — tách rõ tên màu/finish đặc biệt thuộc
 * MẶT SỐ (dial) / VÀNH (bezel) / VỎ (case) / DÂY (strap)… để khỏi rối khi tư vấn.
 * Nguồn rối: field colorEn gộp chung màu dial, bezel, chất liệu vỏ, tên dây.
 */

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

export interface ColorLine {
  part: string; // nhãn ngắn tiếng Việt (chip)
  partEn: string;
  display: string; // tên hiển thị
  note: string;
}

type Slot = { part: string; partEn: string };
const DIAL: Slot = { part: "Mặt số", partEn: "dial" };
const BEZEL: Slot = { part: "Vành", partEn: "bezel" };
const CASE: Slot = { part: "Vỏ", partEn: "case" };
const STRAP: Slot = { part: "Dây", partEn: "strap" };
const BOTH: Slot = { part: "Mặt số + vành", partEn: "dial + bezel" };
const GLASS: Slot = { part: "Kính", partEn: "crystal" };
const HAND: Slot = { part: "Kim", partEn: "hand" };

interface Entry extends Slot {
  keys: string[];
  display: string;
  note: string;
}

// Thu tu: cai CHI TIET/dac biet hon dat truoc (vd "reverse panda" truoc "panda")
const DICT: Entry[] = [
  // ----- MẶT SỐ (dial) -----
  { ...DIAL, keys: ["sundust"], display: "Sundust", note: "màu MẶT SỐ hồng champagne ánh kim — chỉ đi cùng vỏ Everose (vàng hồng)" },
  { ...DIAL, keys: ["wimbledon"], display: "Wimbledon", note: "MẶT SỐ xám đá (slate) + số La Mã XANH LÁ — riêng dòng Datejust" },
  { ...DIAL, keys: ["tiffany"], display: "Tiffany", note: "màu MẶT SỐ xanh ngọc (turquoise) — nổi nhờ Patek Nautilus 5711 Tiffany" },
  { ...DIAL, keys: ["reverse panda"], display: "Reverse Panda", note: "MẶT SỐ ĐEN + 3 mặt phụ TRẮNG (ngược với Panda)" },
  { ...DIAL, keys: ["panda"], display: "Panda", note: "MẶT SỐ TRẮNG + 3 mặt phụ ĐEN (giống mặt gấu trúc)" },
  { ...DIAL, keys: ["polar"], display: "Polar", note: "MẶT SỐ TRẮNG của Explorer II (đối lập bản mặt đen)" },
  { ...DIAL, keys: ["rhodium"], display: "Rhodium", note: "màu MẶT SỐ xám bạc ánh kim (rhodium)" },
  { ...DIAL, keys: ["slate"], display: "Slate", note: "màu MẶT SỐ xám đá" },
  { ...DIAL, keys: ["anthracite"], display: "Anthracite", note: "màu MẶT SỐ xám than" },
  { ...DIAL, keys: ["chocolate"], display: "Chocolate", note: "MẶT SỐ nâu sô-cô-la — thường đi vỏ Everose" },
  { ...DIAL, keys: ["champagne"], display: "Champagne", note: "MẶT SỐ vàng champagne nhạt (đừng nhầm với vỏ vàng)" },
  { ...DIAL, keys: ["mop", "mother of pearl", "xa cu"], display: "MOP (xà cừ)", note: "MẶT SỐ xà cừ (Mother of Pearl) óng ánh — mỗi mặt vân khác nhau" },
  { ...DIAL, keys: ["ice blue"], display: "Ice Blue", note: "MẶT SỐ xanh băng — RIÊNG bản Platinum của Rolex (dấu hiệu nhận biết bạch kim)" },
  { ...DIAL, keys: ["z-blue", "z blue"], display: "Z-Blue", note: "MẶT SỐ xanh điện (electric blue) của Milgauss" },
  { ...DIAL, keys: ["teak"], display: "Teak", note: "MẶT SỐ vân sọc dọc kiểu sàn gỗ tàu (teak) — Sky-Dweller" },
  { ...DIAL, keys: ["tintin"], display: "Tintin", note: "MẶT SỐ trắng + vạch phút đỏ-trắng (gợi tên lửa Tintin)" },
  { ...DIAL, keys: ["d-blue", "james cameron"], display: "D-Blue (James Cameron)", note: "MẶT SỐ chuyển XANH → ĐEN mô phỏng độ sâu đại dương (Deepsea)" },
  { ...DIAL, keys: ["le mans"], display: "Le Mans", note: "MẶT SỐ reverse panda + số 100 ĐỎ (TAG Carrera Le Mans)" },
  { ...DIAL, keys: ["grande tapisserie", "mega tapisserie", "petite tapisserie", "tapisserie"], display: "Tapisserie", note: "hoạ tiết ô bàn cờ dập nổi trên MẶT SỐ (Audemars Piguet)" },
  { ...DIAL, keys: ["honeycomb"], display: "Honeycomb", note: "hoạ tiết tổ ong trên MẶT SỐ" },
  { ...DIAL, keys: ["fume", "vignette"], display: "Fumé / Vignette", note: "MẶT SỐ chuyển tối dần ra rìa (fumé)" },
  { ...DIAL, keys: ["sunburst", "sunray"], display: "Sunburst", note: "MẶT SỐ vân tia nắng toả từ tâm" },
  { ...DIAL, keys: ["palm"], display: "Palm", note: "MẶT SỐ hoạ tiết lá cọ (Palm motif)" },
  { ...DIAL, keys: ["floral"], display: "Floral", note: "MẶT SỐ hoạ tiết hoa" },
  { ...DIAL, keys: ["celebration"], display: "Celebration", note: "MẶT SỐ hoạ tiết bong bóng nhiều màu (Celebration)" },
  { ...DIAL, keys: ["museum"], display: "Museum", note: "MẶT SỐ trơn, 1 chấm vàng tại 12h (Movado Museum)" },
  { ...DIAL, keys: ["pie pan"], display: "Pie Pan", note: "MẶT SỐ gờ nghiêng như đĩa nướng (Constellation cổ)" },
  { ...DIAL, keys: ["candy"], display: "Candy", note: "MẶT SỐ xanh kẹo bóng (candy)" },
  { ...DIAL, keys: ["snoopy"], display: "Snoopy", note: "đồ hoạ Snoopy ở MẶT SỐ phụ (9h) + đáy nắp" },
  { ...DIAL, keys: ["spectre"], display: "Spectre", note: "MẶT SỐ/họa tiết bản phim 007 'Spectre'" },

  // ----- MẶT SỐ: CHẤT LIỆU ĐÁ / THIÊN THẠCH / MEN (đặc biệt, đắt) -----
  { ...DIAL, keys: ["meteorite"], display: "Meteorite", note: "MẶT SỐ cắt từ THIÊN THẠCH sắt-niken (thường Gibeon/Muonionalusta) — vân Widmanstätten tự nhiên, MỖI mặt độc nhất; tên gọi vì làm từ thiên thạch thật rơi xuống Trái Đất" },
  { ...DIAL, keys: ["aventurine"], display: "Aventurine", note: "MẶT SỐ thuỷ tinh aventurine lấp lánh như BẦU TRỜI SAO; tên từ 'a ventura' (tình cờ) tiếng Ý" },
  { ...DIAL, keys: ["onyx"], display: "Onyx", note: "MẶT SỐ đá ONYX (mã não) ĐEN tuyền bóng — đá quý tự nhiên" },
  { ...DIAL, keys: ["malachite"], display: "Malachite", note: "MẶT SỐ đá MALACHITE xanh lá vân sọc — đá bán quý" },
  { ...DIAL, keys: ["lapis", "lapis lazuli"], display: "Lapis Lazuli", note: "MẶT SỐ đá LAPIS LAZULI xanh dương đậm, điểm vàng pyrite" },
  { ...DIAL, keys: ["tiger eye", "tiger's eye", "tigereye"], display: "Tiger's Eye", note: "MẶT SỐ đá MẮT HỔ vân nâu-vàng óng ánh" },
  { ...DIAL, keys: ["opal"], display: "Opal", note: "MẶT SỐ đá OPAL ánh cầu vồng nhiều màu" },
  { ...DIAL, keys: ["turquoise"], display: "Turquoise", note: "MẶT SỐ đá NGỌC LAM (turquoise) xanh ngọc" },
  { ...DIAL, keys: ["jade"], display: "Jade", note: "MẶT SỐ đá NGỌC BÍCH (jade) xanh" },
  { ...DIAL, keys: ["grand feu", "grand-feu", "enamel"], display: "Grand Feu enamel", note: "MẶT SỐ men nung LỬA (Grand Feu) — màu bền vĩnh viễn, kỹ thuật thủ công đắt đỏ" },
  { ...DIAL, keys: ["wood dial", "wooden"], display: "Wood", note: "MẶT SỐ gỗ tự nhiên — vân gỗ độc nhất mỗi chiếc" },
  { ...DIAL, keys: ["carbon dial", "carbon fiber dial"], display: "Carbon dial", note: "MẶT SỐ sợi carbon vân vằn thể thao" },

  // ----- VÀNH (bezel) -----
  { ...BEZEL, keys: ["pepsi"], display: "Pepsi", note: "VÀNH 2 màu ĐỎ-XANH DƯƠNG (như lon Pepsi) — mặt số thường ĐEN" },
  { ...BEZEL, keys: ["batgirl"], display: "Batgirl", note: "VÀNH ĐEN-XANH DƯƠNG + dây Jubilee (cùng ref Batman)" },
  { ...BEZEL, keys: ["batman"], display: "Batman", note: "VÀNH ĐEN-XANH DƯƠNG — màu VÀNH (mặt số đen)" },
  { ...BEZEL, keys: ["coke"], display: "Coke", note: "VÀNH ĐỎ-ĐEN — màu VÀNH" },
  { ...BEZEL, keys: ["sprite"], display: "Sprite", note: "VÀNH ĐEN-XANH LÁ, núm bên TRÁI (destro) — màu VÀNH" },
  { ...BEZEL, keys: ["root beer", "rootbeer"], display: "Root Beer", note: "VÀNH NÂU-ĐEN (màu bia root beer) — màu VÀNH" },
  { ...BEZEL, keys: ["starbucks", "cermit"], display: "Starbucks", note: "VÀNH XANH LÁ GỐM (ceramic), mặt số đen — màu VÀNH" },
  { ...BEZEL, keys: ["kermit"], display: "Kermit", note: "VÀNH XANH LÁ NHÔM (aluminium), mặt số đen — màu VÀNH" },
  { ...BEZEL, keys: ["rainbow"], display: "Rainbow", note: "VÀNH nạm đá quý đủ màu cầu vồng — VÀNH" },
  { ...BEZEL, keys: ["lunette noire", " ln ", "'ln'"], display: "LN (Lunette Noire)", note: "VÀNH gốm ĐEN ('lunette noire' = vành đen tiếng Pháp)" },

  // ----- MẶT SỐ + VÀNH -----
  { ...BOTH, keys: ["hulk"], display: "Hulk", note: "MẶT SỐ xanh lá + VÀNH xanh lá (Submariner 'Hulk')" },
  { ...BOTH, keys: ["smurf"], display: "Smurf", note: "MẶT SỐ xanh dương + VÀNH xanh dương, vỏ vàng trắng" },
  { ...BOTH, keys: ["bluesy"], display: "Bluesy", note: "MẶT SỐ xanh + VÀNH xanh, vỏ THÉP-VÀNG (two-tone)" },

  // ----- VỎ / chất liệu (case) -----
  { ...CASE, keys: ["everose"], display: "Everose", note: "vàng HỒNG độc quyền Rolex — chất liệu VỎ, ít phai màu" },
  { ...CASE, keys: ["rolesium"], display: "Rolesium", note: "VỎ thép + VÀNH bạch kim (platinum) — riêng Yacht-Master" },
  { ...CASE, keys: ["rolesor", "two-tone", "two tone", "demi"], display: "Rolesor (two-tone)", note: "VỎ + dây THÉP pha VÀNG (Rolesor / two-tone) — KHÔNG phải màu mặt số" },
  { ...CASE, keys: ["pvd", "dlc"], display: "PVD / DLC", note: "lớp phủ ĐEN trên VỎ thép" },
  { ...CASE, keys: ["all black", "dark side", "grey side"], display: "All Black / Side of the Moon", note: "VỎ gốm ĐEN/XÁM toàn thân" },
  { ...CASE, keys: ["titanium", "titan"], display: "Titanium", note: "VỎ titan — nhẹ, ánh xám" },
  { ...CASE, keys: ["forged carbon", "carbon fiber", "carbon fibre", "tpt"], display: "Forged Carbon / Carbon TPT", note: "VỎ sợi carbon ép — siêu nhẹ, vân vằn độc nhất mỗi chiếc" },
  { ...CASE, keys: ["tantalum"], display: "Tantalum", note: "VỎ kim loại TANTALUM xám ánh xanh — hiếm, nặng, khó gia công" },
  { ...CASE, keys: ["bronze"], display: "Bronze", note: "VỎ ĐỒNG (bronze) — lên patina (xỉn màu) đẹp dần theo thời gian" },
  { ...CASE, keys: ["damascus", "damascene"], display: "Damascus steel", note: "VỎ thép Damascus vân nước (xếp lớp rèn)" },
  { ...CASE, keys: ["sedna"], display: "Sedna Gold", note: "vàng HỒNG độc quyền Omega (Sedna) — bền màu" },
  { ...CASE, keys: ["moonshine"], display: "Moonshine Gold", note: "vàng VÀNG nhạt độc quyền Omega (Moonshine)" },
  { ...CASE, keys: ["canopus"], display: "Canopus Gold", note: "vàng TRẮNG sáng độc quyền Omega (Canopus)" },

  // ----- KÍNH / KIM -----
  { ...GLASS, keys: ["z-green", "green sapphire"], display: "Z-Green sapphire", note: "KÍNH sapphire ánh XANH LÁ đặc trưng Milgauss (không phải màu mặt số)" },
  { ...HAND, keys: ["lightning"], display: "Lightning hand", note: "KIM giây hình TIA SÉT màu cam (Milgauss)" },
  { ...HAND, keys: ["ultraman"], display: "Ultraman", note: "KIM giây chrono màu CAM (Speedmaster Ultraman)" },

  // ----- DÂY (strap) -----
  { ...STRAP, keys: ["president"], display: "President", note: "tên DÂY (3 mắt bán nguyệt) đi cùng Day-Date — KHÔNG phải màu" },
  { ...STRAP, keys: ["oysterflex"], display: "Oysterflex", note: "DÂY cao su lõi kim loại (Oysterflex)" },
];

function hit(text: string, key: string): boolean {
  const k = norm(key);
  if (k.length <= 3) return new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`).test(text);
  return text.includes(k);
}

/** Tra ve cac dong giai thich "tên màu này thuộc bộ phận nào". */
export function colorBreakdown(w: Watch): ColorLine[] {
  const text = norm(`${w.colorEn ?? ""} · ${w.nickname ?? ""}`);
  if (!text.trim()) return [];

  const matched = DICT.filter((e) => e.keys.some((k) => hit(text, k)));
  if (!matched.length) return [];

  // Bo trung & bo cai bi BAO trong cai khac (vd "Panda" nam trong "Reverse Panda")
  const seen = new Set<string>();
  const out: ColorLine[] = [];
  for (const e of matched) {
    const dl = e.display.toLowerCase();
    if (seen.has(dl)) continue;
    const coveredByOther = matched.some(
      (o) => o !== e && o.display.toLowerCase() !== dl && o.display.toLowerCase().includes(dl),
    );
    if (coveredByOther) continue;
    seen.add(dl);
    out.push({ part: e.part, partEn: e.partEn, display: e.display, note: e.note });
  }
  return out;
}

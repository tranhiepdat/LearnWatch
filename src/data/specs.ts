import type { Watch } from "./types";

type Spec = Partial<Pick<Watch, "tier" | "movement" | "bezelEn" | "strapEn" | "movementNote">>;

/**
 * Thong so theo DONG (collection) - ap cho moi mau de hoc nhanh:
 * phan khuc, may (calibre), loai bezel & day bang tieng Anh, may dung chung.
 * Chi dien vao truong con TRONG (mau da co thi giu nguyen).
 */
export const COLLECTION_SPECS: Record<string, Spec> = {
  // ---------- ROLEX ----------
  Datejust: {
    tier: "Phổ thông cao cấp · Mainstream luxury (dễ đeo nhất)",
    movement: "Cal. 3235 (36/41mm)",
    movementNote: "Cal. 3235 dùng CHUNG với Submariner Date & Sea-Dweller",
    bezelEn: "Fluted or smooth bezel (white gold / steel)",
    strapEn: "Jubilee (5-link) or Oyster bracelet",
  },
  "Day-Date": {
    tier: "Đỉnh cao địa vị · Flagship (chỉ kim loại quý)",
    movement: "Cal. 3255",
    movementNote: "Cal. 3255 = bản 'cao cấp' của 3235 (thêm ngày + thứ)",
    bezelEn: "Fluted or smooth bezel (solid gold/platinum)",
    strapEn: "President bracelet (3-piece semi-circular)",
  },
  Submariner: {
    tier: "Icon thể thao lặn · rất phổ biến, dễ bán",
    movement: "Cal. 3235 (Date) / 3230 (No-Date)",
    movementNote: "3235 dùng chung Datejust/Sea-Dweller; 3230 = bản không lịch",
    bezelEn: "Cerachrom ceramic dive bezel (60-min, unidirectional)",
    strapEn: "Oyster bracelet (Glidelock clasp)",
  },
  "GMT-Master II": {
    tier: "Icon du lịch · 2 múi giờ, săn đón",
    movement: "Cal. 3285",
    movementNote: "Cal. 3285 dùng CHUNG với Explorer II (trữ cót 70h)",
    bezelEn: "Cerachrom 24-hour two-colour bezel",
    strapEn: "Jubilee or Oyster bracelet",
  },
  "Cosmograph Daytona": {
    tier: "Grail thể thao · cực khó mua, giữ giá",
    movement: "Cal. 4131 (đời mới) / 4130",
    movementNote: "Máy bấm giờ (chronograph) in-house, trữ cót 72h",
    bezelEn: "Cerachrom tachymeter bezel (steel) hoặc metal/diamond",
    strapEn: "Oyster bracelet or Oysterflex rubber",
  },
  "Sky-Dweller": {
    tier: "Cao cấp phức tạp · lịch năm + 2 múi giờ",
    movement: "Cal. 9002",
    bezelEn: "Fluted Ring Command bezel (xoay để cài đặt)",
    strapEn: "Oyster / Jubilee / Oysterflex",
  },
  "Land-Dweller": {
    tier: "MỚI NHẤT 2025 · đột phá kỹ thuật, hiếm",
    movement: "Cal. 7135 (Dynapulse escapement)",
    bezelEn: "Fluted bezel",
    strapEn: "Flat Jubilee bracelet (liền khối / integrated)",
  },
  Explorer: {
    tier: "Công cụ bền bỉ · giá MỀM nhất dòng Professional",
    movement: "Cal. 3230",
    bezelEn: "Smooth domed bezel",
    strapEn: "Oyster bracelet",
  },
  "Explorer II": {
    tier: "Công cụ GMT 24h · thám hiểm hang động",
    movement: "Cal. 3285",
    bezelEn: "Fixed stainless-steel 24-hour bezel",
    strapEn: "Oyster bracelet",
  },
  "Sea-Dweller": {
    tier: "Lặn chuyên sâu (1220m)",
    movement: "Cal. 3235",
    bezelEn: "Cerachrom dive bezel",
    strapEn: "Oyster bracelet (Glidelock + Fliplock)",
  },
  "Sea-Dweller Deepsea": {
    tier: "Lặn cực sâu (3900m) · 'quái vật'",
    movement: "Cal. 3235",
    bezelEn: "Cerachrom dive bezel + Ringlock case",
    strapEn: "Oyster bracelet (Fliplock extension)",
  },
  "Yacht-Master": {
    tier: "Thể thao sang du thuyền",
    movement: "Cal. 3235",
    bezelEn: "Bidirectional 60-min bezel (Cerachrom/platinum/gold)",
    strapEn: "Oyster bracelet or Oysterflex",
  },
  "Yacht-Master II": {
    tier: "Regatta phức tạp · bản lớn 44mm",
    movement: "Cal. 4161",
    bezelEn: "Ring Command regatta countdown bezel",
    strapEn: "Oyster bracelet",
  },
  "Oyster Perpetual": {
    tier: "NHẬP MÔN Rolex · không lịch, giá mềm nhất",
    movement: "Cal. 3230",
    bezelEn: "Smooth domed bezel",
    strapEn: "Oyster bracelet",
  },
  "Air-King": {
    tier: "Thể thao giá mềm · cảm hứng phi công",
    movement: "Cal. 3230",
    bezelEn: "Smooth bezel",
    strapEn: "Oyster bracelet",
  },
  Milgauss: {
    tier: "Chống từ trường · ĐÃ NGỪNG sản xuất (sưu tầm)",
    movement: "Cal. 3131 (lồng sắt non chống từ)",
    bezelEn: "Smooth bezel",
    strapEn: "Oyster bracelet",
  },

  // ---------- OMEGA ----------
  Speedmaster: {
    tier: "Icon 'Moonwatch' · lịch sử chinh phục Mặt Trăng",
    movement: "Cal. 3861 (Moonwatch) / 1861",
    movementNote: "3861 = Master Chronometer lên cót tay; bản cũ dùng 1861/321",
    bezelEn: "Tachymeter bezel (aluminium / ceramic)",
    strapEn: "Steel bracelet or strap",
  },
  Seamaster: {
    tier: "Thể thao lặn · đối thủ trực tiếp Submariner",
    movement: "Cal. 8800 / 8900 (Master Chronometer)",
    movementNote: "Master Chronometer (METAS) kháng từ 15.000 gauss",
    bezelEn: "Ceramic dive bezel (Aqua Terra: smooth, no rotate)",
    strapEn: "Steel bracelet / rubber / mesh",
  },
  Constellation: {
    tier: "Lịch lãm · 4 móng vuốt (griffes)",
    movement: "Cal. 8900 (Master Chronometer)",
    bezelEn: "Bezel khắc số La Mã + móng vuốt 3-9 giờ",
    strapEn: "Steel / two-tone bracelet",
  },
  "De Ville": {
    tier: "Dress watch thanh lịch · giá mềm trong nhà Omega",
    movement: "Cal. 8800 / 2500 (Co-Axial)",
    bezelEn: "Smooth round bezel",
    strapEn: "Leather strap",
  },

  // ---------- TAG HEUER ----------
  Carrera: {
    tier: "Chronograph đua xe biểu tượng (từ 1963)",
    movement: "Cal. Heuer 02 (in-house, 80h)",
    movementNote: "Heuer 02 dùng chung nhiều bản Carrera; bản rẻ dùng máy ETA/Sellita",
    bezelEn: "Tachymeter or ceramic bezel",
    strapEn: "Steel bracelet / rubber",
  },
  Monaco: {
    tier: "Icon VUÔNG Steve McQueen",
    movement: "Cal. Heuer 02 (skeleton) / 11 (cổ điển)",
    bezelEn: "Smooth square bezel (núm vặn bên trái)",
    strapEn: "Leather strap / steel bracelet",
  },
  Aquaracer: {
    tier: "Lặn thể thao · giá tốt, bền",
    movement: "Cal. 5 (nền ETA/Sellita)",
    bezelEn: "12-sided ceramic dive bezel",
    strapEn: "Steel bracelet / rubber",
  },
  "Formula 1": {
    tier: "NHẬP MÔN Thụy Sĩ · RẺ NHẤT của TAG, hợp người mới",
    movement: "Quartz (pin) hoặc Cal. 16 (automatic)",
    bezelEn: "Tachymeter bezel",
    strapEn: "Steel bracelet / rubber",
  },

  // ---------- CARTIER ----------
  Tank: {
    tier: "Icon dress VUÔNG · thanh lịch vượt thời gian",
    movement: "Quartz (pin) hoặc Cal. 1847 MC (automatic)",
    bezelEn: "Brushed flat bezel (không xoay)",
    strapEn: "Leather strap (kim 'blued steel')",
  },

  // ---------- HUBLOT ----------
  "Big Bang": {
    tier: "Icon hiện đại phá cách · 'Art of Fusion'",
    movement: "Cal. Unico (in-house) / HUB",
    movementNote: "Unico = máy in-house lộ cơ; bản rẻ dùng HUB (nền Sellita)",
    bezelEn: "6-screw bezel (ceramic / gold / titanium)",
    strapEn: "Rubber strap (lắp nhanh 'one-click')",
  },
  "Square Bang": {
    tier: "Bản VUÔNG mới · góc cạnh, sci-fi",
    movement: "Cal. Unico (in-house)",
    bezelEn: "6-screw SQUARE bezel",
    strapEn: "Rubber strap",
  },
  "Spirit of Big Bang": {
    tier: "Bản TONNEAU (thùng tô-nô) · phá cách",
    movement: "Cal. Unico / HUB",
    bezelEn: "6-screw tonneau bezel",
    strapEn: "Rubber strap",
  },
  "Classic Fusion": {
    tier: "Dòng MỎNG · dễ đeo, RẺ HƠN Big Bang",
    movement: "Cal. HUB1100 / 1110 (nền Sellita)",
    bezelEn: "Smooth bezel + ốc vít",
    strapEn: "Rubber / leather strap",
  },

  // ---------- FASHION ----------
  "Mega Chief": {
    tier: "FASHION (giá rẻ) · KHÔNG phải đồng hồ Thụy Sĩ",
    movement: "Quartz (pin) Nhật/TQ",
    bezelEn: "Fixed steel bezel",
    strapEn: "Steel bracelet / leather",
  },
  Museum: {
    tier: "Thiết kế biểu tượng (MoMA) · giá phổ thông",
    movement: "Quartz Thuỵ Sĩ",
    bezelEn: "Smooth slim bezel",
    strapEn: "Leather strap / mesh",
  },

  // ---------- TUDOR ----------
  "Black Bay": {
    tier: "Lặn cổ điển · GIÁ TRỊ/TIỀN tuyệt vời ('em ruột' Rolex)",
    movement: "Cal. MT5602 (in-house, trữ cót 70h, COSC)",
    movementNote: "Tudor = thương hiệu em của Rolex, máy in-house riêng",
    bezelEn: "Aluminium / ceramic dive bezel",
    strapEn: "Steel bracelet / leather / fabric (NATO)",
  },
  "Black Bay Chrono": {
    tier: "Chronograph thể thao · giá tốt bất ngờ",
    movement: "Cal. MT5813 (nền Breitling B01, COSC)",
    bezelEn: "Tachymeter bezel",
    strapEn: "Steel bracelet / fabric",
  },

  // ---------- IWC ----------
  "Pilot's Watch": {
    tier: "Đồng hồ PHI CÔNG · kỹ thuật chắc chắn (Thuỵ Sĩ)",
    movement: "Cal. 69385 (chrono) / dòng 32xxx",
    bezelEn: "Smooth bezel",
    strapEn: "Rubber / leather / steel (EasX-CHANGE)",
  },
  Ingenieur: {
    tier: "Thể thao sang dây liền khối · chống từ",
    movement: "Cal. 32111 (in-house, 120h)",
    movementNote: "Thiết kế bởi Gérald Genta (cùng cha đẻ Royal Oak & Nautilus)",
    bezelEn: "Smooth bezel có 5 ốc",
    strapEn: "Integrated steel bracelet (liền khối)",
  },

  // ---------- AUDEMARS PIGUET ----------
  "Royal Oak": {
    tier: "Grail thể thao xa xỉ · PREMIUM cực cao, khó mua",
    movement: "Cal. 4302 / 7121 (in-house)",
    movementNote: "Gérald Genta thiết kế 1972 — khai sinh dòng 'luxury sports watch'",
    bezelEn: "Octagonal bezel + 8 ốc lục giác lộ",
    strapEn: "Integrated steel bracelet (liền khối)",
  },
  "Royal Oak Offshore": {
    tier: "Bản LỚN & hầm hố hơn Royal Oak · thể thao mạnh",
    movement: "Cal. 4401 (chronograph in-house)",
    bezelEn: "Octagonal bezel + ốc, 'Méga Tapisserie'",
    strapEn: "Rubber strap / integrated bracelet",
  },

  // ---------- PATEK PHILIPPE ----------
  Nautilus: {
    tier: "GRAIL đỉnh cao · huyền thoại cực khó mua",
    movement: "Cal. 26-330 / 324 (in-house)",
    movementNote: "Gérald Genta thiết kế 1976; Patek là 'vua' chế tác Thuỵ Sĩ",
    bezelEn: "Bezel dáng 'lỗ tàu' (rounded octagon)",
    strapEn: "Integrated steel bracelet (liền khối)",
  },

  // ---------- CARTIER (bổ sung) ----------
  Santos: {
    tier: "Icon VUÔNG phi công · thanh lịch thể thao (từ 1904)",
    movement: "Cal. 1847 MC (in-house, automatic)",
    bezelEn: "Square bezel với ốc vít lộ",
    strapEn: "Steel bracelet (QuickSwitch) / leather (SmartLink)",
  },

  // ---------- ROLEX (bổ sung) ----------
  "Perpetual 1908": {
    tier: "Dress watch MỎNG mới · đeo dây da (khác chất thể thao)",
    movement: "Cal. 7140 (in-house, đáy lộ máy, 66h)",
    bezelEn: "Slim domed bezel",
    strapEn: "Leather strap (khoá Dualclasp)",
  },
};

/** Dien thong so theo dong vao cac mau (chi dien truong con trong). */
export function applyCollectionSpecs(list: Watch[]): void {
  for (const w of list) {
    const s = COLLECTION_SPECS[w.collection];
    if (!s) continue;
    (Object.keys(s) as (keyof Spec)[]).forEach((k) => {
      if (w[k] === undefined && s[k] !== undefined) {
        (w as unknown as Record<string, unknown>)[k] = s[k];
      }
    });
  }
}

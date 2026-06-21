export type Brand =
  | "Rolex"
  | "Omega"
  | "TAG Heuer"
  | "Cartier"
  | "Hublot"
  | "Tudor"
  | "IWC"
  | "Audemars Piguet"
  | "Patek Philippe"
  | "Diesel"
  | "Movado";

export type Topic = "nickname" | "material" | "model";

export interface Watch {
  /** slug duy nhat - cung la ten file anh: /public/watches/<id>.jpg */
  id: string;
  brand: Brand;
  /** Dong san pham, vd "GMT-Master II", "Submariner" */
  collection: string;
  /** Ten goi day du de hien tren the */
  model: string;
  /** Bien danh dan choi, vd "Pepsi" */
  nickname?: string;
  /** Vi sao co bien danh do */
  nicknameMeaning?: string;
  /** Ma tham chieu (reference) */
  reference?: string;
  /** Cac chat lieu chinh */
  materials: string[];
  /** Mau vanh bezel (1 mau = solid, 2 mau = chia doi) de ve visual */
  bezelColors?: string[];
  /** Mau mat so */
  dialColor?: string;
  /** Mau vo (case) - anh huong toi visual */
  caseColor?: "steel" | "yellowgold" | "rosegold" | "whitegold" | "platinum" | "titanium" | "blackceramic";
  caseSize?: string;
  movement?: string;
  year?: string;
  /** Cac y chinh de sale noi voi khach */
  facts: string[];
  /** 1 cau "wow" de gay an tuong */
  funFact?: string;
  /** Ghi de duong dan anh neu khac mac dinh */
  image?: string;
  /** Ten mau dac biet trong tieng Anh (vd "Wimbledon", "Tiffany", "Stelline") */
  colorEn?: string;
  /** Khoang gia resale tham khao (de sale tieng Anh) */
  resale?: string;
  /** Thuat ngu thi truong / tieng Anh lien quan */
  marketTerms?: string;
  /** Meo nho nhanh (de hoc/ban) */
  tip?: string;
  /** Phan khuc / dinh vi: vd "Nhap mon", "Pho thong", "Cao cap", "Grail" */
  tier?: string;
  /** Loai vanh (bezel) - tieng Anh */
  bezelEn?: string;
  /** Loai + chat lieu day - tieng Anh */
  strapEn?: string;
  /** Ghi chu may / dung chung movement */
  movementNote?: string;
}

export type TermCategory =
  | "Chất liệu"
  | "Công nghệ"
  | "Dây đeo & khóa"
  | "Bộ máy"
  | "Chứng nhận"
  | "Tên màu (EN)"
  | "Thuật ngữ EN"
  | "Thị trường & giá"
  | "Xưởng & Máy";

export interface Term {
  id: string;
  brand: Brand | "Chung";
  term: string;
  category: TermCategory;
  /** Giai thich ngan gon de nho */
  short: string;
  /** Giai thich day du de ban hieu sau */
  detail: string;
}

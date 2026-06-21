import type { Brand } from "./types";

/**
 * Thong tin & dac trung theo DONG (collection): dong nay DE LAM GI, nhan dien
 * the nao, lich su, bien the, dinh vi gia, ban cho ai. Hien o moi tab de hoc & ban.
 */
export interface CollectionInfo {
  collection: string;
  brand: Brand;
  /** Dinh vi 1 cau (chip) */
  tagline: string;
  /** Dong nay DE LAM GI + cach dung (2-3 cau) */
  purpose: string;
  /** Dac trung nhan dien (4-5 y) */
  signature: string[];
  /** Lich su / nam ra doi / cau chuyen (chi tiet) */
  heritage: string;
  /** Cac bien the / ref / doi nen biet */
  variants?: string;
  /** Dinh vi gia / cach giu gia / resale */
  priceNote?: string;
  /** Hop ai / cach tu van - chot sale */
  forWho: string;
  /** Thuat ngu tieng Anh gan voi dong */
  terms?: string;
}

const LIST: CollectionInfo[] = [
  // ============== ROLEX ==============
  {
    collection: "Submariner",
    brand: "Rolex",
    tagline: "Đồng hồ LẶN biểu tượng",
    purpose:
      "Sinh ra để LẶN BIỂN: vành xoay 1 chiều 60 phút giúp thợ lặn canh thời gian còn dưỡng khí — xoay vạch tam giác về vị trí kim phút lúc xuống nước, đọc số phút đã trôi trên vành. Chống nước 300m, dạ quang Chromalight sáng xanh 8 tiếng. Thực tế giờ là chiếc 'đa năng' đeo được cả đi biển lẫn công sở.",
    signature: [
      "Vành lặn gốm Cerachrom xoay 1 chiều (đếm ngược an toàn)",
      "Cọc số tròn/que to phủ dạ quang Chromalight",
      "Kim 'Mercedes' đặc trưng Rolex thể thao",
      "Dây Oyster khoá Glidelock chỉnh dài không cần dụng cụ",
      "Bản Date có cửa sổ ngày + Cyclops; bản No-Date mặt sạch",
    ],
    heritage:
      "Ra mắt 1953 — chiếc lặn chống nước 100m thương mại đầu tiên, đặt CHUẨN cho mọi đồng hồ lặn sau này. James Bond đeo bản đầu thập ni 60. Qua 70 năm thiết kế gần như không đổi → minh chứng 'thiết kế đúng ngay từ đầu'.",
    variants:
      "No-Date (124060, mặt sạch, rẻ hơn) · Date (126610LN đen, 126610LV 'Starbucks' vành xanh) · Hulk (116610LV xanh toàn bộ, đã ngừng) · Smurf/Bluesy (vàng trắng/two-tone) · Kermit (vành xanh mặt đen 50 năm).",
    priceNote:
      "Bản thép luôn 'khó mua hơn giá niêm yết', resale cao hơn list 10-40%. No-Date là cửa vào mềm nhất. Two-tone/vàng giữ giá kém hơn thép.",
    forWho:
      "Người mê thể thao/biển hoặc muốn 1 chiếc Rolex 'làm tất'. Dễ bán nhất, ai cũng nhận ra, giữ giá tốt. Chốt sale: 'icon không bao giờ lỗi mốt'.",
    terms: "Dive bezel · unidirectional · Cerachrom · Chromalight · 300m water-resistant",
  },
  {
    collection: "GMT-Master II",
    brand: "Rolex",
    tagline: "Đồng hồ 2 MÚI GIỜ (du lịch/phi công)",
    purpose:
      "Xem CÙNG LÚC 2–3 múi giờ. Kim GMT (mũi tên) chạy 1 vòng/24 giờ, đọc trên vành 24h hai màu phân biệt ngày/đêm: chỉnh kim GMT về giờ quê nhà, kim giờ chính chỉnh nhảy theo nấc 1h sang giờ địa phương khi tới nơi. Muốn xem múi thứ 3 thì xoay vành. Sinh ra cho phi công bay xuyên lục địa.",
    signature: [
      "Vành 24h hai màu (Pepsi đỏ-xanh, Batman đen-xanh, Coke đỏ-đen, Root Beer nâu-đen)",
      "Kim GMT mũi tên màu khác biệt",
      "Vành gốm Cerachrom đúc 2 màu — kỹ thuật khó bậc nhất",
      "Bản 'Sprite' núm bên trái (destro) cho người thuận tay trái",
      "Dây Jubilee (mềm, sang) hoặc Oyster (thể thao)",
    ],
    heritage:
      "1955 hợp tác hãng bay Pan Am để phi công biết giờ quê nhà khi bay đường dài. 'Pepsi' là vành đầu tiên. Đời II (GMT-Master II) cho chỉnh kim giờ độc lập, tiện hơn nhiều khi đổi múi giờ.",
    variants:
      "126710BLRO Pepsi · 126710BLNR Batman · 126711/126715 two-tone & vàng Root Beer · 126710 'Sprite' núm trái mặt xanh lá · bản đá quý/vàng cao cấp.",
    priceNote:
      "Bản thép Pepsi/Batman cực săn, resale trên list. Vành 2 màu khó làm nên đắt hơn Submariner. Root Beer vàng/two-tone hợp khách thích nổi.",
    forWho:
      "Người hay bay/đi nước ngoài, hoặc thích vành hai màu nổi bật. Chốt sale: '2 múi giờ + món sưu tầm khó mua'.",
    terms: "GMT hand · 24-hour bezel · dual time · BLRO/BLNR · destro",
  },
  {
    collection: "Datejust",
    brand: "Rolex",
    tagline: "Rolex KINH ĐIỂN, đeo mọi lúc",
    purpose:
      "Đồng hồ lịch để đeo HÀNG NGÀY/đi làm: xem giờ + ngày, lịch lãm mà không phô trương. Ngày tự nhảy tức thì lúc nửa đêm; kính lúp Cyclops phóng to số ngày 2,5 lần cho dễ đọc. Vô vàn lựa chọn cỡ-mặt-dây nên hợp gần như mọi người.",
    signature: [
      "Cửa sổ ngày ở 3h + kính lúp Cyclops",
      "Vành khía (fluted) vàng trắng — dấu hiệu Datejust kinh điển",
      "Dây Jubilee 5 mắt (gắn liền với Datejust) hoặc Oyster",
      "Nhiều mặt số: Wimbledon (số La Mã xanh), Palm, Mint, Sundust…",
      "Cỡ đa dạng 28 / 31 / 36 / 41mm",
    ],
    heritage:
      "1945 — đồng hồ đeo tay TỰ ĐỘNG đầu tiên có cửa sổ ngày nhảy tức thì, ra mắt mừng Rolex 40 tuổi. 'Datejust' = 'date' + nhảy 'just' đúng nửa đêm. Đã là Rolex bán chạy nhất nhiều thập kỷ.",
    variants:
      "36mm cổ điển · 41mm hiện đại (126300/126334) · 31/28mm nữ · Two-tone Rolesor (thép-vàng) · mặt Wimbledon/Palm/Floral · vành fluted/smooth/nạm kim cương.",
    priceNote:
      "Cửa vào Rolex 'mặc vest' mềm nhất sau Oyster Perpetual. Two-tone hợp khách thích vàng mà ngân sách vừa. Mặt số hiếm (Wimbledon, Palm) được săn hơn.",
    forWho:
      "Người mới chơi Rolex, dân văn phòng, cả nam lẫn nữ. Linh hoạt nhất — luôn có một cấu hình hợp khách. Chốt sale: 'một chiếc đeo được 30 năm, mọi dịp'.",
    terms: "Date window · Cyclops · Jubilee · fluted bezel · Rolesor",
  },
  {
    collection: "Day-Date",
    brand: "Rolex",
    tagline: "ĐỈNH địa vị (President)",
    purpose:
      "Khẳng định ĐẲNG CẤP & địa vị: là chiếc duy nhất hiện đầy đủ THỨ trong tuần viết NGUYÊN CHỮ (ô vòng cung ở 12h) + NGÀY ở 3h. CHỈ làm bằng vàng 18k hoặc bạch kim — không bao giờ có thép. Đi cùng dây 'President' đặc trưng.",
    signature: [
      "Vòng cung chữ THỨ (đầy đủ) ở 12h — hơn 20 ngôn ngữ",
      "Ngày ở 3h + kính lúp Cyclops",
      "Dây President 3 mắt bán nguyệt (chỉ riêng Day-Date & một số Datejust)",
      "Luôn vàng/bạch kim — chất liệu quý",
      "Mặt số đa dạng: ombré, đá thiên thạch, nạm kim cương…",
    ],
    heritage:
      "1956 — chiếc đầu tiên hiện thứ bằng chữ trọn vẹn. Gắn với nhiều tổng thống & lãnh đạo (Eisenhower, Kennedy…) nên có biệt danh 'President'. Là đỉnh tháp dòng cổ điển của Rolex.",
    variants:
      "DD36 (228238 vàng vàng, 228206 platinum mặt ice blue) · DD40 bản lớn · mặt thiên thạch/onyx/ombré · nạm kim cương full.",
    priceNote:
      "Luôn là kim loại quý nên giá KHỞI ĐIỂM cao (gấp nhiều lần Datejust). Bản platinum ice blue là 'kín tiếng mà đỉnh'. Giữ giá tốt ở bản phổ biến.",
    forWho:
      "Khách thành đạt, doanh nhân, muốn món biểu tượng quyền lực kín đáo. Chốt sale: 'đồng hồ của các nguyên thủ — đẳng cấp không cần nói'.",
    terms: "President bracelet · day display · full calendar · ice blue (platinum)",
  },
  {
    collection: "Cosmograph Daytona",
    brand: "Rolex",
    tagline: "Chronograph ĐUA XE (grail)",
    purpose:
      "BẤM GIỜ đua xe: nút trên start/stop, nút dưới reset; 3 mặt phụ đếm giây/phút/giờ. Vành Tachymeter quanh mặt đo TỐC ĐỘ trung bình — chạy đủ 1 km/dặm rồi đọc số trên vành ra km/h. Kim giây lớn ở giữa chỉ chạy khi bấm giờ.",
    signature: [
      "3 mặt phụ (sub-dials) ở 3/6/9",
      "Vành Tachymeter (gốm Cerachrom hoặc kim loại)",
      "2 nút bấm chrono vặn vít chống nước",
      "Mặt 'Panda' (trắng mặt phụ đen) hoặc ngược lại",
      "Dây Oyster hoặc Oysterflex cao su (bản vàng)",
    ],
    heritage:
      "1963, đặt theo trường đua Daytona (Florida). Bản 'Paul Newman' (mặt exotic) do tài tử đeo, từng đấu giá 17,8 triệu USD — đắt nhất lịch sử đồng hồ đeo tay. Là grail mơ ước của giới sưu tầm.",
    variants:
      "126500LN thép vành gốm (panda/đen) · vàng vàng/hồng/trắng dây Oysterflex · platinum mặt ice blue 126506 · bản nạm đá 'Rainbow' · mặt thiên thạch.",
    priceNote:
      "Bản thép GẦN NHƯ không mua được theo list — chênh chợ đen rất cao, giữ giá số 1. Vàng dễ mua hơn. Rainbow/platinum là đỉnh.",
    forWho:
      "Người mê tốc độ/đua xe, dân sưu tầm, khách muốn 'món khó mua nhất'. Chốt sale: 'huyền thoại giữ giá số 1, càng để càng có giá'.",
    terms: "Chronograph · tachymeter · sub-dials · pushers · Paul Newman",
  },
  {
    collection: "Sky-Dweller",
    brand: "Rolex",
    tagline: "Du lịch + LỊCH NĂM thông minh",
    purpose:
      "Cho người đi nhiều & bận rộn: xem 2 múi giờ qua ĐĨA 24h lệch tâm ở giữa mặt, cùng LỊCH NĂM (annual calendar) tự biết tháng đủ 30 hay 31 ngày — chỉ phải chỉnh ngày 1 LẦN/NĂM (cuối tháng 2). 12 ô nhỏ quanh mặt báo tháng. Cài đặt nhanh bằng vành Ring Command xoay.",
    signature: [
      "Đĩa 24h lệch tâm (off-centre) = múi giờ thứ 2",
      "12 ô tháng quanh mặt số (ô sáng = tháng hiện tại)",
      "Vành Ring Command xoay để chọn chế độ chỉnh",
      "Cửa sổ ngày ở 3h",
      "Vỏ to 42mm, có thép/two-tone/vàng",
    ],
    heritage:
      "2012 — đồng hồ phức tạp nhất do Rolex TỰ phát triển, với nhiều bằng sáng chế (lịch Saros, Ring Command). Đưa Rolex vào nhóm 'phức tạp' mà vẫn bền-dễ dùng.",
    variants:
      "326934 thép vành fluted trắng · two-tone Rolesor (mặt xanh/champagne) · vàng vàng/hồng dây Oysterflex · mặt teak vân dọc.",
    priceNote:
      "Định vị cao cấp-phức tạp, đắt hơn nhiều Datejust. Bản thép/two-tone dễ tiếp cận hơn vàng. Giữ giá khá.",
    forWho:
      "Doanh nhân hay công tác, thích công nghệ & tiện. Chốt sale: 'lịch năm thông minh, cả năm chỉ chỉnh 1 lần'.",
    terms: "Annual calendar · dual time · Ring Command bezel · Saros",
  },
  {
    collection: "Land-Dweller",
    brand: "Rolex",
    tagline: "MỚI NHẤT 2025 · đột phá kỹ thuật",
    purpose:
      "Dòng thể thao sang dây LIỀN KHỐI (integrated) mới ra: khoe bộ thoát Dynapulse hoàn toàn mới (chạy hiệu quả hơn), mặt số vân tổ ong, đáy lộ máy. Là tuyên ngôn 'Rolex vẫn dẫn đầu kỹ thuật'.",
    signature: [
      "Dây Jubilee DẸT liền khối (integrated bracelet)",
      "Bộ thoát Dynapulse (high-frequency) mới",
      "Mặt vân tổ ong honeycomb",
      "Vành fluted quen thuộc nhưng dáng thể thao mỏng",
      "Đáy lộ máy ngắm cơ",
    ],
    heritage:
      "Ra mắt 2025 — dòng HOÀN TOÀN MỚI đầu tiên sau nhiều năm, đánh dấu hướng đi 'luxury sports watch dây liền khối' của Rolex, cạnh tranh trực diện Royal Oak/Nautilus.",
    priceNote: "Vừa ra nên KHAN hàng, premium cao. Bản thép được săn nhất; sẽ là tâm điểm sưu tầm vài năm tới.",
    forWho:
      "Khách thích đồ mới-hiếm, mê kỹ thuật, đã có vài chiếc cơ bản. Chốt sale: 'dòng mới nhất, công nghệ chưa từng có'.",
    terms: "Integrated bracelet · Dynapulse escapement · honeycomb dial",
  },
  {
    collection: "Explorer",
    brand: "Rolex",
    tagline: "Công cụ LEO NÚI, giá mềm",
    purpose:
      "Đồng hồ bền-đọc-nhanh cho thám hiểm: mặt đen cực sạch, số 3-6-9 + cọc que phủ dạ quang đậm, không lịch, không rườm rà — liếc là biết giờ trong mọi điều kiện. Tinh thần 'tool watch' nguyên bản, đeo hằng ngày rất gọn.",
    signature: [
      "Mặt đen với số 3-6-9 nổi bật",
      "Vành trơn (smooth) mỏng",
      "Cỡ gọn 36mm (cổ điển) hoặc 40mm",
      "Không cửa sổ ngày — mặt tối giản",
      "Dây Oyster chắc chắn",
    ],
    heritage:
      "1953 — ra mắt đúng dịp đoàn Hillary & Tenzing chinh phục đỉnh Everest, mang tinh thần chinh phục. Là một trong những 'tool watch' thuần tuý nhất của Rolex.",
    variants: "124270 (36mm) · 224270 (40mm) · bản two-tone vàng-thép mới (cho người thích lấp lánh hơn).",
    priceNote:
      "Một trong những Rolex thể thao MỀM nhất → 'cửa ngõ' lý tưởng. Bản thép 36/40 dễ mua hơn Sub/GMT.",
    forWho:
      "Người thích tối giản, cổ tay nhỏ-vừa, ngân sách mềm nhất nhóm Professional. Chốt sale: 'Rolex thể thao dễ sở hữu nhất, đẹp bền vô thời hạn'.",
    terms: "Tool watch · 3-6-9 dial · Everest",
  },
  {
    collection: "Explorer II",
    brand: "Rolex",
    tagline: "24h phân biệt NGÀY/ĐÊM",
    purpose:
      "Cho thợ thám hiểm HANG ĐỘNG/vùng cực (nơi không thấy mặt trời): kim 24h màu cam chạy 1 vòng/ngày, đối chiếu vành thép CỐ ĐỊNH khắc 24h để biết đang sáng hay tối. Cũng dùng như múi giờ thứ 2. Mặt to, dạ quang mạnh.",
    signature: [
      "Kim 24h màu CAM nổi bật",
      "Vành thép 24h CỐ ĐỊNH (không xoay)",
      "Bản 'Polar' mặt trắng & bản mặt đen",
      "Vỏ to 42mm thể thao",
      "Số 3-6-9 kiểu Explorer",
    ],
    heritage:
      "1971 — thiết kế cho dân speleology (thám hiểm hang động) và vùng cực. Ref 1655 'Steve McQueen' đời đầu nay là món sưu tầm.",
    variants: "226570 Polar (trắng) / mặt đen · đời cũ 216570 / 16570.",
    priceNote: "Giá tốt trong nhóm thể thao (rẻ hơn GMT/Sub bản hot). Polar trắng được ưa hơn, dễ nhận diện.",
    forWho:
      "Người thích chất tool-watch hầm hố, mặt to nam tính, ngân sách vừa. Chốt sale: 'mặt to dễ đọc, 24h tiện như GMT mà giá mềm hơn'.",
    terms: "24-hour hand · fixed bezel · Polar dial",
  },
  {
    collection: "Sea-Dweller",
    brand: "Rolex",
    tagline: "Lặn CHUYÊN SÂU (1220m)",
    purpose:
      "Lặn bão hoà chuyên nghiệp: chịu sâu 1220m (gấp 4 lần Submariner) nhờ vỏ dày & van xả khí Heli (helium escape valve) tự nhả khí trong buồng giảm áp để kính không bị bung. Là công cụ thật cho thợ lặn công nghiệp.",
    signature: [
      "Van thoát Heli (helium escape valve) ở 9h",
      "Vỏ dày, kính sapphire chịu áp lực lớn",
      "Vành lặn Cerachrom 60 phút",
      "Có Cyclops (bản mới) — khác bản cổ không Cyclops",
      "Dạ quang Chromalight mạnh",
    ],
    heritage:
      "1967, phát triển cùng COMEX (công ty lặn Pháp) cho thợ lặn bão hoà ở độ sâu lớn. Van Heli là phát minh giải bài toán kính bung khi giảm áp.",
    variants: "126600 (43mm, có Cyclops) · bản cổ 'Single Red'/COMEX là grail sưu tầm.",
    priceNote: "Đắt hơn Submariner, kén người vì to-nặng. Bản COMEX cổ giá rất cao.",
    forWho:
      "Khách mê đồ 'trâu bò' chịu nước cực sâu, cổ tay to. Chốt sale: 'phiên bản lặn chuyên nghiệp, bền hơn cả nhu cầu thật'.",
    terms: "Saturation diving · helium escape valve · 1220m · COMEX",
  },
  {
    collection: "Sea-Dweller Deepsea",
    brand: "Rolex",
    tagline: "'QUÁI VẬT' lặn 3900m",
    purpose:
      "Lặn CỰC SÂU 3900m: dùng hệ vỏ Ringlock (vòng thép chịu lực + kính dày + đáy titan) để chống áp suất khủng khiếp. To, dày, nặng — một tuyên ngôn kỹ thuật hơn là nhu cầu thực.",
    signature: [
      "Hệ vỏ Ringlock System",
      "Bản D-Blue 'James Cameron' mặt chuyển xanh→đen",
      "Van thoát Heli + đáy titan",
      "Rất dày & nặng (44mm+)",
      "Dây Oyster có khoá giãn Fliplock",
    ],
    heritage:
      "Bản D-Blue tôn vinh chuyến lặn ĐƠN ĐỘC xuống rãnh Mariana sâu 10.908m của đạo diễn James Cameron năm 2012 (mặt số chuyển màu mô phỏng độ sâu).",
    variants: "136660 (mới, 44mm) D-Blue / đen · bản vàng vàng 'gold Deepsea' mới.",
    priceNote: "Định vị statement piece, đắt & kén. Bản D-Blue dễ nhận diện, được ưa.",
    forWho:
      "Khách thích to-nặng-độc, thích câu chuyện chinh phục. Kén cổ tay nhỏ. Chốt sale: 'kỳ quan kỹ thuật, lặn sâu nhất'.",
    terms: "Ringlock System · 3900m · D-Blue · James Cameron",
  },
  {
    collection: "Yacht-Master",
    brand: "Rolex",
    tagline: "Thể thao sang DU THUYỀN",
    purpose:
      "Phong cách biển hạng sang (hơn là lặn sâu): vành xoay 2 CHIỀU 60 phút số nổi để canh giờ chèo/đua nhẹ. Chất liệu quý + dây cao su Oysterflex trẻ trung. Đeo đi du thuyền, nghỉ dưỡng.",
    signature: [
      "Vành 2 chiều số NỔI (Cerachrom/platinum/vàng)",
      "Bản Rolesium: thép + vành PLATINUM mặt rhodium",
      "Dây Oysterflex cao su lõi kim loại",
      "Mặt đa dạng, có bản đảo màu",
      "Cỡ 37/40/42mm",
    ],
    heritage:
      "1992 — 'em sang chảnh' của Submariner, thiên về thời trang biển hơn lặn chuyên dụng. Rolesium (thép-platinum) là chất liệu đặc trưng riêng.",
    variants: "126622 Rolesium · 226658 vàng vàng 42mm Oysterflex · 268621 two-tone · bản 37mm cho cổ tay nhỏ.",
    priceNote: "Định vị thể thao-sang, giá trên Submariner ở bản quý. Oysterflex hợp khách trẻ.",
    forWho:
      "Khách thích chất thể thao nhưng bóng bẩy, đeo dây cao su năng động. Chốt sale: 'thể thao mà vẫn sang, hợp nghỉ dưỡng'.",
    terms: "Bidirectional bezel · Oysterflex · Rolesium · raised numerals",
  },
  {
    collection: "Yacht-Master II",
    brand: "Rolex",
    tagline: "ĐẾM NGƯỢC đua thuyền (regatta)",
    purpose:
      "Chuyên đua DU THUYỀN: bộ đếm ngược 1–10 phút LẬP TRÌNH ĐƯỢC, có cơ chế 'bộ nhớ' đồng bộ với tiếng còi xuất phát, giúp canh vạch start chuẩn. Vành Ring Command xoay để lập trình. Bản lớn, phức tạp.",
    signature: [
      "Bộ đếm ngược regatta lập trình (kim trung tâm + cung màu)",
      "Vành Ring Command tương tác với máy",
      "Vỏ LỚN 44mm",
      "Mặt thể thao nhiều màu",
      "Chỉ bản cỡ lớn",
    ],
    heritage:
      "2007 — đồng hồ regatta CƠ KHÍ có bộ nhớ lập trình, một màn phô diễn kỹ thuật của Rolex.",
    variants: "116681 two-tone · 116688 vàng vàng · 116680 thép.",
    priceNote: "Kén khách vì to & chuyên dụng → thường giảm giá trên thị trường second-hand. Cơ hội cho người thích phức tạp giá tốt.",
    forWho:
      "Khách mê du thuyền hoặc thích cỗ máy phức tạp, cổ tay to. Chốt sale: 'regatta đếm ngược — kỹ thuật độc'.",
    terms: "Programmable countdown · regatta · Ring Command",
  },
  {
    collection: "Oyster Perpetual",
    brand: "Rolex",
    tagline: "NHẬP MÔN Rolex",
    purpose:
      "Rolex thuần khiết nhất: CHỈ giờ-phút-giây, KHÔNG lịch, không phức tạp — toàn bộ tinh tuý 'Oyster chống nước' + 'Perpetual tự động' trong form gọn. Nổi tiếng các mặt số MÀU vui nhộn (turquoise, hồng, vàng, xanh lá).",
    signature: [
      "Không cửa sổ ngày — mặt cực sạch",
      "Vành trơn mảnh",
      "Mặt màu kẹo (Tiffany turquoise, candy pink, coral, green)",
      "Cỡ 28/31/34/36/41mm",
      "Dây Oyster",
    ],
    heritage:
      "Kế thừa hai phát minh nền tảng: vỏ 'Oyster' chống nước 1926 (chiếc chống nước đầu tiên) và cơ chế tự lên dây 'Perpetual' 1931. Là gốc rễ của mọi Rolex.",
    variants: "124300 (41mm) các mặt màu · 277200/276200 cỡ nhỏ · bản 'Celebration' bong bóng nhiều màu (rất hot).",
    priceNote:
      "Rolex giá KHỞI ĐIỂM mềm nhất → cửa vào tốt nhất. Mặt màu hiếm (turquoise, Celebration) bị săn lùng, resale cao bất ngờ.",
    forWho:
      "Người mới, ngân sách mềm, thích màu trẻ trung; bán rất chạy cho khách nữ/trẻ. Chốt sale: 'Rolex thật, giá dễ thở nhất, màu cực trendy'.",
    terms: "Time-only · no date · Oyster case · Perpetual",
  },
  {
    collection: "Air-King",
    brand: "Rolex",
    tagline: "Cảm hứng PHI CÔNG, giá mềm",
    purpose:
      "Tri ân hàng không: mặt đen với thang phút lớn vòng ngoài + số 3-6-9, ưu tiên đọc nhanh. Chất thể thao đơn giản, không lịch, giá tốt trong nhóm Professional.",
    signature: [
      "Mặt đen, số phút 05-10-15… nổi bật + 3/6/9",
      "Chữ 'Air-King' kiểu chữ retro",
      "Vành trơn, cỡ 40mm",
      "Kim giây vàng/xanh điểm nhấn",
      "Dây Oyster",
    ],
    heritage:
      "Tên 'Air-King' có từ 1945 tôn vinh phi công Anh trong Thế chiến II. Bản hiện đại lấy cảm hứng buồng lái & gắn với đội đua/khám phá Rolex.",
    variants: "126900 (bản 2022, thêm vạch phút 05) · 116900 (đời trước).",
    priceNote: "Giá mềm, dễ mua hơn Sub/GMT. Mặt số đặc trưng nên kén gu → second-hand đôi khi giá tốt.",
    forWho:
      "Người thích Rolex thể thao 'khác bầy', ngân sách mềm. Chốt sale: 'di sản phi công, dễ sở hữu, ai cũng hỏi mặt số lạ'.",
    terms: "Pilot heritage · minute scale",
  },
  {
    collection: "Milgauss",
    brand: "Rolex",
    tagline: "CHỐNG TỪ cho nhà khoa học",
    purpose:
      "Kháng từ trường tới 1000 gauss nhờ lồng sắt non (Faraday) bọc bộ máy — dành cho người làm gần thiết bị điện/từ mạnh (kỹ sư, bác sĩ MRI). 'Mille gauss' = 1000 gauss.",
    signature: [
      "Kim giây hình TIA SÉT (lightning) màu cam",
      "Kính sapphire ánh XANH LÁ (Z-Green) — độc quyền",
      "Mặt Z-Blue điện hoặc đen",
      "Vành trơn 40mm",
      "Lồng sắt non chống từ bên trong",
    ],
    heritage:
      "1956 — làm cho kỹ sư CERN. Đã NGỪNG sản xuất (2023) nên trở thành món SƯU TẦM tăng giá.",
    variants: "116400GV Z-Blue / mặt đen kính xanh · 116400 đời cũ kính thường.",
    priceNote: "Đã khai tử → bản second-hand đang TĂNG giá. Z-Blue kính xanh được săn nhất.",
    forWho:
      "Dân sưu tầm, người thích nét lập dị độc đáo. Chốt sale: 'đã ngừng sản xuất — càng hiếm càng có giá'.",
    terms: "Anti-magnetic · 1000 gauss · lightning hand · Z-Green crystal",
  },
  {
    collection: "Perpetual 1908",
    brand: "Rolex",
    tagline: "DRESS WATCH mỏng, dây da",
    purpose:
      "Đồng hồ LỊCH LÃM đi suit/cưới hỏi: vỏ mỏng, dây DA, đáy lộ máy — khác hẳn chất thể thao Oyster. Kim giây nhỏ ở 6h (small seconds) kiểu cổ điển. Đây là dòng dress riêng của Rolex (gọi Perpetual/Settimo).",
    signature: [
      "Kim giây NHỎ ở 6h (small seconds)",
      "Vành mỏng cong (domed), vỏ thanh mảnh",
      "Dây DA khoá gập Dualclasp",
      "Đáy LỘ máy ngắm cơ (hiếm ở Rolex)",
      "Chỉ vàng vàng/trắng 39mm",
    ],
    heritage:
      "2023 — gợi nhớ năm 1908 khi Hans Wilsdorf đăng ký tên 'Rolex'. Là nỗ lực đưa Rolex trở lại sân chơi dress watch cao cấp.",
    variants: "Vàng vàng mặt trắng/đen · vàng trắng mặt đen 'ice blue-ish'.",
    priceNote: "Chỉ vàng nên giá cao; định vị dress sang. Còn mới nên ít hàng second-hand.",
    forWho:
      "Khách cần đồng hồ mặc vest/sự kiện trang trọng, thích cổ điển thanh lịch. Chốt sale: 'Rolex cho bộ suit — mỏng, lộ máy, sang trọng'.",
    terms: "Dress watch · small seconds · display caseback",
  },

  // ============== OMEGA ==============
  {
    collection: "Speedmaster",
    brand: "Omega",
    tagline: "MOONWATCH — lên Mặt Trăng",
    purpose:
      "Chronograph bấm giờ huyền thoại: nút trên start/stop, nút dưới reset; 3 mặt phụ đếm giây/phút/giờ + vành Tachymeter đo tốc độ. Phi hành gia dùng nó để CANH GIỜ đốt động cơ thủ công.",
    signature: [
      "3 mặt phụ chrono ở 3/6/9",
      "Vành Tachymeter (nhôm/gốm)",
      "Kính Hesalite (nhựa) bản Moonwatch cổ điển — hoặc sapphire",
      "Mặt đen 'Moonwatch' kinh điển",
      "Lên cót TAY (manual) ở bản Professional",
    ],
    heritage:
      "1957. Là đồng hồ ĐẦU TIÊN được đeo trên MẶT TRĂNG (Apollo 11, 1969). Năm 1970 giúp phi hành đoàn Apollo 13 canh giờ đốt động cơ sống sót trở về — câu chuyện bán hàng cực mạnh.",
    variants:
      "Moonwatch Professional 3861 (Hesalite/sapphire) · Dark Side/Grey Side of the Moon (gốm) · Speedy Tuesday/Snoopy (edition) · Racing/Reduced.",
    priceNote:
      "Moonwatch là chronograph icon giá HỢP LÝ nhất (mềm hơn Daytona nhiều). Edition (Snoopy, Silver Snoopy) tăng giá mạnh.",
    forWho:
      "Người mê lịch sử/không gian, người muốn chronograph icon mà ngân sách vừa. Chốt sale: 'chiếc đồng hồ đã lên Mặt Trăng — câu chuyện không hãng nào có'.",
    terms: "Chronograph · tachymeter · Hesalite · Moonwatch · Cal. 3861",
  },
  {
    collection: "Seamaster",
    brand: "Omega",
    tagline: "LẶN & James Bond",
    purpose:
      "Dòng LẶN/thể thao nước chủ lực của Omega: chống nước 300–600m, vành lặn gốm, van xả Heli; máy Co-Axial Master Chronometer kháng từ 15.000 gauss. Đối thủ trực tiếp của Submariner với giá thường mềm hơn.",
    signature: [
      "Mặt SÓNG (wave) laser hoặc vân teak/dọc",
      "Vành lặn gốm + số tráng men",
      "Van thoát Heli ở 10h (bản Diver 300M)",
      "Kim & cọc skeleton phủ dạ quang",
      "Máy Co-Axial Master Chronometer (METAS)",
    ],
    heritage:
      "Dòng có gốc từ 1948 (kỷ niệm 100 năm Omega). Là đồng hồ của ĐIỆP VIÊN 007 từ 1995 (GoldenEye) tới nay → nhận diện toàn cầu.",
    variants:
      "Diver 300M (mặt sóng, Bond) · Aqua Terra 150M (thanh lịch, mặt teak) · Planet Ocean 600M (lặn sâu, cam) · Seamaster 300 (heritage) · Ploprof (chuyên dụng) · Railmaster (chống từ).",
    priceNote:
      "Giá/chất lượng tốt hơn Rolex tương đương → dễ thuyết phục khách lý trí. Bản Bond edition & 007 được sưu tầm.",
    forWho:
      "Khách thích chất thể thao Thuỵ Sĩ giá tốt hơn Rolex, fan James Bond. Chốt sale: 'công nghệ Co-Axial kháng từ, đeo Bond mà giá mềm hơn Sub'.",
    terms: "Co-Axial · Master Chronometer · helium valve · 300M/600M · METAS",
  },
  {
    collection: "Constellation",
    brand: "Omega",
    tagline: "Lịch lãm 'MÓNG VUỐT'",
    purpose:
      "Dòng dress-sport sang: nhận diện bằng 4 'móng vuốt' (griffes) giữ mặt kính ở 3h & 9h, cùng dây tích hợp nửa mắt. Đeo công sở/sự kiện, thiên về thẩm mỹ & độ chính xác.",
    signature: [
      "4 móng vuốt (griffes/claws) ở 3h–9h",
      "Mặt 'Pie Pan' gờ nghiêng (bản cổ) hoặc phẳng hiện đại",
      "Dây tích hợp nửa mắt đặc trưng",
      "Ngôi sao Constellation ở mặt số",
      "Cỡ đa dạng nam/nữ",
    ],
    heritage:
      "1952, lấy chuẩn chính xác từ các cuộc thi đài thiên văn (observatory). Bản 'Manhattan' 1982 định hình kiểu móng vuốt hiện đại.",
    variants: "Manhattan (hiện đại) · Pie Pan (vintage sưu tầm) · Globemaster (Master Chronometer, vành khía).",
    priceNote: "Định vị lịch lãm tầm trung, giá dễ chịu. Globemaster là bản 'chuẩn observatory' cao cấp hơn.",
    forWho:
      "Khách thích đồng hồ lịch lãm khác biệt, cả nam và nữ, không thích thể thao. Chốt sale: 'thiết kế móng vuốt độc nhất, lịch lãm bền bỉ'.",
    terms: "Griffes/claws · Pie Pan dial · observatory · Globemaster",
  },
  {
    collection: "De Ville",
    brand: "Omega",
    tagline: "DRESS thanh lịch, giá mềm",
    purpose:
      "Dòng mặc suit thuần DRESS: vỏ tròn mỏng, mặt sạch, thường dây da; là nơi Omega khoe công nghệ Co-Axial trong form cổ điển. Đeo trang trọng, nhẹ nhàng.",
    signature: [
      "Vỏ tròn trơn MỎNG",
      "Mặt số tối giản, số La Mã/cọc mảnh",
      "Dây da",
      "Máy Co-Axial",
      "Bản Trésor/Prestige/Hour Vision",
    ],
    heritage:
      "Tách thành dòng riêng 1967 từ Seamaster De Ville; tập trung nét cổ điển-thanh lịch, là dòng giá mềm trong nhà Omega.",
    variants: "Prestige (cơ bản) · Trésor (mỏng cao cấp) · Hour Vision (đáy lộ máy) · bản nữ nạm kim cương.",
    priceNote: "Giá mềm nhất nhóm Omega cơ → hợp người mới hoặc làm quà.",
    forWho:
      "Khách cần đồng hồ lịch sự giá phải chăng, người lớn tuổi/công sở. Chốt sale: 'Co-Axial cao cấp trong dáng dress giá tốt'.",
    terms: "Dress watch · Co-Axial escapement · Trésor",
  },

  // ============== TAG HEUER ==============
  {
    collection: "Carrera",
    brand: "TAG Heuer",
    tagline: "Chronograph ĐUA XE",
    purpose:
      "Bấm giờ lấy cảm hứng đường đua, ưu tiên DỄ ĐỌC: mặt panda tương phản, vành tachymeter đo tốc độ, máy in-house Heuer 02 trữ cót 80h. Nút trên start/stop, nút dưới reset.",
    signature: [
      "Mặt panda/reverse panda tương phản",
      "Vành tachymeter (hoặc gốm)",
      "Logo Heuer cổ điển (dòng cao cấp bỏ chữ TAG)",
      "Máy in-house Heuer 02 (80h) ở bản xịn",
      "Bản Glassbox kính vòm hoài cổ",
    ],
    heritage:
      "1963, Jack Heuer đặt theo giải đua tử thần Carrera Panamericana ở Mexico — sinh ra để đua. Là icon chronograph thể thao của hãng.",
    variants: "Carrera Chronograph 39/42/44mm · Glassbox · Panda/Reverse Panda · Skipper teal · bản Porsche · Carrera GMT (2 múi giờ).",
    priceNote:
      "Chronograph Thuỵ Sĩ in-house giá HỢP LÝ hơn Daytona/Speedmaster nhiều → dễ chốt cho người thích chrono mà ngân sách vừa.",
    forWho:
      "Người mê xe/đua, muốn chronograph Thuỵ Sĩ giá tốt. Chốt sale: 'di sản đua xe 60 năm, máy in-house, giá dễ thở'.",
    terms: "Chronograph · panda dial · Heuer 02 · tachymeter · Glassbox",
  },
  {
    collection: "Monaco",
    brand: "TAG Heuer",
    tagline: "Chronograph VUÔNG Steve McQueen",
    purpose:
      "Bấm giờ vỏ VUÔNG độc đáo — tuyên ngôn cá tính. Bản cổ điển có NÚM VẶN nằm BÊN TRÁI (vì máy chrono tự động khi đó chưa cần chỉnh giờ thường). Mặt phụ đếm phút/giờ bấm giờ.",
    signature: [
      "Vỏ VUÔNG (rất hiếm có ở chronograph)",
      "Núm vặn BÊN TRÁI (bản Calibre 11 cổ điển)",
      "Mặt xanh dương đặc trưng",
      "2 mặt phụ chrono",
      "Kính chống nước trên vỏ vuông (kỹ thuật khó)",
    ],
    heritage:
      "1969 — một trong những chronograph TỰ ĐỘNG đầu tiên (Calibre 11). Steve McQueen đeo trong phim Le Mans (1971) → biểu tượng điện ảnh-đua xe.",
    variants: "Monaco Calibre Heuer 02 (hiện đại) · bản Gulf sọc xanh-cam · các edition kỷ niệm màu đặc biệt.",
    priceNote: "Định vị icon cá tính, giá ngang/above Carrera. Edition Gulf & kỷ niệm được sưu tầm.",
    forWho:
      "Khách thích KHÁC BIỆT, mê điện ảnh/đua xe, dám chơi vỏ vuông. Chốt sale: 'chiếc vuông huyền thoại của Steve McQueen — không lẫn vào đâu'.",
    terms: "Square case · left crown · Calibre 11 · Gulf",
  },
  {
    collection: "Aquaracer",
    brand: "TAG Heuer",
    tagline: "LẶN thể thao giá tốt",
    purpose:
      "Đồng hồ LẶN 300m bền-rẻ: vành gốm 12 cạnh dễ bám-xoay kể cả đeo găng, mặt vân ngang đặc trưng, dạ quang tốt. Là 'cửa ngõ' lặn của TAG.",
    signature: [
      "Vành gốm 12 CẠNH dễ xoay",
      "Mặt vân ngang (horizontal lines)",
      "Chống nước 300m",
      "Dây thép/cao su đổi nhanh",
      "Có bản 3 kim & bản Chronograph",
    ],
    heritage: "Kế thừa dòng lặn của Heuer từ 1978 (series 844/1000); hiện là dòng lặn phổ thông của TAG.",
    variants: "Professional 300 (3 kim) · Aquaracer Chronograph · bản Solargraph (pin mặt trời) · GMT.",
    priceNote: "Giá MỀM, dễ tiếp cận → hợp người mới muốn đồng hồ lặn Thuỵ Sĩ. Second-hand rất tốt.",
    forWho:
      "Người mới thích đồng hồ lặn Thuỵ Sĩ ngân sách vừa. Chốt sale: 'lặn 300m thật, thương hiệu Thuỵ Sĩ, giá vào tầm tay'.",
    terms: "Dive bezel · 300m · 12-sided · Solargraph",
  },
  {
    collection: "Formula 1",
    brand: "TAG Heuer",
    tagline: "NHẬP MÔN Thuỵ Sĩ (rẻ nhất)",
    purpose:
      "Đồng hồ thể thao motorsport giá MỀM NHẤT của TAG: bền, nhiều màu, có bản chạy pin (quartz) lẫn tự động. Đưa người trẻ đến với thương hiệu Thuỵ Sĩ.",
    signature: [
      "Vành tachymeter nhiều MÀU thể thao",
      "Thiết kế trẻ trung, năng động",
      "Bản 'Gulf' sọc xanh-cam",
      "Quartz (pin) hoặc automatic",
      "Vỏ thép/nhựa nhẹ",
    ],
    heritage: "1986 — ra đời cùng cảm hứng đường đua F1, là dòng nhập môn đưa giới trẻ đến với Heuer/TAG.",
    variants: "Formula 1 Quartz (rẻ nhất) · Automatic · bản Gulf · các bản collab/màu.",
    priceNote: "RẺ nhất nhà TAG → điểm chạm đầu tiên. Bản collab (Gulf, Kith…) có thể tăng giá.",
    forWho:
      "Người mới hoàn toàn, ngân sách thấp, thích màu sắc thể thao, mua tặng. Chốt sale: 'đồng hồ Thuỵ Sĩ thật với giá khởi điểm dễ chịu nhất'.",
    terms: "Quartz/automatic · entry-level · tachymeter · Gulf",
  },

  // ============== CARTIER ==============
  {
    collection: "Tank",
    brand: "Cartier",
    tagline: "DRESS vuông vượt thời gian",
    purpose:
      "Đồng hồ TRANG SỨC lịch lãm: vỏ chữ nhật như nhìn từ trên xuống thân xe tăng, hai thanh dọc (brancards) liền dây. Đeo đi tiệc/suit, thiên về thẩm mỹ thời trang hơn công năng.",
    signature: [
      "Vỏ chữ nhật + hai thanh dọc brancards",
      "Số La Mã + đường ray phút",
      "Kim 'blued steel' xanh + núm xanh sapphire/spinel",
      "Mặt trắng/bạc cổ điển",
      "Quartz (pin) hoặc cơ tuỳ bản",
    ],
    heritage:
      "1917 — Louis Cartier lấy cảm hứng từ xe tăng Renault Thế chiến I. Được Jackie Kennedy, Andy Warhol, công nương Diana đeo → biểu tượng thanh lịch văn hoá.",
    variants: "Tank Louis Cartier (cổ điển) · Must de Cartier (giá vào) · Tank Française (dây liền thể thao) · Américaine (dài) · Tank Solo.",
    priceNote: "Must de Cartier là cửa vào mềm. Bản vàng & Louis Cartier cao hơn. Vintage Tank được sưu tầm.",
    forWho:
      "Khách thích vẻ quý phái cổ điển, cả nam nữ; mê thời trang hơn thể thao. Chốt sale: 'icon dress đeo cả thế kỷ — Jackie Kennedy, Diana đều chọn'.",
    terms: "Rectangular case · Roman numerals · blued hands · brancards",
  },
  {
    collection: "Santos",
    brand: "Cartier",
    tagline: "Đồng hồ PHI CÔNG đầu tiên",
    purpose:
      "Đeo tay thay đồng hồ túi cho phi công: vỏ VUÔNG bo góc với 8 ốc vít LỘ trên vành — thể thao mà vẫn thanh lịch. Hệ QuickSwitch đổi dây & SmartLink chỉnh dây không cần dụng cụ.",
    signature: [
      "Vỏ vuông bo + 8 ốc vít LỘ trên vành",
      "Số La Mã + đường ray phút",
      "Hệ đổi dây nhanh QuickSwitch",
      "Kim 'blued steel' xanh",
      "Bản thép/two-tone/vàng",
    ],
    heritage:
      "1904 — Louis Cartier làm cho phi công Alberto Santos-Dumont để xem giờ khi lái mà không cần rút đồng hồ túi. Được coi là chiếc đồng hồ ĐEO TAY hiện đại đầu tiên.",
    variants: "Santos de Cartier (Medium/Large) · two-tone vàng-thép · vàng khối · Santos-Dumont (mỏng, thạch anh/cơ).",
    priceNote: "Định vị lai thể thao-lịch lãm, giá tầm trung-cao. Two-tone hợp khách thích vàng vừa túi.",
    forWho:
      "Khách thích nét lai thể thao-thanh lịch, tiện đổi dây. Bán được cho cả nam nữ. Chốt sale: 'đồng hồ đeo tay đầu tiên của thế giới — lịch sử + đổi dây cực tiện'.",
    terms: "Square case · exposed screws · QuickSwitch · SmartLink",
  },

  // ============== HUBLOT ==============
  {
    collection: "Big Bang",
    brand: "Hublot",
    tagline: "Chronograph HIỆN ĐẠI phá cách",
    purpose:
      "Statement piece BẤM GIỜ: triết lý 'Art of Fusion' trộn nhiều chất liệu (vàng + gốm + cao su + carbon), mặt thường LỘ CƠ. Bản Unico là flyback (reset chạy lại ngay không cần dừng). To, hầm hố, gây chú ý.",
    signature: [
      "Vành tròn 6 ốc chữ H",
      "Mặt LỘ cơ chronograph (skeleton)",
      "Phối chất liệu lạ (King Gold, Magic Gold, gốm, sapphire trong suốt)",
      "Dây cao su lắp nhanh 'one-click'",
      "Máy in-house Unico (flyback)",
    ],
    heritage:
      "2005 — cú 'nổ lớn' đưa Hublot lên bản đồ dưới thời Jean-Claude Biver. 'Art of Fusion' (kết hợp vật liệu trái ngược) là DNA của hãng.",
    variants: "Unico 42/44mm · All Black (toàn đen) · Sapphire (vỏ trong suốt) · Integral (dây liền khối) · Iced/nạm kim cương · MP edition.",
    priceNote: "Định vị xa xỉ hiện đại, giá cao. Giữ giá kém hơn Rolex/AP nhưng bản hiếm/sapphire được săn.",
    forWho:
      "Khách TRẺ, thích nổi bật-hiện đại, gu thể thao xa xỉ/hip-hop, người nổi tiếng. Chốt sale: 'không lẫn vào đâu — chất liệu độc, đeo là gây chú ý'.",
    terms: "Flyback chronograph · Unico · Art of Fusion · one-click strap",
  },
  {
    collection: "Square Bang",
    brand: "Hublot",
    tagline: "Big Bang bản VUÔNG",
    purpose:
      "Phiên bản vỏ VUÔNG góc cạnh của Big Bang: chất sci-fi mạnh, vẫn máy Unico flyback LỘ cơ. Dáng vuông hiện đại, hiếm gặp ở chronograph.",
    signature: [
      "Vỏ VUÔNG 6 ốc",
      "Máy Unico flyback lộ cơ",
      "Phối gốm/King Gold/titan",
      "Dây cao su one-click",
      "Đáy lộ máy",
    ],
    heritage: "2023 — mở rộng ngôn ngữ Big Bang sang dáng vuông, đáp ứng khách muốn nét lạ hơn bản tròn.",
    variants: "Square Bang Unico Titan · King Gold/gốm two-tone · mặt xanh.",
    priceNote: "Mới & dáng độc → giá cao, kén khách. Hợp người đã mê Hublot muốn khác biệt.",
    forWho:
      "Khách đã thích Hublot, muốn dáng vuông cá tính mạnh. Chốt sale: 'Big Bang nhưng vuông — độc hơn'.",
    terms: "Square case · Unico · flyback · skeleton",
  },
  {
    collection: "Spirit of Big Bang",
    brand: "Hublot",
    tagline: "Chronograph dáng TONNEAU",
    purpose:
      "Bấm giờ vỏ THÙNG TÔ-NÔ (tonneau) ôm cong theo cổ tay: vẫn lộ cơ Unico flyback, vẫn phá cách nhưng đeo ôm tay hơn bản tròn/vuông.",
    signature: [
      "Vỏ tonneau (thùng) ôm tay",
      "Mặt lộ cơ chronograph",
      "Vành 6 ốc",
      "Dây cao su one-click",
      "Phối titan/King Gold/gốm",
    ],
    heritage: "2014 — biến thể tô-nô của Big Bang, dáng mềm ôm cổ tay, mở rộng tệp khách.",
    variants: "Spirit Titan · King Gold · mặt xanh/two-tone · bản nạm đá.",
    priceNote: "Ngang Big Bang. Dáng tonneau hợp cổ tay vừa, đeo êm.",
    forWho:
      "Khách thích Hublot nhưng muốn dáng mềm, ôm tay. Chốt sale: 'chất Hublot trong dáng tonneau ôm tay êm hơn'.",
    terms: "Tonneau case · skeleton chronograph · Unico",
  },
  {
    collection: "Classic Fusion",
    brand: "Hublot",
    tagline: "Hublot MỎNG, dễ đeo (rẻ hơn)",
    purpose:
      "Bản TỐI GIẢN-thanh lịch hơn Big Bang: vỏ MỎNG, thường CHỈ giờ (3 kim, không bấm giờ), nhẹ nhàng — đeo công sở/suit được. Là cửa ngõ giá mềm vào Hublot.",
    signature: [
      "Vỏ tròn MỎNG + 6 ốc",
      "Mặt sạch (hoặc bản skeleton lộ cơ)",
      "3 kim, thường KHÔNG chronograph",
      "Dây cao su/da",
      "Titan/King Gold/gốm",
    ],
    heritage: "Kế thừa thiết kế Hublot nguyên bản 1980 (vỏ + ốc + dây cao su), là dòng thanh lịch giá mềm nhất hãng.",
    variants: "Classic Fusion 38/42/45mm · Skeleton · Chronograph (bản có bấm giờ) · Titanium/King Gold.",
    priceNote: "Giá MỀM nhất Hublot → cửa vào. Bản 3 kim dễ đeo, bán chạy cho người mới.",
    forWho:
      "Người mới chơi Hublot, thích nhẹ-mỏng, đeo công sở. Chốt sale: 'Hublot dễ đeo nhất, mỏng-nhẹ-giá mềm'.",
    terms: "Time-only · ultra-thin · 6-screw bezel",
  },

  // ============== TUDOR ==============
  {
    collection: "Black Bay",
    brand: "Tudor",
    tagline: "LẶN cổ điển, GIÁ TRỊ/TIỀN số 1",
    purpose:
      "Đồng hồ LẶN phong cách vintage: vành xoay 60 phút, dạ quang mạnh, chống nước 200m. Dùng máy IN-HOUSE MT56xx đạt chuẩn COSC trữ cót 70h — chất Rolex với giá mềm hơn nhiều.",
    signature: [
      "Kim 'snowflake' (bông tuyết) đặc trưng Tudor",
      "Vành lặn nhôm/gốm, mặt domed phồng",
      "Máy in-house COSC 70h",
      "Bản 41/39/54/58mm nhiều màu",
      "Dây thép/da/vải NATO đổi được",
    ],
    heritage:
      "Tudor là thương hiệu EM của Rolex (cùng nhà sáng lập Hans Wilsdorf), dùng linh kiện chất lượng với giá thấp hơn. Black Bay (2012) gợi lại Submariner xưa thập niên 50.",
    variants: "BB58 (39mm, cổ tay nhỏ) · BB41 · BB GMT (Pepsi) · BB Pro · BB54 · BB Bronze · các màu burgundy/blue/black.",
    priceNote:
      "BEST VALUE để khởi đầu đồ Thuỵ Sĩ xịn (máy in-house giá ~1/3 Rolex). BB58 được khen nhiều nhất. Giữ giá tốt cho phân khúc.",
    forWho:
      "Người mê chất Rolex nhưng ngân sách vừa, người mới vào đồ cơ Thuỵ Sĩ. Chốt sale: 'em ruột Rolex, máy in-house COSC, giá chỉ một phần'.",
    terms: "In-house COSC · snowflake hand · vintage diver · 200m",
  },
  {
    collection: "Black Bay Chrono",
    brand: "Tudor",
    tagline: "Chronograph giá tốt bất ngờ",
    purpose:
      "Bấm giờ thể thao lai DNA lặn + đua: dùng máy nền Breitling B01 (đạt COSC) — hiếm có chronograph cơ in-house tin cậy ở tầm giá này. 2 mặt phụ + ô ngày.",
    signature: [
      "2 mặt phụ chrono (45-min ở 3h, giây ở 9h) + ngày 6h",
      "Vành tachymeter",
      "Kim snowflake",
      "Máy MT5813 (nền Breitling B01, COSC)",
      "Dây thép/vải",
    ],
    heritage: "2017 — Tudor đổi máy với Breitling (Tudor đưa MT5612, nhận B01) → có chrono in-house COSC giá dễ tiếp cận.",
    variants: "BB Chrono (panda/đen) · 'Bubblegum' (hồng) · two-tone vàng · mặt xanh.",
    priceNote: "Chronograph Thuỵ Sĩ COSC rẻ hơn Daytona/Speedmaster nhiều → cực hời cho người thích chrono.",
    forWho:
      "Khách muốn chronograph cơ Thuỵ Sĩ COSC mà không trả giá grail. Chốt sale: 'máy nền Breitling B01, COSC, giá chỉ bằng phần nhỏ Daytona'.",
    terms: "Breitling B01 base · COSC · tachymeter · snowflake",
  },

  // ============== IWC ==============
  {
    collection: "Pilot's Watch",
    brand: "IWC",
    tagline: "Đồng hồ PHI CÔNG dễ đọc",
    purpose:
      "Sinh ra cho BUỒNG LÁI: mặt đen, số to dạ quang, tam giác định hướng ở 12h để liếc là biết chiều — đọc cực nhanh. Lồng sắt non chống từ. Có bản 3 kim, chronograph, và lịch.",
    signature: [
      "Mặt đen + tam giác (▲) định hướng ở 12h",
      "Số Ả Rập to + kim kiếm dạ quang",
      "Núm vặn khía to (đeo găng phi công vẫn vặn được)",
      "Đổi dây nhanh EasX-CHANGE",
      "Bản Big Pilot mặt to 43-46mm",
    ],
    heritage:
      "IWC làm đồng hồ phi công từ 1936; 'Big Pilot' B-Uhr thời chiến là biểu tượng. Hợp tác phi đội & phim Top Gun.",
    variants: "Mark XX (3 kim) · Pilot Chronograph · Big Pilot 43 · bản Top Gun gốm · Spitfire/Le Petit Prince edition.",
    priceNote: "Mark XX 3 kim là cửa vào mềm. Big Pilot & chrono cao hơn. Edition (Top Gun, Le Petit Prince) được ưa.",
    forWho:
      "Khách thích chất công cụ-quân đội, mặt to nam tính, kỹ thuật. Chốt sale: 'di sản phi công thật, dễ đọc, chống từ — chất lính'.",
    terms: "Pilot · soft-iron cage · EasX-CHANGE · Big Pilot",
  },
  {
    collection: "Ingenieur",
    brand: "IWC",
    tagline: "Thể thao sang CHỐNG TỪ (Genta)",
    purpose:
      "Đồng hồ kỹ sư kháng TỪ TRƯỜNG mạnh, dây thép LIỀN KHỐI thể thao. Do Gérald Genta (cha đẻ Royal Oak & Nautilus) thiết kế → cùng ngôn ngữ 'luxury sports watch'.",
    signature: [
      "Vành tròn 5 ốc lộ đặc trưng",
      "Dây thép liền khối (integrated)",
      "Lồng sắt non chống từ",
      "Mặt vân 'grid' ô lưới",
      "Máy in-house 32111 (120h)",
    ],
    heritage:
      "Gốc 1955 (chống từ cho kỹ sư); bản Genta 1976 cùng thời Royal Oak/Nautilus. Hồi sinh 2023 đúng tinh thần Genta.",
    variants: "Ingenieur Automatic 40 (thép, mặt xanh/đen/bạc) · titan · bản cao cấp.",
    priceNote: "Lựa chọn 'luxury sports watch dây liền khối' DỄ MUA hơn AP/Patek nhiều → ngách hời.",
    forWho:
      "Khách mê dáng dây liền khối (Royal Oak/Nautilus) nhưng muốn lựa chọn khả thi hơn. Chốt sale: 'thiết kế Genta, chống từ, giá hợp lý hơn Royal Oak rất nhiều'.",
    terms: "Anti-magnetic · integrated bracelet · Genta · 5 screws",
  },

  // ============== AUDEMARS PIGUET ==============
  {
    collection: "Royal Oak",
    brand: "Audemars Piguet",
    tagline: "GRAIL thể thao xa xỉ (Genta)",
    purpose:
      "Chiếc KHAI SINH dòng 'luxury sports watch': làm bằng THÉP nhưng giá như vàng, nhờ hoàn thiện thủ công cực kỳ tinh xảo. Vành bát giác 8 ốc, mặt 'Tapisserie', dây liền khối — tất cả là một khối nghệ thuật.",
    signature: [
      "Vành BÁT GIÁC (8 cạnh) + 8 ốc lục giác LỘ",
      "Mặt 'Tapisserie' (Grande/Petite) ô bàn cờ dập nổi",
      "Dây thép liền khối vuốt nhỏ dần",
      "Hoàn thiện chải xước + vát bóng xen kẽ",
      "Máy siêu mỏng (Jumbo) hoặc chrono/phức tạp",
    ],
    heritage:
      "1972 — Gérald Genta phác thảo trong MỘT ĐÊM, cứu AP khỏi khủng hoảng & cách mạng hoá đồng hồ thép cao cấp. Giá ra mắt đắt hơn cả Rolex vàng thời đó → gây sốc rồi thành huyền thoại.",
    variants: "Jumbo 16202 (39mm siêu mỏng) · 15500/15510 (41mm) · 15450 (37mm) · Royal Oak Chronograph · Perpetual Calendar · bản đá quý.",
    priceNote: "Cực KHÓ mua chính hãng, premium chợ rất cao, giữ giá top. Jumbo & chrono được săn nhất.",
    forWho:
      "Khách thượng lưu, sành sỏi, đã có Rolex muốn lên hạng. Chốt sale: 'biểu tượng khai sinh cả một thể loại — thép mà đắt hơn vàng có lý do'.",
    terms: "Octagonal bezel · Tapisserie · integrated bracelet · Jumbo",
  },
  {
    collection: "Royal Oak Offshore",
    brand: "Audemars Piguet",
    tagline: "Royal Oak bản LỚN & hầm hố",
    purpose:
      "Bản thể thao MẠNH MẼ hơn Royal Oak: to, dày, thường là chronograph, hoạ tiết 'Méga Tapisserie' ô LỚN, nút bấm bọc cao su. Đeo statement, năng động.",
    signature: [
      "Bát giác cỡ LỚN 42-44mm, dày",
      "Mặt 'Méga Tapisserie' ô to",
      "Chronograph nút bọc cao su",
      "Phối nhiều chất liệu/màu mạnh",
      "Dây cao su hoặc thép liền khối",
    ],
    heritage:
      "1993 — 'The Beast' do Emmanuel Gueit thiết kế, ban đầu gây tranh cãi vì quá to rồi thành biểu tượng thể thao mạnh, được Schwarzenegger/Lebron ưa.",
    variants: "Offshore Chronograph 42/43mm · các edition màu/đá · bản gốm/forged carbon.",
    priceNote: "Premium cao, kén cổ tay to. Edition giới hạn được sưu tầm.",
    forWho:
      "Khách thích đồ TO-bốc, năng động, cổ tay lớn, sao thể thao/giải trí. Chốt sale: 'bản hầm hố nhất nhà AP — đeo là nổi'.",
    terms: "Méga Tapisserie · chronograph · oversized · The Beast",
  },

  // ============== PATEK PHILIPPE ==============
  {
    collection: "Nautilus",
    brand: "Patek Philippe",
    tagline: "GRAIL đỉnh cao (Genta)",
    purpose:
      "Luxury sports watch HUYỀN THOẠI của 'vua chế tác' Patek: thanh lịch-thể thao, hoàn thiện đỉnh cao, cực hiếm. Vành dáng 'lỗ tàu' (porthole) bo 8 cạnh mềm, mặt vân ngang gọi, dây liền khối.",
    signature: [
      "Vành dáng cửa sổ TÀU THUỶ (porthole) bo cạnh",
      "Mặt vân NGANG (horizontal embossed) thường xanh/đen",
      "Hai 'tai' (ears) bản lề hai bên vỏ",
      "Dây thép liền khối hoàn thiện gương",
      "Cực mỏng & nhẹ",
    ],
    heritage:
      "1976 — Gérald Genta lấy cảm hứng cửa sổ tàu thuỷ, phác trên khăn ăn nhà hàng. Bản 5711 'Tiffany' xanh (2021) đấu giá hàng triệu USD; Patek khai tử 5711 khiến giá càng tăng.",
    variants: "5711 (3 kim, đã ngừng — grail) · 5712 (power reserve + lịch tuần trăng) · 5990 (du lịch chrono) · 5980 (chrono) · Tiffany blue.",
    priceNote: "Đỉnh của đỉnh: danh sách chờ nhiều NĂM, premium chợ rất lớn. 5711 ngừng sản xuất nên giá trên trời.",
    forWho:
      "Khách đỉnh nhất, sưu tầm nghiêm túc, hiểu giá trị chế tác. Chốt sale: 'một trong những đồng hồ thép được thèm muốn nhất hành tinh'.",
    terms: "Porthole bezel · horizontal embossed dial · integrated · 5711",
  },

  // ============== FASHION ==============
  {
    collection: "Mega Chief",
    brand: "Diesel",
    tagline: "FASHION chrono cỡ lớn",
    purpose:
      "Đồng hồ THỜI TRANG to-bản chạy PIN (quartz): phong cách bụi bặm-streetwear, giá rẻ. KHÔNG phải đồ Thuỵ Sĩ, một số mặt phụ chỉ để trang trí.",
    signature: [
      "Mặt RẤT to (44-51mm)",
      "Mặt phụ chrono (có thể trang trí)",
      "Logo Diesel đậm, vỏ thép/PVD",
      "Máy quartz (pin)",
      "Tông màu đen/khói/nâu bụi bặm",
    ],
    heritage: "Diesel là hãng thời trang Ý (Renzo Rosso); đồng hồ làm theo gu streetwear, nhắm phong cách hơn cơ khí.",
    variants: "Mega Chief Chronograph các màu · bản dây da/thép/silicone.",
    priceNote: "Giá RẺ (fashion), không giữ giá. Mua để phối đồ, không phải đầu tư.",
    forWho:
      "Khách trẻ thích phong cách, ngân sách thấp, không đặt nặng máy móc. Chốt sale: 'to, ngầu, hợp phối đồ — giá mềm'. (Nói rõ là fashion, không phải Thuỵ Sĩ.)",
    terms: "Fashion watch · quartz chronograph",
  },
  {
    collection: "Museum",
    brand: "Movado",
    tagline: "TỐI GIẢN 1 chấm vàng",
    purpose:
      "Tuyên ngôn THIẾT KẾ: mặt trơn tuyền, KHÔNG số, chỉ một CHẤM VÀNG ở 12h tượng trưng mặt trời giữa trưa. Đeo lịch sự, nghệ thuật, làm quà.",
    signature: [
      "Mặt đen trơn không số",
      "1 CHẤM vàng tại 12h (Museum dot)",
      "Kim mảnh tối giản",
      "Vỏ mỏng tròn",
      "Thường quartz",
    ],
    heritage:
      "Thiết kế 1947 của Nathan George Horwitt, được bảo tàng MoMA (New York) đưa vào bộ sưu tập → 'Museum dial'.",
    variants: "Museum Classic · Bold (to hơn) · các bản dây thép/da/mesh.",
    priceNote: "Giá phổ thông, dễ tiếp cận. Là món quà lịch sự đẹp hơn là đầu tư.",
    forWho:
      "Khách yêu tối giản-nghệ thuật, mua làm quà lịch sự. Chốt sale: 'thiết kế nằm trong bảo tàng MoMA — tối giản kinh điển'.",
    terms: "Minimalist · single dot · MoMA design",
  },
];

const MAP: Record<string, CollectionInfo> = {};
for (const c of LIST) MAP[c.collection] = c;

export const collectionInfos = LIST;
export const getCollectionInfo = (collection: string): CollectionInfo | undefined => MAP[collection];

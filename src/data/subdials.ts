import type { Watch } from "./types";

/**
 * MAT PHU (sub-dials) & CACH DUNG — "dial nao de lam gi va cach sai".
 * Moi chuoi: cac dong ngan cach bang " | " (UI tu tach thanh gach dau dong).
 * Co kem THUAT NGU tieng Anh de sale.
 */

// --- CHRONOGRAPH (may bam gio) ---
const DAYTONA =
  "Đây là máy BẤM GIỜ (chronograph) — 3 mặt phụ (sub-dials / registers). | 9h: kim GIÂY đang chạy của đồng hồ (running seconds). | 3h: đếm PHÚT bấm giờ (30-min counter). | 6h: đếm GIỜ bấm giờ (12-hour counter). | Kim giây LỚN ở giữa CHỈ chạy khi bấm giờ — lúc thường nó đứng yên. | Cách dùng: nút TRÊN (2h) = start/stop; nút DƯỚI (4h) = reset về 0. | Vành Tachymeter đo TỐC ĐỘ trung bình (chạy đủ 1 km/dặm rồi đọc số trên vành).";

const SPEEDMASTER =
  "Máy BẤM GIỜ lên cót tay (manual chronograph) — 3 mặt phụ (sub-dials). | 9h: kim GIÂY đang chạy (running seconds). | 3h: đếm PHÚT bấm giờ (30-min counter). | 6h: đếm GIỜ bấm giờ (12-hour counter). | Kim giây dài ở giữa chỉ chạy khi bấm giờ. | Cách dùng: nút TRÊN = start/stop, nút DƯỚI = reset. | Vành Tachymeter để tính tốc độ — NASA dùng bấm giờ đốt động cơ tàu Apollo 13.";

const CARRERA_CHRONO =
  "Máy BẤM GIỜ (chronograph) — thường 3 mặt phụ (sub-dials) ở 3/6/9. | Một mặt là kim GIÂY đang chạy (running seconds); hai mặt còn lại đếm PHÚT và GIỜ bấm giờ. | Kim giây trung tâm chỉ chạy khi bấm giờ. | Nút TRÊN = start/stop, nút DƯỚI = reset về 0. | Vành Tachymeter đo tốc độ trung bình (di sản đua xe Carrera). | Cửa sổ ngày (date) tuỳ phiên bản.";

const MONACO =
  "Chronograph vỏ VUÔNG — mặt phụ (sub-dials) hai bên đếm PHÚT & GIỜ bấm giờ; một mặt là kim giây đang chạy. | Bản cổ điển (Cal.11) có NÚM VẶN nằm BÊN TRÁI — đặc điểm nhận diện 'Steve McQueen'. | Kim giây trung tâm chỉ chạy khi bấm giờ. | Nút TRÊN = start/stop, nút DƯỚI = reset. | Cửa sổ ngày (date) tuỳ bản.";

const BB_CHRONO =
  "Chronograph — 2 mặt phụ (sub-dials): 3h = đếm PHÚT bấm giờ (45-min counter), 9h = kim GIÂY đang chạy (running seconds). | Kim giây trung tâm chỉ chạy khi bấm giờ. | Cửa sổ NGÀY (date) ở 6h. | Nút TRÊN = start/stop, nút DƯỚI = reset. | Vành Tachymeter cố định để đo tốc độ.";

const RO_OFFSHORE =
  "Chronograph thể thao — 3 mặt phụ (sub-dials) ở 3/6/9: đếm PHÚT, đếm GIỜ và kim GIÂY đang chạy. | Mặt số hoạ tiết 'Méga Tapisserie' ô lớn. | Kim giây trung tâm chỉ chạy khi bấm giờ. | Nút bấm bọc cao su: TRÊN = start/stop, DƯỚI = reset. | Cửa sổ ngày (date) thường ở 4–5h.";

const PILOT_CHRONO =
  "Chronograph phi công — mặt phụ (sub-dials) đếm PHÚT & GIỜ bấm giờ + kim GIÂY đang chạy. | Nhiều bản có ô NGÀY + THỨ (day-date) ở 3h. | Kim giây trung tâm chỉ chạy khi bấm giờ. | Nút TRÊN = start/stop, nút DƯỚI = reset.";

const HUBLOT_CHRONO =
  "Máy BẤM GIỜ (chronograph) — mặt phụ (sub-dials) đếm PHÚT & GIỜ bấm giờ; bản Unico là FLYBACK (bấm reset chạy lại ngay không cần dừng). | Mặt lộ cơ (skeleton) nên nhìn xuyên thấu các mặt phụ. | Kim giây trung tâm chỉ chạy khi bấm giờ. | Nút TRÊN = start/stop, nút DƯỚI = reset. | Vành 6 ốc; nhiều bản đáy lộ máy.";

const CHRONO_GENERIC =
  "Máy BẤM GIỜ (chronograph) — các mặt phụ (sub-dials) đếm PHÚT và GIỜ bấm giờ, kèm một mặt là kim GIÂY đang chạy. | Kim giây trung tâm chỉ chạy khi bấm giờ. | Nút TRÊN = start/stop, nút DƯỚI = reset về 0. | Vành Tachymeter (nếu có) đo tốc độ trung bình.";

const MEGA_CHIEF =
  "Máy bấm giờ (chronograph) chạy PIN (quartz) — 3 mặt phụ (sub-dials): bấm giờ phút/giờ + kim giây nhỏ. | Nút TRÊN = start/stop, nút DƯỚI = reset. | Lưu ý: hàng fashion — một số mặt phụ có thể chỉ để trang trí, không phải chuẩn Thuỵ Sĩ.";

// --- GMT / 2 mui gio ---
const GMT_ROLEX =
  "Đồng hồ 2 MÚI GIỜ (GMT). | Kim GMT (mũi tên, màu khác) chỉ giờ thứ 2 theo dạng 24 GIỜ — đọc trên VÀNH bezel 24h hai màu (phân biệt ngày/đêm). | Vành xoay 2 chiều: xoay thêm để xem múi giờ thứ 3. | Chỉnh: kim GMT chỉnh độc lập; kim giờ chính nhảy theo từng NẤC 1 giờ khi đổi nước. | Ví dụ kim GMT chỉ '18' trên vành = 6 giờ chiều ở nơi đó.";

const EXPLORER2 =
  "Đồng hồ 24 GIỜ phân biệt NGÀY/ĐÊM. | Kim 24h (kim cam) chạy 1 vòng/24 tiếng, đọc trên VÀNH thép CỐ ĐỊNH khắc 24h. | Dùng để biết đang sáng hay tối (thợ thám hiểm hang động không thấy mặt trời); cũng đọc được múi giờ thứ 2. | Vành KHÔNG xoay (khác GMT-Master).";

const GMT_GENERIC =
  "Đồng hồ 2 MÚI GIỜ (GMT). | Kim GMT chỉ giờ thứ 2 dạng 24h, đọc trên vành/đĩa 24h (thường hai màu phân biệt ngày/đêm). | Xoay vành để xem thêm múi giờ. | Tiện cho người hay bay / làm việc với khách nước ngoài.";

const WORLDTIMER =
  "Đồng hồ GIỜ THẾ GIỚI (worldtimer). | Vòng trong khắc 24 GIỜ + đĩa khắc tên 24 THÀNH PHỐ đại diện 24 múi giờ. | Đọc giờ ở bất kỳ thành phố nào bằng cách dóng theo vành 24h. | Thường có ô ngày (date). | Tiện cho người làm việc nhiều múi giờ cùng lúc.";

// --- Phuc tap / khac ---
const SKYDWELLER =
  "Phức tạp: 2 múi giờ + LỊCH NĂM (annual calendar). | Đĩa 24h LỆCH TÂM ở giữa = giờ múi thứ 2 (off-centre disc). | 12 ô nhỏ quanh viền mặt = THÁNG: ô nào sáng là tháng hiện tại — lịch tự nhảy đúng 30/31 ngày, chỉ chỉnh 1 lần/năm. | Cửa sổ ngày (date) ở 3h. | Chỉnh bằng vành Ring Command: xoay vành chọn chế độ rồi vặn núm.";

const YM2 =
  "Đồng hồ ĐUA THUYỀN (regatta) — bộ ĐẾM NGƯỢC 10 phút lập trình được (programmable countdown). | Kim/mặt phụ canh giờ xuất phát theo tiếng còi. | Vành Ring Command xoay để lập trình bộ đếm. | Đây KHÔNG phải bấm giờ thường — chuyên cho đua du thuyền.";

const SMALL_SECONDS =
  "Mặt phụ DUY NHẤT ở 6h = kim GIÂY NHỎ (small seconds / sub-seconds) — đếm giây liên tục. | KHÔNG phải bấm giờ; đây là bố cục cổ điển của đồng hồ dress mỏng. | Đáy lộ máy (display caseback) ngắm được bộ máy.";

// --- Cua so lich (khong phai sub-dial nhung "dial de lam gi") ---
const DAYDATE =
  "Không có mặt phụ — nhưng có 2 hiển thị đặc trưng. | Cửa sổ vòng cung ở 12h = THỨ trong tuần viết ĐẦY ĐỦ (day), có nhiều ngôn ngữ. | Cửa sổ ở 3h = NGÀY (date), phủ kính lúp Cyclops phóng to. | 'President' là tên dây đi kèm — biểu tượng quyền lực.";

const DATEJUST =
  "Không có mặt phụ — điểm nhấn là cửa sổ NGÀY (date) ở 3h. | Kính lúp Cyclops trên mặt kính phóng to số ngày ~2,5 lần (đặc trưng Rolex). | Chỉnh nhanh ngày (quickset) bằng núm. | 'Datejust' = tên gọi vì có lịch nhảy tức thì lúc nửa đêm.";

/** Nhan dien loai phuc tap roi tra ve mo ta phu hop. */
function resolve(w: Watch): string | undefined {
  const s = `${w.collection} ${w.model} ${w.nickname ?? ""}`;
  const isChrono = /chronograph/i.test(s) || /\bchrono\b/i.test(s); // tranh "chronometer"
  const isGmt = /\bgmt\b/i.test(s);
  const isWorldtimer = /worldtimer|world\s*time/i.test(s);

  switch (w.collection) {
    case "Cosmograph Daytona":
      return DAYTONA;
    case "Speedmaster":
      return SPEEDMASTER;
    case "Monaco":
      return MONACO;
    case "Black Bay Chrono":
      return BB_CHRONO;
    case "Royal Oak Offshore":
      return RO_OFFSHORE;
    case "Big Bang":
    case "Square Bang":
    case "Spirit of Big Bang":
      return HUBLOT_CHRONO;
    case "Mega Chief":
      return MEGA_CHIEF;
    case "Carrera":
      return isGmt ? GMT_GENERIC : CARRERA_CHRONO;
    case "Pilot's Watch":
      return isChrono ? PILOT_CHRONO : undefined;
    case "Aquaracer":
    case "Formula 1":
      return isChrono ? CHRONO_GENERIC : undefined;
    case "GMT-Master II":
      return GMT_ROLEX;
    case "Explorer II":
      return EXPLORER2;
    case "Sky-Dweller":
      return SKYDWELLER;
    case "Yacht-Master II":
      return YM2;
    case "Perpetual 1908":
      return SMALL_SECONDS;
    case "Day-Date":
      return DAYDATE;
    case "Datejust":
      return DATEJUST;
    case "Seamaster":
      return isWorldtimer ? WORLDTIMER : undefined;
  }

  // Du phong theo tu khoa (cho cac mau le)
  if (isWorldtimer) return WORLDTIMER;
  if (isChrono) return CHRONO_GENERIC;
  if (isGmt) return GMT_GENERIC;
  return undefined;
}

/** Dien mo ta mat phu vao cac mau (chi dien khi con trong). */
export function applySubdials(list: Watch[]): void {
  for (const w of list) {
    if (w.subdials !== undefined) continue;
    const desc = resolve(w);
    if (desc) w.subdials = desc;
  }
}

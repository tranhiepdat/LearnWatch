/**
 * HỌC TIẾNG NHẬT ĐỂ BÁN ĐỒNG HỒ — lộ trình theo TÌNH HUỐNG bán hàng
 * (đúng thứ tự thực tế khi tiếp khách nên dễ nhớ, dễ ôn).
 *
 * Mỗi chặng: câu LÕI (short) học trước → câu MỞ RỘNG (long) học sau.
 * Thêm câu mới: append vào `PHRASES` (id không trùng, `step` đúng chặng).
 */

export interface JpStep {
  id: number;
  title: string;
  /** mục tiêu của chặng — nói cho người học biết học xong làm được gì */
  goal: string;
  emoji: string;
}

export interface JpPhrase {
  id: string;
  step: number;
  jp: string;
  romaji: string;
  vi: string;
  /** short = câu lõi phải thuộc trước; long = bản đầy đủ, lịch sự hơn */
  len: "short" | "long";
  note?: string;
}

export const jpSteps: JpStep[] = [
  { id: 1, title: "Chào & tiếp khách", goal: "Đón khách, mời xem hàng tự nhiên.", emoji: "🙇" },
  { id: 2, title: "Giới thiệu mẫu", goal: "Nói được đây là mẫu gì, điểm gì nổi bật.", emoji: "⌚" },
  { id: 3, title: "Thông số & chất liệu", goal: "Trả lời câu hỏi về máy, chất liệu, chống nước.", emoji: "🔧" },
  { id: 4, title: "Deal giá", goal: "Báo giá, nói về thuế, giảm giá, trả góp.", emoji: "💴" },
  { id: 5, title: "Chốt đơn & thanh toán", goal: "Nhận thanh toán, làm miễn thuế, gói quà.", emoji: "🧾" },
  { id: 6, title: "Sau bán & giữ khách", goal: "Bảo hành, cảm ơn, hẹn gặp lại.", emoji: "🎁" },
];

const PHRASES: JpPhrase[] = [
  // ————— 1. CHÀO & TIẾP KHÁCH —————
  { id: "jp-1-1", step: 1, jp: "いらっしゃいませ。", romaji: "Irasshaimase.", vi: "Kính chào quý khách.", len: "short", note: "Câu bắt buộc khi khách bước vào. Không cần khách đáp lại." },
  { id: "jp-1-2", step: 1, jp: "どうぞご覧ください。", romaji: "Douzo goran kudasai.", vi: "Mời anh/chị xem ạ.", len: "short" },
  { id: "jp-1-3", step: 1, jp: "何かお探しですか。", romaji: "Nanika osagashi desu ka.", vi: "Anh/chị đang tìm mẫu nào ạ?", len: "short" },
  { id: "jp-1-4", step: 1, jp: "少々お待ちください。", romaji: "Shoushou omachi kudasai.", vi: "Xin đợi tôi một chút ạ.", len: "short" },
  { id: "jp-1-5", step: 1, jp: "お手に取ってご覧いただけます。", romaji: "Ote ni totte goran itadakemasu.", vi: "Anh/chị có thể cầm lên xem ạ.", len: "long" },
  { id: "jp-1-6", step: 1, jp: "ご試着なさいますか。", romaji: "Goshichaku nasaimasu ka.", vi: "Anh/chị đeo thử nhé?", len: "long", note: "Rất quan trọng — đeo thử là bước chốt mạnh nhất." },
  { id: "jp-1-7", step: 1, jp: "ご予算はどのくらいでしょうか。", romaji: "Goyosan wa dono kurai deshou ka.", vi: "Ngân sách của anh/chị khoảng bao nhiêu ạ?", len: "long" },

  // ————— 2. GIỚI THIỆU MẪU —————
  { id: "jp-2-1", step: 2, jp: "こちらはロレックスです。", romaji: "Kochira wa Rolex desu.", vi: "Đây là Rolex ạ.", len: "short", note: "「こちら」lịch sự hơn 「これ」khi nói với khách." },
  { id: "jp-2-2", step: 2, jp: "人気のモデルです。", romaji: "Ninki no moderu desu.", vi: "Đây là mẫu đang được ưa chuộng ạ.", len: "short" },
  { id: "jp-2-3", step: 2, jp: "新作です。", romaji: "Shinsaku desu.", vi: "Đây là mẫu mới ạ.", len: "short" },
  { id: "jp-2-4", step: 2, jp: "限定モデルです。", romaji: "Gentei moderu desu.", vi: "Đây là mẫu giới hạn ạ.", len: "short" },
  { id: "jp-2-5", step: 2, jp: "在庫は最後の一点です。", romaji: "Zaiko wa saigo no itten desu.", vi: "Chỉ còn đúng một chiếc ạ.", len: "short" },
  { id: "jp-2-6", step: 2, jp: "こちらは2020年製のサブマリーナーです。", romaji: "Kochira wa nisen-nijuu-nen sei no Submariner desu.", vi: "Đây là Submariner sản xuất năm 2020 ạ.", len: "long" },
  { id: "jp-2-7", step: 2, jp: "ダイバーズウォッチとして開発されたモデルです。", romaji: "Daibaazu wotchi to shite kaihatsu sareta moderu desu.", vi: "Đây là mẫu được phát triển làm đồng hồ lặn ạ.", len: "long" },
  { id: "jp-2-8", step: 2, jp: "男女問わずお使いいただけるサイズです。", romaji: "Danjo towazu otsukai itadakeru saizu desu.", vi: "Cỡ này cả nam và nữ đều đeo được ạ.", len: "long" },

  // ————— 3. THÔNG SỐ & CHẤT LIỆU —————
  { id: "jp-3-1", step: 3, jp: "自動巻きです。", romaji: "Jidoumaki desu.", vi: "Máy tự động (automatic) ạ.", len: "short" },
  { id: "jp-3-2", step: 3, jp: "手巻きです。", romaji: "Temaki desu.", vi: "Máy lên cót tay ạ.", len: "short" },
  { id: "jp-3-3", step: 3, jp: "ステンレスです。", romaji: "Sutenresu desu.", vi: "Chất liệu thép không gỉ ạ.", len: "short" },
  { id: "jp-3-4", step: 3, jp: "18金です。", romaji: "Juuhachi-kin desu.", vi: "Vàng 18K ạ.", len: "short" },
  { id: "jp-3-5", step: 3, jp: "文字盤は黒です。", romaji: "Mojiban wa kuro desu.", vi: "Mặt số màu đen ạ.", len: "short", note: "文字盤 = mặt số (dial). Màu: 白 shiro trắng · 青 ao xanh dương · 緑 midori xanh lá." },
  { id: "jp-3-6", step: 3, jp: "ケースサイズは41ミリです。", romaji: "Keesu saizu wa yonjuuichi-miri desu.", vi: "Cỡ vỏ 41mm ạ.", len: "short" },
  { id: "jp-3-7", step: 3, jp: "100メートル防水です。", romaji: "Hyaku-meetoru bousui desu.", vi: "Chống nước 100m ạ.", len: "short" },
  { id: "jp-3-8", step: 3, jp: "パワーリザーブは約70時間です。", romaji: "Pawaa rizaabu wa yaku nanajuu-jikan desu.", vi: "Trữ cót khoảng 70 giờ ạ.", len: "long" },
  { id: "jp-3-9", step: 3, jp: "ベゼルはセラミック製で、傷がつきにくいです。", romaji: "Bezeru wa seramikku-sei de, kizu ga tsukinikui desu.", vi: "Vành làm bằng gốm nên rất khó xước ạ.", len: "long" },
  { id: "jp-3-10", step: 3, jp: "ダイヤはアフターではなく、純正です。", romaji: "Daiya wa afutaa dewa naku, junsei desu.", vi: "Kim cương là chính hãng, không phải gắn thêm ạ.", len: "long", note: "純正 junsei = chính hãng · アフター afutaa = độ thêm sau." },
  { id: "jp-3-11", step: 3, jp: "ベルトのサイズ調整は無料でいたします。", romaji: "Beruto no saizu chousei wa muryou de itashimasu.", vi: "Chỉnh dây miễn phí ạ.", len: "long" },

  // ————— 4. DEAL GIÁ —————
  { id: "jp-4-1", step: 4, jp: "お値段は100万円です。", romaji: "Onedan wa hyaku-man-en desu.", vi: "Giá là 1.000.000 yên ạ.", len: "short", note: "万 man = 10.000. 100万 = 1 triệu yên." },
  { id: "jp-4-2", step: 4, jp: "税込みです。", romaji: "Zeikomi desu.", vi: "Đã bao gồm thuế ạ.", len: "short" },
  { id: "jp-4-3", step: 4, jp: "税抜きです。", romaji: "Zeinuki desu.", vi: "Chưa bao gồm thuế ạ.", len: "short" },
  { id: "jp-4-4", step: 4, jp: "少しお値引きできます。", romaji: "Sukoshi onebiki dekimasu.", vi: "Em giảm giá được một chút ạ.", len: "short" },
  { id: "jp-4-5", step: 4, jp: "これが精一杯です。", romaji: "Kore ga seiippai desu.", vi: "Đây là mức tốt nhất em làm được ạ.", len: "short", note: "Câu chốt giá lịch sự mà dứt khoát." },
  { id: "jp-4-6", step: 4, jp: "分割払いもできます。", romaji: "Bunkatsu-barai mo dekimasu.", vi: "Có thể trả góp ạ.", len: "short" },
  { id: "jp-4-7", step: 4, jp: "本日ご成約でしたら、5パーセントお引きします。", romaji: "Honjitsu goseiyaku deshitara, go-paasento ohiki shimasu.", vi: "Nếu anh/chị chốt hôm nay, em giảm 5% ạ.", len: "long", note: "Mẫu câu 'nhượng bộ có điều kiện' — rất hay dùng." },
  { id: "jp-4-8", step: 4, jp: "こちらは市場価格より、お安くなっております。", romaji: "Kochira wa shijou kakaku yori, oyasuku natte orimasu.", vi: "Giá này đang thấp hơn giá thị trường ạ.", len: "long" },
  { id: "jp-4-9", step: 4, jp: "申し訳ございませんが、これ以上のお値引きは難しいです。", romaji: "Moushiwake gozaimasen ga, kore ijou no onebiki wa muzukashii desu.", vi: "Xin lỗi anh/chị, em không giảm thêm được ạ.", len: "long" },

  // ————— 5. CHỐT ĐƠN & THANH TOÁN —————
  { id: "jp-5-1", step: 5, jp: "カードは使えます。", romaji: "Kaado wa tsukaemasu.", vi: "Thanh toán thẻ được ạ.", len: "short" },
  { id: "jp-5-2", step: 5, jp: "現金でお願いします。", romaji: "Genkin de onegai shimasu.", vi: "Xin thanh toán tiền mặt ạ.", len: "short" },
  { id: "jp-5-3", step: 5, jp: "パスポートをお願いします。", romaji: "Pasupooto wo onegai shimasu.", vi: "Cho em xin hộ chiếu ạ.", len: "short", note: "Bắt buộc khi làm miễn thuế cho khách nước ngoài." },
  { id: "jp-5-4", step: 5, jp: "こちらにサインをお願いします。", romaji: "Kochira ni sain wo onegai shimasu.", vi: "Anh/chị ký vào đây giúp em ạ.", len: "short" },
  { id: "jp-5-5", step: 5, jp: "プレゼント用ですか。", romaji: "Purezento-you desu ka.", vi: "Đây là quà tặng ạ?", len: "short" },
  { id: "jp-5-6", step: 5, jp: "免税手続きができます。", romaji: "Menzei tetsuzuki ga dekimasu.", vi: "Bên em làm được thủ tục miễn thuế ạ.", len: "long" },
  { id: "jp-5-7", step: 5, jp: "ラッピングは無料でおつけします。", romaji: "Rappingu wa muryou de otsuke shimasu.", vi: "Em gói quà miễn phí cho anh/chị ạ.", len: "long" },
  { id: "jp-5-8", step: 5, jp: "お支払いは一括と分割、どちらになさいますか。", romaji: "Oshiharai wa ikkatsu to bunkatsu, dochira ni nasaimasu ka.", vi: "Anh/chị thanh toán một lần hay trả góp ạ?", len: "long", note: "Câu chốt kiểu 'giả định đã mua' — không hỏi có mua không." },

  // ————— 6. SAU BÁN & GIỮ KHÁCH —————
  { id: "jp-6-1", step: 6, jp: "保証書です。", romaji: "Hoshousho desu.", vi: "Đây là phiếu bảo hành ạ.", len: "short" },
  { id: "jp-6-2", step: 6, jp: "保証は5年間です。", romaji: "Hoshou wa go-nenkan desu.", vi: "Bảo hành 5 năm ạ.", len: "short" },
  { id: "jp-6-3", step: 6, jp: "ありがとうございました。", romaji: "Arigatou gozaimashita.", vi: "Cảm ơn quý khách ạ.", len: "short", note: "Dùng thì quá khứ ました khi khách đã mua xong." },
  { id: "jp-6-4", step: 6, jp: "またお越しくださいませ。", romaji: "Mata okoshi kudasaimase.", vi: "Mong được đón tiếp anh/chị lần sau ạ.", len: "short" },
  { id: "jp-6-5", step: 6, jp: "こちらが私の名刺です。", romaji: "Kochira ga watashi no meishi desu.", vi: "Đây là danh thiếp của em ạ.", len: "short" },
  { id: "jp-6-6", step: 6, jp: "オーバーホールは4年から6年ごとをおすすめします。", romaji: "Oobaahooru wa yo-nen kara roku-nen goto wo osusume shimasu.", vi: "Em khuyên nên lau dầu mỗi 4-6 năm ạ.", len: "long" },
  { id: "jp-6-7", step: 6, jp: "何かございましたら、いつでもご連絡ください。", romaji: "Nanika gozaimashitara, itsudemo gorenraku kudasai.", vi: "Có gì anh/chị cứ liên hệ em bất cứ lúc nào ạ.", len: "long" },
];

export const jpPhrases = PHRASES;
export const phrasesOfStep = (step: number) => PHRASES.filter((p) => p.step === step);
export const getPhrase = (id: string) => PHRASES.find((p) => p.id === id);

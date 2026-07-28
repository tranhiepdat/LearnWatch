/**
 * TIPS & TRICKS bán đồng hồ — mỗi ngày app chọn vài tip để ôn.
 *
 * Cách THÊM TIP MỚI: append vào mảng `LIST` bên dưới (id không trùng).
 * Khi mảng phình to có thể tách `tipsExtra.ts` rồi spread như `watches.ts`.
 */

export type TipCat = "Tư vấn" | "Chốt deal" | "Nhận diện" | "Chăm sóc" | "Kiến thức";
export const TIP_CATS: TipCat[] = ["Tư vấn", "Chốt deal", "Nhận diện", "Chăm sóc", "Kiến thức"];

export interface SaleTip {
  id: string;
  cat: TipCat;
  /** 1 câu chốt — hiện ở card "tip hôm nay" và ở summary */
  short: string;
  /** giải thích sâu: vì sao, làm thế nào */
  detail: string;
  /** câu mẫu nói với khách — tiếng Việt */
  say?: string;
  /** câu nói với khách bằng TIẾNG ANH — tự nhiên như người bán thật nói,
   *  không dịch word-by-word, không trịnh trọng máy móc */
  sayEn?: string;
  /** PHIÊN ÂM câu tiếng Anh, viết theo cách đọc của người Việt */
  sayPhon?: string;
}

const LIST: SaleTip[] = [
  // ————— TƯ VẤN —————
  {
    id: "t-hoi-truoc-bao-sau",
    cat: "Tư vấn",
    short: "Khách hỏi giá ngay — đừng báo liền, hỏi nhu cầu trước.",
    detail:
      "Báo giá khi chưa biết khách cần gì thì con số trở thành thứ duy nhất để so sánh, và bạn luôn thua người bán rẻ hơn. Hỏi 2-3 câu về mục đích đeo, cỡ tay, ngân sách khoảng nào — rồi mới đưa ra 2 lựa chọn kèm giá.",
    say: "Dạ để em tư vấn đúng mẫu, anh/chị đeo đi làm hay đi tiệc là chính ạ?",
    sayEn: "Before I point you anywhere — is this more of an everyday watch, or for special occasions?",
    sayPhon: "bi-PHO ai point diu E-ni-que — íz đít mo ợv ần EV-ri-đây oọtch, o pho SPE-sồl ợ-CÊI-zần?",
  },
  {
    id: "t-hai-lua-chon",
    cat: "Tư vấn",
    short: "Luôn đưa 2 lựa chọn, đừng đưa 5.",
    detail:
      "Đưa quá nhiều mẫu khiến khách hoang mang và hoãn quyết định. Chọn sẵn 2 mẫu hợp nhu cầu — một 'đúng ý' và một 'nhỉnh hơn chút'. Khách chuyển từ câu hỏi 'mua hay không' sang 'mua cái nào'.",
    say: "Với nhu cầu của anh, em thấy có 2 mẫu hợp nhất — anh xem thử cái nào ưng tay hơn ạ.",
    sayEn: "For what you're after, these two are the best fit. Let's see which one sits better on you.",
    sayPhon: "pho oọt diu ợ AF-tơ, đíz tu a đờ bét phít. lét-s si uých oăn xít-s BET-tơ on diu.",
  },
  {
    id: "t-deo-thu",
    cat: "Tư vấn",
    short: "Luôn mời khách ĐEO THỬ — đó là bước chốt quan trọng nhất.",
    detail:
      "Đồng hồ trên tay khác hoàn toàn trong tủ kính. Khi khách đã đeo lên và nhìn vào gương, cảm giác sở hữu bắt đầu. Đừng hỏi 'anh có muốn thử không' (dễ bị từ chối) — hãy mở khoá sẵn và đưa ra.",
    say: "Em mở sẵn rồi, anh đeo thử cho biết cỡ tay nha.",
    sayEn: "I've got it unlocked — here, try it on and let's check the fit.",
    sayPhon: "ai-v gót ít ần-LỐC-t — hia, trai ít on en lét-s chék đờ phít.",
  },
  {
    id: "t-co-tay",
    cat: "Tư vấn",
    short: "Hỏi cỡ cổ tay trước khi giới thiệu size mặt.",
    detail:
      "Cổ tay dưới 16cm thường hợp 36-39mm; 16-18cm hợp 39-41mm; trên 18cm mới nên 42mm+. Giới thiệu sai size là mất thời gian cả hai bên, và khách đeo thấy 'không hợp' sẽ mất hứng luôn với cả cửa hàng.",
    say: "Cho em xem cổ tay anh/chị chút để chọn size cho chuẩn ạ.",
    sayEn: "Mind if I check your wrist? That way I get the size right the first time.",
    sayPhon: "main íp ai chék dio rít? đét uây ai ghét đờ xai rai đờ phớt-x taim.",
  },
  {
    id: "t-im-lang",
    cat: "Tư vấn",
    short: "Sau khi báo giá — im lặng.",
    detail:
      "Nói thêm sau khi báo giá thường là tự thương lượng với chính mình (giảm giá khi khách chưa đòi). Báo giá xong, dừng lại. Để khách phản hồi trước.",
    say: "(im lặng — để khách phản hồi trước)",
    sayEn: "…(stay quiet here and let them respond first)",
    sayPhon: "(im lặng — không nói gì)",
  },
  {
    id: "t-nghe-nhieu-hon-noi",
    cat: "Tư vấn",
    short: "Nghe nhiều hơn nói — khách nói càng nhiều, tỉ lệ chốt càng cao.",
    detail:
      "Người bán giỏi thường nói ít hơn khách. Mỗi câu khách kể về công việc, sở thích, dịp mua là một manh mối để chọn mẫu và chọn cách chốt. Hỏi mở: 'Anh thích kiểu mặt số thế nào?' thay vì 'Anh thích cái này không?'.",
    say: "Anh/chị thích kiểu mặt số thế nào ạ?",
    sayEn: "What kind of dial do you usually go for?",
    sayPhon: "oát kaind ợv ĐAI-ồl đu diu YU-du-ợ-li gâu pho?",
  },
  {
    id: "t-ke-chuyen",
    cat: "Tư vấn",
    short: "Bán câu chuyện, không bán thông số.",
    detail:
      "Khách không nhớ '904L steel' hay 'Cal. 3235'. Họ nhớ 'chiếc này phi hành gia đeo lên Mặt Trăng' (Speedmaster) hay 'thợ lặn Rolex làm cho thợ lặn' (Submariner). Mỗi mẫu chủ lực nên thuộc 1 câu chuyện 15 giây.",
    say: "Mẫu này chính là chiếc phi hành gia đeo lên Mặt Trăng đó ạ.",
    sayEn: "This is the one that actually went to the Moon — same watch, same story.",
    sayPhon: "đít íz đờ oăn đét ÉC-chu-ợ-li oen tu đờ mun — xêm oọtch, xêm STO-ri.",
  },

  // ————— CHỐT DEAL —————
  {
    id: "t-khong-giam-ngay",
    cat: "Chốt deal",
    short: "Đừng giảm giá ngay lần đòi đầu tiên.",
    detail:
      "Giảm ngay lập tức dạy khách rằng giá của bạn không thật, và họ sẽ đòi tiếp. Trước khi giảm tiền, thử tăng giá trị: dây tặng kèm, bảo dưỡng miễn phí, hộp, ship. Nếu buộc phải giảm, giảm ít và đổi lấy điều kiện (chốt hôm nay, thanh toán full).",
    say: "Giá này em không giảm thêm được, nhưng em tặng anh gói lau dầu + dây dự phòng nhé.",
    sayEn: "I can't move much on price, but I'll include a full service and a spare strap.",
    sayPhon: "ai kant mup mắch on prai-x, bắt ai-l in-CLUD ợ phul SƠ-vít-x en ợ x-pe strap.",
  },
  {
    id: "t-doi-lay-dieu-kien",
    cat: "Chốt deal",
    short: "Mỗi lần nhượng bộ phải đổi lấy một điều kiện.",
    detail:
      "Nhượng bộ vô điều kiện làm khách nghĩ còn dư địa. Luôn gắn: 'Em giảm được X NẾU anh chốt hôm nay' hoặc 'nếu anh lấy luôn cả dây'. Giữ được cả biên lợi nhuận lẫn thế đàm phán.",
    say: "Em giảm được nếu anh chốt hôm nay ạ.",
    sayEn: "I can do a bit better on price if we wrap it up today.",
    sayPhon: "ai kèn đu ợ bít BET-tơ on prai-x íp qui ráp ít áp tu-ĐÂY.",
  },
  {
    id: "t-chot-gia-dinh",
    cat: "Chốt deal",
    short: "Khách nói 'để về bàn với vợ' — hỏi thêm 1 câu trước khi để đi.",
    detail:
      "Đó thường là cách từ chối lịch sự, che một lo ngại chưa nói. Hỏi nhẹ để lộ ra lý do thật: nếu là giá thì còn xử lý được, nếu là phân vân mẫu thì đổi mẫu.",
    say: "Dạ được ạ. Mà ngoài giá ra, còn điểm nào anh còn lăn tăn không để em nói rõ thêm?",
    sayEn: "Of course, take your time. Besides the price, is there anything else on your mind I can clear up?",
    sayPhon: "ợv KO-sờ, tếch dio taim. bi-XAI-đờ-s đờ prai-x, íz đe É-ni-thing ê-l-s on dio maind ai kèn kliơ áp?",
  },
  {
    id: "t-khan-hiem-that",
    cat: "Chốt deal",
    short: "Dùng khan hiếm THẬT, đừng bịa.",
    detail:
      "'Còn đúng 1 chiếc màu này' chỉ hiệu quả khi đúng sự thật — khách quay lại thấy vẫn còn thì mất sạch niềm tin. Với mẫu thật sự hiếm (Daytona, Nautilus, GMT Pepsi), nói rõ tình trạng thị trường là đủ mạnh rồi.",
    say: "Màu này bên em còn đúng một chiếc thôi ạ.",
    sayEn: "This colour — we're down to the last one, honestly.",
    sayPhon: "đít KÁ-lơ — qui-rờ đao tu đờ lát-x oăn, ỌN-ợt-li.",
  },
  {
    id: "t-chot-bang-buoc-tiep",
    cat: "Chốt deal",
    short: "Chốt bằng bước tiếp theo, đừng hỏi 'anh mua không'.",
    detail:
      "Câu hỏi Có/Không dễ bị trả lời 'Không'. Thay bằng câu giả định đã mua: hỏi về cách thanh toán, khắc tên, hay chỉnh dây. Khách trả lời tức là đã đồng ý mua.",
    say: "Anh thanh toán thẻ hay chuyển khoản ạ? Em chỉnh dây vừa tay luôn cho anh nhé.",
    sayEn: "Card or transfer? Either way I'll size the bracelet for you before you go.",
    sayPhon: "kát o TRAN-s-phơ? Í-đờ uây ai-l xai-z đờ BRÊI-x-lịt pho diu bi-PHO diu gâu.",
  },
  {
    id: "t-im-khi-khach-suy-nghi",
    cat: "Chốt deal",
    short: "Khách đang cân nhắc — đừng chen vào.",
    detail:
      "Khoảnh khắc khách im lặng nhìn đồng hồ là lúc họ đang tự thuyết phục mình. Nói xen vào sẽ cắt mạch. Đứng gần, im lặng, để họ tự đi tới quyết định.",
    say: "(đứng gần, im lặng, để khách tự quyết)",
    sayEn: "…(stand close, stay quiet, let them get there themselves)",
    sayPhon: "(im lặng — đứng gần, để khách tự quyết)",
  },

  // ————— NHẬN DIỆN —————
  {
    id: "t-cyclops",
    cat: "Nhận diện",
    short: "Rolex thật: kính lúp Cyclops phóng đại 2.5×, chữ ngày lấp đầy ô.",
    detail:
      "Hàng nhái thường chỉ phóng ~1.5× nên số ngày trông nhỏ, lệch tâm, không lấp đầy ô kính. Đây là điểm kiểm tra nhanh nhất, chỉ mất 2 giây khi cầm lên.",
    say: "Anh nhìn ô ngày qua kính lúp — chữ phải lấp đầy ô mới là thật ạ.",
    sayEn: "Look at the date through the lens — on a real one the digits fill the whole window.",
    sayPhon: "lúc ét đờ đêit thru đờ len-z — on ợ ri-ồl oăn đờ ĐI-jít-s phil đờ hâu UYN-đâu.",
  },
  {
    id: "t-kim-giay-truot",
    cat: "Nhận diện",
    short: "Kim giây phải TRÔI mượt, không giật từng nhịp rõ.",
    detail:
      "Máy cơ tần số cao (28.800 vph) cho kim giây nhích 8 nhịp/giây, mắt thường thấy như trôi. Kim giật đúng 1 nhịp/giây gần như chắc chắn là máy quartz — trong khi mẫu đó đáng lẽ phải là cơ.",
    say: "Kim giây trôi mượt chứ không giật từng nhịp — đó là máy cơ ạ.",
    sayEn: "See how the second hand sweeps instead of ticking? That's the mechanical movement.",
    sayPhon: "xi hao đờ SÉ-cần hend x-uíp-s in-x-TÉT ợv TÍC-king? đét-s đờ mờ-KA-ni-cồl MU-vờ-mần.",
  },
  {
    id: "t-trong-luong",
    cat: "Nhận diện",
    short: "Cầm lên thấy nhẹ bất thường là dấu hiệu đáng ngờ.",
    detail:
      "Thép 904L và vàng đặc rất nặng tay. Hàng nhái hay dùng thép mỏng, hợp kim rẻ hoặc mạ nên nhẹ hơn hẳn. Cầm nhiều hàng thật sẽ hình thành cảm giác chuẩn — đây là kỹ năng cần luyện bằng tay, không đọc được.",
    say: "Anh cầm thử xem, hàng thật nặng tay hơn hẳn ạ.",
    sayEn: "Here, feel the weight — the real thing sits much heavier in the hand.",
    sayPhon: "hia, phiu đờ uêit — đờ ri-ồl thing xít-s mắch HE-vi-ơ in đờ hend.",
  },
  {
    id: "t-khac-chu",
    cat: "Nhận diện",
    short: "Soi chữ khắc: hàng thật sắc nét, đều, không rỗ.",
    detail:
      "Thương hiệu lớn khắc bằng laser hoặc dập chính xác — nét sắc, sâu đều, khoảng cách chữ chuẩn. Hàng nhái thường in hoặc khắc nông, cạnh chữ lởm chởm khi soi kính lúp. Đặc biệt để ý số ref và số máy.",
    say: "Chữ khắc hàng thật sắc nét đều, soi kính lúp là thấy ngay ạ.",
    sayEn: "The engraving on a genuine one is razor sharp — you can see it under a loupe.",
    sayPhon: "đờ en-GRÊI-ving on ợ JE-nhiu-in oăn íz RÊI-zơ sáp — diu kèn xi ít ÁN-đơ ợ lup.",
  },
  {
    id: "t-cau-hinh-khong-ton-tai",
    cat: "Nhận diện",
    short: "Cấu hình 'không tồn tại' là dấu hiệu hàng độ rõ nhất.",
    detail:
      "Nhiều hàng độ lắp mặt số, vành, dây không hề có trong catalogue chính hãng (ví dụ mặt kim cương trên mẫu vốn không có bản đó). Thuộc cấu hình gốc của các dòng chủ lực là cách phát hiện nhanh nhất — đây chính là thứ app này luyện.",
    say: "Cấu hình này hãng chưa từng sản xuất, nên đây là hàng độ ạ.",
    sayEn: "This exact configuration was never made by the brand — so it's been modified.",
    sayPhon: "đít ếc-ZẾCT con-phí-ghiu-RÊI-shần oợz NÉ-vơ mêit bai đờ brend — sâu ít-s bin MO-đi-phaid.",
  },
  {
    id: "t-giay-to",
    cat: "Nhận diện",
    short: "Full box & paper làm tăng giá trị bán lại đáng kể.",
    detail:
      "Hộp, thẻ bảo hành có ngày mua, hoá đơn gốc có thể chênh 10-20% giá resale so với 'watch only'. Luôn nhắc khách giữ đủ bộ — và khi thu mua, kiểm tra số ref trên thẻ khớp với đồng hồ.",
    say: "Anh giữ đủ hộp và thẻ nhé, sau này bán lại được giá hơn nhiều ạ.",
    sayEn: "Hold on to the box and papers — it makes a real difference if you ever resell.",
    sayPhon: "hâuld on tu đờ bốc-x en PÊI-pơ-s — ít mêit-s ợ ri-ồl ĐÍ-phờ-rần-x íp diu É-vơ ri-XEO.",
  },

  // ————— CHĂM SÓC KHÁCH —————
  {
    id: "t-nhan-tin-sau-ban",
    cat: "Chăm sóc",
    short: "Nhắn lại sau 3 ngày — đây là lúc tạo khách quen.",
    detail:
      "Hầu như không ai làm bước này. Một tin nhắn hỏi thăm 'anh đeo thấy vừa tay chưa' khiến khách nhớ bạn, và là thời điểm tự nhiên nhất để xin giới thiệu bạn bè.",
    say: "Dạ anh đeo mấy hôm thấy vừa tay chưa ạ? Có gì cần chỉnh anh nhắn em nha.",
    sayEn: "How's it been wearing these few days? Just message me if it needs adjusting.",
    sayPhon: "hao-z ít bin OE-ring đít phiu đêi-z? jất MÉ-xịt mi íp ít nít-s ợ-JÁT-xting.",
  },
  {
    id: "t-luu-thong-tin",
    cat: "Chăm sóc",
    short: "Lưu lại sở thích + dịp đặc biệt của khách.",
    detail:
      "Ghi lại mẫu khách từng xem, cỡ tay, sinh nhật, kỷ niệm. Một tin nhắn đúng dịp kèm mẫu đúng gu hiệu quả hơn mọi quảng cáo. Khách cao cấp mua bằng quan hệ, không mua bằng giá.",
    say: "Em lưu lại gu của anh, có mẫu hợp em báo liền ạ.",
    sayEn: "I'll keep your taste in mind — if something you'd like comes in, I'll let you know.",
    sayPhon: "ai-l kíp dio têi-x-t in maind — íp SÁM-thing diu-đờ laic kăm-z in, ai-l lét diu nâu.",
  },
  {
    id: "t-khong-che-hang-khac",
    cat: "Chăm sóc",
    short: "Đừng chê chiếc khách đang đeo.",
    detail:
      "Chê đồng hồ khách đang đeo là chê quyết định trước đây của họ — phản ứng phòng thủ lập tức. Thay vào đó khen điểm mạnh rồi định vị mẫu mới là bổ sung cho bộ sưu tập, không phải thay thế.",
    say: "Chiếc này của anh đẹp mà bền, hợp đi làm. Mẫu này thì hợp mấy dịp tiệc hơn.",
    sayEn: "That's a solid piece — perfect for everyday. This one leans dressier, so they'd work well together.",
    sayPhon: "đét-s ợ SO-lịt pi-x — PƠ-phếct pho EV-ri-đây. đít oăn lin-z ĐRE-si-ơ, sâu đêi-đờ uơc oeo tu-GHE-đơ.",
  },
  {
    id: "t-bao-duong",
    cat: "Chăm sóc",
    short: "Nhắc lịch lau dầu 4-6 năm — vừa giữ khách vừa tạo doanh thu.",
    detail:
      "Máy cơ cần bảo dưỡng 4-6 năm/lần. Chủ động nhắc là dịch vụ tốt, đồng thời tạo điểm chạm để khách quay lại cửa hàng — và người quay lại thường mua thêm.",
    say: "Khoảng 4-5 năm anh mang qua em lau dầu một lần nhé.",
    sayEn: "Bring it back in about four or five years for a service and it'll run like new.",
    sayPhon: "bring ít bék in ợ-BAO pho o phai-v dia-z pho ợ SƠ-vít-x en ít-l răn laic niu.",
  },

  // ————— KIẾN THỨC —————
  {
    id: "t-noi-ref",
    cat: "Kiến thức",
    short: "Gọi tên bằng số ref thay vì 'con này' — khách thấy bạn chuyên nghiệp.",
    detail:
      "'126610LN' nghe khác hẳn 'con Sub đen'. Dân chơi đánh giá người bán qua việc có thuộc ref hay không. Bắt đầu bằng ref của 10 mẫu bán chạy nhất tại cửa hàng.",
    say: "Mẫu này là ref 126610LN ạ.",
    sayEn: "This one's the 126610LN.",
    sayPhon: "đít oăn-x đờ oăn-tu-xích-x xích-x-oăn-âu-EL-EN.",
  },
  {
    id: "t-biet-danh",
    cat: "Kiến thức",
    short: "Thuộc biệt danh dân chơi: Pepsi, Batman, Hulk, Panda…",
    detail:
      "Khách sành thường hỏi theo biệt danh chứ không theo ref. Không hiểu 'anh còn con Batman không' là lộ ngay mình không trong nghề. Biệt danh cũng là cách kể chuyện dễ nhớ nhất cho khách mới.",
    say: "Dân chơi hay gọi mẫu này là 'Batman' đó ạ.",
    sayEn: "Collectors call this one the Batman.",
    sayPhon: "cợ-LẾC-tơ-s kol đít oăn đờ BÉT-mèn.",
  },
  {
    id: "t-mau-mat-so",
    cat: "Kiến thức",
    short: "Gọi ĐÚNG tên màu tiếng Anh, đừng nói 'màu xanh'.",
    detail:
      "'Ice blue' (chỉ có trên bản bạch kim), 'Wimbledon', 'Meteorite', 'Champagne' — mỗi tên gắn với một cấu hình và một mức giá. Nói sai tên màu là mất uy tín ngay với khách sành.",
    say: "Màu này gọi là 'ice blue', chỉ có trên bản bạch kim thôi ạ.",
    sayEn: "This shade is called ice blue — it only comes on the platinum version.",
    sayPhon: "đít shêit íz kold ai-x blu — ít ÂU-li kăm-z on đờ PLA-ti-nồm VƠ-shần.",
  },
  {
    id: "t-gia-thi-truong",
    cat: "Kiến thức",
    short: "Nắm giá thị trường thứ cấp, đừng chỉ nhớ giá niêm yết.",
    detail:
      "Nhiều mẫu hot bán trên giá niêm yết nhiều lần. Khách thường tra giá trước khi tới. Không nắm giá thực tế sẽ mất thế trong thương lượng và trông thiếu chuyên nghiệp.",
    say: "Mẫu này ngoài thị trường đang cao hơn giá niêm yết ạ.",
    sayEn: "This one actually trades above retail right now.",
    sayPhon: "đít oăn ÉC-chu-ợ-li trêi-đờ-s ợ-BÁP RI-têi-l rai náo.",
  },
  {
    id: "t-chat-lieu",
    cat: "Kiến thức",
    short: "Phân biệt được vàng đặc, bọc vàng và mạ PVD.",
    detail:
      "Vàng đặc (solid gold) nguyên khối, nặng, giữ giá. Bọc vàng (gold-filled/cap) là lớp vàng dày ép lên nền kim loại. Mạ PVD chỉ là lớp phủ mỏng, mòn theo thời gian. Chênh lệch giá rất lớn — nói nhầm là mất tiền hoặc mất khách.",
    say: "Đây là vàng đặc chứ không phải mạ, nên giữ giá tốt ạ.",
    sayEn: "This is solid gold, not plated — that's why it holds its value.",
    sayPhon: "đít íz SO-lịt gâul, nót PLÊI-tịt — đét-s oai ít hâuld-s ít-s VE-liu.",
  },
  {
    id: "t-chong-nuoc",
    cat: "Kiến thức",
    short: "Chống nước 30m KHÔNG có nghĩa là bơi được.",
    detail:
      "30m chỉ chịu văng nước, rửa tay. Bơi cần từ 100m, lặn cần 200m+. Tư vấn sai chỗ này dẫn tới đồng hồ vào nước và khách quay lại khiếu nại — nên nói rõ ngay từ đầu.",
    say: "Mẫu này 50m thì rửa tay, đi mưa thoải mái, nhưng bơi thì em khuyên mẫu 100m trở lên ạ.",
    sayEn: "At 50 metres you're fine for handwashing and rain. If you want to swim in it, I'd go 100 metres or more.",
    sayPhon: "ét PHÍP-ti MI-tơ-s diu-rờ phain pho HEND-oo-shing en rêin. íp diu oọn tu x-uim in ít, ai-đờ gâu ợ HĂN-đrịt MI-tơ-s o mo.",
  },
  {
    id: "t-power-reserve",
    cat: "Kiến thức",
    short: "Giải thích trữ cót cho khách mới chơi máy cơ.",
    detail:
      "Đồng hồ cơ automatic lên cót nhờ chuyển động tay, trữ cót thường 40-70 giờ. Để yên qua cuối tuần là ngừng chạy — nhiều khách mới tưởng đồng hồ hỏng. Nói trước sẽ tránh được một lần khiếu nại.",
    say: "Để yên khoảng 2 ngày là đồng hồ ngừng, anh lắc nhẹ hoặc đeo lại là chạy ạ.",
    sayEn: "If you leave it off for a couple of days it'll stop — just give it a shake or wear it and it starts right up.",
    sayPhon: "íp diu li-v ít óp pho ợ KẮP-pồl ợv đêi-z ít-l x-tóp — jất ghi-v ít ợ shêic o oe ít en ít x-tát-s rai áp.",
  },
  {
    id: "t-sai-so",
    cat: "Kiến thức",
    short: "Máy cơ sai vài giây/ngày là BÌNH THƯỜNG.",
    detail:
      "Chuẩn COSC cho phép -4/+6 giây mỗi ngày. Khách quen dùng quartz hoặc điện thoại thường nghĩ sai vài giây là lỗi. Giải thích trước lúc bán sẽ tiết kiệm rất nhiều lần giải thích sau đó.",
    say: "Máy cơ sai vài giây mỗi ngày là bình thường ạ, không phải lỗi đâu.",
    sayEn: "A few seconds a day is completely normal for a mechanical — nothing's wrong with it.",
    sayPhon: "ợ phiu SÉ-cần-đờ-s ợ đêi íz căm-PLÍT-li NO-mồl pho ợ mờ-KA-ni-cồl — NÁ-thing-x rong uých ít.",
  },
  {
    id: "t-vanh-xoay",
    cat: "Kiến thức",
    short: "Vành lặn chỉ xoay MỘT chiều — và đó là tính năng an toàn.",
    detail:
      "Vành đồng hồ lặn cố tình chỉ xoay ngược chiều kim đồng hồ: nếu vô tình va chạm làm xoay, thời gian lặn hiển thị sẽ NGẮN hơn thực tế, khiến thợ lặn nổi lên sớm hơn — an toàn. Chi tiết này luôn gây ấn tượng khi kể cho khách.",
    say: "Vành này cố tình chỉ xoay một chiều, để thợ lặn luôn an toàn ạ.",
    sayEn: "The bezel only turns one way on purpose — it's a safety thing for divers.",
    sayPhon: "đờ BE-zồl ÂU-li tơn-z oăn uây on PƠ-pợ-s — ít-s ợ XÊIP-ti thing pho ĐAI-vơ-s.",
  },
];

export const tips = LIST;
export const getTip = (id: string) => LIST.find((t) => t.id === id);

/** Hash chuỗi ngày → chọn tip cố định trong ngày (không cần lưu gì).
 *  Cùng một ngày luôn ra cùng bộ tip; qua ngày mới là bộ khác. */
export function tipsOfDay(dayKey: string, n = 3): SaleTip[] {
  let h = 2166136261;
  for (let i = 0; i < dayKey.length; i++) {
    h ^= dayKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const start = Math.abs(h) % LIST.length;
  const step = 7; // nguyên tố cùng nhau với đa số độ dài → trải đều, không lặp
  const out: SaleTip[] = [];
  for (let i = 0; i < Math.min(n, LIST.length); i++) {
    out.push(LIST[(start + i * step) % LIST.length]);
  }
  return out;
}

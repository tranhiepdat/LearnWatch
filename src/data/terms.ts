import type { Term } from "./types";

/**
 * Tu dien chat lieu, cong nghe, bo may - dung cho flashcard & quiz "chat lieu".
 */
export const terms: Term[] = [
  // -------- ROLEX --------
  {
    id: "oystersteel",
    brand: "Rolex",
    term: "Oystersteel",
    category: "Chất liệu",
    short: "Thép 904L độc quyền của Rolex, chống ăn mòn vượt trội.",
    detail:
      "Là thép không gỉ nhóm 904L (Rolex gọi tên thương mại Oystersteel). Cứng hơn, chống ăn mòn và giữ độ bóng tốt hơn thép 316L thông thường mà đa số hãng khác dùng. Vì rất khó gia công nên Rolex phải tự đầu tư máy móc riêng.",
  },
  {
    id: "everose",
    brand: "Rolex",
    term: "Everose Gold",
    category: "Chất liệu",
    short: "Vàng hồng 18k độc quyền Rolex, KHÔNG bị phai màu.",
    detail:
      "Hợp kim vàng hồng do Rolex tự pha chế năm 2005, có thêm một chút platinum giúp giữ sắc hồng vĩnh viễn. Vàng hồng thường của hãng khác lâu ngày dễ ngả vàng do đồng bị oxi hóa; Everose thì 'ever rose' - hồng mãi.",
  },
  {
    id: "rolesor",
    brand: "Rolex",
    term: "Rolesor",
    category: "Chất liệu",
    short: "Kết hợp thép + vàng trên cùng một chiếc đồng hồ.",
    detail:
      "Ghép 'Rolex' + 'or' (vàng tiếng Pháp). Thường vỏ/dây thép, còn vành bezel và núm/giữa dây bằng vàng. Có 3 loại: Yellow Rolesor (vàng vàng), Everose Rolesor (vàng hồng), White Rolesor (vàng trắng, thường chỉ ở bezel).",
  },
  {
    id: "cerachrom",
    brand: "Rolex",
    term: "Cerachrom",
    category: "Chất liệu",
    short: "Vành bezel bằng gốm ceramic - không trầy, không phai màu.",
    detail:
      "Ghép 'ceramic' + 'chroma' (màu sắc). Vành gốm siêu cứng, chống trầy xước và tia UV nên không bao giờ bạc màu dưới nắng. Số và vạch được khắc rồi phủ một lớp vàng hoặc platinum mỏng. Bezel hai màu (như Pepsi) đúc nguyên khối là kỳ công kỹ thuật.",
  },
  {
    id: "chromalight",
    brand: "Rolex",
    term: "Chromalight",
    category: "Công nghệ",
    short: "Chất dạ quang phát sáng xanh, lâu gấp đôi loại thường.",
    detail:
      "Dạ quang độc quyền Rolex phát ánh sáng xanh dương, duy trì độ sáng tới khoảng 8 tiếng - lâu gần gấp đôi dạ quang tiêu chuẩn. Giúp đọc giờ rõ khi lặn sâu hoặc trong đêm.",
  },
  {
    id: "parachrom",
    brand: "Rolex",
    term: "Dây tóc Parachrom (xanh)",
    category: "Bộ máy",
    short: "Dây tóc xanh chống từ trường và chịu sốc tốt.",
    detail:
      "Dây tóc (hairspring) làm từ hợp kim niobium-zirconium, màu xanh đặc trưng. Không nhiễm từ, ổn định hơn trước thay đổi nhiệt độ và chịu sốc tốt hơn dây tóc thường tới 10 lần - giúp đồng hồ giữ độ chính xác.",
  },
  {
    id: "cyclops",
    brand: "Rolex",
    term: "Kính lúp Cyclops",
    category: "Công nghệ",
    short: "Thấu kính nhỏ phóng to ô ngày 2,5 lần.",
    detail:
      "Là 'bong bóng' kính ngay trên ô lịch, phóng đại con số ngày 2,5 lần cho dễ đọc. Ra đời 1953, là chi tiết nhận diện Rolex đặc trưng đến mức gần như thành thương hiệu.",
  },
  {
    id: "triplock",
    brand: "Rolex",
    term: "Núm vặn Triplock",
    category: "Công nghệ",
    short: "Núm vặn 3 lớp gioăng cho dòng đồng hồ lặn.",
    detail:
      "Hệ thống núm vặn xuống có 3 vòng gioăng chống nước, dùng cho Submariner/Sea-Dweller/Daytona. Dòng nhẹ hơn dùng Twinlock (2 gioăng). Đây là một phần của hệ vỏ Oyster kín nước trứ danh.",
  },
  {
    id: "glidelock",
    brand: "Rolex",
    term: "Khóa Glidelock / Easylink",
    category: "Dây đeo & khóa",
    short: "Cơ chế nới dây vài mm mà không cần dụng cụ.",
    detail:
      "Glidelock cho phép kéo dài dây từng nấc nhỏ (~2mm) để đeo ngoài bộ đồ lặn. Easylink là khâu nới nhanh ~5mm - tiện khi cổ tay giãn ra lúc trời nóng. Đều thao tác bằng tay, không cần tháo mắt dây.",
  },
  {
    id: "superlative",
    brand: "Rolex",
    term: "Superlative Chronometer",
    category: "Chứng nhận",
    short: "Chuẩn chính xác riêng của Rolex: -2/+2 giây mỗi ngày.",
    detail:
      "Sau khi đạt chuẩn COSC, mỗi chiếc Rolex còn được kiểm định nội bộ đạt sai số -2/+2 giây/ngày (gắt hơn COSC -4/+6). Đi kèm bảo hành 5 năm. Chữ này in màu xanh lá trên mặt số.",
  },
  {
    id: "jubilee-president",
    brand: "Rolex",
    term: "Dây Jubilee / President / Oyster",
    category: "Dây đeo & khóa",
    short: "Ba kiểu dây kim loại biểu tượng của Rolex.",
    detail:
      "Oyster: 3 mắt dẹt, thể thao, chắc chắn. Jubilee: 5 mắt nhỏ, mềm mại, ra mắt 1945 mừng 40 năm Rolex. President: 3 mắt bán nguyệt đặc, chỉ dành cho Day-Date/Datejust kim loại quý - sang trọng đỉnh cao.",
  },

  // -------- OMEGA --------
  {
    id: "coaxial",
    brand: "Omega",
    term: "Bộ thoát đồng trục Co-Axial",
    category: "Bộ máy",
    short: "Cơ chế giảm ma sát do George Daniels phát minh - bền hơn, ít bảo dưỡng.",
    detail:
      "Co-Axial escapement do thiên tài George Daniels sáng chế, Omega đưa vào sản xuất hàng loạt từ 1999. Giảm ma sát giữa các bộ phận nên hao mòn ít, giữ chính xác lâu và kéo dài chu kỳ bảo dưỡng. Là bước đột phá hiếm hoi của ngành trong 250 năm.",
  },
  {
    id: "master-chronometer",
    brand: "Omega",
    term: "Master Chronometer (METAS)",
    category: "Chứng nhận",
    short: "Chuẩn cao nhất: kháng từ 15.000 gauss, sai số 0/+5 giây/ngày.",
    detail:
      "Sau COSC, đồng hồ còn vượt 8 bài kiểm định độc lập của METAS (cơ quan đo lường Thụy Sĩ). Nổi bật nhất là kháng từ trường tới 15.000 gauss - mạnh hơn rất nhiều so với chuẩn thường, nên không sợ điện thoại/nam châm làm sai giờ.",
  },
  {
    id: "sedna",
    brand: "Omega",
    term: "Sedna Gold",
    category: "Chất liệu",
    short: "Vàng hồng 18k độc quyền Omega, giữ màu lâu.",
    detail:
      "Hợp kim vàng - đồng - palladium, đặt theo tên thiên thể Sedna đỏ nhất Hệ Mặt Trời. Palladium giúp khóa sắc hồng để không bị phai. Tương đương Everose của Rolex về mục đích.",
  },
  {
    id: "moonshine",
    brand: "Omega",
    term: "Moonshine Gold",
    category: "Chất liệu",
    short: "Vàng vàng 18k độc quyền, tông nhạt thanh nhã và bền màu.",
    detail:
      "Vàng vàng pha chế riêng, đặt tên theo ánh trăng dịu trên bầu trời đêm. Màu nhạt hơn vàng 18k truyền thống một chút và chống phai/xỉn màu theo thời gian tốt hơn.",
  },
  {
    id: "canopus",
    brand: "Omega",
    term: "Canopus Gold",
    category: "Chất liệu",
    short: "Vàng trắng 18k độc quyền, trắng sáng và bền màu.",
    detail:
      "Vàng trắng pha với palladium, rhodium và bạch kim, đặt tên theo ngôi sao Canopus sáng thứ nhì bầu trời. Trắng sáng hơn và giữ màu tốt hơn vàng trắng thông thường (vốn hay phải xi rhodium lại).",
  },
  {
    id: "liquidmetal",
    brand: "Omega",
    term: "Liquidmetal",
    category: "Công nghệ",
    short: "Hợp kim đặc biệt gắn vạch số lên bezel gốm cực bền.",
    detail:
      "Hợp kim vô định hình bám hoàn hảo vào gốm ceramic, dùng để khắc vạch/số trên bezel. Cứng gấp ~3 lần thép, không phai, không bong - thay cho sơn hay tráng men dễ mòn.",
  },
  {
    id: "ceragold",
    brand: "Omega",
    term: "Ceragold",
    category: "Công nghệ",
    short: "Kỹ thuật gắn liền vàng 18k vào bezel gốm liền mạch.",
    detail:
      "Cho phép đưa chi tiết vàng 18k bám trực tiếp vào gốm ceramic mà không có khe hở, bề mặt phẳng mịn. Tạo vành bezel vừa có độ bền của gốm vừa có ánh vàng sang trọng.",
  },
  {
    id: "naiad-lock",
    brand: "Omega",
    term: "Naiad Lock",
    category: "Công nghệ",
    short: "Cơ chế giữ chữ mặt đáy luôn thẳng đứng.",
    detail:
      "Hệ thống đảm bảo khi vặn kín nắp đáy thì dòng chữ/họa tiết khắc luôn nằm thẳng đúng hướng - một chi tiết hoàn thiện tinh tế thể hiện sự chỉn chu của Omega.",
  },

  // -------- CHUNG (ca hai hang dung) --------
  {
    id: "sapphire",
    brand: "Chung",
    term: "Kính Sapphire",
    category: "Chất liệu",
    short: "Mặt kính nhân tạo cực cứng, chống trầy gần như tuyệt đối.",
    detail:
      "Sapphire tổng hợp đạt ~9/10 thang độ cứng Mohs (chỉ sau kim cương). Gần như không trầy trong sử dụng hằng ngày. Thường phủ chống chói (AR coating). Khác với kính Hesalite (nhựa) vintage và kính khoáng (mineral) giá rẻ.",
  },
  {
    id: "helium-valve",
    brand: "Chung",
    term: "Van xả khí Heli",
    category: "Công nghệ",
    short: "Van cho khí heli thoát ra khi thợ lặn ngoi lên - tránh bung kính.",
    detail:
      "Khi lặn bão hòa trong buồng áp, khí heli li ti lọt vào đồng hồ. Lúc giảm áp để lên, van này cho heli thoát ra từ từ, nếu không áp suất bên trong sẽ bật văng mặt kính. Có trên Sea-Dweller, Seamaster Diver/Planet Ocean.",
  },
  {
    id: "titanium-g5",
    brand: "Chung",
    term: "Titanium Grade 5",
    category: "Chất liệu",
    short: "Hợp kim titan nhẹ, cứng, không gây dị ứng da.",
    detail:
      "Nhẹ hơn thép khoảng 40% nhưng vẫn rất cứng và chống ăn mòn, không gây kích ứng da. Đeo cả ngày không mỏi cổ tay. Omega dùng cho Ploprof, bản No Time To Die...",
  },
  {
    id: "cosc",
    brand: "Chung",
    term: "Chứng nhận COSC",
    category: "Chứng nhận",
    short: "Chuẩn chronometer Thụy Sĩ: sai số -4/+6 giây mỗi ngày.",
    detail:
      "COSC là cơ quan kiểm định độ chính xác của Thụy Sĩ. Đồng hồ đạt chuẩn được gọi là 'chronometer'. Cả Rolex (Superlative) và Omega (Master Chronometer) đều vượt xa mức nền COSC này.",
  },
  {
    id: "super-luminova",
    brand: "Chung",
    term: "Super-LumiNova",
    category: "Công nghệ",
    short: "Chất dạ quang hấp thụ sáng rồi phát sáng trong tối, không phóng xạ.",
    detail:
      "Hợp chất phát quang an toàn (không phóng xạ như Radium/Tritium xưa). 'Sạc' bằng ánh sáng rồi tự phát sáng. Omega dùng rộng rãi; Rolex phát triển bản riêng tên Chromalight (ánh xanh).",
  },
];

export const getTerm = (id: string) => terms.find((t) => t.id === id);

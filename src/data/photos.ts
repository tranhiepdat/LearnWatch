/**
 * Cac mau dang co ANH THAT trong /public/watches/<id>.jpg
 * Dung de sinh cau hoi "trac nghiem nhin hinh".
 * Khi them anh moi vao public/watches/, nho them id vao day.
 */
export const watchPhotos = new Set<string>([
  "rolex-daytona-blackceramic",
  "rolex-daytona-everose",
  "rolex-daytona-panda",
  "rolex-daytona-platinum",
  "rolex-daytona-rainbow",
  "rolex-daytona-steel-vintage",
  "rolex-daytona-twotone",
  "rolex-daytona-whitegold",
  "rolex-daytona-yellowgold",
  "rolex-deepsea-jamescameron",
  "rolex-gmt-batman",
  "rolex-gmt-black",
  "rolex-gmt-coke",
  "rolex-gmt-pepsi",
  "rolex-gmt-rootbeer",
  "rolex-gmt-sprite",
  "rolex-gmt-twotone",
  "rolex-sub-date",
  "rolex-sub-hulk",
  "rolex-sub-smurf",
  "rolex-sub-yellowgold",
  "rolex-yachtmaster2",
  "rolex-yachtmaster42",
]);

export const hasPhoto = (id: string) => watchPhotos.has(id);

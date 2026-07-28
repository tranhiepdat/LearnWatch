"use client";

/**
 * Phát âm bằng giọng có sẵn của máy (Web Speech API) — không cần mạng,
 * không cần API key. Dùng cho câu tiếng Nhật và câu tiếng Anh nói với khách.
 */

let cached: SpeechSynthesisVoice[] | null = null;

function voices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  if (!cached || cached.length === 0) cached = window.speechSynthesis.getVoices();
  return cached ?? [];
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  // danh sách giọng nạp bất đồng bộ trên một số trình duyệt
  window.speechSynthesis.onvoiceschanged = () => {
    cached = window.speechSynthesis.getVoices();
  };
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

/** Có giọng đúng ngôn ngữ trên máy này không (vd chưa cài giọng tiếng Nhật) */
export function hasVoiceFor(lang: string): boolean {
  const p = lang.slice(0, 2).toLowerCase();
  return voices().some((v) => v.lang?.toLowerCase().startsWith(p));
}

/**
 * Đọc `text` bằng ngôn ngữ `lang` ("ja-JP" | "en-US"…).
 * `rate` chậm hơn mặc định một chút để nghe rõ từng âm khi học.
 */
export function speak(text: string, lang = "ja-JP", rate = 0.9): void {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel(); // cắt câu đang đọc để không chồng tiếng
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1;
    const p = lang.slice(0, 2).toLowerCase();
    const v = voices().find((x) => x.lang?.toLowerCase().startsWith(p));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {
    /* máy không hỗ trợ — bỏ qua êm ái */
  }
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}

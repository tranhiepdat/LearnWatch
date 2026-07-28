"use client";

/**
 * Phát âm bằng giọng có sẵn của máy (Web Speech API) — không cần mạng, không key.
 *
 * BA CÁI BẪY THỰC TẾ đã xử lý ở đây:
 *  1. iOS: speak() PHẢI được gọi ĐỒNG BỘ ngay trong cử chỉ chạm. Bọc trong
 *     setTimeout/await là mất tiếng — nên tuyệt đối không hoãn.
 *  2. iOS/Safari cần "mở khoá" một lần bằng utterance câm trong cử chỉ đầu tiên.
 *  3. Chrome: cancel() chạy bất đồng bộ, gọi speak() ngay sau có thể bị nuốt →
 *     gọi resume() ngay sau speak() để đẩy hàng đợi.
 */

let unlocked = false;

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

function allVoices(): SpeechSynthesisVoice[] {
  const s = synth();
  if (!s) return [];
  try {
    return s.getVoices() ?? [];
  } catch {
    return [];
  }
}

export function canSpeak(): boolean {
  return !!synth();
}

/** Máy có giọng đúng ngôn ngữ này không (vd chưa cài giọng tiếng Nhật) */
export function hasVoiceFor(lang: string): boolean {
  const p = lang.slice(0, 2).toLowerCase();
  return allVoices().some((v) => v.lang?.toLowerCase().startsWith(p));
}

/** Mở khoá TTS — gọi trong cử chỉ chạm đầu tiên của người dùng (iOS bắt buộc) */
export function unlockSpeech(): void {
  const s = synth();
  if (!s || unlocked) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    s.speak(u);
    unlocked = true;
  } catch {
    /* ignore */
  }
}

export interface SpeakResult {
  /** đã gọi được speak() */
  started: boolean;
  /** máy CÓ giọng đúng ngôn ngữ không — nếu không, tiếng có thể sai giọng/câm */
  hasVoice: boolean;
}

/** Đọc `text`. rate chậm hơn mặc định chút để nghe rõ từng âm khi học. */
export function speak(text: string, lang = "ja-JP", rate = 0.9): SpeakResult {
  const s = synth();
  if (!s) return { started: false, hasVoice: false };
  try {
    // huỷ câu cũ NGAY (đồng bộ) — không hoãn, để giữ nguyên chuỗi cử chỉ iOS
    if (s.speaking || s.pending) s.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;

    const p = lang.slice(0, 2).toLowerCase();
    const v = allVoices().find((x) => x.lang?.toLowerCase().startsWith(p));
    // Gán giọng trong try RIÊNG: nếu vì lý do gì đó gán lỗi thì vẫn phải đọc
    // được theo u.lang, tuyệt đối không để cả câu bị câm.
    if (v) {
      try {
        u.voice = v;
      } catch {
        /* để engine tự chọn theo u.lang */
      }
    }

    s.speak(u);
    // Chrome/Android: đẩy hàng đợi sau cancel()
    try {
      s.resume();
    } catch {
      /* ignore */
    }
    unlocked = true;
    return { started: true, hasVoice: !!v };
  } catch {
    return { started: false, hasVoice: false };
  }
}

export function stopSpeaking(): void {
  const s = synth();
  if (s) {
    try {
      s.cancel();
    } catch {
      /* ignore */
    }
  }
}

// Danh sách giọng nạp bất đồng bộ + mở khoá ở cử chỉ đầu tiên
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    /* chỉ để trình duyệt nạp danh sách; allVoices() luôn đọc mới */
  };
  const once = () => {
    unlockSpeech();
    window.removeEventListener("pointerdown", once, true);
  };
  window.addEventListener("pointerdown", once, { capture: true, passive: true });
}

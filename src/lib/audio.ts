import { browser } from '$app/environment';

let voices: SpeechSynthesisVoice[] = [];

if (browser && window.speechSynthesis) {
	const loadVoices = () => {
		voices = window.speechSynthesis.getVoices();
	};
	loadVoices();
	window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speak(text: string) {
	if (!browser || !window.speechSynthesis) return;

	// Cancel any current speaking
	window.speechSynthesis.cancel();

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'ja-JP';
	utterance.rate = 0.9; // Slightly slower for better clarity

	// Check if we need to reload voices
	if (voices.length === 0) {
		voices = window.speechSynthesis.getVoices();
	}

	// Try to find a Japanese voice
	// 1. Google Japanese (Chrome/Android)
	// 2. Exact ja-JP match (System)
	// 3. Loose 'ja' match
	const jaVoice =
		voices.find((v) => v.lang === 'ja-JP' && v.name.includes('Google')) ||
		voices.find((v) => v.lang === 'ja-JP') ||
		voices.find((v) => v.lang.includes('ja'));

	if (jaVoice) {
		utterance.voice = jaVoice;
	}

	window.speechSynthesis.speak(utterance);
}

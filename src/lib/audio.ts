import { browser } from '$app/environment';

// Cache to store blob URLs for texts we've already fetched
// This prevents re-fetching the same word multiple times
const audioCache = new Map<string, string>();

// Track current audio to allow interruption
let currentAudio: HTMLAudioElement | null = null;

export async function speak(text: string) {
	if (!browser || !text) return;

	// Stop any currently playing audio
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
	}

	try {
		let audioUrl = audioCache.get(text);

		// If not in cache, fetch from our API proxy
		if (!audioUrl) {
			const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
			if (!res.ok) {
				console.error('TTS API error:', res.status, await res.text());
				return;
			}

			const blob = await res.blob();
			audioUrl = URL.createObjectURL(blob);
			audioCache.set(text, audioUrl);
		}

		// Play
		currentAudio = new Audio(audioUrl);
		// Clean up on end (optional, but good practice if we were tracking state)
		currentAudio.onended = () => {
			if (currentAudio?.src === audioUrl) {
				currentAudio = null;
			}
		};

		await currentAudio.play();
	} catch (e) {
		console.error('TTS Playback failed:', e);
	}
}

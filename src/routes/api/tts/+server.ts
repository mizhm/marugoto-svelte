import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const text = url.searchParams.get('text');

	if (!text) {
		throw error(400, 'Text is required');
	}

	try {
		const bodyParams = new URLSearchParams({
			alpha: '0',
			pitch: '0',
			speaker: 'yuri',
			speed: '0',
			text: text
		});

		// 1. Get ID for the audio
		const makeIdRes = await fetch('https://papago.naver.com/apis/tts/makeID', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Origin: 'https://papago.naver.com',
				Referer: 'https://papago.naver.com/',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			},
			body: bodyParams.toString()
		});

		if (!makeIdRes.ok) {
			const errText = await makeIdRes.text();
			console.error('Papago makeID failed', makeIdRes.status, errText);
			throw error(502, `Failed to generate TTS ID: ${makeIdRes.status} ${errText}`);
		}

		const data = await makeIdRes.json();
		const id = data.id;

		if (!id) {
			throw error(502, 'Invalid ID from Papago');
		}

		// 2. Fetch the audio file
		const audioRes = await fetch(`https://papago.naver.com/apis/tts/${id}`, {
			headers: {
				Origin: 'https://papago.naver.com',
				Referer: 'https://papago.naver.com/',
				'User-Agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			}
		});

		if (!audioRes.ok) {
			throw error(502, 'Failed to fetch audio stream');
		}

		// 3. Stream back to client
		return new Response(audioRes.body, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	} catch (e: unknown) {
		console.error('TTS Server Error:', e);
		const message = e instanceof Error ? e.message : 'Unknown error';
		const stack = e instanceof Error ? e.stack : undefined;
		return new Response(JSON.stringify({ error: message, stack }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

declare global {
	interface Window {
		grecaptcha?: {
			ready: (callback: () => void) => void
			execute: (
				siteKeyOrWidgetId: string | number,
				options?: { action: string }
			) => Promise<string>
			render: (
				container: string | HTMLElement,
				parameters: Record<string, unknown>,
				callback: (token: string) => void
			) => number
			reset: (widgetId: number) => void
		}
	}
}

const SITE_KEY = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY

let scriptLoaded = false

function loadRecaptchaScript(): Promise<void> {
	if (typeof window === 'undefined') {
		return Promise.resolve()
	}

	if (window.grecaptcha) {
		return Promise.resolve()
	}

	if (scriptLoaded) {
		return new Promise(resolve => {
			const interval = setInterval(() => {
				if (window.grecaptcha) {
					clearInterval(interval)
					resolve()
				}
			}, 100)
		})
	}

	scriptLoaded = true

	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
		script.async = true
		script.onload = () => resolve()
		script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
		document.head.appendChild(script)
	})
}

export async function executeRecaptcha(action: string): Promise<string | undefined> {
	if (!SITE_KEY) {
		return undefined
	}

	await loadRecaptchaScript()

	if (!window.grecaptcha) {
		return undefined
	}

	return new Promise((resolve, reject) => {
		window.grecaptcha!.ready(async () => {
			try {
				const token = await window.grecaptcha!.execute(SITE_KEY!, { action })
				resolve(token)
			} catch (error) {
				reject(error)
			}
		})
	})
}

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	env: {
		SERVER_URL: process.env.SERVER_URL,
		GOOGLE_RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY
	}
}

export default nextConfig

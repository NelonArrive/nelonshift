import axios from 'axios'

export const api = axios.create({
	baseURL: 'https://68f9d6e3ef8b2e621e7da291.mockapi.io',
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.response.use(
	response => response,
	error => {
		console.error('API Error:', error.response?.data || error.message)
		return Promise.reject(error)
	}
)

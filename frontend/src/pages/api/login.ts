// src/pages/api/login.ts

import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { email, password } = req.body
		const response = await fetch('http://127.0.0.1:8000/api/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
		const data = await response.json()

		if (response.ok) {
			res.status(response.status).json(data)
		} else {
			console.error('Erro ao fazer login:', data)
			res.status(response.status).json(data)
		}
	} catch (error) {
		console.error('Erro ao fazer login:', error)
		res.status(500).json({ error: 'Erro interno do servidor' })
	}
}

// src/pages/login.tsx

import { useState } from 'react'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			const data = await response.json()
			if (response.ok) {
				console.log(data)
				// Redirecionar para outra página após o login
			} else {
				//Mostrar erro
				console.error('Erro ao fazer login:', data)
			}
		} catch (error) {
			console.error('Erro ao fazer login:', error)
		}
	}

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Senha'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type='submit'>Entrar</button>
			</form>
		</div>
	)
}

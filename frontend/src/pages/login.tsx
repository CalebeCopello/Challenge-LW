'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import { TextInput, Button, Spinner, Alert } from 'flowbite-react'
import { GrCircleAlert } from 'react-icons/gr'
import '../app/globals.css'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState<boolean>(false)
	const [msg, setMsg] = useState('')
	const [alert, setAlert] = useState<string>('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			setLoading(true)
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
				const token = data.data.token
				Cookies.set('token-lw', token, { expires: 30 })
				setMsg('Logado com Sucesso!')
				setAlert('info')
			} else {
				setMsg(`Erro ao fazer login: ${data.message}`)
				setAlert('failure')
				console.error('Erro ao fazer login:', data)
			}
		} catch (error) {
			setMsg(`Erro ao fazer login: ${error}`)
			setAlert('info')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen mt-20'>
			<div className='flex p-3 max-w-sm mx-auto flex-col md:flex-row md:items-center gap-7'>
				<div className='flex-1 p-7 border-2 rounded border-bg3_lm bg-bg1_lm'>
					<h1 className='text-center mb-5 text-3xl font-semibold font-monospace text-fg2_lm'>
						Login
					</h1>
					<form
						className='flex flex-col gap-3'
						onSubmit={handleSubmit}
					>
						<TextInput
							type='email'
							placeholder='Email'
							value={email}
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextInput
							type='password'
							placeholder='Senha'
							value={password}
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type='submit'>{loading ? <Spinner /> : 'Entrar'}</Button>
					</form>
					{msg && <Alert className='mt-5' color={alert} onDismiss={() => setMsg('')} icon={GrCircleAlert}>{msg}</Alert>}
				</div>
			</div>
		</div>
	)
}

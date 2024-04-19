import { NextResponse, type NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/') {
		return NextResponse.redirect(new URL('/login', request.url))
	}
	if (request.nextUrl.pathname === '/dashboard') {
		const secret = process.env.NEXT_PUBLIC_JWT_SECRET
		const token = request.cookies.get('tokenLw')
		if (!token) {
			return NextResponse.redirect(new URL('/login', request.url))
		}
        // const value = token.value
        // const testing = jwt.verify(value, process.env.NEXT_PUBLIC_JWT_SECRET)
        // console.log(testing)
	}
}

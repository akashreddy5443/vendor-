import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )

                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })

                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // why users are being logged out randomly.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected Routes Logic
    // Protected Routes Logic
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/login')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Verify Admin Role
        const { data: userProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userProfile?.role !== 'admin') {
            // Redirect non-admins to homepage
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/user')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Refresh Session if needed (getUser handles this internally via setAll)

    return response
}

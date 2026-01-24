import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vencortech17.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/user/'], // Disallow admin and user dashboard from crawlers
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}

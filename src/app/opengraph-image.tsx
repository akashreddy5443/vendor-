import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'TechDev Store - Premium Developer Gear'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #000000, #18181b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                    }}
                >
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: 0,
                            letterSpacing: '-2px',
                        }}
                    >
                        TechDev
                    </h1>
                </div>
                <p
                    style={{
                        fontSize: '32px',
                        color: '#a1a1aa',
                        marginTop: '20px',
                    }}
                >
                    Premium Gear for Developers
                </p>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <div style={{ width: '10px', height: '10px', background: '#f97316', borderRadius: '50%' }} />
                    <span style={{ color: '#d4d4d8', fontSize: '20px' }}>store.techdev.com</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}

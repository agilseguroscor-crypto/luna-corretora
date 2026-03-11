import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Luna Seguros';
  const description = searchParams.get('desc') || 'Corretora de Seguros no Rio de Janeiro';
  const emoji = searchParams.get('emoji') || '🐱';

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #282828 0%, #3d0a50 60%, #7b0b9a 100%)',
          fontFamily: 'sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '52px',
                      height: '52px',
                      background: 'linear-gradient(135deg, #7b0b9a, #a020c8)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                    },
                    children: '🐱',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '28px',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                    },
                    children: [
                      'Luna ',
                      {
                        type: 'span',
                        props: {
                          style: { color: '#c97fe0' },
                          children: 'Seguros',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '72px',
                marginBottom: '12px',
              },
              children: emoji,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '52px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                maxWidth: '900px',
                marginBottom: '20px',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '24px',
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '700px',
                lineHeight: 1.5,
              },
              children: description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '40px',
                right: '80px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '18px',
                color: 'rgba(255,255,255,0.35)',
              },
              children: 'lunaseguros.com.br • SUSEP 202021257',
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}

import { ImageResponse } from 'next/og';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050a15 0%, #050f23 100%)',
          fontSize: 48,
          fontWeight: 'bold',
          color: '#22c55e',
        }}
      >
        CTF
      </div>
    ),
    {
      width: 192,
      height: 192,
    },
  );
}

import { ImageResponse } from 'next/og';

export default function Icon() {
  return new ImageResponse(
    (
      <img
        src="/cclogo_v2.png"
        alt="Coding Club Logo"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    ),
    {
      width: 192,
      height: 192,
    },
  );
}

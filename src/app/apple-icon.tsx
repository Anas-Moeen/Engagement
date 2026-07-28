import { ImageResponse } from 'next/og';
import { couple } from '@/data/content';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B241C',
          color: '#C8A96A',
          fontSize: 72,
          fontFamily: 'serif',
        }}
      >
        {couple.monogram}
      </div>
    ),
    size,
  );
}

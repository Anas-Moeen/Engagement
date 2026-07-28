import { ImageResponse } from 'next/og';
import { couple } from '@/data/content';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Gold monogram on forest — legible at 16px in a Telegram link card. */
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
          background: '#0B241C',
          color: '#C8A96A',
          fontSize: 26,
          fontFamily: 'serif',
                    borderRadius: 14,
        }}
      >
        {couple.monogram}
      </div>
    ),
    size,
  );
}

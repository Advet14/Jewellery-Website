import QRCode from 'qrcode';

/**
 * Generate a random unique verification ID like JAJ-VFY-8F72KQ91M4
 */
export function generateVerificationId(): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 10; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `JAJ-VFY-${randomPart}`;
}

/**
 * Generate a QR Code Data URL from verification ID
 */
export async function generateQrDataUrl(verificationId: string): Promise<string> {
  const url = `https://verify.jayambejewellers.in/v/${encodeURIComponent(verificationId)}`;
  try {
    return await QRCode.toDataURL(url, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}

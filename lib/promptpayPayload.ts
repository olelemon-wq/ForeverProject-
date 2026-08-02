function formatTlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Build a Thai PromptPay EMVCo QR payload for display in a QR image. */
export function buildPromptPayPayload(promptPayId: string, amount?: number): string {
  const digits = promptPayId.replace(/\D/g, '');
  if (!digits) return '';

  let target = digits;
  if (target.length === 10 && target.startsWith('0')) {
    target = `0066${target.slice(1)}`;
  }

  const targetType = target.length >= 15 ? '02' : '01';
  const merchantInfo =
    formatTlv('00', 'A000000677010111') + formatTlv(targetType, target);

  let payload = formatTlv('00', '01');
  payload += formatTlv('01', amount && amount > 0 ? '12' : '11');
  payload += formatTlv('29', merchantInfo);
  payload += formatTlv('53', '764');

  if (amount && amount > 0) {
    payload += formatTlv('54', amount.toFixed(2));
  }

  payload += formatTlv('58', 'TH');
  payload += '6304';

  return payload + crc16(payload);
}

export function buildPromptPayQrImageUrl(promptPayId: string, amount?: number): string {
  const payload = buildPromptPayPayload(promptPayId, amount);
  if (!payload) return '';

  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&ecc=M&data=${encodeURIComponent(payload)}`;
}

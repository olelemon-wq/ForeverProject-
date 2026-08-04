export const CONDOLENCE_REPORT_REASONS = [
  { value: 'OFFENSIVE', label: 'ข้อความหยาบ / ดูถูก' },
  { value: 'SPAM', label: 'โฆษณา / สแปม' },
  { value: 'FALSE_INFO', label: 'ข้อมูลไม่จริง / กล่าวหา' },
  { value: 'OFF_TOPIC', label: 'เนื้อหาไม่เกี่ยวกับการไว้อาลัย' },
  { value: 'OTHER', label: 'อื่น ๆ' },
] as const;

export type CondolenceReportReason = (typeof CONDOLENCE_REPORT_REASONS)[number]['value'];

const REASON_LABELS = Object.fromEntries(
  CONDOLENCE_REPORT_REASONS.map((r) => [r.value, r.label]),
) as Record<CondolenceReportReason, string>;

export function getCondolenceReportReasonLabel(reason: string): string {
  return REASON_LABELS[reason as CondolenceReportReason] ?? reason;
}

export const CONDOLENCE_REPORT_DETAILS_MAX = 200;

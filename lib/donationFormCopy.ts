export type DonationFormCopy = {
  formTitle: string;
  donorNameLabel: string;
  donorNamePlaceholder: string;
  amountLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  submitLoading: string;
  successMessage: string;
  errorNameRequired: string;
  errorAmountRequired: string;
  wallTitle: string;
  wallDescription: string;
  wallEmpty: string;
  qrScanLabel: string;
};

const MERIT_COPY: DonationFormCopy = {
  formTitle: 'ส่งสลิปโอนเงินยืนยันการทำบุญ (Slip Verify)',
  donorNameLabel: 'ชื่อผู้ร่วมทำบุญ',
  donorNamePlaceholder: 'เช่น นายสมใจ รักสงบ',
  amountLabel: 'จำนวนเงินทำบุญ (บาท)',
  messageLabel: 'คำส่งอนุโมทนา/คำอุทิศส่วนกุศล (ระบุได้ตามปรารถนา)',
  messagePlaceholder: 'เช่น ขอให้ดวงวิญญาณไปสู่สุคติในสัมปรายภพ',
  submitButton: 'ยืนยันยอดและร่วมอนุโมทนาบุญ',
  submitLoading: 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...',
  successMessage: 'ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขออนุโมทนาบุญค่ะ',
  errorNameRequired: 'กรุณากรอกชื่อผู้ร่วมทำบุญ หรือเลือกแบบไม่ประสงค์ออกนาม',
  errorAmountRequired: 'กรุณากรอกจำนวนเงินทำบุญที่ถูกต้อง',
  wallTitle: 'กระดานรายนามผู้ร่วมอนุโมทนาบุญ (Merit Wall)',
  wallDescription: 'รายนามแขกผู้มีเกียรติที่ร่วมทำบุญและได้รับการตรวจสอบสลิปเรียบร้อยแล้ว',
  wallEmpty: 'ยังไม่มีผู้ส่งข้อมูลทำบุญในเวลานี้',
  qrScanLabel: 'DONATION SCAN',
};

const CATEGORY_COPY: Partial<Record<string, DonationFormCopy>> = {
  Couple: {
    formTitle: 'ส่งสลิปโอนเงินยืนยันการสมทบ (Slip Verify)',
    donorNameLabel: 'ชื่อผู้ร่วมสมทบ',
    donorNamePlaceholder: 'เช่น คุณมิ้นท์ เพื่อนสนิท',
    amountLabel: 'จำนวนเงินสมทบ (บาท)',
    messageLabel: 'ข้อความอวยพรถึงคู่รัก (ระบุได้ตามปรารถนา)',
    messagePlaceholder: 'เช่น ขอให้แพลนนี้สำเร็จและมีความสุขด้วยกันนะ',
    submitButton: 'ยืนยันยอดและร่วมสมทบ',
    submitLoading: 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...',
    successMessage: 'ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขอบคุณที่ร่วมสมทบค่ะ',
    errorNameRequired: 'กรุณากรอกชื่อผู้ร่วมสมทบ หรือเลือกแบบไม่ประสงค์ออกนาม',
    errorAmountRequired: 'กรุณากรอกจำนวนเงินสมทบที่ถูกต้อง',
    wallTitle: 'รายนามผู้ร่วมสมทบเป้าหมาย',
    wallDescription: 'รายนามผู้ร่วมสมทบที่ได้รับการตรวจสอบสลิปเรียบร้อยแล้ว',
    wallEmpty: 'ยังไม่มีผู้ส่งข้อมูลสมทบในเวลานี้',
    qrScanLabel: 'OUR GOAL',
  },
  Wedding: {
    formTitle: 'ส่งสลิปโอนเงินยืนยันของขวัญ (Slip Verify)',
    donorNameLabel: 'ชื่อผู้ร่วมใส่ซอง',
    donorNamePlaceholder: 'เช่น คุณสมหญิง ใจดี',
    amountLabel: 'จำนวนเงินของขวัญ (บาท)',
    messageLabel: 'คำอวยพรถึงคู่บ่าวสาว (ระบุได้ตามปรารถนา)',
    messagePlaceholder: 'เช่น ขอให้มีความสุขมั่นคงตลอดไปนะคะ',
    submitButton: 'ยืนยันยอดและส่งของขวัญ',
    submitLoading: 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...',
    successMessage: 'ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขอบคุณสำหรับของขวัญค่ะ',
    errorNameRequired: 'กรุณากรอกชื่อผู้ร่วมใส่ซอง หรือเลือกแบบไม่ประสงค์ออกนาม',
    errorAmountRequired: 'กรุณากรอกจำนวนเงินของขวัญที่ถูกต้อง',
    wallTitle: 'รายนามผู้ร่วมใส่ซองของขวัญ (Gift Wall)',
    wallDescription: 'รายนามแขกผู้มีเกียรติที่ร่วมส่งของขวัญและได้รับการตรวจสอบสลิปเรียบร้อยแล้ว',
    wallEmpty: 'ยังไม่มีผู้ส่งข้อมูลของขวัญในเวลานี้',
    qrScanLabel: 'WEDDING GIFT',
  },
  Anniversary: {
    formTitle: 'ส่งสลิปโอนเงินยืนยันการสนับสนุน (Slip Verify)',
    donorNameLabel: 'ชื่อผู้ร่วมสนับสนุน',
    donorNamePlaceholder: 'เช่น คุณวิชัย รักดี',
    amountLabel: 'จำนวนเงินสนับสนุน (บาท)',
    messageLabel: 'ข้อความอวยพร (ระบุได้ตามปรารถนา)',
    messagePlaceholder: 'เช่น ขอให้ความรักของทั้งคู่ยิ่งเจริญงอกงาม',
    submitButton: 'ยืนยันยอดและร่วมสนับสนุน',
    submitLoading: 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...',
    successMessage: 'ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขอบคุณสำหรับการสนับสนุนค่ะ',
    errorNameRequired: 'กรุณากรอกชื่อผู้ร่วมสนับสนุน หรือเลือกแบบไม่ประสงค์ออกนาม',
    errorAmountRequired: 'กรุณากรอกจำนวนเงินสนับสนุนที่ถูกต้อง',
    wallTitle: 'รายนามผู้ร่วมสนับสนุน (Support Wall)',
    wallDescription: 'รายนามผู้ร่วมสนับสนุนที่ได้รับการตรวจสอบสลิปเรียบร้อยแล้ว',
    wallEmpty: 'ยังไม่มีผู้ส่งข้อมูลสนับสนุนในเวลานี้',
    qrScanLabel: 'GIFT FUND',
  },
  Friends: {
    formTitle: 'ส่งสลิปโอนเงินยืนยันการสมทบ (Slip Verify)',
    donorNameLabel: 'ชื่อผู้ร่วมสมทบ',
    donorNamePlaceholder: 'เช่น คุณมานะ รุ่นเดียวกัน',
    amountLabel: 'จำนวนเงินสมทบ (บาท)',
    messageLabel: 'ข้อความถึงกลุ่ม (ระบุได้ตามปรารถนา)',
    messagePlaceholder: 'เช่น ขอให้ทริปนี้สนุกและปลอดภัยนะทุกคน',
    submitButton: 'ยืนยันยอดและร่วมสมทบ',
    submitLoading: 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...',
    successMessage: 'ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขอบคุณสำหรับการสมทบค่ะ',
    errorNameRequired: 'กรุณากรอกชื่อผู้ร่วมสมทบ หรือเลือกแบบไม่ประสงค์ออกนาม',
    errorAmountRequired: 'กรุณากรอกจำนวนเงินสมทบที่ถูกต้อง',
    wallTitle: 'รายนามผู้ร่วมสมทบ (Group Fund Wall)',
    wallDescription: 'รายนามสมาชิกที่ร่วมสมทบและได้รับการตรวจสอบสลิปเรียบร้อยแล้ว',
    wallEmpty: 'ยังไม่มีผู้ส่งข้อมูลสมทบในเวลานี้',
    qrScanLabel: 'GROUP FUND',
  },
  'Family Legacy': {
    formTitle: 'ส่งสลิปโอนเงินยืนยันการสมทบ (Slip Verify)',
    donorNameLabel: 'ชื่อผู้ร่วมสมทบ',
    donorNamePlaceholder: 'เช่น คุณวิชัย ลูกหลาน',
    amountLabel: 'จำนวนเงินสมทบ (บาท)',
    messageLabel: 'ข้อความถึงครอบครัว (ระบุได้ตามปรารถนา)',
    messagePlaceholder: 'เช่น ขอให้ครอบครัวอบอุ่นและดูแลกันเสมอ',
    submitButton: 'ยืนยันยอดและร่วมสมทบ',
    submitLoading: 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...',
    successMessage: 'ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขอบคุณสำหรับการสมทบค่ะ',
    errorNameRequired: 'กรุณากรอกชื่อผู้ร่วมสมทบ หรือเลือกแบบไม่ประสงค์ออกนาม',
    errorAmountRequired: 'กรุณากรอกจำนวนเงินสมทบที่ถูกต้อง',
    wallTitle: 'รายนามผู้ร่วมสมทบกองทุนครอบครัว',
    wallDescription: 'รายนามผู้ร่วมสมทบที่ได้รับการตรวจสอบสลิปเรียบร้อยแล้ว',
    wallEmpty: 'ยังไม่มีผู้ส่งข้อมูลสมทบในเวลานี้',
    qrScanLabel: 'FAMILY FUND',
  },
  'Pet Memorial': {
    formTitle: 'แจ้งการโอนเงินและแนบสลิป',
    donorNameLabel: 'ชื่อผู้ร่วมบริจาค',
    donorNamePlaceholder: 'เช่น คุณแมวขาว รักน้อง',
    amountLabel: 'จำนวนเงินบริจาค (บาท)',
    messageLabel: 'ข้อความถึงน้อง (ระบุได้ตามปรารถนา)',
    messagePlaceholder: 'เช่น ขอให้น้องมีความสุขบนดาวเสมอ',
    submitButton: 'ยืนยันยอดและร่วมบริจาค',
    submitLoading: 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...',
    successMessage: 'ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขอบคุณสำหรับการบริจาคค่ะ',
    errorNameRequired: 'กรุณากรอกชื่อผู้ร่วมบริจาค หรือเลือกแบบไม่ประสงค์ออกนาม',
    errorAmountRequired: 'กรุณากรอกจำนวนเงินบริจาคที่ถูกต้อง',
    wallTitle: 'รายนามผู้ร่วมบริจาค',
    wallDescription: 'รายนามผู้ร่วมบริจาคที่ได้รับการตรวจสอบสลิปเรียบร้อยแล้ว',
    wallEmpty: 'ยังไม่มีผู้ส่งข้อมูลบริจาคในเวลานี้',
    qrScanLabel: 'PET FUND',
  },
};

export function getDonationFormCopy(category?: string): DonationFormCopy {
  if (category && CATEGORY_COPY[category]) {
    return CATEGORY_COPY[category]!;
  }
  return MERIT_COPY;
}

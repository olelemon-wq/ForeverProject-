import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts the first actual letter of a name by stripping common prefixes
 * (e.g., นาย, นาง, นางสาว, คุณ, ดร., ด.ช., ด.ญ., นพ., พญ. etc.)
 * and handling Thai leading vowels (เ, แ, โ, ใ, ไ).
 */
export function getInitialLetter(name: string): string {
  if (!name) return '';

  let cleaned = name.trim();

  // List of prefixes to strip (ordered from longest to shortest)
  const prefixes = [
    // Military/Police long forms
    'พลตำรวจเอก', 'พลตำรวจโท', 'พลตำรวจตรี',
    'พันตำรวจเอก', 'พันตำรวจโท', 'พันตำรวจตรี',
    'ร้อยตำรวจเอก', 'ร้อยตำรวจโท', 'ร้อยตำรวจตรี',
    'จ่าสิบเอก',
    
    // Academic/Titles long forms
    'ผู้ช่วยศาสตราจารย์', 'รองศาสตราจารย์', 'ศาสตราจารย์',
    'นายแพทย์', 'แพทย์หญิง', 'เด็กหญิง', 'เด็กชาย',
    
    // Honorifics / Religious
    'หลวงพ่อ', 'หลวงปู่', 'พระมหา', 'พระครู',
    
    // Abbreviations (Military/Police)
    'พล.ต.อ.', 'พล.ต.ท.', 'พล.ต.ต.',
    'พ.ต.อ.', 'พ.ต.ท.', 'พ.ต.ต.',
    'ร.ต.อ.', 'ร.ต.ท.', 'ร.ต.ต.',
    'จ.ส.อ.', 'พล.อ.', 'พล.ท.', 'พล.ต.',
    'พ.อ.', 'พ.ท.', 'พ.ต.', 'ร.อ.', 'ร.ท.', 'ร.ต.',
    
    // Abbreviations (Academic/Medical/General)
    'ผศ.ดร.', 'รศ.ดร.', 'ศ.ดร.', 'ผศ.', 'รศ.', 'ศ.',
    'ด.ญ.', 'ด.ช.', 'น.ส.', 'นพ.', 'พญ.', 'ดร.',
    
    // Common general prefixes
    'นางสาว', 'หลวง', 'นาย', 'นาง', 'คุณ', 'พระ',
    
    // English titles
    'Prof. Dr.', 'Prof.', 'Assoc. Prof.', 'Asst. Prof.',
    'Mr.', 'Mrs.', 'Ms.', 'Dr.',
  ];

  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }

  const char = cleaned.charAt(0);

  // Thai leading vowels that precede consonants: เ, แ, โ, ใ, ไ
  const leadingVowels = ['เ', 'แ', 'โ', 'ใ', 'ไ'];
  if (leadingVowels.includes(char) && cleaned.length > 1) {
    return cleaned.charAt(1);
  }

  return char || name.trim().charAt(0) || '';
}

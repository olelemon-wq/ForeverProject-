'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FeatureToggleList from '@/components/FeatureToggleList';
import ScrollableSubTabs from '@/components/ScrollableSubTabs';
import ThaiDatePicker from '@/components/ThaiDatePicker';
import BackupPhoneSection from '@/components/BackupPhoneSection';
import DefaultMediaPicker from '@/components/DefaultMediaPicker';
import { getVisibleKeys, getFeatureLabel, MANDATORY_FEATURES } from '@/lib/categories';
import { clampImagePan, imageTransformStyle, toRelativeOffset } from '@/lib/imagePosition';
import type { DefaultMediaKind } from '@/lib/defaultMedia';
import { getDefaultMediaForCategory } from '@/lib/defaultMedia';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Flame, BookOpen, Camera, GitBranch, Settings, Plus, Minus, Trash2, Edit3, 
  CreditCard, Smartphone, Check, AlertCircle, ArrowLeft, ArrowRight, 
  LogOut, Upload, User, Calendar, Heart, DollarSign, Download, RotateCw
, X, Lock, Database, Search, Save, Palette, ChevronUp, ChevronDown, LayoutDashboard, AlertTriangle, MapPin, Clock, Phone, Info, Droplets, Image as ImageIcon, Video, Menu as MenuIcon, Copy, ExternalLink, Globe, Grid, History, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Website {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: string;
  expiredAt: string;
  donationPromptPay: string | null;
  donationAccountName: string | null;
  donationActive: boolean;
  role: string;
}

type ManageSubject = {
  name: string;
  birthDate: Date | null;
  deathDate: Date | null;
  birthYearOnly: boolean;
  deathYearOnly: boolean;
  birthYear: number | null;
  deathYear: number | null;
  isAlive?: boolean;
  /** Friends: optional role in group */
  role?: string;
  /** Friends: optional short note */
  note?: string;
};

const emptyManageSubject = (): ManageSubject => ({
  name: '',
  birthDate: null,
  deathDate: null,
  birthYearOnly: false,
  deathYearOnly: false,
  birthYear: null,
  deathYear: null,
  isAlive: false,
  role: '',
  note: '',
});

function dateToYmd(d: Date | null): string {
  if (!d || isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function ymdToDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

function normalizeManageSubjects(raw: any[], category: string): ManageSubject[] {
  const list = Array.isArray(raw)
    ? raw.map((s) => ({
        name: s?.name || '',
        birthDate: s?.birthDate ? new Date(s.birthDate) : null,
        deathDate: s?.deathDate ? new Date(s.deathDate) : null,
        birthYearOnly: !!s?.birthYearOnly,
        deathYearOnly: !!s?.deathYearOnly,
        birthYear: s?.birthYear ?? null,
        deathYear: s?.deathYear ?? null,
        isAlive: !!s?.isAlive,
        role: s?.role || '',
        note: s?.note || '',
      }))
    : [];

  if (list.length === 0) {
    if (category === 'Couple' || category === 'Wedding') {
      return [emptyManageSubject(), emptyManageSubject()];
    }
    return [emptyManageSubject()];
  }
  return list;
}

/** Serialize subjects for save — Friends keeps name/role/note only */
function serializeManageSubjects(subjects: ManageSubject[], category: string) {
  if (category === 'Friends') {
    return subjects.map((s) => ({
      name: s.name || '',
      role: s.role || '',
      note: s.note || '',
      isAlive: true,
      birthDate: null,
      deathDate: null,
      birthYearOnly: false,
      deathYearOnly: false,
      birthYear: null,
      deathYear: null,
    }));
  }
  return subjects;
}

function getSubjectEditorCopy(category: string) {
  if (category === 'Pet Memorial') {
    return {
      sectionTitle: 'รายชื่อสัตว์เลี้ยง',
      sectionHint: 'เพิ่มหรือแก้ไขข้อมูลน้อง ๆ ที่แสดงบนหน้าเว็บ แล้วกดบันทึกการตั้งค่าด้านล่าง',
      cardTitle: (i: number) => `ข้อมูลสัตว์เลี้ยงตัวที่ ${i + 1}`,
      nameLabel: 'ชื่อสัตว์เลี้ยงแสนรัก',
      namePlaceholder: 'เช่น เจ้าปุยฝ้าย',
      aliveLabel: 'น้องยังมีชีวิตอยู่',
      dateLabel: 'วันเกิด – วันที่เดินทางไปดาวหมาแมว',
      startTitle: 'วันเกิด',
      endTitle: 'วันที่เดินทางกลับดาว',
      yearOnlyBirth: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีเกิด)',
      yearOnlyDeath: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีที่เดินทางกลับดาว)',
      addLabel: '+ เพิ่มสัตว์เลี้ยงอีกตัว',
      showAlive: true,
      showDates: true,
      canAdd: true,
    };
  }
  if (category === 'Family Legacy') {
    return {
      sectionTitle: 'รายชื่อต้นตระกูล / ผู้ได้รับการรำลึก',
      sectionHint: 'เพิ่มหรือแก้ไขรายชื่อที่เกี่ยวข้องกับหน้านี้ แล้วกดบันทึกการตั้งค่าด้านล่าง',
      cardTitle: (i: number) => `ข้อมูลท่านที่ ${i + 1}`,
      nameLabel: 'ชื่อ-นามสกุล',
      namePlaceholder: 'เช่น คุณปู่บุญส่ง รักดี',
      aliveLabel: 'ท่านยังมีชีวิตอยู่',
      dateLabel: 'วันเกิด – วันเสียชีวิต',
      startTitle: 'วันเกิด',
      endTitle: 'วันเสียชีวิต',
      yearOnlyBirth: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีเกิด)',
      yearOnlyDeath: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีที่เสียชีวิต)',
      addLabel: '+ เพิ่มรายชื่ออีกท่าน',
      showAlive: true,
      showDates: true,
      canAdd: true,
    };
  }
  if (category === 'Couple' || category === 'Wedding') {
    return {
      sectionTitle: category === 'Wedding' ? 'ข้อมูลคู่บ่าวสาว' : 'ข้อมูลคู่รัก',
      sectionHint: 'แก้ไขชื่อและวันที่สำคัญของทั้งสองคน แล้วกดบันทึกการตั้งค่าด้านล่าง',
      cardTitle: (i: number) => `ข้อมูลคนที่ ${i + 1}`,
      nameLabel: 'ชื่อ-นามสกุล',
      namePlaceholder: 'เช่น สมศรี',
      aliveLabel: '',
      dateLabel: category === 'Wedding' ? 'วันเริ่มต้นคบหา – วันแต่งงาน' : 'วันแรกที่พบกัน – วันครบรอบ',
      startTitle: category === 'Wedding' ? 'วันเริ่มต้นคบหา' : 'วันแรกที่พบกัน',
      endTitle: category === 'Wedding' ? 'วันแต่งงาน' : 'วันครบรอบ',
      yearOnlyBirth: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปี)',
      yearOnlyDeath: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปี)',
      addLabel: '',
      showAlive: false,
      showDates: true,
      canAdd: false,
    };
  }
  if (category === 'Friends') {
    return {
      sectionTitle: 'รายชื่อสมาชิกในกลุ่ม',
      sectionHint: 'เพิ่มชื่อเล่น บทบาท และโน้ตสั้น ๆ ของสมาชิก แล้วกดบันทึกการตั้งค่าด้านล่าง',
      cardTitle: (i: number) => `ข้อมูลสมาชิกคนที่ ${i + 1}`,
      nameLabel: 'ชื่อ / ชื่อเล่น',
      namePlaceholder: 'เช่น ตูน, แจ๊ส, บิ๊ก',
      aliveLabel: '',
      dateLabel: '',
      startTitle: '',
      endTitle: '',
      yearOnlyBirth: '',
      yearOnlyDeath: '',
      addLabel: '+ เพิ่มสมาชิก',
      showAlive: false,
      showDates: false,
      canAdd: true,
      roleLabel: 'บทบาทในกลุ่ม (ไม่บังคับ)',
      rolePlaceholder: 'เช่น กัปตัน, เลขา, เหรัญญิก, สมาชิก',
      noteLabel: 'โน้ตสั้น (ไม่บังคับ)',
      notePlaceholder: 'เช่น คนจัดทริป, สายกิน, ม.ศ.3 รุ่น 55',
    };
  }
  return {
    sectionTitle: 'รายชื่อผู้ล่วงลับ',
    sectionHint: 'เพิ่มหรือแก้ไขรายชื่อผู้ล่วงลับที่แสดงบนหน้าเว็บ แล้วกดบันทึกการตั้งค่าด้านล่าง',
    cardTitle: (i: number) => `ข้อมูลผู้ล่วงลับท่านที่ ${i + 1}`,
    nameLabel: 'ชื่อ-นามสกุล ผู้ล่วงลับ',
    namePlaceholder: 'เช่น คุณยาย มาลี อบอุ่นยิ่ง',
    aliveLabel: '',
    dateLabel: 'วันเกิด – วันเสียชีวิต',
    startTitle: 'วันเกิด',
    endTitle: 'วันเสียชีวิต',
    yearOnlyBirth: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีเกิด)',
    yearOnlyDeath: 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีที่เสียชีวิต)',
    addLabel: '+ เพิ่มรายชื่อผู้ล่วงลับอีกท่าน',
    showAlive: false,
    showDates: true,
    canAdd: true,
  };
}

const TIME_PRESETS = [
  "09:00 น.", "10:00 น.", "13:00 น.", "14:00 น.", "15:00 น.",
  "15:30 น.", "16:00 น.", "16:30 น.", "17:00 น.", "19:00 น.", "19:30 น.", "20:00 น."
];

const formatShortThaiDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const monthNamesShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const day = date.getDate();
  const month = monthNamesShort[date.getMonth()];
  const yearShort = String(date.getFullYear() + 543).slice(-2);
  return `${day} ${month} ${yearShort}`;
};

const formatThaiDateWithDay = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const monthNamesShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const dayOfWeek = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNamesShort[date.getMonth()];
  const yearShort = String(date.getFullYear() + 543).slice(-2);
  return `${dayOfWeek}ที่ ${day} ${month} ${yearShort}`;
};

const formatThaiDateRange = (startDateStr: string, endDateStr: string) => {
  if (!startDateStr) return '';
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return '';
  
  const monthNamesShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  
  const startDay = startDate.getDate();
  const startMonthIndex = startDate.getMonth();
  const startYear = startDate.getFullYear() + 543;
  
  if (!endDateStr) {
    return `${startDay} ${monthNamesShort[startMonthIndex]} ${String(startYear).slice(-2)}`;
  }
  
  const endDate = new Date(endDateStr);
  if (isNaN(endDate.getTime())) {
    return `${startDay} ${monthNamesShort[startMonthIndex]} ${String(startYear).slice(-2)}`;
  }
  
  const endDay = endDate.getDate();
  const endMonthIndex = endDate.getMonth();
  const endYear = endDate.getFullYear() + 543;
  
  if (startYear !== endYear) {
    return `${startDay} ${monthNamesShort[startMonthIndex]} ${String(startYear).slice(-2)} - ${endDay} ${monthNamesShort[endMonthIndex]} ${String(endYear).slice(-2)}`;
  }
  
  if (startMonthIndex !== endMonthIndex) {
    return `${startDay} ${monthNamesShort[startMonthIndex]} - ${endDay} ${monthNamesShort[endMonthIndex]} ${String(startYear).slice(-2)}`;
  }
  
  return `${startDay}-${endDay} ${monthNamesShort[startMonthIndex]} ${String(startYear).slice(-2)}`;
};

const getScheduleLabels = (category: string) => {
  if (category === 'Couple' || category === 'Wedding') {
    return {
      subtitle: 'กำหนดการจัดงานและกิจกรรม',
      item1: '1. พิธีมงคลสมรส / พิธีหลั่งน้ำพระพุทธมนต์',
      item1Placeholder: 'เช่น วันอาทิตย์ที่ 15 ก.พ. 68',
      item2: '2. งานฉลองมงคลสมรส / งานเลี้ยงฉลอง',
      item2Placeholder: 'เช่น วันอาทิตย์ที่ 15 ก.พ. 68',
      item2TimePlaceholder: 'เช่น 18:00 น.',
      item3: '3. พิธีฉลองอาฟเตอร์ปาร์ตี้ / กิจกรรมพิเศษ',
      item3Placeholder: 'เช่น เวลา 21:00 น. เป็นต้นไป',
      venueLabel: 'สถานที่จัดงาน (VENUE)',
      venuePlaceholder: 'เช่น โรงแรมสยามเคมปินสกี้',
      pavilionLabel: 'ห้องจัดเลี้ยง / ห้องจัดงาน (ถ้ามี)',
      pavilionPlaceholder: 'เช่น ห้องแกรนด์บอลรูม / ห้องสราญรมย์',
      invitePlaceholder: 'กราบเรียนเชิญญาติสนิทและมิตรสหายมาร่วมยินดี',
      guidelinesTitle: 'คำแนะนำการร่วมงานแสดงความยินดี',
    };
  }
  if (category === 'Friends') {
    return {
      subtitle: 'นัดพบปะกลุ่ม',
      item1: 'วันและเวลานัดพบ',
      item1Placeholder: 'เช่น วันเสาร์ที่ 20 ก.ค. 68',
      item2: '',
      item2Placeholder: '',
      item2TimePlaceholder: '',
      item3: '',
      item3Placeholder: '',
      venueLabel: 'สถานที่นัดพบ',
      venuePlaceholder: 'เช่น ร้านอาหาร / คาเฟ่ / รีสอร์ท',
      pavilionLabel: 'โซน / ห้อง (ถ้ามี)',
      pavilionPlaceholder: 'เช่น โซนสวน / ห้อง VIP',
      invitePlaceholder: 'เชิญชวนมาร่วมพบปะและสร้างความทรงจำด้วยกัน',
      guidelinesTitle: 'ข้อมูลเพิ่มเติมสำหรับเพื่อน ๆ',
      dateLabel: 'วันนัดพบ',
      timeLabel: 'เวลานัด (ไม่บังคับ)',
      notesLabel: 'โน้ต / รายละเอียด',
      notesPlaceholder: 'เช่น แต่งตามสบาย, ธีมสีกลุ่ม, สิ่งที่ควรเตรียม',
      meetupTitle: 'นัดพบปะกลุ่ม',
    };
  }
  if (category === 'Pet Memorial') {
    return {
      subtitle: 'กำหนดการอำลาและการเดินทางกลับดาว',
      item1: '1. พิธีอำลา / กล่าวคำอาลัย',
      item1Placeholder: 'เช่น วันเสาร์ที่ 12 ธ.ค. 67',
      item2: '2. พิธีฌาปนกิจสัตว์เลี้ยง',
      item2Placeholder: 'เช่น วันเสาร์ที่ 12 ธ.ค. 67',
      item2TimePlaceholder: 'เช่น 14:00 น.',
      item3: '3. พิธีลอยอังคารอัฐิ / โปรยเเถ้ากระดูก',
      item3Placeholder: 'เช่น วันอาทิตย์ที่ 13 ธ.ค. 67',
      venueLabel: 'สถานที่จัดพิธี (VENUE)',
      venuePlaceholder: 'เช่น วัดคลองเตยใน (แผนกสัตว์เลี้ยง)',
      pavilionLabel: 'ศาลา / โซนจัดพิธี (ถ้ามี)',
      pavilionPlaceholder: 'เช่น ศาลาน้ำตาแสงไต้ หรือ โซน B',
      invitePlaceholder: 'เรียนเชิญร่วมส่งน้องเดินทางกลับดาวเสร็จสมบูรณ์',
      guidelinesTitle: 'ข้อแนะนำการร่วมส่งน้องกลับดาว',
    };
  }
  return {
    subtitle: 'กำหนดการพิธีสวดพระอภิธรรม และฌาปนกิจศพ',
    item1: '1. พิธีรดน้ำศพ',
    item1Placeholder: 'เช่น วันศุกร์ที่ 15 พ.ย. 67',
    item2: '2. พิธีสวดพระอภิธรรม',
    item2Placeholder: 'เช่น 16-22 พ.ย. 67',
    item2TimePlaceholder: 'เช่น 19:00 น.',
    item3: '3. พิธีฌาปนกิจ / พระราชทานเพลิงศพ',
    item3Placeholder: 'เช่น วันเสาร์ที่ 23 พ.ย. 67',
    venueLabel: 'สถานที่จัดพิธี (VENUE)',
    venuePlaceholder: 'เช่น วัดมกุฏกษัตริยาราม',
    pavilionLabel: 'ศาลาที่จัดงาน',
    pavilionPlaceholder: 'เช่น ศาลา 10',
    invitePlaceholder: 'กราบเรียนเชิญด้วยความเคารพอย่างสูง',
    guidelinesTitle: 'ข้อแนะนำการร่วมแสดงความอาลัย',
  };
};

const getStyle3Label = (category: string) => {
  if (category === 'Couple' || category === 'Wedding') return 'ชมพูโรสพาสเทล (Soft Rose)';
  if (category === 'Pet Memorial') return 'เขียวเซจอบอุ่น (Warm Sage)';
  if (category === 'Family Legacy') return 'น้ำเงินกรมท่าทอง (Royal Navy)';
  if (category === 'Friends') return 'เขียวมินต์สดใส (Mint Teal)';
  return 'Charcoal Gold (สีเทาเข้มหรูหรา)';
};

const getStyle3Config = (category: string) => {
  if (category === 'Couple' || category === 'Wedding') {
    return {
      classes: 'bg-[#FFF0F2] border-[#FBC5CD] text-[#8C3A4F] shadow-[0_10px_30px_rgba(251,197,205,0.3)]',
      backgroundImage: undefined,
      avatarBorder: 'border-[#FBC5CD]',
      innerCardBg: 'bg-[#FFF5F6]/70 border-[#FBC5CD]/40',
    };
  }
  if (category === 'Pet Memorial') {
    return {
      classes: 'bg-[#F2F6F3] border-[#C8D9CD] text-[#2C4A3E] shadow-[0_10px_30px_rgba(200,217,205,0.3)]',
      backgroundImage: undefined,
      avatarBorder: 'border-[#C8D9CD]',
      innerCardBg: 'bg-[#FAFDFB]/75 border-[#C8D9CD]/40',
    };
  }
  if (category === 'Family Legacy') {
    return {
      classes: 'bg-[#0D1F2D] border-[#2A445C] text-[#E0A96D] shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
      backgroundImage: undefined,
      avatarBorder: 'border-[#2A445C]',
      innerCardBg: 'bg-[#152E40]/65 border-[#2A445C]/40',
    };
  }
  if (category === 'Friends') {
    return {
      classes: 'bg-[#EAF4F4] border-[#A8D1D1] text-[#1E4848] shadow-[0_10px_30px_rgba(168,209,209,0.3)]',
      backgroundImage: undefined,
      avatarBorder: 'border-[#A8D1D1]',
      innerCardBg: 'bg-[#F4FAFA]/75 border-[#A8D1D1]/40',
    };
  }
  return {
    classes: 'bg-stone-950 border-stone-800 text-[#C2A878] shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
    backgroundImage: 'url(/Template-cards/charcoal_gold.png)',
    avatarBorder: 'border-amber-600/40',
    innerCardBg: 'bg-stone-900/60 border-[#C2A878]/25',
  };
};

interface Condolence {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  createdAt: string;
}

interface MemoryPost {
  id: string;
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  senderName: string;
  createdAt: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthYear: string | null;
  deathYear: string | null;
  isDeceased: boolean;
  avatarUrl: string | null;
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  pdfUrl: string;
  totalPages: number;
  pages: string[];
}

export default function WebmasterDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [activeSite, setActiveSite] = useState<Website | null>(null);
  const [condolences, setCondolences] = useState<Condolence[]>([]);
  const [pendingPosts, setPendingPosts] = useState<MemoryPost[]>([]);
  
  // Active site editable configs
  const [siteName, setSiteName] = useState('');
  const [siteCategory, setSiteCategory] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0d9488');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [visibility, setVisibility] = useState('PUBLIC');
  
  // Donation states
  const [donationPromptPay, setDonationPromptPay] = useState('');
  const [donationAccountName, setDonationAccountName] = useState('');
  const [donationActive, setDonationActive] = useState(false);

  // Storage states
  const [storageUsedBytes, setStorageUsedBytes] = useState(256 * 1024 * 1024); // mock start 256MB
  const [storageQuotaBytes, setStorageQuotaBytes] = useState(1073741824); // 1GB
  
  // Family Tree states
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyId, setFamilyId] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyRelationship, setFamilyRelationship] = useState('CHILD');
  const [familyBirthYear, setFamilyBirthYear] = useState('');
  const [familyDeathYear, setFamilyDeathYear] = useState('');
  const [familyIsDeceased, setFamilyIsDeceased] = useState(false);
  const [familyAvatarUrl, setFamilyAvatarUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [biography, setBiography] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [albums, setAlbums] = useState<string[]>([]);
  const [mediaAlbums, setMediaAlbums] = useState<Record<string, string>>({});
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState('ALL');
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [tempAlbumName, setTempAlbumName] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'card' | 'gallery' | 'videos' | 'family' | 'ebooks' | 'condolences' | 'billing'>('settings');
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeSaving, setYoutubeSaving] = useState(false);
  const [galleryMedias, setGalleryMedias] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [annActive, setAnnActive] = useState(true);
  const [annCardMode, setAnnCardMode] = useState<'template' | 'custom'>('template');
  const [annCustomCardUrl, setAnnCustomCardUrl] = useState('');
  const [annCardUploading, setAnnCardUploading] = useState(false);
  const [annCardUploadError, setAnnCardUploadError] = useState('');
  const [annText, setAnnText] = useState('');
  const [annStyle, setAnnStyle] = useState('ELEGANT_WHITE');
  const [annFontFamily, setAnnFontFamily] = useState('LINE Seed Sans TH');
  const [annWaterDate, setAnnWaterDate] = useState('');
  const [annWaterTime, setAnnWaterTime] = useState('');
  const [annAbhidhammaDateRange, setAnnAbhidhammaDateRange] = useState('');
  const [annAbhidhammaTime, setAnnAbhidhammaTime] = useState('');
  const [annCremationDate, setAnnCremationDate] = useState('');
  const [annCremationTime, setAnnCremationTime] = useState('');
  const [annTempleName, setAnnTempleName] = useState('');
  const [annPavilion, setAnnPavilion] = useState('');
  const [annMapLink, setAnnMapLink] = useState('');
  const [annDressCode, setAnnDressCode] = useState('');
  const [annWreathPolicy, setAnnWreathPolicy] = useState('NORMAL');
  const [annContactPhone, setAnnContactPhone] = useState('');
  
  const [isCustomWaterTime, setIsCustomWaterTime] = useState(false);
  const [isCustomAbhidhammaTime, setIsCustomAbhidhammaTime] = useState(false);
  const [isCustomCremationTime, setIsCustomCremationTime] = useState(false);
  const [abhidhammaStartDate, setAbhidhammaStartDate] = useState('');
  const [abhidhammaEndDate, setAbhidhammaEndDate] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const showConfirm = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmConfig({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [defaultFontSize, setDefaultFontSize] = useState<'NORMAL' | 'MEDIUM' | 'LARGE'>('NORMAL');

  const [deceasedAvatarUrl, setDeceasedAvatarUrl] = useState('');
  const [deceasedAvatarScale, setDeceasedAvatarScale] = useState(1);
  const [deceasedAvatarX, setDeceasedAvatarX] = useState(0);
  const [deceasedAvatarY, setDeceasedAvatarY] = useState(0);
  const [deceasedAvatarRotate, setDeceasedAvatarRotate] = useState(0);
  const [deceasedCoverUrl, setDeceasedCoverUrl] = useState('');
  const [deceasedCoverScale, setDeceasedCoverScale] = useState(1);
  const [deceasedCoverX, setDeceasedCoverX] = useState(0);
  const [deceasedCoverY, setDeceasedCoverY] = useState(0);
  const [deceasedCoverRotate, setDeceasedCoverRotate] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);
  const [isCoverCropModalOpen, setIsCoverCropModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);
  const [defaultMediaPicker, setDefaultMediaPicker] = useState<DefaultMediaKind | null>(null);
  const [quickPreview, setQuickPreview] = useState<{ kind: DefaultMediaKind; src: string } | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  
  const [features, setFeatures] = useState<any>({
    family: true,
    gallery: true,
    videos: true,
    announcement: true,
    ebooks: true,
    condolence: true,
    donation: true,
    memory: true,
    feed: true,
  });
  const [familyIsDragActive, setFamilyIsDragActive] = useState(false);
  const [familyFormOpen, setFamilyFormOpen] = useState(false);

  // E-Book states
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [ebookId, setEbookId] = useState('');
  const [ebookTitle, setEbookTitle] = useState('');
  const [ebookAuthor, setEbookAuthor] = useState('');
  const [ebookTotalPages, setEbookTotalPages] = useState('4');
  const [ebookPagesText, setEbookPagesText] = useState('');
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [ebookFormOpen, setEbookFormOpen] = useState(false);

  // Renewal states (Phase 2 Expiration Banner alignment)
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewRefId, setRenewRefId] = useState('');
  const [renewAmount, setRenewAmount] = useState(2000);
  const [renewLoading, setRenewLoading] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // 1. Initial Load: Fetch User Managed Websites and Phone Identity
  useEffect(() => {
    async function loadWebsites() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (!meData.authenticated) {
          const next = encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
          );
          window.location.href = `/login?next=${next}`;
          return;
        }
        setUserPhone(meData.phone || '');

        const res = await fetch('/api/tenant/list-mine');
        const data = await res.json();

        if (res.status === 401) {
          const next = encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
          );
          window.location.href = `/login?next=${next}`;
          return;
        }

        if (!res.ok) throw new Error(data.error);

        const list = data.websites || [];
        setWebsites(list);
        if (list.length > 0) {
          const searchParams = new URLSearchParams(window.location.search);
          const siteParam = searchParams.get('site');
          if (siteParam) {
            const matchedSite = list.find((w: any) => w.slug === siteParam || w.id === siteParam);
            if (matchedSite) {
              selectWebsite(matchedSite);
            } else {
              setActiveSite(null);
            }
          } else {
            setActiveSite(null);
          }
        }
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลเว็บไซต์');
      } finally {
        setIsLoading(false);
      }
    }
    loadWebsites();
  }, []);

  const uploadDeceasedAvatar = async (file: File) => {
    if (!activeSite) return;
    setAvatarUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: `deceased-avatar-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          album: 'PROFILE',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl) {
        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      setDeceasedAvatarUrl(data.filePath);
      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);
      setIsCropModalOpen(true);
      setSuccess('อัปโหลดรูปโปรไฟล์สำเร็จ');
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดรูปโปรไฟล์ล้มเหลว');
    } finally {
      setAvatarUploading(false);
    }
  };

  const uploadDeceasedCover = async (file: File) => {
    if (!activeSite) return;
    setCoverUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: `deceased-cover-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          album: 'PROFILE',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl) {
        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      setDeceasedCoverUrl(data.filePath);
      setDeceasedCoverScale(1);
      setDeceasedCoverX(0);
      setDeceasedCoverY(0);
      setDeceasedCoverRotate(0);
      setIsCoverCropModalOpen(true);
      setSuccess('อัปโหลดรูปภาพหน้าปกสำเร็จ');
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดรูปภาพหน้าปกล้มเหลว');
    } finally {
      setCoverUploading(false);
    }
  };

  const uploadAnnouncementCard = async (file: File) => {
    if (!activeSite?.id) {
      const msg = 'ไม่พบเว็บไซต์ที่กำลังแก้ไข กรุณารีเฟรชหน้าแล้วลองใหม่';
      setAnnCardUploadError(msg);
      setError(msg);
      return;
    }

    const rawExt = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const allowedExt = ['jpg', 'jpeg', 'png', 'webp'] as const;
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const extOk = allowedExt.includes(rawExt as (typeof allowedExt)[number]);
    const mimeOk = allowedMime.includes(file.type);
    // macOS / AI exports often have empty MIME — accept by extension
    if (!extOk && !mimeOk) {
      const msg = 'รองรับเฉพาะไฟล์รูปภาพ JPG, PNG หรือ WEBP';
      setAnnCardUploadError(msg);
      setError(msg);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      const msg = 'ไฟล์ใหญ่เกิน 10MB กรุณาลดขนาดแล้วลองใหม่';
      setAnnCardUploadError(msg);
      setError(msg);
      return;
    }

    const safeExt = extOk
      ? (rawExt === 'jpeg' ? 'jpg' : rawExt)
      : file.type.includes('png')
        ? 'png'
        : file.type.includes('webp')
          ? 'webp'
          : 'jpg';
    const contentType = mimeOk
      ? (file.type === 'image/jpg' ? 'image/jpeg' : file.type)
      : `image/${safeExt === 'jpg' ? 'jpeg' : safeExt}`;
    const safeName = `announcement-card-${Date.now()}.${safeExt}`;

    setAnnCardUploading(true);
    setAnnCardUploadError('');
    setError('');
    setSuccess('');

    const localPreview = URL.createObjectURL(file);
    setAnnCustomCardUrl(localPreview);
    setAnnCardMode('custom');

    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: safeName,
          fileType: contentType,
          fileSize: file.size,
          album: 'PROFILE',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'ขอ URL อัปโหลดไม่สำเร็จ');

      if (data.uploadUrl) {
        const putRes = await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': contentType },
          body: file,
        });
        if (!putRes.ok) {
          const putErr = await putRes.json().catch(() => ({}));
          throw new Error(putErr.error || `บันทึกไฟล์ลงเซิร์ฟเวอร์ไม่สำเร็จ (${putRes.status})`);
        }
      }

      if (!data.filePath) throw new Error('ไม่ได้รับที่อยู่ไฟล์จากเซิร์ฟเวอร์');

      URL.revokeObjectURL(localPreview);
      setAnnCustomCardUrl(data.filePath);
      setAnnCardUploadError('');
      setSuccess('อัปโหลดการ์ดสำเร็จ — กดบันทึกเพื่อยืนยัน');
    } catch (err: any) {
      URL.revokeObjectURL(localPreview);
      setAnnCustomCardUrl('');
      const msg = err.message || 'การอัปโหลดการ์ดล้มเหลว';
      setAnnCardUploadError(msg);
      setError(msg);
    } finally {
      setAnnCardUploading(false);
    }
  };

  const uploadGalleryMedia = async (file: File): Promise<string | null> => {
    if (!activeSite) return null;
    setGalleryUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: `gallery-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          album: file.type.startsWith('video/') ? 'VIDEO' : 'GALLERY',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl) {
        const putRes = await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!putRes.ok) {
          throw new Error('อัปโหลดไฟล์ไปยังที่เก็บไม่สำเร็จ กรุณาลองใหม่ หรือตรวจการตั้งค่า R2/CORS');
        }
      }

      setSuccess('อัปโหลดไฟล์สำเร็จ');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
      return data.mediaId || null;
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดไฟล์ขัดข้อง');
      return null;
    } finally {
      setGalleryUploading(false);
    }
  };

  const deleteGalleryMedia = async (mediaId: string, force = false) => {
    if (!activeSite) return;
    if (!force) {
      showConfirm(
        'ยืนยันการลบไฟล์สื่อ',
        'คุณแน่ใจหรือไม่ว่าต้องการลบสื่อนี้? การลบแล้วจะไม่สามารถกู้คืนกลับมาได้',
        () => deleteGalleryMedia(mediaId, true)
      );
      return;
    }
    try {
      const res = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, websiteId: activeSite.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ลบสื่อเสร็จสิ้น');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การลบไฟล์สื่อล้มเหลว');
    }
  };

  const saveAlbumConfig = async (updatedAlbums: string[], updatedMediaAlbums: Record<string, string>) => {
    if (!activeSite) return;
    try {
      const res = await fetch('/api/tenant/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          name: siteName,
          category: siteCategory,
          visibility,
          donationPromptPay,
          donationAccountName,
          donationActive,
          themeConfig: {
            primaryColor,
            secondaryColor,
            fontFamily,
            defaultFontSize,
            heroStyle: 'Classic',
            avatarUrl: deceasedAvatarUrl,
            avatarScale: deceasedAvatarScale,
            avatarX: deceasedAvatarX,
            avatarY: deceasedAvatarY,
            avatarRotate: deceasedAvatarRotate,
            coverUrl: deceasedCoverUrl,
            coverScale: deceasedCoverScale,
            coverX: deceasedCoverX,
            coverY: deceasedCoverY,
            coverRotate: deceasedCoverRotate,
            imageCoordSpace: 'relative',
            biography,
            subjects: serializeManageSubjects(subjects, activeSite.category),
            albums: updatedAlbums,
            mediaAlbums: updatedMediaAlbums,
            features,
            announcement: {
              active: annActive,
              mode: annCardMode,
              customCardUrl: annCustomCardUrl.startsWith('blob:') ? '' : annCustomCardUrl,
              text: annText,
              style: annStyle,
              fontFamily: annFontFamily,
              waterDate: annWaterDate,
              waterTime: annWaterTime,
              abhidhammaDateRange: activeSite.category === 'Friends' ? '' : annAbhidhammaDateRange,
              abhidhammaTime: activeSite.category === 'Friends' ? '' : annAbhidhammaTime,
              cremationDate: activeSite.category === 'Friends' ? '' : annCremationDate,
              cremationTime: activeSite.category === 'Friends' ? '' : annCremationTime,
              templeName: annTempleName,
              pavilion: annPavilion,
              mapLink: annMapLink,
              dressCode: annDressCode,
              wreathPolicy: activeSite.category === 'Friends' ? '' : annWreathPolicy,
              contactPhone: annContactPhone,
            },
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setWebsites(websites.map(w => w.id === activeSite.id ? { 
        ...w, 
        name: siteName, 
        category: siteCategory,
        donationPromptPay,
        donationAccountName,
        donationActive,
        themeConfig: data.tenant.themeConfig
      } : w));
      setActiveSite(data.tenant);
    } catch (err: any) {
      console.error('Error saving album config:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลอัลบั้ม');
    }
  };

  const handleAddAlbum = (name: string) => {
    if (!name.trim()) return;
    if (albums.includes(name.trim())) return;
    const nextAlbums = [...albums, name.trim()];
    setAlbums(nextAlbums);
    saveAlbumConfig(nextAlbums, mediaAlbums);
  };

  const handleDeleteAlbum = (name: string) => {
    const nextAlbums = albums.filter(a => a !== name);
    const nextMediaAlbums = { ...mediaAlbums };
    Object.keys(nextMediaAlbums).forEach(k => {
      if (nextMediaAlbums[k] === name) {
        delete nextMediaAlbums[k];
      }
    });
    setAlbums(nextAlbums);
    setMediaAlbums(nextMediaAlbums);
    if (selectedAlbumFilter === name) {
      setSelectedAlbumFilter('ALL');
    }
    saveAlbumConfig(nextAlbums, nextMediaAlbums);
  };

  const handleRenameAlbum = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName.trim()) return;
    if (albums.includes(newName.trim())) return;
    const nextAlbums = albums.map(a => a === oldName ? newName.trim() : a);
    const nextMediaAlbums = { ...mediaAlbums };
    Object.keys(nextMediaAlbums).forEach(k => {
      if (nextMediaAlbums[k] === oldName) {
        nextMediaAlbums[k] = newName.trim();
      }
    });
    setAlbums(nextAlbums);
    setMediaAlbums(nextMediaAlbums);
    if (selectedAlbumFilter === oldName) {
      setSelectedAlbumFilter(newName.trim());
    }
    saveAlbumConfig(nextAlbums, nextMediaAlbums);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const site = activeSite || websites[0];
    if (!site) return;

    // Create a copy of the list and reorder items
    const reorderedList = [...galleryMedias];
    const [draggedItem] = reorderedList.splice(draggedIndex, 1);
    reorderedList.splice(targetIndex, 0, draggedItem);

    // Update local state immediately for snappy UX
    setGalleryMedias(reorderedList);
    setDraggedIndex(null);

    // Call reorder API to persist
    try {
      const orderedIds = reorderedList.map(m => m.id);
      const res = await fetch('/api/media/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: site.id,
          orderedIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSuccess('จัดเรียงลำดับรูปภาพสำเร็จ');
    } catch (err: any) {
      setError(err.message || 'การจัดเรียงรูปภาพขัดข้อง');
      
      // Fallback: Re-fetch original list if API fails
      try {
        const listRes = await fetch(`/api/media/list?websiteId=${site.id}`);
        const listData = await listRes.json();
        if (listRes.ok) {
          setGalleryMedias(listData.mediaList || []);
        }
      } catch (listErr) {
        console.error('Error rolling back gallery reorder:', listErr);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // 2. Select Website & Load related details
  const selectWebsite = async (site: Website) => {
    if (site.status === 'PENDING_PAYMENT') {
      window.location.href = `/manage/payment?site=${site.id}`;
      return;
    }
    setActiveSite(site);
    setSiteName(site.name);
    setSiteCategory(site.category);
    
    // Set donation fields from DB
    setDonationPromptPay(site.donationPromptPay || '');
    setDonationAccountName(site.donationAccountName || '');
    setDonationActive(site.donationActive || false);

    // Reset status flags
    setError('');
    setSuccess('');

    // Update URL query parameter
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('site', site.slug);
      window.history.replaceState({}, '', url.toString());
    }
    
    // Fetch pending condolences for this site
    try {
      const res = await fetch(`/api/condolence/pending?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setCondolences(data.condolences || []);
      }
    } catch (err) {
      console.error('Error fetching condolences:', err);
    }

    // Fetch pending memory posts for this site (Memory Wall)
    try {
      const res = await fetch(`/api/memory/pending?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setPendingPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching memory posts:', err);
    }

    // Fetch Family Members
    try {
      const res = await fetch(`/api/family/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setFamilyMembers(data.members || []);
      }
    } catch (err) {
      console.error('Error fetching family members:', err);
    }

    // Fetch E-Books
    try {
      const res = await fetch(`/api/ebook/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setEbooks(data.ebooks || []);
      }
    } catch (err) {
      console.error('Error fetching ebooks:', err);
    }

    // Fetch Media List
    try {
      setGalleryLoading(true);
      const res = await fetch(`/api/media/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setGalleryMedias(data.mediaList || []);
      }
    } catch (err) {
      console.error('Error fetching gallery media:', err);
    } finally {
      setGalleryLoading(false);
    }

    // Initialize theme variables from config
    const config = (site as any).themeConfig as any;
    if (config) {
      setPrimaryColor(config.primaryColor || '#0d9488');
      const scriptFonts = ['Charm', 'Srisakdi', 'Charmonman', 'Thasadith'];
      const loadedFont = config.fontFamily || 'Inter';
      setFontFamily(scriptFonts.includes(loadedFont) ? 'LINE Seed Sans TH' : loadedFont);
      setBiography(config.biography || '');
      setSubjects(normalizeManageSubjects(config.subjects || [], site.category));
      setAlbums(config.albums || []);
      setMediaAlbums(config.mediaAlbums || {});
      setDefaultFontSize(config.defaultFontSize || 'NORMAL');
      setDeceasedAvatarUrl(config.avatarUrl || '');
      {
        const avatarScale = config.avatarScale || 1;
        const coverScale = config.coverScale || 1;
        setDeceasedAvatarScale(avatarScale);
        setDeceasedAvatarX(clampImagePan(toRelativeOffset(config.avatarX || 0, 224, config.imageCoordSpace), avatarScale));
        setDeceasedAvatarY(clampImagePan(toRelativeOffset(config.avatarY || 0, 224, config.imageCoordSpace), avatarScale));
        setDeceasedAvatarRotate(config.avatarRotate || 0);
        setDeceasedCoverUrl(config.coverUrl || '');
        setDeceasedCoverScale(coverScale);
        setDeceasedCoverX(clampImagePan(toRelativeOffset(config.coverX || 0, 320, config.imageCoordSpace), coverScale));
        setDeceasedCoverY(clampImagePan(toRelativeOffset(config.coverY || 0, 160, config.imageCoordSpace), coverScale));
        setDeceasedCoverRotate(config.coverRotate || 0);
      }

      const ann = config.announcement || {};
      setAnnActive(ann.active !== false);
      setAnnCardMode(ann.mode === 'custom' ? 'custom' : 'template');
      setAnnCustomCardUrl(ann.customCardUrl || '');
      setAnnText(ann.text || '');
      setAnnStyle(ann.style || 'ELEGANT_WHITE');
      setAnnFontFamily(ann.fontFamily || 'LINE Seed Sans TH');
      setAnnWaterDate(ann.waterDate || '');
      setAnnWaterTime(ann.waterTime || '');
      setAnnAbhidhammaDateRange(ann.abhidhammaDateRange || '');
      setAnnAbhidhammaTime(ann.abhidhammaTime || '');
      setAnnCremationDate(ann.cremationDate || '');
      setAnnCremationTime(ann.cremationTime || '');
      setAnnTempleName(ann.templeName || '');
      setAnnPavilion(ann.pavilion || '');
      setAnnMapLink(ann.mapLink || '');
      setAnnDressCode(ann.dressCode || '');
      setAnnWreathPolicy(ann.wreathPolicy || 'NORMAL');
      setAnnContactPhone(ann.contactPhone || '');

      setIsCustomWaterTime(ann.waterTime ? !TIME_PRESETS.includes(ann.waterTime) : false);
      setIsCustomAbhidhammaTime(ann.abhidhammaTime ? !TIME_PRESETS.includes(ann.abhidhammaTime) : false);
      setIsCustomCremationTime(ann.cremationTime ? !TIME_PRESETS.includes(ann.cremationTime) : false);
      setAbhidhammaStartDate('');
      setAbhidhammaEndDate('');

      if (config.features) {
        setFeatures({
          family: config.features.family !== false,
          gallery: config.features.gallery !== false,
          videos: config.features.videos !== false,
          announcement: config.features.announcement !== false,
          ebooks: config.features.ebooks !== false,
          condolence: config.features.condolence !== false,
          donation: config.features.donation !== false,
          memory: config.features.memory !== false,
          feed: config.features.feed !== false,
        });
      }
    } else {
      setPrimaryColor('#0d9488');
      setSecondaryColor('#f59e0b');
      setFontFamily('Inter');
      setBiography('');
      setSubjects([]);
      setAlbums([]);
      setMediaAlbums({});
      setDeceasedAvatarUrl('');
      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);
      setDeceasedCoverUrl('');
      setDeceasedCoverScale(1);
      setDeceasedCoverX(0);
      setDeceasedCoverY(0);
      setDeceasedCoverRotate(0);
    }
  };

  const handleExportZip = async () => {
    if (!activeSite) return;
    setExportLoading(true);
    setError('');
    setSuccess('');

    try {
      window.location.href = `/api/media/export?websiteId=${activeSite.id}`;
      setSuccess('ระบบกำลังดำเนินการบีบอัดไฟล์ ZIP... ข้อมูลความทรงจำทั้งหมดจะถูกดาวน์โหลดโดยอัตโนมัติในไม่ช้า');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการดาวน์โหลดข้อมูล');
    } finally {
      setTimeout(() => setExportLoading(false), 4000);
    }
  };

  // 3. Save Website Configuration (BR025, BR026, Step 7 Theme Save, Donation fields update)
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite) return;

    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/tenant/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          name: siteName,
          category: siteCategory,
          visibility,
          donationPromptPay,
          donationAccountName,
          donationActive,
          themeConfig: {
            primaryColor,
            secondaryColor,
            fontFamily,
            defaultFontSize,
            heroStyle: 'Classic',
            avatarUrl: deceasedAvatarUrl,
            avatarScale: deceasedAvatarScale,
            avatarX: deceasedAvatarX,
            avatarY: deceasedAvatarY,
            avatarRotate: deceasedAvatarRotate,
            coverUrl: deceasedCoverUrl,
            coverScale: deceasedCoverScale,
            coverX: deceasedCoverX,
            coverY: deceasedCoverY,
            coverRotate: deceasedCoverRotate,
            imageCoordSpace: 'relative',
            biography,
            subjects: serializeManageSubjects(subjects, activeSite.category),
            albums,
            mediaAlbums,
            features,
            announcement: {
              active: annActive,
              mode: annCardMode,
              customCardUrl: annCustomCardUrl.startsWith('blob:') ? '' : annCustomCardUrl,
              text: annText,
              style: annStyle,
              fontFamily: annFontFamily,
              waterDate: annWaterDate,
              waterTime: annWaterTime,
              abhidhammaDateRange: activeSite.category === 'Friends' ? '' : annAbhidhammaDateRange,
              abhidhammaTime: activeSite.category === 'Friends' ? '' : annAbhidhammaTime,
              cremationDate: activeSite.category === 'Friends' ? '' : annCremationDate,
              cremationTime: activeSite.category === 'Friends' ? '' : annCremationTime,
              templeName: annTempleName,
              pavilion: annPavilion,
              mapLink: annMapLink,
              dressCode: annDressCode,
              wreathPolicy: activeSite.category === 'Friends' ? '' : annWreathPolicy,
              contactPhone: annContactPhone,
            },
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('บันทึกการปรับแต่งเว็บไซต์ความทรงจำสำเร็จ');
      
      // Update local websites list state
      setWebsites(websites.map(w => w.id === activeSite.id ? { 
        ...w, 
        name: siteName, 
        category: siteCategory,
        donationPromptPay,
        donationAccountName,
        donationActive,
        themeConfig: data.tenant.themeConfig
      } : w));
      setActiveSite(data.tenant);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaveLoading(false);
    }
  };

  // 4. Moderate Condolence (Approve / Delete - BR027)
  const handleModerateCondolence = async (id: string, action: 'APPROVE' | 'DELETE', force = false) => {
    if (!activeSite) return;
    const isFriends = activeSite.category === 'Friends';
    const isHappy =
      isFriends ||
      activeSite.category === 'Couple' ||
      activeSite.category === 'Wedding';
    if (action === 'DELETE' && !force) {
      showConfirm(
        'ยืนยันการลบข้อมูล',
        isHappy
          ? 'คุณต้องการลบข้อความนี้ใช่หรือไม่? การลบนี้จะไม่สามารถย้อนกลับได้'
          : 'คุณต้องการลบข้อความแสดงความไว้อาลัยนี้ใช่หรือไม่? การลบนี้จะไม่สามารถย้อนกลับได้',
        () => handleModerateCondolence(id, 'DELETE', true)
      );
      return;
    }
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/condolence/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condolenceId: id,
          action,
          websiteId: activeSite.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(
        action === 'APPROVE'
          ? isHappy
            ? 'อนุมัติข้อความออกเผยแพร่สำเร็จ'
            : 'อนุมัติคำไว้อาลัยออกเผยแพร่สำเร็จ'
          : isHappy
            ? 'ลบข้อความสำเร็จ'
            : 'ลบคำไว้อาลัยสำเร็จ'
      );
      setCondolences(condolences.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการคัดกรองข้อมูล');
    }
  };

  // 5. Moderate Memory Post (Approve / Delete)
  const handleModerateMemoryPost = async (id: string, action: 'APPROVE' | 'DELETE', force = false) => {
    if (!activeSite) return;
    if (action === 'DELETE' && !force) {
      showConfirm(
        'ยืนยันการลบข้อมูล',
        'คุณต้องการลบเรื่องราวความทรงจำนี้ใช่หรือไม่? การลบนี้จะไม่สามารถย้อนกลับได้',
        () => handleModerateMemoryPost(id, 'DELETE', true)
      );
      return;
    }
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/memory/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: id,
          action,
          websiteId: activeSite.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(action === 'APPROVE' ? 'อนุมัติโพสต์ขึ้นบอร์ดความทรงจำสำเร็จ' : 'ลบโพสต์สำเร็จ');
      setPendingPosts(pendingPosts.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการคัดกรองเรื่องราว');
    }
  };

  // 6. Mock Media Upload with Quota Checks (BR014, BR016, Step 8 uploader)
  const handleMockUpload = async (sizeMB: number) => {
    if (!activeSite) return;
    setUploadLoading(true);
    setError('');
    setSuccess('');

    const sizeBytes = sizeMB * 1024 * 1024;
    const fileName = `memory-photo-${Date.now()}.png`;

    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName,
          fileType: 'image/png',
          fileSize: sizeBytes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`อัปโหลดไฟล์ "${fileName}" (${sizeMB} MB) สำเร็จ! บันทึกในคลังภาพ R2 สำเร็จ`);
      setStorageUsedBytes(prev => prev + sizeBytes);
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดไฟล์ขัดข้อง');
    } finally {
      setUploadLoading(false);
    }
  };

  // 7. Family Tree Handlers
  const uploadFamilyAvatar = async (file: File) => {
    if (!activeSite) return;
    setAvatarUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: `family-avatar-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          album: 'FAMILY',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl) {
        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      setFamilyAvatarUrl(data.filePath);
      setSuccess('อัปโหลดรูปภาพสำเร็จ');
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดรูปภาพล้มเหลว');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite) return;

    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/family/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: familyId || undefined,
          websiteId: activeSite.id,
          name: familyName,
          relationship: familyRelationship,
          birthYear: familyBirthYear || null,
          deathYear: familyDeathYear || null,
          isDeceased: familyIsDeceased,
          avatarUrl: familyAvatarUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('บันทึกข้อมูลสมาชิกเครือญาติสำเร็จ');
      
      // Reload family members
      const listRes = await fetch(`/api/family/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) setFamilyMembers(listData.members || []);

      resetFamilyForm();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลเครือญาติ');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteFamilyMember = async (memberId: string, force = false) => {
    if (!activeSite) return;
    if (!force) {
      showConfirm(
        'ยืนยันการลบข้อมูลญาติ',
        'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลญาติท่านนี้? การลบแล้วจะไม่สามารถกู้คืนกลับมาได้',
        () => handleDeleteFamilyMember(memberId, true)
      );
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/family/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, websiteId: activeSite.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ลบข้อมูลสมาชิกเครือญาติสำเร็จ');
      setFamilyMembers(familyMembers.filter(m => m.id !== memberId));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูลญาติ');
    }
  };

  const editFamilyMember = (m: FamilyMember) => {
    setFamilyId(m.id);
    setFamilyName(m.name);
    setFamilyRelationship(m.relationship);
    setFamilyBirthYear(m.birthYear || '');
    setFamilyDeathYear(m.deathYear || '');
    setFamilyIsDeceased(m.isDeceased);
    setFamilyAvatarUrl(m.avatarUrl || '');
    setFamilyFormOpen(true);
  };

  const resetFamilyForm = () => {
    familyId && setFamilyId('');
    familyName && setFamilyName('');
    setFamilyRelationship('CHILD');
    familyBirthYear && setFamilyBirthYear('');
    familyDeathYear && setFamilyDeathYear('');
    familyIsDeceased && setFamilyIsDeceased(false);
    familyAvatarUrl && setFamilyAvatarUrl('');
    familyIsDragActive && setFamilyIsDragActive(false);
    familyFormOpen && setFamilyFormOpen(false);
  };

  // 8. E-Book Handlers
  const handleSaveEbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite) return;

    setSaveLoading(true);
    setError('');
    setSuccess('');

    // Simulate S3 quota check and file record registration
    const fileSize = ebookFile ? ebookFile.size : 5 * 1024 * 1024; // Default mock 5MB
    const fileName = ebookFile ? ebookFile.name : `ebook-booklet-${Date.now()}.pdf`;

    try {
      // 1. Quota check API
      const quotaRes = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName,
          fileType: 'application/pdf',
          fileSize,
        }),
      });

      const quotaData = await quotaRes.json();
      if (!quotaRes.ok) throw new Error(quotaData.error);

      // 2. Submit Booklet metadata
      const pagesArray = ebookPagesText.split('[PAGE]').map(p => p.trim()).filter(Boolean);
      if (pagesArray.length === 0) {
        // Fallback default pages if user did not provide pages
        const pagesCount = parseInt(ebookTotalPages, 10) || 1;
        for (let i = 1; i <= pagesCount; i++) {
          pagesArray.push(`หน้า ${i}: ข้อความนำเสนอธรรมสติและคำกล่าวขอบคุณของผู้ล่วงลับ...`);
        }
      }

      const res = await fetch('/api/ebook/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ebookId || undefined,
          websiteId: activeSite.id,
          title: ebookTitle,
          author: ebookAuthor,
          pdfUrl: quotaData.filePath || `https://storage.forever.co.th/uploads/${activeSite.id}/${fileName}`,
          totalPages: pagesArray.length,
          pages: pagesArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('อัปโหลดหนังสือที่ระลึกธรรมทานและสร้างระบบ Web Reader สำเร็จ!');
      setStorageUsedBytes(prev => prev + fileSize);

      // Reload ebooks
      const listRes = await fetch(`/api/ebook/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) setEbooks(listData.ebooks || []);

      resetEbookForm();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการจัดการข้อมูลหนังสือ');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteEbook = async (ebId: string, force = false) => {
    if (!activeSite) return;
    if (!force) {
      showConfirm(
        'ยืนยันการลบหนังสือที่ระลึก',
        'คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือที่ระลึกนี้? การลบแล้วจะไม่สามารถกู้คืนกลับมาได้',
        () => handleDeleteEbook(ebId, true)
      );
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/ebook/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ebookId: ebId, websiteId: activeSite.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ลบหนังสือที่ระลึกสำเร็จ');
      setEbooks(ebooks.filter(b => b.id !== ebId));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลบหนังสือ');
    }
  };

  const editEbook = (b: Ebook) => {
    setEbookId(b.id);
    setEbookTitle(b.title);
    setEbookAuthor(b.author);
    setEbookTotalPages(String(b.totalPages));
    setEbookPagesText(b.pages.join(' \n[PAGE]\n '));
    setEbookFormOpen(true);
  };

  const resetEbookForm = () => {
    setEbookId('');
    setEbookTitle('');
    setEbookAuthor('');
    setEbookTotalPages('4');
    setEbookPagesText('');
    setEbookFile(null);
    setEbookFormOpen(false);
  };

  // 9. Renewal Handler (Phase 2 Expiration Banner alignment)
  const handleRequestRenewal = async () => {
    if (!selectedSite) return;
    setRenewLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/payment/create-renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId: selectedSite.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRenewRefId(data.refId);
      setRenewAmount(data.amount);
      setRenewModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการขอต่ออายุบริการ');
    } finally {
      setRenewLoading(false);
    }
  };

  const handleSimulateRenewSuccess = async () => {
    if (!selectedSite || !renewRefId) return;
    setRenewLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refId: renewRefId,
          amount: renewAmount,
          status: 'SUCCESS',
          signature: 'MOCK_SIGNATURE_OK_2026',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ต่ออายุบริการเว็บไซต์สำเร็จ! ขยายเวลาการใช้งานเรียบร้อยแล้วค่ะ');
      setRenewModalOpen(false);

      // Reload website details to refresh expiry date
      const meRes = await fetch('/api/tenant/list-mine');
      const meData = await meRes.json();
      if (meRes.ok && meData.websites) {
        setWebsites(meData.websites);
        const updated = meData.websites.find((w: any) => w.id === selectedSite.id);
        if (updated) selectWebsite(updated);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการจำลองการชำระเงินต่ออายุ');
    } finally {
      setRenewLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
        <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลดแผงควบคุมหลังบ้าน...</p>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 text-stone-850 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
          <Flame className="w-8 h-8 text-[#0071e3] animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-stone-900">ยินดีต้อนรับสู่ FOREVER</h1>
          <p className="text-stone-500 text-sm max-w-sm mx-auto">
            {userPhone
              ? `เข้าสู่ระบบด้วย ${userPhone} แล้ว แต่ยังไม่มีเว็บไซต์ในบัญชีนี้`
              : 'คุณยังไม่มีเว็บไซต์ความทรงจำในระบบบัญชีของคุณในขณะนี้'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/manage/create"
            className="px-6 py-3.5 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-sm transition active:scale-95 shadow-sm"
          >
            สร้างเว็บไซต์แรกของคุณ
          </Link>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="px-6 py-3.5 rounded-2xl border border-stone-200 bg-white text-stone-700 font-bold text-sm hover:bg-stone-50 transition cursor-pointer"
          >
            ออกจากระบบ / เปลี่ยนเบอร์
          </button>
        </div>
      </main>
    );
  }

  const selectedSite = activeSite || websites[0];
  const sLabels = getScheduleLabels(selectedSite?.category || 'Memorial');
  const storagePercentage = Math.min((storageUsedBytes / storageQuotaBytes) * 100, 100);

  // Dynamic invoice lists matching expiredAt dates (Thai receipt logs)
  const invoiceLogs = [
    {
      id: `INV-2026-${Math.floor(10000 + selectedSite.slug.charCodeAt(0) * 123) % 90000}`,
      refId: `QR-${selectedSite.slug}-9011`,
      amount: '2,000.00 บาท',
      status: 'SUCCESS',
      date: selectedSite.expiredAt 
         ? new Date(new Date(selectedSite.expiredAt).getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH')
        : new Date().toLocaleDateString('th-TH'),
      desc: 'ค่าธรรมเนียมจดทะเบียนและดูแลรักษาระบบรายปี (First Year + ความจุ 1GB)'
    }
  ];

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleSaveYoutubeLink = async () => {
    if (!activeSite || !youtubeUrl) return;
    setYoutubeSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/video-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          videoUrl: youtubeUrl,
          title: '',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`แนบลิงก์วิดีโอสำเร็จ`);
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์วิดีโอล้มเหลว');
    } finally {
      setYoutubeSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const photoMedias = galleryMedias.filter(m => !m.mimeType?.startsWith('video/') && m.mimeType !== 'video/youtube');
  const videoMedias = galleryMedias.filter(m => m.mimeType?.startsWith('video/') || m.mimeType === 'video/youtube');

  if (!activeSite) {
    return (
      <main className="min-h-screen bg-stone-50 text-stone-850 p-6 md:p-12 font-sans relative flex items-center justify-center">
        {/* Decorative Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-500/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl w-full mx-auto space-y-8 relative z-10">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-white to-blue-50/80 rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm gap-5">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-stone-900 tracking-wider">
                FOREVER <span className="text-[#0071e3] font-normal">เว็บของฉัน</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0071e3]/10 flex items-center justify-center ring-2 ring-[#0071e3]/15">
                  <User className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-stone-400 font-bold uppercase">บัญชีผู้ใช้งาน</p>
                  <p className="text-xs font-bold text-stone-700">{userPhone || 'กำลังโหลด...'}</p>
                </div>
              </div>
              <Button variant="ghost" type="button" 
                onClick={handleLogout}
                className="h-auto px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 hover:text-stone-900 text-stone-500 text-xs font-bold transition flex items-center gap-1.5 active:scale-[0.97] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ</span>
              </Button>
            </div>
          </header>

          <p className="text-sm text-stone-500 pl-1 -mt-2">จัดการเว็บไซต์ทั้งหมดของคุณได้จากที่นี่</p>

          {/* Backup Phones Section & Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Websites Grid */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 pl-1">
                <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <Grid className="w-4.5 h-4.5 text-[#0071e3]" />
                  <span>เว็บไซต์อนุสรณ์ของฉัน</span>
                </h2>
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#0071e3] text-white text-[10px] font-black">
                  {websites.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {websites.map((site) => {
                  const isActive = site.status === 'ACTIVE';
                  const accent = {
                    'Memorial': { strip: 'bg-rose-500', badge: 'border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-50' },
                    'Family Legacy': { strip: 'bg-amber-500', badge: 'border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-50' },
                    'Pet Memorial': { strip: 'bg-teal-500', badge: 'border-teal-100 bg-teal-50 text-teal-700 hover:bg-teal-50' },
                    'Couple': { strip: 'bg-pink-500', badge: 'border-pink-100 bg-pink-50 text-pink-700 hover:bg-pink-50' },
                    'Wedding': { strip: 'bg-violet-500', badge: 'border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-50' },
                    'Friends': { strip: 'bg-sky-500', badge: 'border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-50' },
                  }[site.category] || { strip: 'bg-blue-500', badge: 'border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-50' };
                  
                  return (
                    <div key={site.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-52 group text-left animate-fade-in">
                      <div className="px-6 pt-5 pb-2 space-y-2.5 flex-1">
                        <div className="flex justify-between items-start">
                          <Badge className={`h-auto rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${accent.badge}`}>
                            {site.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`h-auto rounded-full px-2.5 py-0.5 text-[9px] font-black ${
                              isActive
                                ? 'border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-50'
                                : 'border-amber-100 bg-amber-50 text-amber-800 hover:bg-amber-50'
                            }`}
                          >
                            {isActive ? 'ใช้งานอยู่' : 'รอชำระเงิน'}
                          </Badge>
                        </div>
                        <h3 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-[#0071e3] transition">{site.name}</h3>
                        
                        {isActive ? (
                          <a 
                            href={`/${site.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-stone-400 font-medium hover:underline flex items-center gap-1 mt-1 font-mono"
                          >
                            <ExternalLink className="w-3 h-3 text-stone-400" />
                            <span>forever.co.th/{site.slug}</span>
                          </a>
                        ) : (
                          <p className="text-[10px] text-stone-400 font-mono mt-1">ยังไม่เปิดใช้งาน (ยังไม่มีลิงก์)</p>
                        )}
                      </div>

                      <div className="px-6 pb-5 pt-3 border-t border-stone-100 flex gap-2">
                        {isActive ? (
                          <Button variant="ghost" type="button"
                            onClick={() => selectWebsite(site)}
                            className="w-full py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white hover:text-white font-bold text-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>จัดการเว็บไซต์</span>
                          </Button>
                        ) : (
                          <Link
                            href={`/manage/payment?site=${site.id}`}
                            className="w-full py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-xs transition active:scale-95 text-center flex items-center justify-center gap-1.5 animate-pulse"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>ชำระเงิน ฿2,000</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Create New Website card button */}
                <Link 
                  href="/"
                  className="bg-gradient-to-br from-blue-50/60 to-stone-50 hover:from-blue-50 hover:to-blue-50/30 border-2 border-dashed border-stone-300 hover:border-[#0071e3]/40 rounded-3xl p-6 flex flex-col items-center justify-center h-52 transition-all duration-200 group text-center space-y-3 select-none"
                >
                  <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:border-blue-200 transition-all duration-200">
                    <Plus className="w-7 h-7 text-stone-400 group-hover:text-[#0071e3] transition" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-700 group-hover:text-stone-900 transition">สร้างเว็บไซต์ความทรงจำใหม่</p>
                    <p className="text-[10px] text-stone-400 mt-1">เลือกหัวข้อและรับรหัสผ่านมือถือ</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right: Phone Numbers Management */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
                <h2 className="text-sm font-black text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-3">
                  <Smartphone className="w-4.5 h-4.5 text-[#0071e3]" />
                  <span>การจัดการเบอร์โทรศัพท์</span>
                </h2>
                
                <BackupPhoneSection userPhone={userPhone} />
              </div>
            </div>

          </div>

        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <header className="md:hidden w-full bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <span className="text-lg font-black tracking-wider text-stone-900">
          FOREVER <span className="text-[#0071e3] font-normal">MANAGE</span>
        </span>
        <Button variant="ghost"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-xl border border-stone-200 text-stone-650 hover:bg-stone-50 transition cursor-pointer active:scale-95"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </Button>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 p-6 flex flex-col justify-between overflow-y-auto shrink-0 transition-transform duration-300 transform
        md:relative md:translate-x-0 md:h-screen md:sticky md:top-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="mb-6">
            <Button variant="ghost" type="button"
              onClick={() => {
                setActiveSite(null);
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('site');
                  window.history.replaceState({}, '', url.toString());
                }
              }}
              className="w-full py-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-stone-900 rounded-xl text-[10px] font-black transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
              <span>กลับไปหน้าเว็บของฉัน</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black tracking-wider text-[#0071e3] truncate max-w-[200px]">
              จัดการ: {activeSite?.name}
            </span>
          </div>
          <nav className="space-y-1">
            {features.gallery && (
              <Button variant="ghost" 
                type="button"
                onClick={() => handleTabClick('gallery')}
                className={`h-auto w-full justify-start gap-3 rounded-xl border-transparent px-4 py-2.5 text-left text-xs font-semibold shadow-none transition cursor-pointer ${
                  activeTab === 'gallery' 
                    ? 'bg-[#0071e3] font-bold text-white hover:bg-[#0071e3] hover:text-white' 
                    : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Camera className={`size-3.5 shrink-0 ${activeTab === 'gallery' ? 'text-white' : 'text-stone-500'}`} />
                <span>{getFeatureLabel(selectedSite.category, 'gallery').label} ({photoMedias.length})</span>
              </Button>
            )}
            {features.videos && (
              <Button variant="ghost" 
                type="button"
                onClick={() => handleTabClick('videos')}
                className={`h-auto w-full justify-start gap-3 rounded-xl border-transparent px-4 py-2.5 text-left text-xs font-semibold shadow-none transition cursor-pointer ${
                  activeTab === 'videos' 
                    ? 'bg-[#0071e3] font-bold text-white hover:bg-[#0071e3] hover:text-white' 
                    : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Video className={`size-3.5 shrink-0 ${activeTab === 'videos' ? 'text-white' : 'text-stone-500'}`} />
                <span>{getFeatureLabel(selectedSite.category, 'videos').label} ({videoMedias.length})</span>
              </Button>
            )}
            {features.family && (
              <Button variant="ghost" 
                type="button"
                onClick={() => handleTabClick('family')}
                className={`h-auto w-full justify-start gap-3 rounded-xl border-transparent px-4 py-2.5 text-left text-xs font-semibold shadow-none transition cursor-pointer ${
                  activeTab === 'family' 
                    ? 'bg-[#0071e3] font-bold text-white hover:bg-[#0071e3] hover:text-white' 
                    : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <GitBranch className={`size-3.5 shrink-0 ${activeTab === 'family' ? 'text-white' : 'text-stone-500'}`} />
                <span>{getFeatureLabel(selectedSite.category, 'family').label} ({familyMembers.length})</span>
              </Button>
            )}
            {features.ebooks && (
              <Button variant="ghost" 
                type="button"
                onClick={() => handleTabClick('ebooks')}
                className={`h-auto w-full justify-start gap-3 rounded-xl border-transparent px-4 py-2.5 text-left text-xs font-semibold shadow-none transition cursor-pointer ${
                  activeTab === 'ebooks' 
                    ? 'bg-[#0071e3] font-bold text-white hover:bg-[#0071e3] hover:text-white' 
                    : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <BookOpen className={`size-3.5 shrink-0 ${activeTab === 'ebooks' ? 'text-white' : 'text-stone-500'}`} />
                <span>{getFeatureLabel(selectedSite.category, 'ebooks').label} ({ebooks.length})</span>
              </Button>
            )}
            {(features.condolence || features.memory) && (
              <Button variant="ghost" 
                type="button"
                onClick={() => handleTabClick('condolences')}
                className={`h-auto w-full justify-between gap-3 rounded-xl border-transparent px-4 py-2.5 text-left text-xs font-semibold shadow-none transition cursor-pointer ${
                  activeTab === 'condolences' 
                    ? 'bg-[#0071e3] font-bold text-white hover:bg-[#0071e3] hover:text-white' 
                    : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Flame className={`size-3.5 shrink-0 ${activeTab === 'condolences' ? 'text-white' : 'text-stone-500'}`} />
                  <span>
                    {features.condolence && features.memory
                      ? 'กลั่นกรองเนื้อหา'
                      : features.memory
                      ? `กลั่นกรอง${getFeatureLabel(selectedSite.category, 'memory').label}`
                      : selectedSite.category === 'Friends'
                        ? 'กลั่นกรองข้อความถึงกัน'
                        : selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                          ? 'กลั่นกรองคำอวยพร'
                          : 'กลั่นกรองคำไว้อาลัย'}
                  </span>
                </div>
                
                {/* LINE-style Notification Badge */}
                {(condolences.length + pendingPosts.length) > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[9px] font-black text-white ring-2 ring-rose-300/30 animate-pulse">
                    {condolences.length + pendingPosts.length}
                  </span>
                )}
              </Button>
            )}

            <div className="pt-4 mt-4 border-t border-stone-200/60">
              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2 px-4">SYSTEM CONFIG</label>
              <Button variant="ghost" 
                type="button"
                onClick={() => handleTabClick('settings')}
                className={`h-auto w-full justify-start gap-3 rounded-xl border-transparent px-4 py-2.5 text-left text-xs font-semibold shadow-none transition cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-[#0071e3] font-bold text-white hover:bg-[#0071e3] hover:text-white' 
                    : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Settings className={`size-3.5 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-stone-500'}`} />
                <span>ตั้งค่าเว็บไซต์</span>
              </Button>
              <Link href="/manage/create" className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-955 hover:bg-stone-200/30 text-xs transition font-semibold mt-1">
                <Plus className="w-3.5 h-3.5 text-stone-400" />
                <span>สร้างเว็บไซต์เพิ่ม</span>
              </Link>
            </div>
          </nav>


        </div>
        
        <div className="mt-8 border-t border-stone-200 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
              <User className="w-4 h-4 text-[#0071e3]" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">ผู้ใช้งานบัญชี</p>
              <p className="text-[10px] text-stone-555 font-mono font-medium">{userPhone}</p>
            </div>
          </div>
          <Button variant="ghost" 
            type="button"
            onClick={handleLogout}
            className="h-auto p-1.5 rounded-lg text-stone-400 hover:text-red-655 hover:bg-stone-200/50 transition cursor-pointer active:scale-95 border-0"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {success && <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-2xl font-semibold animate-fade-in flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" />{success}</div>}
        {error && <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 rounded-2xl font-semibold animate-fade-in flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500 shrink-0" />{error}</div>}

        {/* Expiration warning banner (Phase 2 Expiration Banner alignment) */}
        {(() => {
          const getRemainingDays = (expiredAtStr: string) => {
            const expiredAt = new Date(expiredAtStr);
            const now = new Date();
            const diffTime = expiredAt.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
          };
          const remainingDays = selectedSite.expiredAt ? getRemainingDays(selectedSite.expiredAt) : 999;
          const isExpiringSoon = remainingDays <= 30;

          if (!isExpiringSoon) return null;

          const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleSaveYoutubeLink = async () => {
    if (!activeSite || !youtubeUrl) return;
    setYoutubeSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/video-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          videoUrl: youtubeUrl,
          title: '',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`แนบลิงก์วิดีโอสำเร็จ`);
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์วิดีโอล้มเหลว');
    } finally {
      setYoutubeSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const photoMedias = galleryMedias.filter(m => !m.mimeType?.startsWith('video/') && m.mimeType !== 'video/youtube');
  const videoMedias = galleryMedias.filter(m => m.mimeType?.startsWith('video/') || m.mimeType === 'video/youtube');

  return (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold text-amber-800">
              <div className="space-y-1">
                <p className="font-bold text-sm text-amber-900">⚠️ บริการใกล้หมดอายุ (Subscription Expiring Soon)</p>
                <p className="text-[11px] text-amber-700">
                  เว็บไซต์รำลึก /{selectedSite.slug} จะหมดอายุลงในอีก {remainingDays} วัน (ในวันที่ {new Date(selectedSite.expiredAt).toLocaleDateString('th-TH')}) กรุณาต่ออายุเพื่อหลีกเลี่ยงการระงับบริการชั่วคราว
                </p>
              </div>
              <Button variant="ghost" 
                type="button"
                onClick={handleRequestRenewal}
                disabled={renewLoading}
                className="h-auto px-4 py-2.5 bg-amber-650 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-xl transition flex-shrink-0 text-[10px] shadow-sm flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>ต่ออายุบริการ 1 ปี (2,000 บาท)</span>
              </Button>
            </div>
          );
        })()}

        {/* Renewal Checkout Modal */}
        {renewModalOpen && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full space-y-6 text-center animate-fade-in shadow-2xl">
              <header className="space-y-1 text-left border-b border-stone-100 pb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>ต่ออายุบริการเว็บไซต์ (Subscription Renewal)</span>
                </h3>
                <p className="text-[10px] text-stone-500 font-semibold">ต่ออายุหน้ารำลึก /{selectedSite.slug} เพิ่มเติม 1 ปี (365 วัน)</p>
              </header>

              <div className="p-5 rounded-2xl bg-white text-stone-900 shadow-md space-y-4 max-w-[240px] mx-auto border border-stone-200">
                <div className="text-center font-bold text-[9px] tracking-wider border-b border-stone-100 pb-1 text-stone-500 uppercase">PROMPTPAY QR</div>
                
                <div className="w-36 h-36 bg-stone-50 rounded-lg mx-auto flex flex-col items-center justify-center gap-1 border border-stone-150 p-2 shadow-inner">
                  <Flame className="w-6 h-6 text-stone-500 animate-pulse" />
                  <span className="text-[7px] font-black text-stone-700">RENEWAL PAYMENT</span>
                  <span className="text-[8px] font-mono text-stone-500 break-all px-1 select-all">{renewRefId}</span>
                </div>

                <div className="space-y-0.5 text-left text-[11px]">
                  <p className="font-bold text-stone-600">ยอดชำระ: <span className="text-emerald-800 font-black">{renewAmount.toLocaleString()} บาท</span></p>
                  <p className="text-[9px] text-stone-400">อ้างอิง: {renewRefId.substring(0, 16)}...</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 text-[10px] text-stone-605 text-left leading-normal">
                * คิวอาร์โค้ดสำหรับจ่ายเงินต่ออายุนี้มีอายุการใช้งาน 15 นาทีตามมาตรฐานความปลอดภัย (Grill Decision)
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" 
                  type="button"
                  onClick={handleSimulateRenewSuccess}
                  disabled={renewLoading}
                  className="h-auto flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm active:scale-95"
                >
                  {renewLoading ? 'กำลังจำลอง...' : '✓ จำลองต่ออายุสำเร็จ'}
                </Button>
                <Button variant="ghost" 
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  disabled={renewLoading}
                  className="px-4 py-2.5 border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold rounded-xl text-xs transition"
                >
                  ปิด
                </Button>
              </div>
            </div>
          </div>
        )}

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">{selectedSite.name}</h1>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
              <span>ลิงก์ความทรงจำ:</span>
              <a 
                href={`/${selectedSite.slug}`} 
                target="_blank" 
                className="text-[#0071e3] font-semibold hover:text-[#0071e3]/80 underline"
              >
                forever.co.th/{selectedSite.slug}
              </a>
              <Button variant="ghost"
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`forever.co.th/${selectedSite.slug}`);
                  setSuccess('คัดลอกลิงก์สำเร็จ!');
                }}
                className="p-1 hover:bg-stone-100 rounded-md text-stone-400 hover:text-stone-750 transition cursor-pointer border-0"
                title="คัดลอกลิงก์"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Website Selector Dropdown */}
            <Select
              value={selectedSite.id}
              onValueChange={(value) => {
                const site = websites.find(w => w.id === value);
                if (site) selectWebsite(site);
              }}
            >
              <SelectTrigger
                size="sm"
                className="h-auto min-h-8 w-auto max-w-[240px] gap-2 rounded-xl border-stone-250 bg-white px-3 py-1.5 text-xs font-bold text-stone-850 shadow-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" position="popper">
                {websites.map(w => (
                  <SelectItem key={w.id} value={w.id}>
                    /{w.slug} ({w.name.substring(0, 10)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Quick settings button */}
            <Button variant="ghost"
              type="button"
              onClick={() => handleTabClick('settings')}
              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>ตั้งค่า</span>
            </Button>

            {/* Live website link */}
            <a
              href={`/${selectedSite.slug}`}
              target="_blank"
              className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0071e3]/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ดูหน้าเว็บ</span>
            </a>
          </div>
        </header>

        {activeTab === 'settings' && (
          <div className="w-full">
            {/* Settings Customizer */}
            <form onSubmit={handleSaveConfig} className="w-full p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
              
              <ScrollableSubTabs
                className="mb-6"
                value={activeSubTab}
                onChange={(id) => setActiveSubTab(id as typeof activeSubTab)}
                tabs={[
                  { id: 'general', label: 'ข้อมูลทั่วไป & ประกาศ', icon: Globe },
                  { id: 'media', label: 'รูปโปรไฟล์ & หน้าปก', icon: ImageIcon },
                  { id: 'theme', label: 'ธีม & สี & ฟอนต์', icon: Palette },
                  { id: 'features', label: 'ฟีเจอร์ที่เปิดใช้งาน', icon: Grid },
                  { id: 'billing', label: 'พื้นที่จัดเก็บ & การชำระเงิน', icon: CreditCard },
                ]}
              />

              {/* 1. ข้อมูลทั่วไป & ประกาศ Tab */}
              {activeSubTab === 'general' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Globe className="size-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-stone-900">ข้อมูลทั่วไป & ประกาศ</h3>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-600 tracking-wide">
                      {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                        ? 'ชื่อคู่รัก / ชื่อหน้าความรัก'
                        : selectedSite.category === 'Pet Memorial'
                        ? 'ชื่อสัตว์เลี้ยง / หน้าความทรงจำ'
                        : selectedSite.category === 'Friends'
                        ? 'ชื่อเว็บไซต์ / ชื่อกลุ่ม'
                        : selectedSite.category === 'Family Legacy'
                        ? 'ชื่อตระกูล / หน้าความทรงจำ'
                        : 'ชื่อหน้ารำลึก'}
                    </label>
                    <Input 
                      type="text" 
                      value={siteName} 
                      onChange={(e) => setSiteName(e.target.value)} 
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                      {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                        ? 'เรื่องราวความรัก (ประวัติคู่รักโดยย่อ)'
                        : selectedSite.category === 'Pet Memorial'
                        ? 'คำอำลาและประวัติสัตว์เลี้ยงโดยย่อ'
                        : selectedSite.category === 'Friends'
                        ? 'เรื่องราวของพวกเรา (แนะนำกลุ่มโดยย่อ)'
                        : selectedSite.category === 'Family Legacy'
                        ? 'เรื่องราวตระกูล (ประวัติโดยย่อ)'
                        : 'คำอาลัยและคำรำลึก (ประวัติโดยย่อ)'}
                    </label>
                    <Textarea 
                      value={biography} 
                      onChange={(e) => setBiography(e.target.value)} 
                      rows={4}
                      placeholder={
                        selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                          ? 'เช่น เรื่องราวความรักของเราสองคน เริ่มต้นจากการพบกันครั้งแรกในที่ทำงาน และร่วมทุกข์ร่วมสุขด้วยกันมา...'
                          : selectedSite.category === 'Pet Memorial'
                          ? 'เช่น น้องเป็นหมาที่ร่าเริงและแสนรู้ที่สุด นำความสุขและรอยยิ้มมาให้ครอบครัวเราตลอดเวลาที่อยู่ด้วยกัน...'
                          : selectedSite.category === 'Friends'
                          ? 'เช่น พวกเราเจอกันตั้งแต่สมัยเรียน ไปทริปด้วยกันทุกปี และยังคอยเชียร์กันในทุกก้าวของชีวิต...'
                          : selectedSite.category === 'Family Legacy'
                          ? 'เช่น ตระกูลของเราเริ่มต้นจากคุณปู่คุณย่าที่สร้างบ้านและส่งต่อคุณค่าดี ๆ ให้ลูกหลาน...'
                          : 'เช่น คุณพ่อสมศักดิ์เป็นคนดี มีความเสียสละ...'
                      }
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                    />
                  </div>

                  {/* Subjects editor (pets / memorial people / couple, etc.) */}
                  {(() => {
                    const cat = selectedSite.category;
                    const copy = getSubjectEditorCopy(cat);
                    const updateSubject = (index: number, patch: Partial<ManageSubject>) => {
                      setSubjects((prev) => {
                        const next = [...prev];
                        next[index] = { ...next[index], ...patch };
                        return next;
                      });
                    };

                    return (
                      <div className="space-y-4 border-t border-stone-150 pt-6">
                        <div className="space-y-1">
                          <h4 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
                            <User className="size-4 text-emerald-700" />
                            <span>{copy.sectionTitle}</span>
                          </h4>
                          <p className="text-xs text-stone-500">{copy.sectionHint}</p>
                        </div>

                        {subjects.map((sub, index) => (
                          <div
                            key={index}
                            className="relative space-y-4 rounded-2xl border border-stone-200 bg-stone-50/30 p-5 shadow-xs"
                          >
                            {subjects.length > 1 && copy.canAdd && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSubjects((prev) => prev.filter((_, i) => i !== index));
                                }}
                                className="absolute top-4 right-4 cursor-pointer text-xs font-bold text-rose-600 transition hover:text-rose-700"
                              >
                                ลบออก
                              </button>
                            )}

                            <h5 className="pr-12 text-[10px] font-black uppercase tracking-wider text-stone-400">
                              {copy.cardTitle(index)}
                            </h5>

                            <div className="space-y-1">
                              <label className="text-sm font-bold tracking-wide text-stone-600">
                                {copy.nameLabel}
                              </label>
                              <Input
                                type="text"
                                value={sub.name || ''}
                                onChange={(e) => updateSubject(index, { name: e.target.value })}
                                placeholder={copy.namePlaceholder}
                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900"
                              />
                            </div>

                            {cat === 'Friends' && (
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-sm font-bold tracking-wide text-stone-600">
                                    {copy.roleLabel || 'บทบาทในกลุ่ม (ไม่บังคับ)'}
                                  </label>
                                  <Input
                                    type="text"
                                    value={sub.role || ''}
                                    onChange={(e) => updateSubject(index, { role: e.target.value })}
                                    placeholder={copy.rolePlaceholder || 'เช่น กัปตัน, เลขา, สมาชิก'}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-bold tracking-wide text-stone-600">
                                    {copy.noteLabel || 'โน้ตสั้น (ไม่บังคับ)'}
                                  </label>
                                  <Input
                                    type="text"
                                    value={sub.note || ''}
                                    onChange={(e) => updateSubject(index, { note: e.target.value })}
                                    placeholder={copy.notePlaceholder || 'เช่น คนจัดทริป, สายกิน'}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900"
                                  />
                                </div>
                              </div>
                            )}

                            {copy.showDates !== false && !(index > 0 && (cat === 'Couple' || cat === 'Wedding')) && (
                              <div className="space-y-2.5">
                                {copy.showAlive && (
                                  <label className="flex cursor-pointer select-none items-center gap-1.5">
                                    <Checkbox
                                      checked={!!sub.isAlive}
                                      onCheckedChange={(checked) => {
                                        const isAlive = !!checked;
                                        updateSubject(index, {
                                          isAlive,
                                          ...(isAlive
                                            ? { deathDate: null, deathYear: null, deathYearOnly: false }
                                            : {}),
                                        });
                                      }}
                                      className="size-3.5"
                                    />
                                    <span className="text-xs font-bold text-emerald-800">{copy.aliveLabel}</span>
                                  </label>
                                )}

                                <label className="text-sm font-bold tracking-wide text-stone-600">
                                  {copy.dateLabel}
                                </label>

                                <div className={`grid gap-4 ${sub.isAlive ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                                  <div className="space-y-1">
                                    <span className="block text-[9px] font-semibold text-stone-500">{copy.startTitle}</span>
                                    <ThaiDatePicker
                                      variant="input"
                                      yearOnly={!!sub.birthYearOnly}
                                      value={
                                        sub.birthYearOnly
                                          ? sub.birthYear != null
                                            ? `${sub.birthYear}-01-01`
                                            : ''
                                          : dateToYmd(sub.birthDate)
                                      }
                                      onChange={(ymd) => {
                                        if (sub.birthYearOnly) {
                                          if (!ymd) {
                                            updateSubject(index, { birthYear: null, birthDate: null });
                                            return;
                                          }
                                          const year = parseInt(ymd.slice(0, 4), 10);
                                          updateSubject(index, {
                                            birthYear: year,
                                            birthDate: new Date(year, 0, 1),
                                          });
                                          return;
                                        }
                                        updateSubject(index, { birthDate: ymdToDate(ymd) });
                                      }}
                                      placeholder={sub.birthYearOnly ? 'เลือกปี พ.ศ.' : copy.startTitle}
                                      align="left"
                                    />
                                    <label className="mt-1 flex cursor-pointer select-none items-center gap-1.5">
                                      <Checkbox
                                        checked={!!sub.birthYearOnly}
                                        onCheckedChange={(checked) => {
                                          const birthYearOnly = !!checked;
                                          if (birthYearOnly) {
                                            const year = sub.birthDate?.getFullYear() ?? new Date().getFullYear();
                                            updateSubject(index, {
                                              birthYearOnly: true,
                                              birthYear: year,
                                              birthDate: new Date(year, 0, 1),
                                            });
                                          } else {
                                            updateSubject(index, {
                                              birthYearOnly: false,
                                              birthYear: null,
                                              birthDate: null,
                                            });
                                          }
                                        }}
                                        className="size-3"
                                      />
                                      <span className="text-[9px] font-semibold text-stone-500">{copy.yearOnlyBirth}</span>
                                    </label>
                                  </div>

                                  {!sub.isAlive && (
                                    <div className="space-y-1">
                                      <span className="block text-[9px] font-semibold text-stone-500">{copy.endTitle}</span>
                                      <ThaiDatePicker
                                        variant="input"
                                        yearOnly={!!sub.deathYearOnly}
                                        value={
                                          sub.deathYearOnly
                                            ? sub.deathYear != null
                                              ? `${sub.deathYear}-01-01`
                                              : ''
                                            : dateToYmd(sub.deathDate)
                                        }
                                        onChange={(ymd) => {
                                          if (sub.deathYearOnly) {
                                            if (!ymd) {
                                              updateSubject(index, { deathYear: null, deathDate: null });
                                              return;
                                            }
                                            const year = parseInt(ymd.slice(0, 4), 10);
                                            updateSubject(index, {
                                              deathYear: year,
                                              deathDate: new Date(year, 0, 1),
                                            });
                                            return;
                                          }
                                          updateSubject(index, { deathDate: ymdToDate(ymd) });
                                        }}
                                        placeholder={sub.deathYearOnly ? 'เลือกปี พ.ศ.' : copy.endTitle}
                                        align="right"
                                      />
                                      <label className="mt-1 flex cursor-pointer select-none items-center gap-1.5">
                                        <Checkbox
                                          checked={!!sub.deathYearOnly}
                                          onCheckedChange={(checked) => {
                                            const deathYearOnly = !!checked;
                                            if (deathYearOnly) {
                                              const year = sub.deathDate?.getFullYear() ?? new Date().getFullYear();
                                              updateSubject(index, {
                                                deathYearOnly: true,
                                                deathYear: year,
                                                deathDate: new Date(year, 0, 1),
                                              });
                                            } else {
                                              updateSubject(index, {
                                                deathYearOnly: false,
                                                deathYear: null,
                                                deathDate: null,
                                              });
                                            }
                                          }}
                                          className="size-3"
                                        />
                                        <span className="text-[9px] font-semibold text-stone-500">{copy.yearOnlyDeath}</span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {copy.canAdd && (
                          <button
                            type="button"
                            onClick={() => setSubjects((prev) => [...prev, emptyManageSubject()])}
                            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/40 py-3 text-xs font-bold text-stone-500 transition hover:border-emerald-500 hover:bg-emerald-50/20 hover:text-emerald-700"
                          >
                            {copy.addLabel}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Announcement settings cards */}
                  {features.announcement && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border-t border-stone-150 pt-6">
                      {/* Left: Inputs */}
                      <div className="space-y-6 text-left bg-stone-50/20 p-5 rounded-2xl border border-stone-200">
                        <div className="flex justify-between items-center border-b border-stone-150 pb-3">
                          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 font-sans">
                            <Calendar className="w-4 h-4 text-emerald-700" />
                            <span>ข้อมูลการ์ดกำหนดการดิจิทัล</span>
                          </h4>
                          <label className="flex items-center gap-2 text-xs font-bold text-stone-600 cursor-pointer">
                            <Checkbox
                              checked={annActive}
                              onCheckedChange={(c) => setAnnActive(!!c)}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <span>เปิดแสดงผลการ์ด</span>
                          </label>
                        </div>

                        {annActive && (
                          <div className="space-y-4 text-xs">
                            {/* Card mode: template vs custom upload */}
                            <div className="space-y-2">
                              <label className="font-bold text-stone-600">รูปแบบการ์ด</label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setAnnCardMode('template')}
                                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition active:scale-95 cursor-pointer ${
                                    annCardMode === 'template'
                                      ? 'border-[#0071e3] bg-[#0071e3]/5 text-[#0071e3]'
                                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                                  }`}
                                >
                                  ใช้เทมเพลตระบบ
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAnnCardMode('custom');
                                    setAnnCardUploadError('');
                                  }}
                                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition active:scale-95 cursor-pointer ${
                                    annCardMode === 'custom'
                                      ? 'border-[#0071e3] bg-[#0071e3]/5 text-[#0071e3]'
                                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                                  }`}
                                >
                                  อัปโหลดการ์ดของฉัน
                                </button>
                              </div>
                            </div>

                            {annCardMode === 'custom' ? (
                              <div className="space-y-3">
                                <input
                                  type="file"
                                  id="announcement-card-file-input"
                                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                  className="sr-only"
                                  disabled={annCardUploading}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) void uploadAnnouncementCard(file);
                                    e.target.value = '';
                                  }}
                                />
                                {annCustomCardUrl ? (
                                  <div className="relative rounded-2xl border border-stone-200 overflow-hidden bg-stone-50">
                                    <img
                                      src={annCustomCardUrl}
                                      alt="การ์ดที่อัปโหลด"
                                      className="w-full max-h-64 object-contain bg-stone-100"
                                    />
                                    {annCardUploading && (
                                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-bold text-stone-600">
                                        กำลังอัปโหลด...
                                      </div>
                                    )}
                                    <div className="flex gap-2 p-3 border-t border-stone-100">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => document.getElementById('announcement-card-file-input')?.click()}
                                        disabled={annCardUploading}
                                        className="flex-1 h-9 text-xs font-bold border border-stone-200 rounded-xl"
                                      >
                                        {annCardUploading ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูป'}
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                          setAnnCustomCardUrl('');
                                          setAnnCardUploadError('');
                                        }}
                                        disabled={annCardUploading}
                                        className="h-9 px-3 text-xs font-bold text-rose-500 hover:bg-rose-50 border border-rose-200 rounded-xl"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={annCardUploading}
                                    onClick={() => document.getElementById('announcement-card-file-input')?.click()}
                                    className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                                      annCardUploading
                                        ? 'border-[#0071e3]/40 bg-blue-50/40 cursor-wait'
                                        : 'border-stone-300 bg-white hover:border-[#0071e3]/50 hover:bg-blue-50/20 cursor-pointer'
                                    }`}
                                  >
                                    <div className="size-10 rounded-full bg-stone-100 flex items-center justify-center">
                                      <Upload className="w-4 h-4 text-stone-500" />
                                    </div>
                                    <span className="text-xs font-bold text-stone-700">
                                      {annCardUploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัปโหลดการ์ด'}
                                    </span>
                                    <span className="text-[10px] text-stone-400 leading-relaxed max-w-[240px]">
                                      แนะนำขนาด <span className="font-semibold text-stone-500">1080 × 1920 px</span> (แนวตั้ง 9:16)
                                      <br />
                                      รองรับ JPG, PNG, WEBP ไม่เกิน 10MB
                                    </span>
                                  </button>
                                )}
                                {annCardUploadError && (
                                  <p className="text-[11px] font-semibold text-rose-600 flex items-start gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span>{annCardUploadError}</span>
                                  </p>
                                )}
                                <p className="text-[10px] text-stone-400 leading-relaxed">
                                  เหมาะกับการ์ดที่ออกแบบเองหรือสร้างจาก AI — การ์ดจะแสดงเป็นรูปเต็มใบบนหน้าเว็บ
                                </p>
                              </div>
                            ) : (
                              <>
                            {/* Theme and Font selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-bold text-stone-600">รูปแบบธีมการ์ด</label>
                                <Select
                              value={annStyle}
                              onValueChange={(value) => setAnnStyle(value)}
                            >
                              <SelectTrigger className={"w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
<SelectItem value="ELEGANT_WHITE">Classic White (สีขาวเรียบหรู)</SelectItem>
                                  <SelectItem value="WARM_CREAM">Warm Cream (สีครีมวินเทจ)</SelectItem>
                                  <SelectItem value="CHARCOAL_SLATE">{getStyle3Label(selectedSite?.category || 'Memorial')}</SelectItem>
                              </SelectContent>
                            </Select>
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-stone-600">แบบอักษร (Font)</label>
                                <Select
                              value={annFontFamily}
                              onValueChange={(value) => setAnnFontFamily(value)}
                            >
                              <SelectTrigger className={"w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
<SelectItem value="LINE Seed Sans TH">LINE Seed (ตัวหนา ทันสมัย)</SelectItem>
                                  <SelectItem value="Charmonman">Charmonman (ตัวเขียนทางการ)</SelectItem>
                                  <SelectItem value="Srisakdi">Srisakdi (ตัวอักษรไทยคลาสสิก)</SelectItem>
                                  <SelectItem value="Charm">Charm (ตัวเขียนอ่อนช้อย)</SelectItem>
                                  <SelectItem value="Thasadith">Thasadith (ตัวพิมพ์ทางการ)</SelectItem>
                              </SelectContent>
                            </Select>
                              </div>
                            </div>

                            {/* Default Font Size selector */}
                            <div className="space-y-1">
                              <label className="font-bold text-stone-600">ขนาดตัวอักษรเริ่มต้นของเว็บไซต์</label>
                              <Select
                              value={defaultFontSize}
                              onValueChange={(value) => setDefaultFontSize(value as any)}
                            >
                              <SelectTrigger className={"w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
<SelectItem value="NORMAL">ขนาดปกติ (100% - มาตรฐานทั่วไป)</SelectItem>
                                <SelectItem value="MEDIUM">ขนาดค่อนข้างใหญ่ (112% - อ่านง่ายสบายตา)</SelectItem>
                                <SelectItem value="LARGE">ขนาดใหญ่พิเศษ (125% - แนะนำสำหรับผู้สูงอายุ)</SelectItem>
                              </SelectContent>
                            </Select>
                            </div>

                            {/* Header Text */}
                            <div className="space-y-1">
                              <label className="font-bold text-stone-600">คำเชิญชวนหลักด้านบน</label>
                              <Input
                                type="text"
                                value={annText}
                                onChange={(e) => setAnnText(e.target.value)}
                                placeholder={sLabels.invitePlaceholder}
                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                              />
                            </div>

                            <div className="border-t border-stone-150 pt-3">
                              <p className="font-bold text-stone-700 mb-2">{sLabels.subtitle}</p>
                              <div className="space-y-3">
                                {/* Meetup / ceremony slot 1 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-100/50 rounded-xl border border-stone-200/50">
                                  {selectedSite.category !== 'Friends' && (
                                    <div className="space-y-1 col-span-2 font-bold text-stone-700">{sLabels.item1}</div>
                                  )}
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">
                                      {selectedSite.category === 'Friends'
                                        ? (sLabels.dateLabel || 'วันนัดพบ')
                                        : 'วันที่จัด'}
                                    </label>
                                    <div className="flex gap-1.5 items-center relative">
                                      <Input
                                        type="text"
                                        value={annWaterDate}
                                        onChange={(e) => setAnnWaterDate(e.target.value)}
                                        placeholder={sLabels.item1Placeholder}
                                        className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 min-w-0"
                                      />
                                      <ThaiDatePicker
                                        align="right"
                                        buttonClassName="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer h-[38px] w-[38px] shrink-0"
                                        iconClassName="w-4 h-4"
                                        onChange={(val) => {
                                          if (val) {
                                            setAnnWaterDate(formatThaiDateWithDay(val));
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">
                                      {selectedSite.category === 'Friends'
                                        ? (sLabels.timeLabel || 'เวลานัด (ไม่บังคับ)')
                                        : 'เวลาเริ่ม'}
                                    </label>
                                    <div className="space-y-1.5">
                                      <Select
                              value={(isCustomWaterTime ? 'CUSTOM' : annWaterTime) || '__empty__'}
                              onValueChange={(raw) => {
                                const value = raw === '__empty__' ? '' : raw;
                                const val = value;
                                          if (val === 'CUSTOM') {
                                            setIsCustomWaterTime(true);
                                            if (!annWaterTime || TIME_PRESETS.includes(annWaterTime)) {
                                              setAnnWaterTime('16:00 น.');
                                            }
                                          } else {
                                            setIsCustomWaterTime(false);
                                            setAnnWaterTime(val);
                                          }
                              }}
                            >
                              <SelectTrigger className={"w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 cursor-pointer text-sm font-semibold"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
<SelectItem value="__empty__">
                                          {selectedSite.category === 'Friends' ? 'ไม่ระบุเวลา' : 'เลือกเวลา'}
                                        </SelectItem>
                                        {TIME_PRESETS.map((preset) => (
                                          <SelectItem key={preset} value={String(preset)}>{preset}</SelectItem>
                                        ))}
                                        <SelectItem value="CUSTOM">พิมพ์ระบุเวลาเอง...</SelectItem>
                              </SelectContent>
                            </Select>
                                      {isCustomWaterTime && (
                                        <Input
                                          type="text"
                                          value={annWaterTime}
                                          onChange={(e) => setAnnWaterTime(e.target.value)}
                                          placeholder="ระบุเวลา เช่น 16:15 น."
                                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 text-sm animate-fade-in"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {selectedSite.category !== 'Friends' && (
                                <>
                                {/* 2. สวดพระอภิธรรม */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-100/50 rounded-xl border border-stone-200/50">
                                  <div className="space-y-1 col-span-2 font-bold text-stone-700">{sLabels.item2}</div>
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">ช่วงวันที่จัด</label>
                                    <div className="flex gap-1.5 items-center relative">
                                      <Input
                                        type="text"
                                        value={annAbhidhammaDateRange}
                                        onChange={(e) => setAnnAbhidhammaDateRange(e.target.value)}
                                        placeholder={sLabels.item2Placeholder}
                                        className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 min-w-0"
                                      />
                                      <ThaiDatePicker
                                        mode="range"
                                        align="right"
                                        buttonClassName="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer h-[38px] w-[38px] shrink-0"
                                        iconClassName="w-4 h-4"
                                        rangeStart={abhidhammaStartDate}
                                        rangeEnd={abhidhammaEndDate}
                                        onChangeRange={(start, end) => {
                                          setAbhidhammaStartDate(start);
                                          setAbhidhammaEndDate(end);
                                          if (start) {
                                            setAnnAbhidhammaDateRange(formatThaiDateRange(start, end));
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">เวลาเริ่มงาน</label>
                                    <div className="space-y-1.5">
                                      <Select
                              value={(isCustomAbhidhammaTime ? 'CUSTOM' : annAbhidhammaTime) || '__empty__'}
                              onValueChange={(raw) => {
                                const value = raw === '__empty__' ? '' : raw;
                                const val = value;
                                          if (val === 'CUSTOM') {
                                            setIsCustomAbhidhammaTime(true);
                                            if (!annAbhidhammaTime || TIME_PRESETS.includes(annAbhidhammaTime)) {
                                              setAnnAbhidhammaTime('19:00 น.');
                                            }
                                          } else {
                                            setIsCustomAbhidhammaTime(false);
                                            setAnnAbhidhammaTime(val);
                                          }
                              }}
                            >
                              <SelectTrigger className={"w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 cursor-pointer text-sm font-semibold"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
<SelectItem value="__empty__">เลือกเวลา</SelectItem>
                                        {TIME_PRESETS.map((preset) => (
                                          <SelectItem key={preset} value={String(preset)}>{preset}</SelectItem>
                                        ))}
                                        <SelectItem value="CUSTOM">พิมพ์ระบุเวลาเอง...</SelectItem>
                              </SelectContent>
                            </Select>
                                      {isCustomAbhidhammaTime && (
                                        <Input
                                          type="text"
                                          value={annAbhidhammaTime}
                                          onChange={(e) => setAnnAbhidhammaTime(e.target.value)}
                                          placeholder="ระบุเวลา เช่น 19:15 น."
                                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 text-sm animate-fade-in"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* 3. ฌาปนกิจ */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-100/50 rounded-xl border border-stone-200/50">
                                  <div className="space-y-1 col-span-2 font-bold text-stone-700">{sLabels.item3}</div>
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">วันที่จัด</label>
                                    <div className="flex gap-1.5 items-center relative">
                                      <Input
                                        type="text"
                                        value={annCremationDate}
                                        onChange={(e) => setAnnCremationDate(e.target.value)}
                                        placeholder={sLabels.item3Placeholder}
                                        className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 min-w-0"
                                      />
                                      <ThaiDatePicker
                                        align="right"
                                        buttonClassName="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer h-[38px] w-[38px] shrink-0"
                                        iconClassName="w-4 h-4"
                                        onChange={(val) => {
                                          if (val) {
                                            setAnnCremationDate(formatThaiDateWithDay(val));
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">เวลาเริ่มพิธี</label>
                                    <div className="space-y-1.5">
                                      <Select
                              value={(isCustomCremationTime ? 'CUSTOM' : annCremationTime) || '__empty__'}
                              onValueChange={(raw) => {
                                const value = raw === '__empty__' ? '' : raw;
                                const val = value;
                                          if (val === 'CUSTOM') {
                                            setIsCustomCremationTime(true);
                                            if (!annCremationTime || TIME_PRESETS.includes(annCremationTime)) {
                                              setAnnCremationTime('16:00 น.');
                                            }
                                          } else {
                                            setIsCustomCremationTime(false);
                                            setAnnCremationTime(val);
                                          }
                              }}
                            >
                              <SelectTrigger className={"w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 cursor-pointer text-sm font-semibold"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
<SelectItem value="__empty__">เลือกเวลา</SelectItem>
                                        {TIME_PRESETS.map((preset) => (
                                          <SelectItem key={preset} value={String(preset)}>{preset}</SelectItem>
                                        ))}
                                        <SelectItem value="CUSTOM">พิมพ์ระบุเวลาเอง...</SelectItem>
                              </SelectContent>
                            </Select>
                                      {isCustomCremationTime && (
                                        <Input
                                          type="text"
                                          value={annCremationTime}
                                          onChange={(e) => setAnnCremationTime(e.target.value)}
                                          placeholder="ระบุเวลา เช่น 16:15 น."
                                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 text-sm animate-fade-in"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                </>
                                )}
                              </div>
                            </div>

                            {/* Location Details */}
                            <div className="border-t border-stone-150 pt-3 space-y-3">
                              <p className="font-bold text-stone-700">{sLabels.venueLabel}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-stone-600 font-semibold">
                                    {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                      ? 'สถานที่จัดงาน (เช่น โรงแรม/โบสถ์)'
                                      : selectedSite.category === 'Friends'
                                        ? 'ชื่อสถานที่นัดพบ'
                                        : 'ชื่อวัด / สถานที่จัดงาน'}
                                  </label>
                                  <Input
                                    type="text"
                                    value={annTempleName}
                                    onChange={(e) => setAnnTempleName(e.target.value)}
                                    placeholder={sLabels.venuePlaceholder}
                                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-stone-600 font-semibold">{sLabels.pavilionLabel}</label>
                                  <Input
                                    type="text"
                                    value={annPavilion}
                                    onChange={(e) => setAnnPavilion(e.target.value)}
                                    placeholder={sLabels.pavilionPlaceholder}
                                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-stone-600 font-semibold">ลิงก์ Google Maps สำหรับนำทาง (ถ้ามี)</label>
                                <Input
                                  type="text"
                                  value={annMapLink}
                                  onChange={(e) => setAnnMapLink(e.target.value)}
                                  placeholder="เช่น https://goo.gl/maps/..."
                                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            </div>

                            {/* Recommendations */}
                            <div className="border-t border-stone-150 pt-3 space-y-3">
                              <p className="font-bold text-stone-700">
                                {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                  ? 'คำแนะนำการร่วมงานแสดงความยินดี'
                                  : selectedSite.category === 'Friends'
                                    ? 'ข้อมูลเพิ่มเติมสำหรับเพื่อน ๆ'
                                    : 'คำแนะนำการร่วมงาน'}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-stone-600 font-semibold">
                                    {selectedSite.category === 'Friends'
                                      ? (sLabels.notesLabel || 'โน้ต / รายละเอียด')
                                      : 'การแต่งกาย'}
                                  </label>
                                  <Input
                                    type="text"
                                    value={annDressCode}
                                    onChange={(e) => setAnnDressCode(e.target.value)}
                                    placeholder={
                                      selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                        ? 'เช่น ธีมสีชมพู/พาสเทล หรือ ตามความสะดวก'
                                        : selectedSite.category === 'Friends'
                                          ? (sLabels.notesPlaceholder || 'เช่น แต่งตามสบาย, ธีมสีกลุ่ม')
                                          : 'เช่น ชุดสุภาพสีขาว/ดำ'
                                    }
                                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-stone-600 font-semibold">เบอร์โทรติดต่อประสานงาน</label>
                                  <Input
                                    type="text"
                                    value={annContactPhone}
                                    onChange={(e) => setAnnContactPhone(e.target.value)}
                                    placeholder="เช่น 081-234-5678"
                                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </div>
                              {selectedSite.category !== 'Friends' && (
                              <div className="space-y-1">
                                <label className="text-stone-600 font-semibold">
                                  {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                    ? 'นโยบายการรับซอง/ของขวัญ'
                                    : 'นโยบายการรับพวงหรีด'}
                                </label>
                                <Select
                              value={annWreathPolicy}
                              onValueChange={(value) => setAnnWreathPolicy(value)}
                            >
                              <SelectTrigger className={"w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
{selectedSite.category === 'Couple' || selectedSite.category === 'Wedding' ? (
                                    <>
                                      <SelectItem value="NORMAL">ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ</SelectItem>
                                      <SelectItem value="NO_FLOWERS">ขออภัย งดรับของขวัญ (เน้นการร่วมแสดงความยินดีและอวยพรแทน)</SelectItem>
                                      <SelectItem value="DONATION_ONLY">ขออภัย งดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)</SelectItem>
                                      <SelectItem value="NO_WREATH">ขออภัย งดรับซองและของขวัญทุกประเภท</SelectItem>
                                    </>
                                  ) : (
                                    <>
                                      <SelectItem value="NORMAL">รับพวงหรีดตามปกติ</SelectItem>
                                      <SelectItem value="NO_FLOWERS">งดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)</SelectItem>
                                      <SelectItem value="DONATION_ONLY">งดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)</SelectItem>
                                      <SelectItem value="NO_WREATH">งดรับพวงหรีดทุกประเภท</SelectItem>
                                    </>
                                  )}
                              </SelectContent>
                            </Select>
                              </div>
                              )}
                            </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Live Preview Card */}
                      <div className="sticky top-6 space-y-4">
                        <p className="text-xs font-bold text-stone-500 text-left uppercase tracking-wider">ตัวอย่างแสดงผลการ์ดจริงบนหน้าเว็บ (Live Preview)</p>
                        
                        {!annActive ? (
                          <div className="p-12 text-center border border-dashed border-stone-200 rounded-3xl text-stone-500 text-xs bg-stone-50">
                            การ์ดปิดการแสดงผลอยู่ จะไม่ถูกแสดงในหน้าแรกของเว็บไซต์สาธารณะ
                          </div>
                        ) : annCardMode === 'custom' ? (
                          <div className="w-full max-w-md mx-auto rounded-3xl border border-stone-200 overflow-hidden shadow-lg bg-stone-50">
                            {annCustomCardUrl ? (
                              <img
                                src={annCustomCardUrl}
                                alt="พรีวิวการ์ด"
                                className="w-full object-contain"
                              />
                            ) : (
                              <div className="aspect-[9/16] flex flex-col items-center justify-center gap-2 text-stone-400 p-8">
                                <Upload className="w-8 h-8 text-stone-300" />
                                <p className="text-xs font-medium">ยังไม่มีรูปการ์ด</p>
                                <p className="text-[10px] text-center">อัปโหลดการ์ดด้านซ้ายเพื่อดูตัวอย่าง</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div 
                            className={`w-full max-w-md mx-auto rounded-3xl border p-8 space-y-6 text-center shadow-lg relative overflow-hidden transition-all duration-300 ${
                              annStyle === 'CHARCOAL_SLATE'
                                ? getStyle3Config(selectedSite?.category || 'Memorial').classes
                                : annStyle === 'WARM_CREAM'
                                ? 'bg-[#FAF6EE] border-[#EADFC9] text-[#4A3E29]'
                                : 'bg-white border-stone-200 text-stone-900'
                            }`}
                            style={{
                              fontFamily: annFontFamily,
                              backgroundImage: annStyle === 'CHARCOAL_SLATE' ? getStyle3Config(selectedSite?.category || 'Memorial').backgroundImage : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            {/* Repositioned Deceased Image */}
                            <div className={`relative w-28 h-28 rounded-full border overflow-hidden mx-auto bg-stone-100 flex items-center justify-center shadow-md ${
                              annStyle === 'CHARCOAL_SLATE'
                                ? getStyle3Config(selectedSite?.category || 'Memorial').avatarBorder
                                : 'border-amber-600/40'
                            }`}>
                              {deceasedAvatarUrl ? (
                                <img
                                  src={deceasedAvatarUrl}
                                  alt="Avatar Preview"
                                  className="pointer-events-none max-w-none origin-center"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: `translate(${((deceasedAvatarX || 0) / 224) * 100}%, ${((deceasedAvatarY || 0) / 224) * 100}%) rotate(${deceasedAvatarRotate}deg) scale(${(deceasedAvatarScale || 1) * (300 / 224)})`,
                                    transformOrigin: 'center center',
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-stone-250 flex items-center justify-center text-xs font-bold text-stone-500">
                                  รูปโปรไฟล์
                                </div>
                              )}
                            </div>

                            {/* Header */}
                            <div className="space-y-1.5">
                              <p className="text-[10px] tracking-widest opacity-80 uppercase">{annText || sLabels.invitePlaceholder}</p>
                              <h2 className="text-xl font-bold tracking-normal">
                                {(() => {
                                  const match = siteName.match(/^(ด้วยรักและคิดถึง|ด้วยรักและอาลัย|ร่วมรำลึกถึง|รำลึกถึง|คิดถึง|อาลัยแด่)\s*(.*)$/);
                                  if (match) {
                                    return (
                                      <>
                                        <span className="block sm:inline">{match[1]}</span>
                                        <span className="hidden sm:inline"> </span>
                                        <span className="block sm:inline">{match[2]}</span>
                                      </>
                                    );
                                  }
                                  return siteName;
                                })()}
                              </h2>
                              <p className="text-[10px] opacity-75 font-semibold">{sLabels.subtitle}</p>
                            </div>

                            {/* Timelines list */}
                            <div className="space-y-3 text-xs text-left">
                              {selectedSite.category === 'Friends' ? (
                                (annWaterDate || annWaterTime) && (
                                  <div className={`p-4 rounded-2xl border transition-all ${
                                    annStyle === 'CHARCOAL_SLATE' ? getStyle3Config(selectedSite?.category || 'Memorial').innerCardBg :
                                    annStyle === 'WARM_CREAM' ? 'bg-[#F3EBD9]/65 border-[#E5D7B7]' :
                                    'bg-stone-50 border-stone-200/80'
                                  }`}>
                                    <p className="font-bold mb-1">{sLabels.meetupTitle || 'นัดพบปะกลุ่ม'}</p>
                                    <p className="opacity-90">
                                      {[annWaterDate, annWaterTime ? `เวลา ${annWaterTime}` : ''].filter(Boolean).join(' · ') || '-'}
                                    </p>
                                  </div>
                                )
                              ) : (
                                <>
                              {(annWaterDate || annWaterTime) && (
                                <div className={`p-4 rounded-2xl border transition-all ${
                                  annStyle === 'CHARCOAL_SLATE' ? getStyle3Config(selectedSite?.category || 'Memorial').innerCardBg : 
                                  annStyle === 'WARM_CREAM' ? 'bg-[#F3EBD9]/65 border-[#E5D7B7]' : 
                                  'bg-stone-50 border-stone-200/80'
                                }`}>
                                  <p className="font-bold mb-1">{sLabels.item1}</p>
                                  <p className="opacity-90">{annWaterDate || '-'} {annWaterTime ? `เวลา ${annWaterTime}` : ''}</p>
                                </div>
                              )}

                              {(annAbhidhammaDateRange || annAbhidhammaTime) && (
                                <div className={`p-4 rounded-2xl border transition-all ${
                                  annStyle === 'CHARCOAL_SLATE' ? getStyle3Config(selectedSite?.category || 'Memorial').innerCardBg : 
                                  annStyle === 'WARM_CREAM' ? 'bg-[#F3EBD9]/65 border-[#E5D7B7]' : 
                                  'bg-stone-50 border-stone-200/80'
                                }`}>
                                  <p className="font-bold mb-1">{sLabels.item2}</p>
                                  <p className="opacity-90">ช่วงวันที่: {annAbhidhammaDateRange || '-'} {annAbhidhammaTime ? `เวลา ${annAbhidhammaTime}` : ''}</p>
                                </div>
                              )}

                              {(annCremationDate || annCremationTime) && (
                                <div className={`p-4 rounded-2xl border transition-all ${
                                  annStyle === 'CHARCOAL_SLATE' ? getStyle3Config(selectedSite?.category || 'Memorial').innerCardBg : 
                                  annStyle === 'WARM_CREAM' ? 'bg-[#F3EBD9]/65 border-[#E5D7B7]' : 
                                  'bg-stone-50 border-stone-200/80'
                                }`}>
                                  <p className="font-bold mb-1">{sLabels.item3}</p>
                                  <p className="opacity-90">{annCremationDate || '-'} {annCremationTime ? `เวลา ${annCremationTime}` : ''}</p>
                                </div>
                              )}
                                </>
                              )}
                            </div>

                            {/* Venue & Guidelines */}
                            {(annTempleName || annPavilion || annDressCode || annContactPhone) && (
                              <div className="space-y-4 border-t border-dashed border-stone-300/30 pt-4 text-xs text-left">
                                {annTempleName && (
                                  <div>
                                    <p className="font-bold text-[10px] opacity-80 uppercase tracking-wide">{sLabels.venueLabel}</p>
                                    <p className="font-bold mt-0.5">{annTempleName} {annPavilion ? `(${annPavilion})` : ''}</p>
                                    {annMapLink && (
                                      <span className="inline-block text-[9px] text-emerald-600 underline font-bold mt-1">
                                        คลิกลิงก์เพื่อนำทาง Google Maps
                                      </span>
                                    )}
                                  </div>
                                )}

                                {(annDressCode || annContactPhone || (selectedSite.category !== 'Friends' && annWreathPolicy !== 'NORMAL')) && (
                                  <div className="space-y-1">
                                    <p className="font-bold text-[10px] opacity-80 uppercase tracking-wide">
                                      {sLabels.guidelinesTitle}
                                    </p>
                                    {annDressCode && (
                                      <p className="opacity-90">
                                        {selectedSite.category === 'Friends' ? 'โน้ต: ' : 'การแต่งกาย: '}
                                        {annDressCode}
                                      </p>
                                    )}
                                    {annContactPhone && <p className="opacity-90">ติดต่อประสานงาน: {annContactPhone}</p>}
                                    {selectedSite.category !== 'Friends' && annWreathPolicy === 'NO_FLOWERS' && (
                                      <p className="text-amber-800 font-bold">
                                        {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                          ? 'งดรับของขวัญ เน้นการร่วมอวยพรแทน'
                                          : 'งดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)'}
                                      </p>
                                    )}
                                    {selectedSite.category !== 'Friends' && annWreathPolicy === 'NO_WREATH' && (
                                      <p className="text-red-650 font-bold">
                                        {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                          ? 'งดรับซองและของขวัญทุกประเภท'
                                          : 'งดรับพวงหรีดทุกประเภท'}
                                      </p>
                                    )}
                                    {selectedSite.category !== 'Friends' && annWreathPolicy === 'DONATION_ONLY' && (
                                      <p className="text-amber-800 font-bold">
                                        {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                          ? 'งดรับของขวัญ ร่วมสมทบทุนมูลนิธิแทน'
                                          : 'งดรับพวงหรีด ร่วมทำบุญสมทบทุนแทน'}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Donation Settings Section */}
                  <div className="border-t border-stone-150 pt-6 space-y-4">
                    <div className="flex justify-between items-center gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>
                            {selectedSite.category === 'Friends'
                              ? 'เปิดใช้กองทุนรวมตัว (Donation QR)'
                              : selectedSite.category === 'Pet Memorial'
                              ? 'เปิดใช้สมทบกองทุนช่วยเหลือสัตว์ (Donation QR)'
                              : selectedSite.category === 'Couple'
                              ? 'เปิดใช้กองทุนแห่งความรัก (Donation QR)'
                              : selectedSite.category === 'Wedding'
                              ? 'เปิดใช้ร่วมใส่ซองออนไลน์ (Donation QR)'
                              : selectedSite.category === 'Family Legacy'
                              ? 'เปิดใช้สมทบกองทุนตระกูล (Donation QR)'
                              : 'เปิดใช้บริการรับเงินทำบุญ (Donation QR)'}
                          </span>
                        </h4>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          {getFeatureLabel(selectedSite.category, 'donation').description}
                        </p>
                      </div>
                      <Checkbox 
                        checked={donationActive}
                        onCheckedChange={(c) => setDonationActive(!!c)}
                        className="w-5 h-5 cursor-pointer shrink-0"
                      />
                    </div>

                    {donationActive && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-stone-600 tracking-wide">หมายเลขพร้อมเพย์ (PromptPay)</label>
                          <Input 
                            type="text" 
                            value={donationPromptPay} 
                            onChange={(e) => setDonationPromptPay(e.target.value)} 
                            placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
                            className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-stone-600 tracking-wide">ชื่อบัญชีผู้รับเงิน</label>
                          <Input 
                            type="text" 
                            value={donationAccountName} 
                            onChange={(e) => setDonationAccountName(e.target.value)} 
                            placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                            className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. รูปโปรไฟล์ & รูปปกเด่น Tab */}
              {activeSubTab === 'media' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-[#0071e3]/10">
                      <ImageIcon className="w-4 h-4 text-[#0071e3]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900">รูปโปรไฟล์ & หน้าปก</h4>
                      <p className="text-xs text-stone-400">เลือกจากชุดธีม หรืออัปโหลดรูปของคุณเอง</p>
                    </div>
                  </div>

                  <DefaultMediaPicker
                    open={defaultMediaPicker === 'avatar'}
                    onOpenChange={(open) => setDefaultMediaPicker(open ? 'avatar' : null)}
                    kind="avatar"
                    category={activeSite?.category}
                    selectedSrc={deceasedAvatarUrl}
                    onSelect={(src) => {
                      setDeceasedAvatarUrl(src);
                      setDeceasedAvatarScale(1);
                      setDeceasedAvatarX(0);
                      setDeceasedAvatarY(0);
                      setDeceasedAvatarRotate(0);
                      setSuccess('เลือกรูปโปรไฟล์จากชุดธีมแล้ว — กดบันทึกเพื่อยืนยัน');
                    }}
                  />
                  <DefaultMediaPicker
                    open={defaultMediaPicker === 'cover'}
                    onOpenChange={(open) => setDefaultMediaPicker(open ? 'cover' : null)}
                    kind="cover"
                    category={activeSite?.category}
                    selectedSrc={deceasedCoverUrl}
                    onSelect={(src) => {
                      setDeceasedCoverUrl(src);
                      setDeceasedCoverScale(1);
                      setDeceasedCoverX(0);
                      setDeceasedCoverY(0);
                      setDeceasedCoverRotate(0);
                      setSuccess('เลือกภาพหน้าปกจากชุดธีมแล้ว — กดบันทึกเพื่อยืนยัน');
                    }}
                  />

                  {/* Hidden input file fields */}
                  <Input
                    type="file"
                    id="deceased-avatar-file-input"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadDeceasedAvatar(file);
                    }}
                    disabled={avatarUploading}
                    className="hidden"
                  />

                  <Input
                    type="file"
                    id="deceased-cover-file-input"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadDeceasedCover(file);
                    }}
                    disabled={coverUploading}
                    className="hidden"
                  />

                  {/* Live Preview Card */}
                  <div className="relative w-full max-w-xl mx-auto h-52 sm:h-60 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center group select-none">
                    {/* Cover Photo Background */}
                    {deceasedCoverUrl ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img 
                          src={deceasedCoverUrl} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover" 
                          style={imageTransformStyle({
                            x: deceasedCoverX || 0,
                            y: deceasedCoverY || 0,
                            scale: deceasedCoverScale || 1,
                            rotate: deceasedCoverRotate || 0,
                          })}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100 flex flex-col items-center justify-center gap-2 text-stone-400">
                        <ImageIcon className="w-10 h-10 text-stone-300" />
                        <span className="text-xs font-medium text-stone-400">คลิกไอคอนกล้องเพื่อเพิ่มรูปปก</span>
                      </div>
                    )}

                    {/* Circular Avatar (Overlapping in the center) */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-stone-50 shadow-lg flex items-center justify-center overflow-hidden z-10">
                      {deceasedAvatarUrl ? (
                        <div className="w-full h-full relative">
                          <img 
                            src={deceasedAvatarUrl} 
                            alt="Avatar Preview" 
                            className="pointer-events-none w-full h-full object-cover" 
                            style={imageTransformStyle({
                              x: deceasedAvatarX || 0,
                              y: deceasedAvatarY || 0,
                              scale: deceasedAvatarScale || 1,
                              rotate: deceasedAvatarRotate || 0,
                            })}
                          />
                        </div>
                      ) : (
                        <div className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-0.5 rounded-full p-2 text-center bg-stone-150 text-stone-400">
                          <User className="w-8 h-8 opacity-70" />
                        </div>
                      )}
                    </div>

                    {/* LINE-Style camera icon trigger overlay on Circular Avatar */}
                    <div className="absolute bottom-6 left-[calc(50%+26px)] sm:left-[calc(50%+32px)] z-20">
                      <Button variant="ghost"
                        type="button"
                        onClick={() => {
                          setIsAvatarMenuOpen(!isAvatarMenuOpen);
                          setIsCoverMenuOpen(false);
                        }}
                        className="w-8 h-8 rounded-full bg-stone-850 hover:bg-stone-900 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                        title="จัดการรูปโปรไฟล์"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </Button>

                      {/* Avatar Menu Popover */}
                      {isAvatarMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsAvatarMenuOpen(false)} />
                          <div className="absolute left-[calc(50%-88px)] bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-48 text-stone-850 text-xs font-bold z-30 animate-fade-in text-left">
                            <Button variant="ghost"
                              type="button"
                              onClick={() => {
                                setIsAvatarMenuOpen(false);
                                setDefaultMediaPicker('avatar');
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left"
                            >
                              เลือกจากชุดธีม
                            </Button>
                            <Button variant="ghost"
                              type="button"
                              onClick={() => {
                                setIsAvatarMenuOpen(false);
                                document.getElementById('deceased-avatar-file-input')?.click();
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                            >
                              อัปโหลดรูปภาพใหม่
                            </Button>
                            {deceasedAvatarUrl && (
                              <>
                                <Button variant="ghost"
                                  type="button"
                                  onClick={() => {
                                    setIsAvatarMenuOpen(false);
                                    setIsCropModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                                >
                                  ปรับแต่งรูปโปรไฟล์
                                </Button>
                                <Button variant="ghost"
                                  type="button"
                                  onClick={() => {
                                    setIsAvatarMenuOpen(false);
                                    setDeceasedAvatarUrl('');
                                    setDeceasedAvatarScale(1);
                                    setDeceasedAvatarX(0);
                                    setDeceasedAvatarY(0);
                                    setDeceasedAvatarRotate(0);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-red-50 text-red-650 cursor-pointer block text-left border-t border-stone-100 font-bold"
                                >
                                  ลบรูปโปรไฟล์
                                </Button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* LINE-Style camera icon trigger overlay on Cover Banner */}
                    <div className="absolute bottom-3 right-3 z-20">
                      <Button variant="ghost" 
                        type="button" 
                        onClick={() => {
                          setIsCoverMenuOpen(!isCoverMenuOpen);
                          setIsAvatarMenuOpen(false);
                        }}
                        className="w-8 h-8 rounded-full bg-stone-850 hover:bg-stone-900 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                        title="จัดการรูปหน้าปก"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </Button>

                      {/* Cover Menu Popover */}
                      {isCoverMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsCoverMenuOpen(false)} />
                          <div className="absolute right-0 bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-48 text-stone-850 text-xs font-bold z-30 animate-fade-in text-left">
                            <Button variant="ghost"
                              type="button"
                              onClick={() => {
                                setIsCoverMenuOpen(false);
                                setDefaultMediaPicker('cover');
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left"
                            >
                              เลือกจากชุดธีม
                            </Button>
                            <Button variant="ghost"
                              type="button"
                              onClick={() => {
                                setIsCoverMenuOpen(false);
                                document.getElementById('deceased-cover-file-input')?.click();
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                            >
                              อัปโหลดรูปปกใหม่
                            </Button>
                            {deceasedCoverUrl && (
                              <>
                                <Button variant="ghost"
                                  type="button"
                                  onClick={() => {
                                    setIsCoverMenuOpen(false);
                                    setIsCoverCropModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                                >
                                  ปรับแต่งหน้าปก
                                </Button>
                                <Button variant="ghost"
                                  type="button"
                                  onClick={() => {
                                    setIsCoverMenuOpen(false);
                                    setDeceasedCoverUrl('');
                                    setDeceasedCoverScale(1);
                                    setDeceasedCoverX(0);
                                    setDeceasedCoverY(0);
                                    setDeceasedCoverRotate(0);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-red-50 text-red-650 cursor-pointer block text-left border-t border-stone-100 font-bold"
                                >
                                  ลบรูปหน้าปก
                                </Button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick default pickers under preview — with preview+confirm */}
                  <div className="mx-auto w-full max-w-xl space-y-3">
                    {/* Preview confirmation bar */}
                    {quickPreview && (
                      <div className="flex items-center gap-3 rounded-2xl border border-[#0071e3]/20 bg-blue-50/40 p-4 animate-fade-in">
                        <div className={quickPreview.kind === 'avatar'
                          ? 'size-14 shrink-0 overflow-hidden rounded-full border-2 border-[#0071e3]/30 shadow-sm'
                          : 'h-14 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-[#0071e3]/30 shadow-sm'
                        }>
                          <img src={quickPreview.src} alt="พรีวิว" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 text-sm text-stone-700 font-medium">
                          {quickPreview.kind === 'avatar' ? 'ใช้รูปโปรไฟล์นี้?' : 'ใช้พื้นหลังนี้?'}
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuickPreview(null)}
                          className="rounded-xl px-4 py-2 text-xs font-medium text-stone-500 transition hover:bg-stone-100 active:scale-95"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (quickPreview.kind === 'avatar') {
                              setDeceasedAvatarUrl(quickPreview.src);
                              setDeceasedAvatarScale(1);
                              setDeceasedAvatarX(0);
                              setDeceasedAvatarY(0);
                              setDeceasedAvatarRotate(0);
                            } else {
                              setDeceasedCoverUrl(quickPreview.src);
                              setDeceasedCoverScale(1);
                              setDeceasedCoverX(0);
                              setDeceasedCoverY(0);
                              setDeceasedCoverRotate(0);
                            }
                            setQuickPreview(null);
                          }}
                          className="rounded-xl bg-[#0071e3] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#0071e3]/90 active:scale-95"
                        >
                          ยืนยัน
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        โปรไฟล์
                      </span>
                      <button
                        type="button"
                        onClick={() => setDefaultMediaPicker('avatar')}
                        className="text-xs font-medium text-[#0071e3] hover:underline transition-colors"
                      >
                        ดูทั้งหมด
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {getDefaultMediaForCategory(activeSite?.category, 'avatar').map((item) => {
                        const isCurrent = deceasedAvatarUrl === item.src;
                        const isPreviewing = quickPreview?.kind === 'avatar' && quickPreview.src === item.src;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setQuickPreview({ kind: 'avatar', src: item.src })}
                            className={`aspect-square overflow-hidden rounded-full border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                              isPreviewing
                                ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20 scale-105'
                                : isCurrent
                                  ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20'
                                  : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                            }`}
                            title={item.label}
                          >
                            <img src={item.src} alt="" className="h-full w-full object-cover" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                        พื้นหลัง
                      </span>
                      <button
                        type="button"
                        onClick={() => setDefaultMediaPicker('cover')}
                        className="text-xs font-medium text-[#0071e3] hover:underline transition-colors"
                      >
                        ดูทั้งหมด
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {getDefaultMediaForCategory(activeSite?.category, 'cover').map((item) => {
                        const isCurrent = deceasedCoverUrl === item.src;
                        const isPreviewing = quickPreview?.kind === 'cover' && quickPreview.src === item.src;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setQuickPreview({ kind: 'cover', src: item.src })}
                            className={`aspect-[16/9] overflow-hidden rounded-2xl border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                              isPreviewing
                                ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20 scale-105'
                                : isCurrent
                                  ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20'
                                  : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                            }`}
                            title={item.label}
                          >
                            <img src={item.src} alt="" className="h-full w-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image crop adjustment buttons */}
                  {(deceasedAvatarUrl || deceasedCoverUrl) && (
                    <div className="flex justify-center gap-3 max-w-xl mx-auto">
                      {deceasedAvatarUrl && (
                        <Button variant="ghost"
                          type="button"
                          onClick={() => setIsCropModalOpen(true)}
                          className="px-5 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-800 font-medium text-xs rounded-xl transition active:scale-95 flex items-center gap-2 justify-center flex-1 cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>ปรับรูปโปรไฟล์</span>
                        </Button>
                      )}
                      {deceasedCoverUrl && (
                        <Button variant="ghost"
                          type="button"
                          onClick={() => setIsCoverCropModalOpen(true)}
                          className="px-5 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-800 font-medium text-xs rounded-xl transition active:scale-95 flex items-center gap-2 justify-center flex-1 cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>ปรับรูปหน้าปก</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. ธีม & สี & ฟอนต์ Tab */}
              {activeSubTab === 'theme' && (
                <div className="space-y-8 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
                      <Palette className="size-4 text-[#0071e3]" />
                      <span>ธีม & สี & ฟอนต์</span>
                    </h3>
                    <p className="text-xs text-stone-500">เลือกโทนสีและฟอนต์ที่เข้ากับเว็บไซต์ของคุณ</p>
                  </div>

                  {/* Theme Templates */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-stone-500">
                        เลือกธีมสำเร็จรูป
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPrimaryColor('#0d9488');
                          setSecondaryColor('#f59e0b');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-bold text-stone-500 transition hover:bg-stone-50 hover:text-stone-700 active:scale-95"
                      >
                        <RotateCw className="size-3" />
                        <span>รีเซ็ต</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[
                        { name: 'Peaceful Mint', desc: 'สงบ รำลึก', primary: '#7ea18b', hover: '#668571', secondary: '#d4be95', light: '#f4f6f3' },
                        { name: 'Sweet Peach', desc: 'อบอุ่น โรแมนติก', primary: '#e09f9f', hover: '#c48282', secondary: '#e6c1a8', light: '#fff7f5' },
                        { name: 'Warm Caramel', desc: 'อ่อนโยน เป็นธรรมชาติ', primary: '#c29a7c', hover: '#a67f62', secondary: '#dcc6a8', light: '#fbf8f5' },
                        { name: 'Classic Olive', desc: 'คลาสสิก ครอบครัว', primary: '#96a288', hover: '#7a866d', secondary: '#cfc5b0', light: '#f7f8f5' },
                        { name: 'Ocean Breeze', desc: 'สดใส มิตรภาพ', primary: '#8ba8bd', hover: '#708d9e', secondary: '#ded2af', light: '#f5f7f9' },
                        { name: 'Lilac Dream', desc: 'หรูหรา ทางการ', primary: '#a49cb5', hover: '#89819a', secondary: '#c8bfcb', light: '#f7f6f8' }
                      ].map(t => {
                        const isActive = primaryColor.toLowerCase() === t.primary.toLowerCase() && secondaryColor.toLowerCase() === t.secondary.toLowerCase();
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => {
                              setPrimaryColor(t.primary);
                              setSecondaryColor(t.secondary);
                            }}
                            className={`relative flex h-auto w-full flex-col rounded-2xl border-2 bg-white overflow-hidden transition-all duration-200 hover:shadow-md ${
                              isActive
                                ? 'border-[#0071e3] shadow-sm ring-4 ring-[#0071e3]/10'
                                : 'border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {/* Color preview bar */}
                            <div className="flex h-12 w-full">
                              <div className="flex-1" style={{ backgroundColor: t.primary }} />
                              <div className="flex-1" style={{ backgroundColor: t.hover }} />
                              <div className="flex-1" style={{ backgroundColor: t.secondary }} />
                              <div className="flex-1" style={{ backgroundColor: t.light }} />
                            </div>
                            <div className="p-3 text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-stone-900">{t.name}</span>
                                {isActive && (
                                  <span className="flex size-5 items-center justify-center rounded-full bg-[#0071e3] text-white">
                                    <Check className="size-3 stroke-[3]" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400">{t.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wide text-stone-500">
                      กำหนดสีเอง
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/50 p-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="size-10 shrink-0 cursor-pointer rounded-xl border border-stone-200 bg-white p-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <p className="text-[10px] font-bold text-stone-400 uppercase">Primary</p>
                          <Input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="h-8 rounded-lg border border-stone-200 bg-white px-2.5 font-mono text-xs text-stone-900 focus-visible:border-[#0071e3]/50 focus-visible:ring-0"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/50 p-3">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="size-10 shrink-0 cursor-pointer rounded-xl border border-stone-200 bg-white p-0.5"
                        />
                        <div className="flex-1 space-y-0.5">
                          <p className="text-[10px] font-bold text-stone-400 uppercase">Secondary</p>
                          <Input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="h-8 rounded-lg border border-stone-200 bg-white px-2.5 font-mono text-xs text-stone-900 focus-visible:border-[#0071e3]/50 focus-visible:ring-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Font */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wide text-stone-500">ฟอนต์</label>
                    <Select
                      value={fontFamily}
                      onValueChange={(value) => setFontFamily(value)}
                    >
                      <SelectTrigger
                        className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm font-bold text-stone-900 focus:border-[#0071e3]/50 focus:bg-white focus:outline-none"
                        style={{ fontFamily }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="LINE Seed Sans TH" style={{ fontFamily: 'LINE Seed Sans TH' }}>LINE Seed Sans TH (แนะนำ)</SelectItem>
                        <SelectItem value="Inter" style={{ fontFamily: 'Inter' }}>Inter (เรียบหรูสากล)</SelectItem>
                        <SelectItem value="Sarabun" style={{ fontFamily: 'Sarabun' }}>Sarabun (ไทยทางการ)</SelectItem>
                        <SelectItem value="Niramit" style={{ fontFamily: 'Niramit' }}>Niramit (ไทยร่วมสมัย)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {/* 4. ฟีเจอร์ที่เปิดใช้งาน Tab */}
              {activeSubTab === 'features' && (
                <div className="pt-2 space-y-5 text-left animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Grid className="w-4 h-4 text-[#0071e3]" />
                      <span>ฟีเจอร์ที่เปิดใช้งาน</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      เลือกส่วนที่ต้องการแสดงบนเว็บไซต์ เปิด-ปิดได้ทุกเมื่อ
                    </p>
                  </div>
                  <FeatureToggleList 
                    value={features}
                    onChange={setFeatures}
                    disabled={saveLoading}
                    mandatoryKeys={MANDATORY_FEATURES}
                    visibleKeys={getVisibleKeys(selectedSite.category)}
                    labelFor={(k) => getFeatureLabel(selectedSite.category, k)}
                  />
                </div>
              )}

              {/* 5. พื้นที่จัดเก็บ & การชำระเงิน Tab */}
              {activeSubTab === 'billing' && (
                <div className="space-y-6 text-left animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-[#0071e3]/10">
                      <CreditCard className="w-4 h-4 text-[#0071e3]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900">พื้นที่จัดเก็บ & การชำระเงิน</h3>
                      <p className="text-xs text-stone-400">จัดการพื้นที่เก็บไฟล์และดูประวัติการชำระเงิน</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Storage Quota Card */}
                    <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <Database className="w-4 h-4 text-[#0071e3]" />
                          <span>พื้นที่จัดเก็บ</span>
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          storagePercentage > 80 
                            ? 'bg-rose-50 text-rose-600' 
                            : storagePercentage > 50 
                            ? 'bg-amber-50 text-amber-600' 
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {storagePercentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              storagePercentage > 80 ? 'bg-rose-500' : storagePercentage > 50 ? 'bg-amber-500' : 'bg-[#0071e3]'
                            }`} 
                            style={{ width: `${storagePercentage}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-xs text-stone-500 font-medium">
                          <span>{(storageUsedBytes / (1024 * 1024)).toFixed(1)} MB ใช้แล้ว</span>
                          <span>{(storageQuotaBytes / (1024 * 1024 * 1024)).toFixed(1)} GB ทั้งหมด</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-stone-100 pt-4 space-y-2">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">ทดสอบอัปโหลด</p>
                        <div className="flex gap-2">
                          <Button variant="ghost" 
                            type="button"
                            onClick={() => handleMockUpload(10)} 
                            disabled={uploadLoading}
                            className="flex-1 h-9 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-600 font-medium transition cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                            รูป 10MB
                          </Button>
                          <Button variant="ghost" 
                            type="button"
                            onClick={() => handleMockUpload(250)} 
                            disabled={uploadLoading}
                            className="flex-1 h-9 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-600 font-medium transition cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5 mr-1.5" />
                            วิดีโอ 250MB
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Export backups Card */}
                    <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4 flex flex-col">
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Download className="w-4 h-4 text-[#0071e3]" />
                        <span>สำรองข้อมูล</span>
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed flex-1">
                        ดาวน์โหลดข้อมูลทั้งหมด ประวัติคำไว้อาลัย ผังครอบครัว และหนังสือที่ระลึก เป็นไฟล์ ZIP สำรองเก็บไว้แบบออฟไลน์
                      </p>
                      <Button variant="default" 
                        type="button"
                        onClick={handleExportZip}
                        disabled={exportLoading}
                        className="h-11 w-full bg-[#0071e3] hover:bg-[#0071e3]/90 text-white hover:text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        {exportLoading ? 'กำลังส่งออก...' : 'ดาวน์โหลด ZIP'}
                      </Button>
                    </div>
                  </div>

                  {/* Billing invoice logs */}
                  <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-100">
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0071e3]" />
                        <span>ประวัติการชำระเงิน</span>
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-bold">{invoiceLogs.length}</span>
                      </h4>
                    </div>
                    
                    {invoiceLogs.length === 0 ? (
                      <div className="py-16 text-center space-y-2">
                        <FileText className="w-10 h-10 text-stone-300 mx-auto" />
                        <p className="text-sm text-stone-500">ยังไม่มีประวัติการชำระเงิน</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-stone-100">
                        {invoiceLogs.map(log => (
                          <div key={log.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-stone-50/50 transition-colors">
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-stone-900 font-mono">{log.id}</span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700">{log.status}</span>
                              </div>
                              <p className="text-xs text-stone-500 truncate">{log.desc}</p>
                              <p className="text-[10px] text-stone-400">{log.date}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-sm font-bold text-stone-900">{log.amount}</span>
                              <a 
                                href={`/api/payment/invoice?refId=${log.refId}`}
                                download
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-600 font-bold transition active:scale-95"
                              >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conditionally display Save Button only on configuration sub-tabs */}
              {activeSubTab !== 'billing' && (
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex h-auto cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#0071e3] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0071e3]/90 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  {saveLoading ? (
                    'กำลังบันทึกข้อมูล...'
                  ) : (
                    <>
                      <Save className="size-4 shrink-0 text-white" />
                      <span>บันทึกการตั้งค่าเว็บไซต์</span>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        )}
        {activeTab === 'gallery' && (() => {
          const filteredPhotoMedias = selectedAlbumFilter === 'ALL'
            ? photoMedias
            : photoMedias.filter(m => mediaAlbums[m.id] === selectedAlbumFilter);

          return (
            <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                    <Camera className="w-5 h-5 text-emerald-700" />
                    <span>คลังภาพถ่ายความทรงจำ ({photoMedias.length})</span>
                  </h3>
                  <p className="text-xs text-stone-500">อัปโหลดและจัดการภาพถ่ายของแกลเลอรีความทรงจำ</p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปภาพใหม่</span>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={async (e) => {
                      if (e.target.files) {
                        const newMediaIds: string[] = [];
                        for (let i = 0; i < e.target.files.length; i++) {
                          const mediaId = await uploadGalleryMedia(e.target.files[i]);
                          if (mediaId) {
                            newMediaIds.push(mediaId);
                          }
                        }
                        if (selectedAlbumFilter !== 'ALL' && newMediaIds.length > 0) {
                          const nextMediaAlbums = { ...mediaAlbums };
                          newMediaIds.forEach((id) => {
                            nextMediaAlbums[id] = selectedAlbumFilter;
                          });
                          setMediaAlbums(nextMediaAlbums);
                          await saveAlbumConfig(albums, nextMediaAlbums);
                        }
                        // Refresh list
                        if (!activeSite) return;
                        const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
                        const listData = await listRes.json();
                        if (listRes.ok) {
                          setGalleryMedias(listData.mediaList || []);
                        }
                      }
                    }}
                  />
                </label>
              </div>

              {/* Albums manager bar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-4 select-none">
                <Button variant="ghost"
                  type="button"
                  onClick={() => setSelectedAlbumFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedAlbumFilter === 'ALL'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  ทั้งหมด ({photoMedias.length})
                </Button>

                {albums.map((albumName) => {
                  const albumPhotosCount = photoMedias.filter(m => mediaAlbums[m.id] === albumName).length;
                  const isSelected = selectedAlbumFilter === albumName;
                  
                  return (
                    <div key={albumName} className="flex items-center gap-1">
                      <Button variant="ghost"
                        type="button"
                        onClick={() => setSelectedAlbumFilter(albumName)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {albumName} ({albumPhotosCount})
                      </Button>
                      
                      {isSelected && (
                        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                          {/* Rename */}
                          <Button variant="ghost"
                            type="button"
                            onClick={() => {
                              const newName = prompt('เปลี่ยนชื่ออัลบั้มใหม่:', albumName);
                              if (newName && newName.trim()) {
                                handleRenameAlbum(albumName, newName.trim());
                              }
                            }}
                            className="p-1 hover:bg-stone-200 rounded text-stone-650 transition"
                            title="เปลี่ยนชื่ออัลบั้ม"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          {/* Delete */}
                          <Button variant="ghost"
                            type="button"
                            onClick={() => {
                              if (confirm(`คุณต้องการลบอัลบั้ม "${albumName}" ใช่หรือไม่?\n(รูปภาพภายในอัลบั้มจะยังคงอยู่ในระบบแต่จะถูกย้ายออกจากอัลบั้มนี้)`)) {
                                handleDeleteAlbum(albumName);
                              }
                            }}
                            className="p-1 hover:bg-red-50 text-red-650 hover:text-red-755 rounded transition"
                            title="ลบอัลบั้ม"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Album Button */}
                {isCreatingAlbum ? (
                  <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl p-1">
                    <Input
                      type="text"
                      autoFocus
                      placeholder="ชื่ออัลบั้ม..."
                      value={tempAlbumName}
                      onChange={(e) => setTempAlbumName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddAlbum(tempAlbumName);
                          setIsCreatingAlbum(false);
                          setTempAlbumName('');
                        } else if (e.key === 'Escape') {
                          setIsCreatingAlbum(false);
                          setTempAlbumName('');
                        }
                      }}
                      className="px-2 py-1 text-xs border border-stone-200 rounded-lg text-stone-900 bg-white focus:outline-none focus:border-emerald-500 max-w-[120px]"
                    />
                    <Button variant="ghost"
                      type="button"
                      onClick={() => {
                        handleAddAlbum(tempAlbumName);
                        setIsCreatingAlbum(false);
                        setTempAlbumName('');
                      }}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition"
                    >
                      เพิ่ม
                    </Button>
                    <Button variant="ghost"
                      type="button"
                      onClick={() => {
                        setIsCreatingAlbum(false);
                        setTempAlbumName('');
                      }}
                      className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-[10px] font-bold transition"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost"
                    type="button"
                    onClick={() => setIsCreatingAlbum(true)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-250 border-dashed rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>สร้างอัลบั้มใหม่</span>
                  </Button>
                )}
              </div>

              {galleryUploading && (
                <div className="p-4 bg-stone-50 border border-stone-200 text-xs text-stone-600 rounded-2xl font-semibold animate-pulse flex items-center gap-2">
                  <RotateCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>กำลังอัปโหลดไฟล์สื่อไปยังคลังเก็บข้อมูล...</span>
                </div>
              )}

              {photoMedias.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-stone-200 rounded-3xl text-stone-500 text-sm">
                  ยังไม่มีการอัปโหลดไฟล์รูปภาพความทรงจำ
                </div>
              ) : filteredPhotoMedias.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-stone-200 rounded-3xl text-stone-500 text-sm">
                  ยังไม่มีรูปภาพในอัลบั้มนี้
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {filteredPhotoMedias.map((m, index) => {
                    const isDraggingItem = draggedIndex === index;
                    return (
                      <div 
                        key={m.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`
                          group relative aspect-square bg-stone-50 rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between transition-all duration-200 cursor-grab active:cursor-grabbing
                          ${isDraggingItem 
                            ? 'opacity-40 border-emerald-500 scale-[0.97] ring-2 ring-emerald-500/20' 
                            : 'border-stone-200 hover:scale-[1.02]'
                          }
                        `}
                      >
                        <img 
                          src={m.filePath} 
                          alt={m.fileName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2 gap-2">
                          <Button variant="ghost"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGalleryMedia(m.id);
                            }}
                            className="p-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer border-0"
                            title="ลบรูปภาพ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          {/* Move to Album Dropdown */}
                          {albums.length > 0 && (
                            <div className="w-full px-1" onClick={(e) => e.stopPropagation()}>
                              <Select
                              value={(mediaAlbums[m.id] || '') || '__empty__'}
                              onValueChange={(raw) => {
                                const value = raw === '__empty__' ? '' : raw;
                                const nextMediaAlbums = { ...mediaAlbums, [m.id]: value };
                                  setMediaAlbums(nextMediaAlbums);
                                  saveAlbumConfig(albums, nextMediaAlbums);
                              }}
                            >
                              <SelectTrigger className={"w-full px-1.5 py-1 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 rounded-lg text-[10px] font-bold focus:outline-none cursor-pointer"}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
<SelectItem value="__empty__">(ไม่มีอัลบั้ม)</SelectItem>
                                {albums.map((a) => (
                                          <SelectItem key={a} value={a}>
                                    ย้ายไป: {a}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })()}

        {activeTab === 'videos' && (
          <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                  <Video className="w-5 h-5 text-emerald-700" />
                  <span>คลังวิดีโอ ({videoMedias.length})</span>
                </h3>
                <p className="text-xs text-stone-500">แนบลิงก์วิดีโอ YouTube หรืออัปโหลดคลิปวิดีโอ</p>
              </div>
            </div>

            {/* Video Input Forms (YouTube link & Direct File upload) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* YouTube Link Form */}
              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4 text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-900">แนบลิงก์วิดีโอจากโซเชียลมีเดีย</h4>
                  <p className="text-[10px] text-stone-500">รองรับ YouTube, Facebook, TikTok, Instagram, Vimeo</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="วางลิงก์ เช่น YouTube, Facebook, TikTok, Instagram, Vimeo"
                    className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500/80 transition"
                  />
                  <Button variant="ghost"
                    type="button"
                    onClick={handleSaveYoutubeLink}
                    disabled={youtubeSaving}
                    className="h-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition active:scale-95 flex-shrink-0 cursor-pointer"
                  >
                    {youtubeSaving ? 'บันทึก...' : 'บันทึกลิงก์'}
                  </Button>
                </div>
              </div>

              {/* Direct File Upload Form */}
              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4 text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-900">อัปโหลดไฟล์วิดีโอโดยตรง</h4>
                  <p className="text-[10px] text-stone-500">รองรับไฟล์วิดีโอรูปแบบ .mp4, .mov (ขนาดแนะนำไม่เกิน 50MB)</p>
                </div>
                <div>
                  <label className="w-full py-2 bg-white border border-stone-250 hover:bg-stone-50 text-stone-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                    <Upload className="w-4 h-4 text-stone-500" />
                    <span>เลือกไฟล์วิดีโอเพื่ออัปโหลด</span>
                    <Input 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          await uploadGalleryMedia(e.target.files[0]);
                          // Refresh list
                          if (!activeSite) return;
                          const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
                          const listData = await listRes.json();
                          if (listRes.ok) {
                            setGalleryMedias(listData.mediaList || []);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {videoMedias.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-stone-200 rounded-3xl text-stone-500 text-sm">
                ยังไม่มีการเพิ่มลิงก์วิดีโอความทรงจำ
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videoMedias.map((m) => {
                  const isYoutube = m.mimeType === 'video/youtube' || m.filePath.includes('youtube.com') || m.filePath.includes('youtu.be');
                  let embedUrl = m.filePath;
                  if (isYoutube) {
                    const match = m.filePath.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                    if (match) {
                      embedUrl = `https://www.youtube.com/embed/${match[1]}`;
                    }
                  }

                  return (
                    <div key={m.id} className="group relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex flex-col justify-between shadow-sm aspect-video">
                      {isYoutube ? (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full border-0"
                          allowFullScreen
                          title={m.fileName}
                        />
                      ) : (
                        <video src={m.filePath} controls className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                        <Button variant="ghost" type="button"
                          onClick={() => deleteGalleryMedia(m.id)}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-md cursor-pointer"
                          title="ลบวิดีโอ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Family Tree Manager Section */}
        {activeTab === 'family' && (
          <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-[#0071e3]/10">
                  <GitBranch className="w-4 h-4 text-[#0071e3]" />
                </div>
                <span>ผังครอบครัวและเครือญาติ</span>
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-stone-200 text-stone-600 text-[10px] font-black">{familyMembers.length}</span>
              </h3>
              <p className="text-xs text-stone-400 pl-10">เพิ่มรายละเอียดของบิดา มารดา คู่สมรส พี่น้อง และบุตรธิดา</p>
            </div>
            <Button variant="default" type="button" 
              onClick={() => { resetFamilyForm(); setFamilyFormOpen(!familyFormOpen); }}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                familyFormOpen 
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-700 border border-stone-200' 
                  : 'bg-[#0071e3] hover:bg-[#0071e3]/90 text-white hover:text-white'
              }`}
            >
              {familyFormOpen ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>ปิด</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มสมาชิกครอบครัว</span>
                </>
              )}
            </Button>
          </div>

          {familyFormOpen && (
            <form onSubmit={handleSaveFamilyMember} className="p-6 rounded-2xl border border-[#0071e3]/20 bg-blue-50/30 space-y-5 max-w-xl animate-fade-in">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#0071e3]/10">
                  {familyId ? <Edit3 className="w-3.5 h-3.5 text-[#0071e3]" /> : <Plus className="w-3.5 h-3.5 text-[#0071e3]" />}
                </div>
                <span>{familyId ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิกใหม่'}</span>
              </h4>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">ชื่อ-นามสกุล</label>
                  <Input 
                    type="text" 
                    value={familyName} 
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                    placeholder="เช่น นายสมจิตร์ รักสงบ"
                    className="w-full h-11 px-4 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-[#0071e3]/50 focus-visible:ring-2 focus-visible:ring-blue-500/20 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">ความสัมพันธ์</label>
                  <Select value={familyRelationship} onValueChange={(value) => setFamilyRelationship(value)}>
                    <SelectTrigger className="w-full h-11 px-4 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-[#0071e3]/50 transition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="PARENT_1">บิดา (Father)</SelectItem>
                      <SelectItem value="PARENT_2">มารดา (Mother)</SelectItem>
                      <SelectItem value="SPOUSE">คู่สมรส (Spouse)</SelectItem>
                      <SelectItem value="SIBLING">พี่น้อง (Sibling)</SelectItem>
                      <SelectItem value="CHILD">บุตร/ธิดา (Child)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">ปีเกิด (พ.ศ.)</label>
                    <Input 
                      type="text" 
                      value={familyBirthYear} 
                      onChange={(e) => setFamilyBirthYear(e.target.value)}
                      placeholder="2490"
                      maxLength={4}
                      className="w-full h-11 px-4 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm font-mono focus:outline-none focus:border-[#0071e3]/50 focus-visible:ring-2 focus-visible:ring-blue-500/20 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">ปีที่ล่วงลับ (พ.ศ.)</label>
                    <Input 
                      type="text" 
                      value={familyDeathYear} 
                      onChange={(e) => setFamilyDeathYear(e.target.value)}
                      disabled={!familyIsDeceased}
                      placeholder="2565"
                      maxLength={4}
                      className="w-full h-11 px-4 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm font-mono disabled:opacity-40 disabled:bg-stone-50 focus:outline-none focus:border-[#0071e3]/50 focus-visible:ring-2 focus-visible:ring-blue-500/20 transition"
                    />
                  </div>
                </div>

                <label htmlFor="isDeceased" className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-stone-200 cursor-pointer select-none hover:bg-stone-50 transition-colors">
                  <Checkbox 
                    id="isDeceased"
                    checked={familyIsDeceased}
                    onCheckedChange={(checked) => setFamilyIsDeceased(!!checked)}
                    className="w-4.5 h-4.5 cursor-pointer rounded"
                  />
                  <span className="text-sm text-stone-700 font-medium">เสียชีวิตแล้ว</span>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">รูปถ่าย</label>
                  
                  <div className="flex items-start gap-4">
                    {familyAvatarUrl && (
                      <div className="relative w-20 h-20 rounded-2xl border-2 border-stone-100 bg-stone-50 overflow-hidden flex-shrink-0 group">
                        <img 
                          src={familyAvatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setFamilyAvatarUrl('')}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}

                    <div
                      onDragEnter={(e) => { e.preventDefault(); setFamilyIsDragActive(true); }}
                      onDragOver={(e) => { e.preventDefault(); setFamilyIsDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setFamilyIsDragActive(false); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setFamilyIsDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          uploadFamilyAvatar(file);
                        }
                      }}
                      className={`flex-1 border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                        familyIsDragActive 
                          ? 'border-[#0071e3] bg-blue-50/50 scale-[1.01]' 
                          : 'border-stone-200 hover:border-[#0071e3]/40 bg-white hover:bg-blue-50/20'
                      }`}
                    >
                      <Input
                        type="file"
                        id="avatar-file-input"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadFamilyAvatar(file);
                        }}
                        disabled={avatarUploading}
                        className="hidden"
                      />
                      <label htmlFor="avatar-file-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                        <div className={`size-10 rounded-full flex items-center justify-center ${familyIsDragActive ? 'bg-[#0071e3]/10' : 'bg-stone-100'}`}>
                          <Camera className={`w-4.5 h-4.5 ${familyIsDragActive ? 'text-[#0071e3]' : 'text-stone-400'}`} />
                        </div>
                        <span className="text-xs font-medium text-stone-600">
                          {avatarUploading 
                            ? 'กำลังอัปโหลด...' 
                            : familyIsDragActive 
                            ? 'วางรูปภาพที่นี่' 
                            : 'คลิกหรือลากรูปมาวาง'}
                        </span>
                        <span className="text-[10px] text-stone-400">PNG, JPG, WEBP ไม่เกิน 5MB</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="default" 
                  type="submit" 
                  disabled={saveLoading}
                  className="h-auto px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white hover:text-white font-bold text-xs transition active:scale-95"
                >
                  {saveLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
                <Button variant="ghost" 
                  type="button" 
                  onClick={resetFamilyForm}
                  className="h-auto px-5 py-2.5 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-100 text-xs font-medium transition"
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          )}

          {familyMembers.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-stone-200 rounded-2xl space-y-2">
              <GitBranch className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm text-stone-500">ยังไม่มีสมาชิกครอบครัว</p>
              <p className="text-xs text-stone-400">กดปุ่ม "เพิ่มสมาชิกครอบครัว" เพื่อเริ่มต้น</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {familyMembers.map(m => {
                const relLabel = 
                  m.relationship === 'PARENT_1' ? 'บิดา' : 
                  m.relationship === 'PARENT_2' ? 'มารดา' : 
                  m.relationship === 'SPOUSE' ? 'คู่สมรส' : 
                  m.relationship === 'SIBLING' ? 'พี่น้อง' : 'บุตร/ธิดา';
                const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleSaveYoutubeLink = async () => {
    if (!activeSite || !youtubeUrl) return;
    setYoutubeSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/video-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          videoUrl: youtubeUrl,
          title: '',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`แนบลิงก์วิดีโอสำเร็จ`);
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์วิดีโอล้มเหลว');
    } finally {
      setYoutubeSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const photoMedias = galleryMedias.filter(m => !m.mimeType?.startsWith('video/') && m.mimeType !== 'video/youtube');
  const videoMedias = galleryMedias.filter(m => m.mimeType?.startsWith('video/') || m.mimeType === 'video/youtube');

  return (
                  <div key={m.id} className="group p-4 rounded-2xl border border-stone-200 bg-white flex justify-between items-center hover:border-stone-300 hover:shadow-sm transition-all duration-200 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {m.avatarUrl ? (
                        <img 
                          src={m.avatarUrl} 
                          alt={m.name} 
                          className="w-11 h-11 rounded-full object-cover border-2 border-stone-100 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] font-bold text-sm flex-shrink-0">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate">{m.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold bg-stone-100 text-stone-500 rounded-full">
                            {relLabel}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {m.birthYear || '?'} – {m.isDeceased ? (m.deathYear || '?') : 'ปัจจุบัน'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" type="button" 
                        onClick={() => editFamilyMember(m)}
                        className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" type="button" 
                        onClick={() => handleDeleteFamilyMember(m.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 border border-rose-200 transition cursor-pointer"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        )}        {/* E-Books Manager Section */}
        {activeTab === 'ebooks' && (
          <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>หนังสือของชำร่วยและธรรมทาน ({ebooks.length})</span>
              </h3>
              <p className="text-xs text-stone-500">อัปโหลดหนังสือธรรมะ บทสวดมนต์ หรือหนังสือชีวประวัติ (PDF) พร้อมระบบอ่านในเว็บ</p>
            </div>
            <Button variant="ghost" type="button" 
              onClick={() => { resetEbookForm(); setEbookFormOpen(!ebookFormOpen); }}
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-200 text-xs font-bold transition flex items-center gap-1"
            >
              {ebookFormOpen ? (
                'ปิดหน้าต่าง'
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>อัปโหลดหนังสือใหม่</span>
                </>
              )}
            </Button>
          </div>

          {ebookFormOpen && (
            <form onSubmit={handleSaveEbook} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4 max-w-xl animate-fade-in">
              <h4 className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
                {ebookId ? (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>แก้ไขข้อมูลหนังสือ</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>อัปโหลดหนังสือธรรมทานใหม่</span>
                  </>
                )}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">ชื่อหนังสือ</label>
                  <Input 
                    type="text" 
                    value={ebookTitle} 
                    onChange={(e) => setEbookTitle(e.target.value)}
                    required
                    placeholder="เช่น หนังสือบทสวดมนต์และธรรมสติ"
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base focus:outline-none focus:border-emerald-500/80 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">ผู้แต่ง / คณะผู้จัดทำ</label>
                  <Input 
                    type="text" 
                    value={ebookAuthor} 
                    onChange={(e) => setEbookAuthor(e.target.value)}
                    required
                    placeholder="เช่น คณะครอบครัวเจริญยิ่ง"
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base focus:outline-none focus:border-emerald-500/80 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">จำนวนหน้าทั้งหมด</label>
                  <Input 
                    type="number" 
                    min={1}
                    value={ebookTotalPages} 
                    onChange={(e) => setEbookTotalPages(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base focus:outline-none focus:border-emerald-500/80 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">เลือกไฟล์หนังสือ PDF</label>
                  <Input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => setEbookFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-stone-600 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-stone-200 file:text-xs file:font-semibold file:bg-stone-50 file:text-stone-705 hover:file:bg-stone-100 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-600 block">ข้อความเนื้อหาในแต่ละหน้า (แยกหน้าโดยใช้เครื่องหมาย `[PAGE]`)</label>
                <Textarea 
                  value={ebookPagesText} 
                  onChange={(e) => setEbookPagesText(e.target.value)}
                  rows={6}
                  placeholder="บทนำ...&#10;[PAGE]&#10;หน้าที่ 2...&#10;[PAGE]&#10;หน้าที่ 3..."
                  className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base font-serif leading-relaxed focus:outline-none focus:border-emerald-500/80 transition"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" 
                  type="submit" 
                  disabled={saveLoading}
                  className="h-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm"
                >
                  {saveLoading ? 'กำลังบันทึกและอัปโหลด...' : '💾 บันทึกและออกบริการ'}
                </Button>
                <Button variant="ghost" 
                  type="button" 
                  onClick={resetEbookForm}
                  className="h-auto px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition"
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          )}

          {ebooks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-stone-200 rounded-2xl text-stone-500 text-xs">
              ยังไม่มีการอัปโหลดหนังสือที่ระลึกธรรมทาน
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ebooks.map(b => (
                <div key={b.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:border-stone-300 transition flex gap-4 items-center">
                  <div className="w-16 h-20 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col items-center justify-center p-2 relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600" />
                    <BookOpen className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{b.title}</p>
                    <p className="text-[10px] text-stone-500">โดย: {b.author}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-stone-200/50 text-stone-600 text-[8px] font-bold">
                      {b.totalPages} หน้า
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" type="button" 
                      onClick={() => editEbook(b)}
                      className="p-2 rounded-xl bg-white border border-stone-250 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition text-[10px]"
                      title="แก้ไข"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" type="button" 
                      onClick={() => handleDeleteEbook(b.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition text-[10px] flex items-center justify-center"
                      title="ลบ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}
        {activeTab === 'condolences' && (
          <div className="space-y-6">
            {features.condolence && (
              <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-[#0071e3]/10">
                      <Flame className="w-4 h-4 text-[#0071e3]" />
                    </div>
                    <span>
                      {selectedSite.category === 'Friends'
                        ? 'ข้อความถึงกันรออนุมัติ'
                        : selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                          ? 'คำอวยพรรออนุมัติ'
                          : 'คำไว้อาลัยรออนุมัติ'}
                    </span>
                    {condolences.length > 0 && (
                      <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-black">{condolences.length}</span>
                    )}
                  </h3>
                </div>

                {condolences.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-stone-200 rounded-2xl space-y-2">
                    <Flame className="w-10 h-10 text-stone-300 mx-auto" />
                    <p className="text-sm text-stone-500">ไม่มีข้อความค้างอนุมัติ</p>
                    <p className="text-xs text-stone-400">
                      {selectedSite.category === 'Friends'
                        ? 'ข้อความใหม่จะแสดงที่นี่'
                        : selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                          ? 'คำอวยพรใหม่จะแสดงที่นี่'
                          : 'ข้อความไว้อาลัยใหม่จะแสดงที่นี่'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {condolences.map(c => (
                      <div key={c.id} className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-200">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                          <div className="space-y-2 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="size-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] text-xs font-bold shrink-0">
                                {c.senderName?.charAt(0) || '?'}
                              </div>
                              <span className="text-sm font-bold text-stone-900">{c.senderName}</span>
                              {c.relationship && c.relationship !== '—' && (
                                <span className="px-2 py-0.5 text-[9px] font-bold bg-stone-100 text-stone-500 rounded-full">
                                  {c.relationship}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-stone-600 leading-relaxed pl-10">"{c.message}"</p>
                          </div>
                          <div className="flex gap-2 self-end sm:self-start shrink-0">
                            <Button variant="default" type="button" 
                              onClick={() => handleModerateCondolence(c.id, 'APPROVE')}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white text-xs font-bold transition active:scale-95"
                            >
                              อนุมัติ
                            </Button>
                            <Button variant="ghost" type="button" 
                              onClick={() => handleModerateCondolence(c.id, 'DELETE')}
                              className="px-4 py-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold transition active:scale-95"
                            >
                              ลบออก
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {features.memory && (
              <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-[#0071e3]/10">
                      <Camera className="w-4 h-4 text-[#0071e3]" />
                    </div>
                    <span>Memory Wall รออนุมัติ</span>
                    {pendingPosts.length > 0 && (
                      <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-black">{pendingPosts.length}</span>
                    )}
                  </h3>
                </div>

                {pendingPosts.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-stone-200 rounded-2xl space-y-2">
                    <Camera className="w-10 h-10 text-stone-300 mx-auto" />
                    <p className="text-sm text-stone-500">ไม่มีเรื่องราวค้างอนุมัติ</p>
                    <p className="text-xs text-stone-400">เรื่องราวและรูปถ่ายใหม่จะแสดงที่นี่</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingPosts.map(p => (
                      <div key={p.id} className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-200">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                          <div className="space-y-2 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="size-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] text-xs font-bold shrink-0">
                                {p.senderName?.charAt(0) || '?'}
                              </div>
                              <div>
                                <span className="text-sm font-bold text-stone-900">{p.senderName}</span>
                                {p.title && <span className="text-xs text-stone-400 ml-2">{p.title}</span>}
                              </div>
                            </div>
                            {p.mediaUrl && (
                              <div className="pl-10">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0071e3]">
                                  <ImageIcon className="w-3 h-3" />
                                  แนบรูปภาพ
                                </span>
                              </div>
                            )}
                            {p.content && <p className="text-sm text-stone-600 leading-relaxed pl-10">"{p.content}"</p>}
                          </div>
                          <div className="flex gap-2 self-end sm:self-start shrink-0">
                            <Button variant="default" type="button" 
                              onClick={() => handleModerateMemoryPost(p.id, 'APPROVE')}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white text-xs font-bold transition active:scale-95"
                            >
                              อนุมัติ
                            </Button>
                            <Button variant="ghost" type="button" 
                              onClick={() => handleModerateMemoryPost(p.id, 'DELETE')}
                              className="px-4 py-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold transition active:scale-95"
                            >
                              ลบออก
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}      {/* Cover Crop Modal */}
      {isCoverCropModalOpen && (
        <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 p-6 flex flex-col gap-6 text-stone-800 text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-150 pb-3">
              <h3 className="text-sm font-black flex items-center gap-1.5 text-emerald-800">
                <Settings className="w-4 h-4 text-emerald-650" />
                <span>ปรับแต่งรูปภาพหน้าปก (Cover Editor)</span>
              </h3>
              <Button variant="ghost" 
                type="button" 
                onClick={() => setIsCoverCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Repositioning viewport Container */}
            <div 
              className="relative w-full aspect-video sm:h-52 bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden cursor-move flex items-center justify-center"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = rect.width;
                const viewportHeight = rect.height;
                const startNX = deceasedCoverX;
                const startNY = deceasedCoverY;
                const startClientX = e.clientX;
                const startClientY = e.clientY;
                const scale = deceasedCoverScale;
                
                const handleMouseMove = (ev: MouseEvent) => {
                  const dx = (ev.clientX - startClientX) / viewportWidth;
                  const dy = (ev.clientY - startClientY) / viewportHeight;
                  setDeceasedCoverX(clampImagePan(startNX + dx, scale));
                  setDeceasedCoverY(clampImagePan(startNY + dy, scale));
                };
                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                };
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }}
              onTouchStart={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = rect.width;
                const viewportHeight = rect.height;
                const touch = e.touches[0];
                const startNX = deceasedCoverX;
                const startNY = deceasedCoverY;
                const startClientX = touch.clientX;
                const startClientY = touch.clientY;
                const scale = deceasedCoverScale;
                
                const handleTouchMove = (ev: TouchEvent) => {
                  const t = ev.touches[0];
                  const dx = (t.clientX - startClientX) / viewportWidth;
                  const dy = (t.clientY - startClientY) / viewportHeight;
                  setDeceasedCoverX(clampImagePan(startNX + dx, scale));
                  setDeceasedCoverY(clampImagePan(startNY + dy, scale));
                };
                const handleTouchEnd = () => {
                  window.removeEventListener('touchmove', handleTouchMove);
                  window.removeEventListener('touchend', handleTouchEnd);
                };
                window.addEventListener('touchmove', handleTouchMove, { passive: true });
                window.addEventListener('touchend', handleTouchEnd);
              }}
            >
              <img
                src={deceasedCoverUrl}
                alt="Cover Repositioning"
                className="pointer-events-none max-w-none"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  ...imageTransformStyle({
                    x: deceasedCoverX,
                    y: deceasedCoverY,
                    scale: deceasedCoverScale,
                    rotate: deceasedCoverRotate,
                  }),
                }}
              />
              {/* Center crosshair reference indicator lines */}
              <div className="absolute inset-0 border border-stone-200/20 pointer-events-none flex items-center justify-center">
                <div className="w-6 h-0.5 bg-stone-400/40 absolute" />
                <div className="w-0.5 h-6 bg-stone-400/40 absolute" />
              </div>
            </div>

            {/* Scale controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 flex justify-between">
                <span>ขนาด (Zoom)</span>
                <span className="font-mono">{deceasedCoverScale.toFixed(2)}x</span>
              </label>
              <div className="flex items-center gap-3">
                <Button variant="ghost"
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, deceasedCoverScale - 0.05);
                    setDeceasedCoverScale(next);
                    setDeceasedCoverX((x) => clampImagePan(x, next));
                    setDeceasedCoverY((y) => clampImagePan(y, next));
                  }}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="ลดขนาด"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedCoverScale}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value);
                    setDeceasedCoverScale(next);
                    setDeceasedCoverX((x) => clampImagePan(x, next));
                    setDeceasedCoverY((y) => clampImagePan(y, next));
                  }}
                  className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-stone-250 rounded-lg appearance-none"
                />
                <Button variant="ghost"
                  type="button"
                  onClick={() => {
                    const next = Math.min(4, deceasedCoverScale + 0.05);
                    setDeceasedCoverScale(next);
                    setDeceasedCoverX((x) => clampImagePan(x, next));
                    setDeceasedCoverY((y) => clampImagePan(y, next));
                  }}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <Button variant="ghost"
                type="button"
                onClick={() => setDeceasedCoverRotate((deceasedCoverRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs font-bold text-stone-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>หมุนภาพ 90°</span>
              </Button>

              <Button variant="ghost"
                type="button"
                onClick={() => {
                  setDeceasedCoverScale(1);
                  setDeceasedCoverX(0);
                  setDeceasedCoverY(0);
                  setDeceasedCoverRotate(0);
                }}
                className="text-xs text-stone-505 hover:text-stone-900 transition cursor-pointer font-semibold"
              >
                รีเซ็ตค่าเริ่มต้น
              </Button>
            </div>

            {/* Save Crop button */}
            <Button variant="ghost"
              type="button"
              onClick={() => setIsCoverCropModalOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>เสร็จสิ้นและนำไปใช้</span>
            </Button>
          </div>
        </div>
      )}
      {/* Profile Photo Crop Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 animate-fade-in select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 p-6 flex flex-col gap-6 text-stone-800 text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-150 pb-3">
              <h3 className="text-sm font-black flex items-center gap-1.5 text-emerald-800">
                <Settings className="w-4 h-4 text-emerald-650" />
                <span>ปรับแต่งรูปโปรไฟล์ (Profile Editor)</span>
              </h3>
              <Button variant="ghost" 
                type="button" 
                onClick={() => setIsCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Viewport Container with Circular Overlay mask */}
            <div className="flex items-center justify-center bg-stone-50 border border-stone-200/60 p-6 rounded-2xl">
              <div 
                className="relative w-48 h-48 rounded-full border-2 border-emerald-600/80 overflow-hidden cursor-move flex items-center justify-center bg-stone-100 shadow-inner"
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const viewportWidth = rect.width;
                  const startNX = deceasedAvatarX;
                  const startNY = deceasedAvatarY;
                  const startClientX = e.clientX;
                  const startClientY = e.clientY;
                  const scale = deceasedAvatarScale;
                  
                  const handleMouseMove = (ev: MouseEvent) => {
                    const dx = (ev.clientX - startClientX) / viewportWidth;
                    const dy = (ev.clientY - startClientY) / viewportWidth;
                    setDeceasedAvatarX(clampImagePan(startNX + dx, scale));
                    setDeceasedAvatarY(clampImagePan(startNY + dy, scale));
                  };
                  const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };
                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                onTouchStart={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const viewportWidth = rect.width;
                  const touch = e.touches[0];
                  const startNX = deceasedAvatarX;
                  const startNY = deceasedAvatarY;
                  const startClientX = touch.clientX;
                  const startClientY = touch.clientY;
                  const scale = deceasedAvatarScale;
                  
                  const handleTouchMove = (ev: TouchEvent) => {
                    const t = ev.touches[0];
                    const dx = (t.clientX - startClientX) / viewportWidth;
                    const dy = (t.clientY - startClientY) / viewportWidth;
                    setDeceasedAvatarX(clampImagePan(startNX + dx, scale));
                    setDeceasedAvatarY(clampImagePan(startNY + dy, scale));
                  };
                  const handleTouchEnd = () => {
                    window.removeEventListener('touchmove', handleTouchMove);
                    window.removeEventListener('touchend', handleTouchEnd);
                  };
                  window.addEventListener('touchmove', handleTouchMove, { passive: true });
                  window.addEventListener('touchend', handleTouchEnd);
                }}
              >
                <img
                  src={deceasedAvatarUrl}
                  alt="Avatar Repositioning"
                  className="pointer-events-none max-w-none"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    ...imageTransformStyle({
                      x: deceasedAvatarX,
                      y: deceasedAvatarY,
                      scale: deceasedAvatarScale,
                      rotate: deceasedAvatarRotate,
                    }),
                  }}
                />
              </div>
            </div>

            {/* Scale controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-505 flex justify-between">
                <span>ขนาด (Zoom)</span>
                <span className="font-mono">{deceasedAvatarScale.toFixed(2)}x</span>
              </label>
              <div className="flex items-center gap-3">
                <Button variant="ghost"
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, deceasedAvatarScale - 0.05);
                    setDeceasedAvatarScale(next);
                    setDeceasedAvatarX((x) => clampImagePan(x, next));
                    setDeceasedAvatarY((y) => clampImagePan(y, next));
                  }}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="ลดขนาด"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedAvatarScale}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value);
                    setDeceasedAvatarScale(next);
                    setDeceasedAvatarX((x) => clampImagePan(x, next));
                    setDeceasedAvatarY((y) => clampImagePan(y, next));
                  }}
                  className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-stone-250 rounded-lg appearance-none"
                />
                <Button variant="ghost"
                  type="button"
                  onClick={() => {
                    const next = Math.min(4, deceasedAvatarScale + 0.05);
                    setDeceasedAvatarScale(next);
                    setDeceasedAvatarX((x) => clampImagePan(x, next));
                    setDeceasedAvatarY((y) => clampImagePan(y, next));
                  }}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <Button variant="ghost"
                type="button"
                onClick={() => setDeceasedAvatarRotate((deceasedAvatarRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs font-bold text-stone-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>หมุนภาพ 90°</span>
              </Button>

              <Button variant="ghost"
                type="button"
                onClick={() => {
                  setDeceasedAvatarScale(1);
                  setDeceasedAvatarX(0);
                  setDeceasedAvatarY(0);
                  setDeceasedAvatarRotate(0);
                }}
                className="text-xs text-stone-505 hover:text-stone-900 transition cursor-pointer font-semibold"
              >
                รีเซ็ตค่าเริ่มต้น
              </Button>
            </div>

            {/* Save Crop button */}
            <Button variant="ghost"
              type="button"
              onClick={() => setIsCropModalOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>เสร็จสิ้นและนำไปใช้</span>
            </Button>
          </div>
        </div>
      )}

      {/* Custom confirm modal dialog */}
      {confirmOpen && confirmConfig && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-fade-in select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 p-6 flex flex-col gap-4 text-stone-850 text-left shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 font-sans">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{confirmConfig.title}</span>
              </h3>
              <p className="text-xs text-stone-500 leading-normal font-semibold">
                {confirmConfig.message}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost"
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmConfig(null);
                }}
                className="flex-1 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-250 text-stone-700 font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer"
              >
                ยกเลิก
              </Button>
              <Button variant="ghost"
                type="button"
                onClick={async () => {
                  setConfirmOpen(false);
                  const onConf = confirmConfig.onConfirm;
                  setConfirmConfig(null);
                  await onConf();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer"
              >
                ยืนยันการลบ
              </Button>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}

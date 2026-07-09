'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEditorStore } from '@/lib/editor/store';
import { TextElement } from '@/lib/editor/schema';
import { 
  ArrowLeft, Plus, Trash2, Info, Save, Settings, 
  MapPin, Clock, Droplets, Flame, Sparkles, Phone,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, 
  Lock, Unlock, BringToFront, SendToBack, Layers, FileText,
  Palette, RefreshCw, Eye, Calendar
} from 'lucide-react';
import ThaiDatePicker from '@/components/ThaiDatePicker';

const TIME_PRESETS = [
  "09:00 น.", "10:00 น.", "11:00 น.", "13:00 น.", "14:00 น.", "15:00 น.", 
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

const formatLongThaiDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const monthNamesLong = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const dayOfWeek = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNamesLong[date.getMonth()];
  const yearBuddhism = date.getFullYear() + 543;
  return `${dayOfWeek}ที่ ${day} ${month} ${yearBuddhism}`;
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

const EditorCanvas = dynamic(
  () => import('@/components/editor/EditorCanvas'),
  { ssr: false }
);

// Helper to measure actual text width in browser environment
const measureTextWidth = (text: string, fontSize: number, fontFamily: string, fontStyle: string) => {
  if (typeof window === 'undefined') return 300;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 300;
    
    // Normalize bold/italic style
    const weight = fontStyle.includes('bold') ? 'bold' : 'normal';
    const style = fontStyle.includes('italic') ? 'italic' : 'normal';
    
    context.font = `${style} ${weight} ${fontSize}px "${fontFamily}"`;
    
    const lines = text.split('\n');
    let maxWidth = 0;
    for (const line of lines) {
      const metrics = context.measureText(line);
      if (metrics.width > maxWidth) {
        maxWidth = metrics.width;
      }
    }
    return Math.ceil(maxWidth);
  } catch (e) {
    return 300;
  }
};

const getStyle3Config = (category: string) => {
  if (category === 'Couple' || category === 'Wedding') {
    return {
      name: 'ชมพูโรสพาสเทล (Soft Rose)',
      bg: '#FFF0F2',
      textColor: '#8C3A4F',
      subTextColor: '#A25F70',
      avatarBorder: '#FBC5CD',
    };
  }
  if (category === 'Pet Memorial') {
    return {
      name: 'เขียวเซจอบอุ่น (Warm Sage)',
      bg: '#F2F6F3',
      textColor: '#2C4A3E',
      subTextColor: '#4E7062',
      avatarBorder: '#C8D9CD',
    };
  }
  if (category === 'Family Legacy') {
    return {
      name: 'น้ำเงินกรมท่าทอง (Royal Navy)',
      bg: '#0D1F2D',
      textColor: '#E0A96D',
      subTextColor: '#B5834C',
      avatarBorder: '#2A445C',
    };
  }
  if (category === 'Friends') {
    return {
      name: 'เขียวมินต์สดใส (Mint Teal)',
      bg: '#EAF4F4',
      textColor: '#1E4848',
      subTextColor: '#3E7D7D',
      avatarBorder: '#A8D1D1',
    };
  }
  return {
    name: 'เทาสุภาพ (Charcoal Slate)',
    bg: '/Template-cards/charcoal_gold.png',
    textColor: '#C2A878',
    subTextColor: '#d6d3d1',
    avatarBorder: '#785A28',
  };
};

const getTextColors = (category: string, style: string) => {
  if (style !== 'CHARCOAL_SLATE') {
    return {
      main: style === 'WARM_CREAM' ? '#362c1a' : '#1c1917',
      sub: style === 'WARM_CREAM' ? '#7d6b4e' : '#57534e',
    };
  }
  const config = getStyle3Config(category);
  return {
    main: config.textColor,
    sub: config.subTextColor,
  };
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
  };
};

function EditorWorkspace() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || 'boonkrua-family';
  const [isLoading, setIsLoading] = useState(true);
  const [siteCategory, setSiteCategory] = useState('Memorial');
  const labels = getScheduleLabels(siteCategory);
  const [activeTab, setActiveTab] = useState<'info' | 'layers'>('info');



  const [abhidhammaStartDate, setAbhidhammaStartDate] = useState('');
  const [abhidhammaEndDate, setAbhidhammaEndDate] = useState('');
  const [isCustomWaterTime, setIsCustomWaterTime] = useState(false);
  const [isCustomAbhidhammaTime, setIsCustomAbhidhammaTime] = useState(false);
  const [isCustomCremationTime, setIsCustomCremationTime] = useState(false);

  const {
    elements,
    addElement,
    updateElement,
    removeElement,
    selectedId,
    background,
    setBackground,
    setElements,
    setSelectedId,
    formData,
    setFormData,
  } = useEditorStore();

  useEffect(() => {
    const fetchWebsiteConfig = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/tenant/list-mine');
        const data = await res.json();
        if (res.ok && data.websites && data.websites.length > 0) {
          const site = data.websites.find((w: any) => w.slug.toLowerCase() === slug.toLowerCase()) || data.websites[0];
          if (site) {
            if (site.status === 'PENDING_PAYMENT') {
              window.location.href = `/manage/payment?site=${site.id}`;
              return;
            }
            setSiteCategory(site.category || 'Memorial');
            const config = site.themeConfig || {};
            const ann = config.announcement || {};

            // 1. Initialize Form Fields state in Zustand
            const normalizeTimeValue = (timeStr: string) => {
              if (!timeStr) return '';
              let cleaned = timeStr.replace(/^เวลา\s*/, '').trim();
              cleaned = cleaned.replace(/(\d{1,2})\.(\d{2})/, '$1:$2');
              return cleaned;
            };

            const wTime = normalizeTimeValue(ann.waterTime || '');
            setIsCustomWaterTime(wTime !== '' && !TIME_PRESETS.includes(wTime));

            const aTime = normalizeTimeValue(ann.abhidhammaTime || '');
            setIsCustomAbhidhammaTime(aTime !== '' && !TIME_PRESETS.includes(aTime));

            const cTime = ann.cremationTime || '';
            setIsCustomCremationTime(cTime !== '' && !TIME_PRESETS.includes(cTime));

            setFormData({
              siteId: site.id,
              siteName: site.name || '',
              announcementActive: ann.active ?? true,
              announcementText: ann.text || '',
              announcementStyle: ann.style || 'ELEGANT_WHITE',
              announcementWaterDate: ann.waterDate || '',
              announcementWaterTime: wTime,
              announcementAbhidhammaDateRange: ann.abhidhammaDateRange || '',
              announcementAbhidhammaTime: aTime,
              announcementCremationDate: ann.cremationDate || '',
              announcementCremationTime: cTime,
              announcementTempleName: ann.templeName || '',
              announcementPavilion: ann.pavilion || '',
              announcementMapLink: ann.mapLink || '',
              announcementDressCode: ann.dressCode || '',
              announcementWreathPolicy: ann.wreathPolicy || 'NORMAL',
              announcementContactPhone: ann.contactPhone || '',
              subjects: config.subjects || [],
            });

            // 2. Determine background color
            let bg = '#FAF6EE'; // WARM_CREAM default
            if (ann.style === 'CHARCOAL_SLATE') {
              bg = getStyle3Config(config.category || 'Memorial').bg;
            } else if (ann.style === 'ELEGANT_WHITE') {
              bg = '#ffffff';
            }

            if (ann.canvasBg) {
              if (ann.canvasBg === '#1c1917' && ann.style === 'CHARCOAL_SLATE') {
                bg = getStyle3Config(config.category || 'Memorial').bg;
              } else {
                bg = ann.canvasBg;
              }
            }
            setBackground(bg);

            // 3. Load Saved elements or Generate defaults
            const fontFamily = config.fontFamily || 'LINE Seed Sans TH';
            let initialElements: any[] = [];

            if (ann.canvasElements && Array.isArray(ann.canvasElements) && ann.canvasElements.length > 0) {
              initialElements = ann.canvasElements;
            } else {
              // Generate dynamic text elements from inputs as default fallback
              const colors = getTextColors(config.category || 'Memorial', ann.style || 'WARM_CREAM');
              let y = 60;
              
              const addDynamicTextElement = (id: string, text: string, fontSize: number, fontStyle: 'normal' | 'bold', fill: string, opacity = 1) => {
                const textWidth = measureTextWidth(text, fontSize, fontFamily, fontStyle);
                const finalWidth = textWidth + 10;
                const xPos = Math.max(20, (600 - finalWidth) / 2);

                initialElements.push({
                  id,
                  type: 'text',
                  text,
                  x: xPos,
                  y: y,
                  rotation: 0,
                  opacity,
                  zIndex: initialElements.length + 1,
                  locked: false,
                  fontSize,
                  fontFamily,
                  fill,
                  align: 'center',
                  fontStyle,
                  width: finalWidth,
                });

                const lines = text.split('\n').length;
                y += (lines * (fontSize + 6)) + 20;
              };

              addDynamicTextElement(
                'header-text', 
                labels.invitePlaceholder, 
                14, 
                'normal', 
                colors.sub,
                0.85
              );

              addDynamicTextElement(
                'name-text', 
                site.name || 'คุณพ่อบุญเครือ เขมาภิรัตน์', 
                26, 
                'bold', 
                colors.main
              );

              if (ann.text) {
                addDynamicTextElement(
                  'intro-text', 
                  ann.text, 
                  13, 
                  'normal', 
                  colors.sub,
                  0.9
                );
              }

              if (ann.waterDate) {
                addDynamicTextElement(
                  'water-text', 
                  `${labels.item1.replace(/^\d+\.\s*/, '')}: ${ann.waterDate} ${ann.waterTime ? `(${ann.waterTime})` : ''}`, 
                  13, 
                  'normal', 
                  colors.main
                );
              }

              if (ann.abhidhammaDateRange) {
                addDynamicTextElement(
                  'abhidhamma-text', 
                  `${labels.item2.replace(/^\d+\.\s*/, '')}: ${ann.abhidhammaDateRange} ${ann.abhidhammaTime ? `(${ann.abhidhammaTime})` : ''}`, 
                  13, 
                  'normal', 
                  colors.main
                );
              }

              if (ann.cremationDate) {
                addDynamicTextElement(
                  'cremation-text', 
                  `${labels.item3.replace(/^\d+\.\s*/, '')}: ${ann.cremationDate} ${ann.cremationTime ? `(${ann.cremationTime})` : ''}`, 
                  13, 
                  'normal', 
                  colors.main
                );
              }

              if (ann.templeName) {
                addDynamicTextElement(
                  'venue-text', 
                  `${labels.venueLabel.replace(/\s*\(VENUE\)/i, '')}: ${ann.templeName} ${ann.pavilion ? `(${ann.pavilion})` : ''}`, 
                  13, 
                  'bold', 
                  colors.main
                );
              }

              let guidelineStr = '';
              if (ann.dressCode) guidelineStr += `การแต่งกาย: ${ann.dressCode}`;
              if (ann.wreathPolicy) {
                const policies: any = (siteCategory === 'Couple' || siteCategory === 'Wedding') ? {
                  'NORMAL': 'ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ',
                  'NO_FLOWERS': 'ขออภัย งดรับของขวัญ (เน้นการร่วมอวยพรแทน)',
                  'DONATION_ONLY': 'ขออภัย งดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)',
                  'NO_WREATH': 'ขออภัย งดรับซองและของขวัญทุกประเภท',
                } : {
                  'NORMAL': 'เปิดรับพวงหรีดตามปกติ',
                  'NO_FLOWERS': 'งดรับพวงหรีดดอกไม้สด (รักษ์โลก)',
                  'DONATION_ONLY': 'งดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)',
                  'NO_WREATH': 'งดรับพวงหรีดทุกประเภท',
                };
                if (guidelineStr) guidelineStr += '\n';
                const policyLabel = (siteCategory === 'Couple' || siteCategory === 'Wedding') ? 'ของขวัญ/ซอง' : 'พวงหรีด';
                guidelineStr += `${policyLabel}: ${policies[ann.wreathPolicy] || policies.NORMAL}`;
              }
              if (ann.contactPhone) {
                if (guidelineStr) guidelineStr += '\n';
                guidelineStr += `ติดต่อประสานงาน: ${ann.contactPhone}`;
              }

              if (guidelineStr) {
                addDynamicTextElement(
                  'guidelines-text', 
                  guidelineStr, 
                  11, 
                  'normal', 
                  colors.sub,
                  0.85
                );
              }
            }

            setElements(initialElements);
          }
        }
      } catch (e) {
        console.error('Failed to load website announcement configuration:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWebsiteConfig();
  }, [slug, setElements, setBackground, setFormData]);

  // Synchronize form fields changes to canvas text elements
  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData({ [field]: value });

    if (field === 'siteName') {
      const text = value || 'ชื่อผู้ล่วงลับ';
      const el = elements.find((e) => e.id === 'name-text');
      if (el && el.type === 'text') {
        updateElement('name-text', { text, width: measureTextWidth(text, el.fontSize, el.fontFamily, el.fontStyle) + 10 });
      }
    } else if (field === 'announcementText') {
      const text = value || '';
      const el = elements.find((e) => e.id === 'intro-text');
      if (el && el.type === 'text') {
        updateElement('intro-text', { text, width: measureTextWidth(text, el.fontSize, el.fontFamily, el.fontStyle) + 10 });
      }
    } else if (field === 'announcementWaterDate' || field === 'announcementWaterTime') {
      const date = field === 'announcementWaterDate' ? value : formData.announcementWaterDate;
      const time = field === 'announcementWaterTime' ? value : formData.announcementWaterTime;
      const text = `พิธีรดน้ำศพ: ${date} ${time ? `(${time})` : ''}`;
      const el = elements.find((e) => e.id === 'water-text');
      if (el && el.type === 'text') {
        updateElement('water-text', { text, width: measureTextWidth(text, el.fontSize, el.fontFamily, el.fontStyle) + 10 });
      }
    } else if (field === 'announcementAbhidhammaDateRange' || field === 'announcementAbhidhammaTime') {
      const range = field === 'announcementAbhidhammaDateRange' ? value : formData.announcementAbhidhammaDateRange;
      const time = field === 'announcementAbhidhammaTime' ? value : formData.announcementAbhidhammaTime;
      const text = `พิธีสวดพระอภิธรรม: ${range} ${time ? `(${time})` : ''}`;
      const el = elements.find((e) => e.id === 'abhidhamma-text');
      if (el && el.type === 'text') {
        updateElement('abhidhamma-text', { text, width: measureTextWidth(text, el.fontSize, el.fontFamily, el.fontStyle) + 10 });
      }
    } else if (field === 'announcementCremationDate' || field === 'announcementCremationTime') {
      const date = field === 'announcementCremationDate' ? value : formData.announcementCremationDate;
      const time = field === 'announcementCremationTime' ? value : formData.announcementCremationTime;
      const text = `พิธีฌาปนกิจ: ${date} ${time ? `(${time})` : ''}`;
      const el = elements.find((e) => e.id === 'cremation-text');
      if (el && el.type === 'text') {
        updateElement('cremation-text', { text, width: measureTextWidth(text, el.fontSize, el.fontFamily, el.fontStyle) + 10 });
      }
    } else if (field === 'announcementTempleName' || field === 'announcementPavilion') {
      const temple = field === 'announcementTempleName' ? value : formData.announcementTempleName;
      const pavilion = field === 'announcementPavilion' ? value : formData.announcementPavilion;
      const venueHeader = labels.venueLabel.replace(/\s*\(VENUE\)/i, '');
      const text = `${venueHeader}: ${temple} ${pavilion ? `(${pavilion})` : ''}`;
      const el = elements.find((e) => e.id === 'venue-text');
      if (el && el.type === 'text') {
        updateElement('venue-text', { text, width: measureTextWidth(text, el.fontSize, el.fontFamily, el.fontStyle) + 10 });
      }
    } else if (field === 'announcementDressCode' || field === 'announcementWreathPolicy' || field === 'announcementContactPhone') {
      const dress = field === 'announcementDressCode' ? value : formData.announcementDressCode;
      const policy = field === 'announcementWreathPolicy' ? value : formData.announcementWreathPolicy;
      const phone = field === 'announcementContactPhone' ? value : formData.announcementContactPhone;

      let guidelineStr = '';
      if (dress) guidelineStr += `การแต่งกาย: ${dress}`;
      if (policy) {
        const policies: any = (siteCategory === 'Couple' || siteCategory === 'Wedding') ? {
          'NORMAL': 'ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ',
          'NO_FLOWERS': 'ขออภัย งดรับของขวัญ (เน้นการร่วมอวยพรแทน)',
          'DONATION_ONLY': 'ขออภัย งดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)',
          'NO_WREATH': 'ขออภัย งดรับซองและของขวัญทุกประเภท',
        } : {
          'NORMAL': 'เปิดรับพวงหรีดตามปกติ',
          'NO_FLOWERS': 'งดรับพวงหรีดดอกไม้สด (รักษ์โลก)',
          'DONATION_ONLY': 'งดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)',
          'NO_WREATH': 'งดรับพวงหรีดทุกประเภท',
        };
        if (guidelineStr) guidelineStr += '\n';
        const policyLabel = (siteCategory === 'Couple' || siteCategory === 'Wedding') ? 'ของขวัญ/ซอง' : 'พวงหรีด';
        guidelineStr += `${policyLabel}: ${policies[policy] || policies.NORMAL}`;
      }
      if (phone) {
        if (guidelineStr) guidelineStr += '\n';
        guidelineStr += `ติดต่อประสานงาน: ${phone}`;
      }

      const el = elements.find((e) => e.id === 'guidelines-text');
      if (el && el.type === 'text') {
        updateElement('guidelines-text', { text: guidelineStr, width: measureTextWidth(guidelineStr, el.fontSize, el.fontFamily, el.fontStyle) + 10 });
      }
    } else if (field === 'announcementStyle') {
      let bg = '#FAF6EE';
      if (value === 'CHARCOAL_SLATE') {
        bg = getStyle3Config(siteCategory).bg;
      } else if (value === 'ELEGANT_WHITE') {
        bg = '#ffffff';
      }
      setBackground(bg);

      const colors = getTextColors(siteCategory, value);
      elements.forEach((el) => {
        if (el.id === 'header-text' || el.id === 'guidelines-text' || el.id === 'intro-text') {
          updateElement(el.id, { fill: colors.sub });
        } else if (['name-text', 'water-text', 'abhidhamma-text', 'cremation-text', 'venue-text'].includes(el.id)) {
          updateElement(el.id, { fill: colors.main });
        }
      });
    }
  };

  const handleAddText = () => {
    const id = 'text-' + Date.now();
    const newText = 'ข้อความใหม่ (ดับเบิ้ลคลิกเพื่อแก้ไข)';
    
    // Type-safe font family retrieval
    const firstTextElement = elements.find((el) => el.type === 'text') as TextElement | undefined;
    const defaultFont = firstTextElement?.fontFamily || 'LINE Seed Sans TH';
    
    const textWidth = measureTextWidth(newText, 16, defaultFont, 'normal');
    
    addElement({
      id,
      type: 'text',
      text: newText,
      x: 150,
      y: 350,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
      locked: false,
      fontSize: 16,
      fontFamily: defaultFont,
      fill: formData.announcementStyle === 'CHARCOAL_SLATE' ? '#C2A878' : '#362c1a',
      align: 'center',
      fontStyle: 'normal',
      width: textWidth + 10,
    });
    setSelectedId(id);
  };

  const handleBringToFront = () => {
    if (!selectedId) return;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    updateElement(selectedId, { zIndex: maxZ + 1 });
    const updated = useEditorStore.getState().elements;
    setElements(updated);
  };

  const handleSendToBack = () => {
    if (!selectedId) return;
    const minZ = elements.reduce((min, el) => Math.min(min, el.zIndex), 0);
    updateElement(selectedId, { zIndex: minZ - 1 });
    const updated = useEditorStore.getState().elements;
    setElements(updated);
  };

  const handleRemoveSelected = () => {
    if (selectedId) {
      removeElement(selectedId);
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId) as TextElement | undefined;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 bg-stone-50">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-emerald-600 animate-spin mb-3" />
        <p className="text-sm">กำลังโหลดข้อมูลและจัดเตรียม Canvas...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-stone-100">
      
      {/* 1. Left Sidebar: Card Settings Form & Layers */}
      <aside className="w-full lg:w-96 bg-white border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col shadow-xs overflow-hidden shrink-0 z-10">
        <div className="flex border-b border-stone-100 bg-stone-50/50 p-2 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition select-none cursor-pointer ${
              activeTab === 'info' 
                ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/60' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>กรอกข้อมูลกำหนดการ</span>
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition select-none cursor-pointer ${
              activeTab === 'layers' 
                ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/60' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>องค์ประกอบเลเยอร์</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'info' ? (
            <div className="space-y-4">
              
              {/* Toggle digital card */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl flex justify-between items-center">
                <div className="space-y-0.5 pr-2">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    <span>แสดงประกาศบนหน้าเว็บ</span>
                  </h4>
                  <p className="text-[10px] text-stone-500 leading-normal">เปิดให้แขกเข้าชมกำหนดการออนไลน์ได้</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.announcementActive}
                  onChange={(e) => handleFieldChange('announcementActive', e.target.checked)}
                  className="w-5 h-5 accent-emerald-650 cursor-pointer rounded"
                />
              </div>

              {/* Card 1: General & Venue */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5 shadow-sm">
                <h4 className="text-xs font-bold text-emerald-850 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. ข้อมูลทั่วไปและสถานที่จัดงาน</span>
                </h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 block">ข้อความเกริ่นนำแจ้งข่าว</label>
                  <textarea 
                    value={formData.announcementText} 
                    onChange={(e) => handleFieldChange('announcementText', e.target.value)} 
                    rows={2}
                    placeholder="เช่น ด้วยความอาลัยยิ่ง..."
                    className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 block">
                    {siteCategory === 'Couple' || siteCategory === 'Wedding'
                      ? 'ชื่อคู่รัก / ชื่อเว็บไซต์'
                      : siteCategory === 'Pet Memorial'
                      ? 'ชื่อสัตว์เลี้ยง'
                      : 'ชื่อผู้ล่วงลับ'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.siteName} 
                    onChange={(e) => handleFieldChange('siteName', e.target.value)} 
                    placeholder={
                      siteCategory === 'Couple' || siteCategory === 'Wedding'
                        ? 'ระบุชื่อคู่รัก'
                        : siteCategory === 'Pet Memorial'
                        ? 'ระบุชื่อสัตว์เลี้ยง'
                        : 'ระบุชื่อผู้ล่วงลับ'
                    }
                    className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                  />
                </div>

                {/* Dynamic Subject List Editor (BR003 / Phase 2 consult: Alive/Deceased toggle) */}
                <div className="space-y-3 pt-2.5 border-t border-stone-100">
                  <div className="flex justify-between items-center select-none">
                    <span className="text-[10px] font-bold text-stone-600">
                      {siteCategory === 'Couple' || siteCategory === 'Wedding' ? 'รายชื่อคู่รัก' :
                       siteCategory === 'Pet Memorial' ? 'รายชื่อสัตว์เลี้ยง' :
                       siteCategory === 'Family Legacy' ? 'รายชื่อผู้ดูแล/บรรพบุรุษ' :
                       'รายชื่อผู้ล่วงลับ'}
                    </span>
                    {!(siteCategory === 'Couple' || siteCategory === 'Wedding') && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextSubjects = [...(formData.subjects || [])];
                          nextSubjects.push({
                            name: '',
                            birthDate: null,
                            deathDate: null,
                            birthYearOnly: false,
                            deathYearOnly: false,
                            birthYear: null,
                            deathYear: null,
                            isAlive: false
                          });
                          handleFieldChange('subjects', nextSubjects);
                        }}
                        className="text-[9px] font-bold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1 cursor-pointer border-0 bg-transparent"
                      >
                        <Plus className="w-3 h-3" />
                        <span>เพิ่มรายชื่อ</span>
                      </button>
                    )}
                  </div>

                  {(formData.subjects || []).map((sub: any, index: number) => {
                    const yearsList = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i);
                    
                    return (
                      <div key={index} className="p-3 bg-stone-50/50 rounded-2xl border border-stone-200 space-y-2.5 relative">
                        {/* Remove button */}
                        {!(siteCategory === 'Couple' || siteCategory === 'Wedding') && (formData.subjects || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextSubjects = (formData.subjects || []).filter((_, idx) => idx !== index);
                              handleFieldChange('subjects', nextSubjects);
                            }}
                            className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer border-0 bg-transparent"
                            title="ลบรายชื่อ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Name Input */}
                        <div className="space-y-1 pr-6">
                          <label className="text-[9px] font-bold text-stone-500 block">ชื่อ</label>
                          <input
                            type="text"
                            value={sub.name || ''}
                            onChange={(e) => {
                              const nextSubjects = [...(formData.subjects || [])];
                              nextSubjects[index] = { ...nextSubjects[index], name: e.target.value };
                              handleFieldChange('subjects', nextSubjects);
                            }}
                            placeholder="ระบุชื่อ..."
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Still Alive checkbox for Pet and Family Legacy */}
                        {(siteCategory === 'Pet Memorial' || siteCategory === 'Family Legacy') && (
                          <label className="flex items-center gap-1.5 cursor-pointer select-none py-0.5">
                            <input
                              type="checkbox"
                              checked={sub.isAlive || false}
                              onChange={(e) => {
                                const nextSubjects = [...(formData.subjects || [])];
                                const checked = e.target.checked;
                                nextSubjects[index] = {
                                  ...nextSubjects[index],
                                  isAlive: checked,
                                  deathDate: checked ? null : nextSubjects[index].deathDate,
                                  deathYear: checked ? null : nextSubjects[index].deathYear,
                                  deathYearOnly: checked ? false : nextSubjects[index].deathYearOnly,
                                };
                                handleFieldChange('subjects', nextSubjects);
                              }}
                              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-emerald-800">
                              {siteCategory === 'Pet Memorial' ? 'น้องยังมีชีวิตอยู่' : 'ท่านยังมีชีวิตอยู่'}
                            </span>
                          </label>
                        )}

                        {/* Dates grid */}
                        <div className={`grid gap-3.5 ${sub.isAlive ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {/* Birth Date */}
                          <div className="space-y-1">
                            <span className="text-[9px] text-stone-500 font-semibold block">วันเกิด</span>
                            {sub.birthYearOnly ? (
                              <select
                                value={sub.birthYear || ''}
                                onChange={(e) => {
                                  const nextSubjects = [...(formData.subjects || [])];
                                  const val = e.target.value ? parseInt(e.target.value, 10) : null;
                                  nextSubjects[index] = {
                                    ...nextSubjects[index],
                                    birthYear: val,
                                    birthDate: val ? new Date(val, 0, 1) : null
                                  };
                                  handleFieldChange('subjects', nextSubjects);
                                }}
                                className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] focus:outline-none cursor-pointer focus:border-emerald-500"
                              >
                                <option value="">เลือกปี พ.ศ.</option>
                                {yearsList.map((y) => (
                                  <option key={y} value={y}>พ.ศ. {y + 543}</option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex gap-1 items-center relative">
                                <input
                                  type="text"
                                  readOnly
                                  value={sub.birthDate ? new Date(sub.birthDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                  placeholder="เลือกวันเกิด"
                                  className="flex-1 px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] focus:outline-none min-w-0"
                                />
                                <ThaiDatePicker
                                  buttonClassName="p-1 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer"
                                  iconClassName="w-3 h-3"
                                  onChange={(val) => {
                                    const nextSubjects = [...(formData.subjects || [])];
                                    nextSubjects[index] = { ...nextSubjects[index], birthDate: val };
                                    handleFieldChange('subjects', nextSubjects);
                                  }}
                                />
                              </div>
                            )}
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                  type="checkbox"
                                  checked={sub.birthYearOnly || false}
                                  onChange={(e) => {
                                    const nextSubjects = [...(formData.subjects || [])];
                                    const checked = e.target.checked;
                                    const bDateObj = sub.birthDate ? new Date(sub.birthDate) : null;
                                    const initialYear = bDateObj ? bDateObj.getFullYear() : new Date().getFullYear();
                                    nextSubjects[index] = {
                                      ...nextSubjects[index],
                                      birthYearOnly: checked,
                                      birthYear: checked ? initialYear : null,
                                      birthDate: checked ? new Date(initialYear, 0, 1) : null
                                    };
                                    handleFieldChange('subjects', nextSubjects);
                                  }}
                                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-2.5 h-2.5 cursor-pointer"
                              />
                              <span className="text-[8px] text-stone-400 font-semibold">ระบุเฉพาะปี พ.ศ.</span>
                            </label>
                          </div>

                          {/* Death Date */}
                          {!sub.isAlive && (
                            <div className="space-y-1">
                              <span className="text-[9px] text-stone-550 font-semibold block">วันเสียชีวิต</span>
                              {sub.deathYearOnly ? (
                                <select
                                  value={sub.deathYear || ''}
                                  onChange={(e) => {
                                    const nextSubjects = [...(formData.subjects || [])];
                                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                                    nextSubjects[index] = {
                                      ...nextSubjects[index],
                                      deathYear: val,
                                      deathDate: val ? new Date(val, 0, 1) : null
                                    };
                                    handleFieldChange('subjects', nextSubjects);
                                  }}
                                  className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] focus:outline-none cursor-pointer focus:border-emerald-500"
                                >
                                  <option value="">เลือกปี พ.ศ.</option>
                                  {yearsList.map((y) => (
                                    <option key={y} value={y}>พ.ศ. {y + 543}</option>
                                  ))}
                                </select>
                              ) : (
                                <div className="flex gap-1 items-center relative">
                                  <input
                                    type="text"
                                    readOnly
                                    value={sub.deathDate ? new Date(sub.deathDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                    placeholder="เลือกวันเสียชีวิต"
                                    className="flex-1 px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] focus:outline-none min-w-0"
                                  />
                                  <ThaiDatePicker
                                    buttonClassName="p-1 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer"
                                    iconClassName="w-3 h-3"
                                    onChange={(val) => {
                                      const nextSubjects = [...(formData.subjects || [])];
                                      nextSubjects[index] = { ...nextSubjects[index], deathDate: val };
                                      handleFieldChange('subjects', nextSubjects);
                                    }}
                                  />
                                </div>
                              )}
                              <label className="flex items-center gap-1 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={sub.deathYearOnly || false}
                                  onChange={(e) => {
                                    const nextSubjects = [...(formData.subjects || [])];
                                    const checked = e.target.checked;
                                    const dDateObj = sub.deathDate ? new Date(sub.deathDate) : null;
                                    const initialYear = dDateObj ? dDateObj.getFullYear() : new Date().getFullYear();
                                    nextSubjects[index] = {
                                      ...nextSubjects[index],
                                      deathYearOnly: checked,
                                      deathYear: checked ? initialYear : null,
                                      deathDate: checked ? new Date(initialYear, 0, 1) : null
                                    };
                                    handleFieldChange('subjects', nextSubjects);
                                  }}
                                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-2.5 h-2.5 cursor-pointer"
                                />
                                <span className="text-[8px] text-stone-400 font-semibold">ระบุเฉพาะปี พ.ศ.</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">
                      {siteCategory === 'Couple' || siteCategory === 'Wedding' ? 'สถานที่จัดงาน' : 'ชื่อวัด'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.announcementTempleName} 
                      onChange={(e) => handleFieldChange('announcementTempleName', e.target.value)} 
                      placeholder={
                        siteCategory === 'Couple' || siteCategory === 'Wedding'
                          ? 'เช่น โรงแรมสยามเคมปินสกี้'
                          : 'เช่น วัดมกุฏกษัตริยาราม'
                      }
                      className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">
                      {labels.pavilionLabel}
                    </label>
                    <input 
                      type="text" 
                      value={formData.announcementPavilion} 
                      onChange={(e) => handleFieldChange('announcementPavilion', e.target.value)} 
                      placeholder={labels.pavilionPlaceholder}
                      className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">สไตล์การ์ดประกาศ</label>
                    <select 
                      value={formData.announcementStyle} 
                      onChange={(e) => handleFieldChange('announcementStyle', e.target.value)} 
                      className="w-full px-2.5 py-1.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                    >
                      <option value="ELEGANT_WHITE">ขาวหรูหรา (Elegant White)</option>
                      <option value="CHARCOAL_SLATE">{getStyle3Config(siteCategory).name}</option>
                      <option value="WARM_CREAM">ครีมทอง (Warm Cream)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">แผนที่ Google Maps</label>
                    <input 
                      type="text" 
                      value={formData.announcementMapLink} 
                      onChange={(e) => handleFieldChange('announcementMapLink', e.target.value)} 
                      placeholder="วางลิงก์นำทางจาก Google Maps"
                      className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Schedules */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold text-emerald-850 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. วันและเวลากำหนดการพิธี</span>
                </h4>

                 {/* 1. Water Bathing */}
                <div className="p-2.5 bg-stone-50/50 rounded-xl border border-stone-150 space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-700 flex items-center gap-1 select-none">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{labels.item1.replace(/^\d+\.\s*/, '')}</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-1.5 items-center relative">
                      <input 
                        type="text" 
                        value={formData.announcementWaterDate} 
                        onChange={(e) => handleFieldChange('announcementWaterDate', e.target.value)} 
                        placeholder={labels.item1Placeholder}
                        className="flex-1 px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500 min-w-0"
                      />
                      <ThaiDatePicker 
                        buttonClassName="p-1 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer"
                        iconClassName="w-3 h-3"
                        onChange={(val) => {
                          if (val) {
                            handleFieldChange('announcementWaterDate', formatShortThaiDate(val));
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <select
                        value={isCustomWaterTime ? 'CUSTOM' : formData.announcementWaterTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'CUSTOM') {
                            setIsCustomWaterTime(true);
                            if (!formData.announcementWaterTime || TIME_PRESETS.includes(formData.announcementWaterTime)) {
                              handleFieldChange('announcementWaterTime', '16:00 น.');
                            }
                          } else {
                            setIsCustomWaterTime(false);
                            handleFieldChange('announcementWaterTime', val);
                          }
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">เลือกเวลา</option>
                        {TIME_PRESETS.map((preset) => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                        <option value="CUSTOM">พิมพ์ระบุเวลาเอง...</option>
                      </select>
                      {isCustomWaterTime && (
                        <input 
                          type="text" 
                          value={formData.announcementWaterTime} 
                          onChange={(e) => handleFieldChange('announcementWaterTime', e.target.value)} 
                          placeholder="ระบุเวลา เช่น 16:15 น."
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Abhidhamma */}
                <div className="p-2.5 bg-stone-50/50 rounded-xl border border-stone-150 space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-700 flex items-center gap-1 select-none">
                    <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{labels.item2.replace(/^\d+\.\s*/, '')}</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-1.5 items-center relative">
                      <input 
                        type="text" 
                        value={formData.announcementAbhidhammaDateRange} 
                        onChange={(e) => handleFieldChange('announcementAbhidhammaDateRange', e.target.value)} 
                        placeholder={labels.item2Placeholder}
                        className="flex-1 px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500 min-w-0"
                      />
                      <ThaiDatePicker 
                        mode="range"
                        buttonClassName="p-1 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer"
                        iconClassName="w-3 h-3"
                        rangeStart={abhidhammaStartDate}
                        rangeEnd={abhidhammaEndDate}
                        onChangeRange={(start, end) => {
                          setAbhidhammaStartDate(start);
                          setAbhidhammaEndDate(end);
                          if (start) {
                            const formatted = formatThaiDateRange(start, end);
                            handleFieldChange('announcementAbhidhammaDateRange', formatted);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <select
                        value={isCustomAbhidhammaTime ? 'CUSTOM' : formData.announcementAbhidhammaTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'CUSTOM') {
                            setIsCustomAbhidhammaTime(true);
                            if (!formData.announcementAbhidhammaTime || TIME_PRESETS.includes(formData.announcementAbhidhammaTime)) {
                              handleFieldChange('announcementAbhidhammaTime', '19:00 น.');
                            }
                          } else {
                            setIsCustomAbhidhammaTime(false);
                            handleFieldChange('announcementAbhidhammaTime', val);
                          }
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">เลือกเวลา</option>
                        {TIME_PRESETS.map((preset) => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                        <option value="CUSTOM">พิมพ์ระบุเวลาเอง...</option>
                      </select>
                      {isCustomAbhidhammaTime && (
                        <input 
                          type="text" 
                          value={formData.announcementAbhidhammaTime} 
                          onChange={(e) => handleFieldChange('announcementAbhidhammaTime', e.target.value)} 
                          placeholder={labels.item2TimePlaceholder}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-555"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Cremation */}
                <div className="p-2.5 bg-stone-50/50 rounded-xl border border-stone-150 space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-700 flex items-center gap-1 select-none">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{labels.item3.replace(/^\d+\.\s*/, '')}</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-1.5 items-center relative">
                      <input 
                        type="text" 
                        value={formData.announcementCremationDate} 
                        onChange={(e) => handleFieldChange('announcementCremationDate', e.target.value)} 
                        placeholder={labels.item3Placeholder}
                        className="flex-1 px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500 min-w-0"
                      />
                      <ThaiDatePicker 
                        buttonClassName="p-1 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer"
                        iconClassName="w-3 h-3"
                        onChange={(val) => {
                          if (val) {
                            handleFieldChange('announcementCremationDate', formatLongThaiDate(val));
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <select
                        value={isCustomCremationTime ? 'CUSTOM' : formData.announcementCremationTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'CUSTOM') {
                            setIsCustomCremationTime(true);
                            if (!formData.announcementCremationTime || TIME_PRESETS.includes(formData.announcementCremationTime)) {
                              handleFieldChange('announcementCremationTime', '16:00 น.');
                            }
                          } else {
                            setIsCustomCremationTime(false);
                            handleFieldChange('announcementCremationTime', val);
                          }
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">เลือกเวลา</option>
                        {TIME_PRESETS.map((preset) => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                        <option value="CUSTOM">พิมพ์ระบุเวลาเอง...</option>
                      </select>
                      {isCustomCremationTime && (
                        <input 
                          type="text" 
                          value={formData.announcementCremationTime} 
                          onChange={(e) => handleFieldChange('announcementCremationTime', e.target.value)} 
                          placeholder="ระบุเวลา เช่น 16:15 น."
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Guidelines */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5 shadow-sm">
                <h4 className="text-xs font-bold text-emerald-850 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. ข้อแนะนำสำหรับแขกผู้เข้าร่วมงาน</span>
                </h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 block">การแต่งกายเข้าร่วมงาน</label>
                  <input 
                    type="text" 
                    value={formData.announcementDressCode} 
                    onChange={(e) => handleFieldChange('announcementDressCode', e.target.value)} 
                    placeholder={
                      siteCategory === 'Couple' || siteCategory === 'Wedding'
                        ? 'เช่น ธีมสีชมพู/พาสเทล หรือ ตามความสะดวก'
                        : 'เช่น ชุดสุภาพโทนสีดำหรือขาว'
                    }
                    className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 block">
                    {siteCategory === 'Couple' || siteCategory === 'Wedding' ? 'นโยบายการรับซอง/ของขวัญ' : 'นโยบายพวงหรีด'}
                  </label>
                  <select 
                    value={formData.announcementWreathPolicy} 
                    onChange={(e) => handleFieldChange('announcementWreathPolicy', e.target.value)} 
                    className="w-full px-2.5 py-1.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                  >
                    {siteCategory === 'Couple' || siteCategory === 'Wedding' ? (
                      <>
                        <option value="NORMAL">ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ</option>
                        <option value="NO_FLOWERS">ขออภัย งดรับของขวัญ (เน้นการร่วมแสดงความยินดีและอวยพรแทน)</option>
                        <option value="DONATION_ONLY">ขออภัย งดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)</option>
                        <option value="NO_WREATH">ขออภัย งดรับซองและของขวัญทุกประเภท</option>
                      </>
                    ) : (
                      <>
                        <option value="NORMAL">เปิดรับพวงหรีดตามปกติ</option>
                        <option value="NO_FLOWERS">งดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)</option>
                        <option value="DONATION_ONLY">งดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)</option>
                        <option value="NO_WREATH">งดรับพวงหรีดทุกประเภท</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 block">เบอร์ติดต่อประสานงานเจ้าภาพ</label>
                  <input 
                    type="text" 
                    value={formData.announcementContactPhone} 
                    onChange={(e) => handleFieldChange('announcementContactPhone', e.target.value)} 
                    placeholder="คุณสมชาย 081-234-5678"
                    className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500/80 transition"
                  />
                </div>
              </div>

            </div>
          ) : (
            // Layers tab
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">เลเยอร์อักษรบนการ์ด ({elements.length})</span>
                <button
                  onClick={handleAddText}
                  className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200/55 transition flex items-center gap-1 select-none cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>เพิ่มข้อความอิสระ</span>
                </button>
              </div>

              <div className="space-y-2">
                {elements.map((el) => {
                  const isSel = el.id === selectedId;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`p-3 rounded-xl border text-xs flex justify-between items-center transition cursor-pointer select-none ${
                        isSel 
                          ? 'bg-emerald-50/40 border-emerald-300 text-emerald-950 font-bold' 
                          : 'bg-stone-50/50 border-stone-150 text-stone-750 hover:bg-stone-100/50'
                      }`}
                    >
                      <span className="truncate pr-2">{el.type === 'text' ? (el as TextElement).text : 'รูปภาพ'}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateElement(el.id, { locked: !el.locked });
                          }}
                          className={`p-1 hover:bg-stone-200/50 rounded transition ${el.locked ? 'text-amber-600' : 'text-stone-400'}`}
                        >
                          {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeElement(el.id);
                          }}
                          className="p-1 hover:bg-stone-200/50 rounded transition text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-[10px] text-stone-500 leading-normal">
                <p className="font-bold text-stone-600 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>วิธีจัดระเบียบเลเยอร์:</span>
                </p>
                <p>• คลิกเลือกเลเยอร์ในหน้านี้ หรือเลือกกล่องข้อความบนภาพการ์ดโดยตรง</p>
                <p>• ใช้เครื่องมือสลับการล็อก (Lock) เพื่อล็อกตำแหน่ง ไม่ให้ลากขยับเคลื่อนที่ได้</p>
                <p>• สามารถจัดลำดับการทับซ้อน (Z-Index) ได้ในแผงควบคุมขวา</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Center: Canvas Display Area */}
      <main className="flex-1 p-6 lg:p-8 flex items-center justify-center bg-stone-100 overflow-y-auto z-0">
        <div className="max-w-2xl w-full flex flex-col items-center">
          
          <div className="mb-4 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-stone-200 inline-flex items-center gap-1.5 select-none shadow-2xs">
              <Settings className="w-3.5 h-3.5 animate-spin-slow text-emerald-650" />
              <span>ดับเบิ้ลคลิก (Double-Click) บนข้อความเพื่อพิมพ์แก้ไขบนการ์ดได้โดยตรง</span>
            </span>
          </div>

          <div className="w-full relative flex justify-center">
            <EditorCanvas />
          </div>
        </div>
      </main>

      {/* 3. Right Sidebar: Properties & Style Panel */}
      <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-stone-200 p-5 flex flex-col shadow-xs shrink-0 overflow-y-auto z-10">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-3.5 mb-4">คุณสมบัติอักษร (Properties)</h3>

        {selectedElement ? (
          <div className="space-y-4.5 animate-fade-in text-xs">
            
            {/* Raw edit textarea */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-600 block">เนื้อหาข้อความ</label>
              <textarea
                value={selectedElement.text}
                onChange={(e) => {
                  const text = e.target.value;
                  updateElement(selectedElement.id, { 
                    text,
                    width: measureTextWidth(text, selectedElement.fontSize, selectedElement.fontFamily, selectedElement.fontStyle) + 10
                  });
                }}
                rows={3}
                className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 transition"
              />
            </div>

            {/* Font Family Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-600 block">แบบตัวอักษร (Font Family)</label>
              <select
                value={selectedElement.fontFamily}
                onChange={(e) => {
                  const fontFamily = e.target.value;
                  updateElement(selectedElement.id, { 
                    fontFamily,
                    width: measureTextWidth(selectedElement.text, selectedElement.fontSize, fontFamily, selectedElement.fontStyle) + 10
                  });
                }}
                className="w-full px-2.5 py-1.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 transition"
              >
                <option value="LINE Seed Sans TH" style={{ fontFamily: 'LINE Seed Sans TH' }}>LINE Seed Sans TH (แนะนำ)</option>
                <option value="Sarabun" style={{ fontFamily: 'Sarabun' }}>Sarabun (ทางการสุภาพ)</option>
                <option value="Niramit" style={{ fontFamily: 'Niramit' }}>Niramit (คลาสสิกเรียบหรู)</option>
                <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter (โมเดิร์น)</option>
                <option value="Charm" style={{ fontFamily: 'Charm' }}>Charm (เขียนมือ อ่อนช้อย)</option>
                <option value="Charmonman" style={{ fontFamily: 'Charmonman' }}>Charmonman (คัดลายมือ อ่อนช้อย)</option>
                <option value="Srisakdi" style={{ fontFamily: 'Srisakdi' }}>Srisakdi (สวยหรู วิจิตร)</option>
                <option value="Thasadith" style={{ fontFamily: 'Thasadith' }}>Thasadith (โมเดิร์น เรียบง่าย)</option>
              </select>
            </div>

            {/* Font Size Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-stone-600">ขนาดตัวอักษร ({selectedElement.fontSize}px)</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={selectedElement.fontSize}
                  onChange={(e) => {
                    const fontSize = parseInt(e.target.value, 10);
                    updateElement(selectedElement.id, { 
                      fontSize,
                      width: measureTextWidth(selectedElement.text, fontSize, selectedElement.fontFamily, selectedElement.fontStyle) + 10
                    });
                  }}
                  className="flex-1 accent-emerald-650 cursor-pointer"
                />
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={selectedElement.fontSize}
                  onChange={(e) => {
                    const fontSize = parseInt(e.target.value, 10) || 12;
                    updateElement(selectedElement.id, { 
                      fontSize,
                      width: measureTextWidth(selectedElement.text, fontSize, selectedElement.fontFamily, selectedElement.fontStyle) + 10
                    });
                  }}
                  className="w-12 px-1.5 py-1 border border-stone-200 rounded-lg text-center font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Font Color & Presets */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-600 block">สีตัวอักษร (Text Color)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedElement.fill}
                  onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                  className="w-8 h-8 border border-stone-200 rounded-lg cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={selectedElement.fill}
                  onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>
              
              {/* Presets Grid */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {[
                  '#362c1a', // Warm Cream text
                  '#7d6b4e', // Warm Cream brand gold
                  '#C2A878', // Accent gold
                  '#ffffff', // Elegant White text
                  '#1c1917', // Charcoal Slate dark
                  '#d6d3d1', // Gray slate
                  '#000000', // Black
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateElement(selectedElement.id, { fill: color })}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-md border border-stone-300 shadow-2xs cursor-pointer hover:scale-105 transition ${
                      selectedElement.fill.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Alignment & Styles */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {/* Alignment */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-600 block">การจัดวางแนว</label>
                <div className="flex border border-stone-200 rounded-lg overflow-hidden divide-x divide-stone-200 bg-stone-50/50">
                  {(['left', 'center', 'right'] as const).map((align) => {
                    const isAlign = selectedElement.align === align;
                    const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
                    return (
                      <button
                        key={align}
                        onClick={() => updateElement(selectedElement.id, { align })}
                        className={`flex-1 py-1.5 flex justify-center items-center transition select-none cursor-pointer ${
                          isAlign ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-stone-400 hover:text-stone-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bold & Italic Toggle */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-600 block">สไตล์ตัวหนังสือ</label>
                <div className="flex border border-stone-200 rounded-lg overflow-hidden divide-x divide-stone-200 bg-stone-50/50">
                  <button
                    onClick={() => {
                      const isBold = selectedElement.fontStyle.includes('bold');
                      const isItalic = selectedElement.fontStyle.includes('italic');
                      const newStyle = isBold 
                        ? (isItalic ? 'italic' : 'normal') 
                        : (isItalic ? 'bold italic' : 'bold');
                      updateElement(selectedElement.id, { 
                        fontStyle: newStyle,
                        width: measureTextWidth(selectedElement.text, selectedElement.fontSize, selectedElement.fontFamily, newStyle) + 10
                      });
                    }}
                    className={`flex-1 py-1.5 flex justify-center items-center transition select-none cursor-pointer ${
                      selectedElement.fontStyle.includes('bold') ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const isBold = selectedElement.fontStyle.includes('bold');
                      const isItalic = selectedElement.fontStyle.includes('italic');
                      const newStyle = isItalic 
                        ? (isBold ? 'bold' : 'normal') 
                        : (isBold ? 'bold italic' : 'italic');
                      updateElement(selectedElement.id, { 
                        fontStyle: newStyle,
                        width: measureTextWidth(selectedElement.text, selectedElement.fontSize, selectedElement.fontFamily, newStyle) + 10
                      });
                    }}
                    className={`flex-1 py-1.5 flex justify-center items-center transition select-none cursor-pointer ${
                      selectedElement.fontStyle.includes('italic') ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Opacity slider */}
            <div className="space-y-1.5 pt-1">
              <label className="font-bold text-stone-600 block">ความโปร่งใส (Opacity: {Math.round(selectedElement.opacity * 100)}%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={Math.round(selectedElement.opacity * 100)}
                onChange={(e) => updateElement(selectedElement.id, { opacity: parseInt(e.target.value, 10) / 100 })}
                className="w-full accent-emerald-650 cursor-pointer"
              />
            </div>

            {/* Layer order controls */}
            <div className="space-y-2 border-t border-stone-100 pt-3.5">
              <label className="font-bold text-stone-600 block">จัดตำแหน่งการทับซ้อน (Layers)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleBringToFront}
                  className="py-1.5 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center gap-1 shadow-2xs hover:text-stone-900 transition cursor-pointer select-none"
                >
                  <BringToFront className="w-3.5 h-3.5 text-stone-500" />
                  <span>นำไว้หน้าสุด</span>
                </button>
                <button
                  onClick={handleSendToBack}
                  className="py-1.5 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center gap-1 shadow-2xs hover:text-stone-900 transition cursor-pointer select-none"
                >
                  <SendToBack className="w-3.5 h-3.5 text-stone-500" />
                  <span>ส่งไว้หลังสุด</span>
                </button>
              </div>
            </div>

            {/* Lock / Unlock Toggle */}
            <button
              onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}
              className={`w-full py-2 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 select-none cursor-pointer ${
                selectedElement.locked 
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900' 
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
              }`}
            >
              {selectedElement.locked ? <Lock className="w-3.5 h-3.5 shrink-0" /> : <Unlock className="w-3.5 h-3.5 shrink-0" />}
              <span>{selectedElement.locked ? 'ปลดล็อกข้อความ (Unlock)' : 'ล็อกตำแหน่งบนการ์ด (Lock)'}</span>
            </button>

            {/* Delete element button */}
            <button
              onClick={handleRemoveSelected}
              className="w-full py-2 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 select-none cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบข้อความนี้ออก (Delete)</span>
            </button>

          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <Palette className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ภาพพื้นหลังการ์ด (Background)</span>
                </h4>
                <p className="text-[10px] text-stone-500 leading-normal mb-2">เลือกโทนสีพื้น หรือรูปแบบภาพเทมเพลตสำเร็จรูปด้านล่างเพื่อเปลี่ยนพื้นหลังการ์ดค่ะ</p>
              </div>

              {/* Grid of Templates & Colors */}
              <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {/* 1. White Color */}
                <button
                  onClick={() => setBackground('#ffffff')}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer hover:bg-stone-55 ${
                    background === '#ffffff' ? 'border-emerald-500 bg-emerald-50/15 font-bold text-emerald-800' : 'border-stone-200 text-stone-600 bg-white'
                  }`}
                >
                  <div className="w-full h-14 rounded-lg bg-white border border-stone-250 shadow-2xs mb-1.5 flex items-center justify-center text-[10px] text-stone-400">
                    White
                  </div>
                  <span className="text-[10px] block">ขาวสุภาพ</span>
                </button>

                {/* 2. Charcoal Slate Color */}
                <button
                  onClick={() => setBackground('/Template-cards/charcoal_gold.png')}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer hover:bg-stone-55 ${
                    background === '/Template-cards/charcoal_gold.png' ? 'border-emerald-500 bg-emerald-50/15 font-bold text-emerald-800' : 'border-stone-200 text-stone-600 bg-white'
                  }`}
                >
                  <div 
                    style={{ backgroundImage: 'url(/Template-cards/charcoal_gold.png)' }} 
                    className="w-full h-14 rounded-lg bg-cover bg-center border border-stone-250 shadow-2xs mb-1.5"
                  />
                  <span className="text-[10px] block font-bold text-stone-700">เทาสุภาพ (ทอง)</span>
                </button>

                {/* 3. Warm Cream Color */}
                <button
                  onClick={() => setBackground('#FAF6EE')}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer hover:bg-stone-55 ${
                    background === '#FAF6EE' ? 'border-emerald-500 bg-emerald-50/15 font-bold text-emerald-800' : 'border-stone-200 text-stone-600 bg-white'
                  }`}
                >
                  <div className="w-full h-14 rounded-lg bg-[#FAF6EE] border border-[#EADFC9] shadow-2xs mb-1.5 flex items-center justify-center text-[10px] text-[#8C7B5D]">
                    Cream
                  </div>
                  <span className="text-[10px] block">ครีมทอง</span>
                </button>

                {/* 10 Image Templates */}
                {Array.from({ length: 10 }).map((_, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  const path = `/Template-cards/Template-${num}.jpeg`;
                  return (
                    <button
                      key={num}
                      onClick={() => setBackground(path)}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer hover:bg-stone-55 ${
                        background === path ? 'border-emerald-500 bg-emerald-50/15 font-bold text-emerald-800' : 'border-stone-200 text-stone-600 bg-white'
                      }`}
                    >
                      <div 
                        style={{ backgroundImage: `url(${path})` }} 
                        className="w-full h-14 rounded-lg bg-cover bg-center border border-stone-250 shadow-2xs mb-1.5"
                      />
                      <span className="text-[10px] block">สไตล์ {num}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5 text-[10px] text-stone-500 leading-normal select-none">
              <p className="font-bold text-stone-600 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                <span>คำแนะนำสำหรับการออกแบบ:</span>
              </p>
              <p>• คลิกเลือกรูปภาพด้านบนเพื่อสลับพื้นหลังการ์ด</p>
              <p>• คลิกเลือกข้อความใด ๆ บนภาพการ์ดเพื่อแก้ไขเนื้อหา ปรับขนาด สไตล์ และสีตัวอักษร</p>
              <p>• กดลากย้ายตำแหน่งข้อความบนการ์ดอย่างอิสระ</p>
            </div>
          </div>
        )}
      </aside>

    </div>
  );
}

function EditorWorkspaceContainer() {
  const { saveCard, saveStatus } = useEditorStore();
  
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col overflow-hidden">
      {/* Header bar */}
      <header className="bg-white border-b border-stone-200 py-3 px-6 flex justify-between items-center shadow-2xs z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/manage" className="p-2 hover:bg-stone-100 rounded-xl transition text-stone-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>Template Editor</span>
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Phase 2</span>
            </h1>
            <p className="text-[10px] text-stone-500">แก้ไขข้อความบนการ์ด ย่อขยายขนาด และจัดวางกำหนดการความทรงจำอย่างอิสระ</p>
          </div>
        </div>

        {/* Action button in header */}
        <div className="flex items-center gap-3">
          {saveStatus.type === 'loading' && (
            <span className="text-[10px] text-stone-500 flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
              <RefreshCw className="w-3 h-3 animate-spin text-stone-500" />
              <span>{saveStatus.message}</span>
            </span>
          )}
          {saveStatus.type === 'success' && (
            <span className="text-[10px] text-emerald-850 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-250 shadow-2xs animate-bounce">
              <Sparkles className="w-3 h-3 text-emerald-700 animate-pulse" />
              <span>{saveStatus.message}</span>
            </span>
          )}
          {saveStatus.type === 'error' && (
            <span className="text-[10px] text-rose-850 font-bold flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-250 shadow-2xs">
              <Info className="w-3.5 h-3.5 text-rose-700" />
              <span>{saveStatus.message}</span>
            </span>
          )}
          
          <button
            onClick={saveCard}
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs hover:shadow-sm transition cursor-pointer select-none"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกกำหนดการและการ์ด</span>
          </button>
        </div>
      </header>

      <EditorWorkspace />
    </div>
  );
}

export default function GenericTemplateEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-stone-500 bg-stone-50">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-emerald-600 animate-spin mb-3" />
        <p className="text-sm">กำลังจัดเตรียมพื้นที่ทำงาน...</p>
      </div>
    }>
      <EditorWorkspaceContainer />
    </Suspense>
  );
}

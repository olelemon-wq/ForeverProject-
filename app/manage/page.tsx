'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FeatureToggleList from '@/components/FeatureToggleList';
import ThaiDatePicker from '@/components/ThaiDatePicker';
import { getVisibleKeys, getFeatureLabel, MANDATORY_FEATURES } from '@/lib/categories';
import { 
  Flame, BookOpen, Camera, GitBranch, Settings, Plus, Minus, Trash2, Edit3, 
  CreditCard, Smartphone, Check, AlertCircle, ArrowLeft, ArrowRight, 
  LogOut, Upload, User, Calendar, Heart, Sparkles, DollarSign, Download, RotateCw
, X, Lock, Database, Search, Save, Palette, ChevronUp, ChevronDown, LayoutDashboard, AlertTriangle, MapPin, Clock, Phone, Info, Droplets, Image as ImageIcon, Video, Menu as MenuIcon, Copy, ExternalLink, Globe, Grid, History, FileText } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'settings' | 'card' | 'gallery' | 'videos' | 'family' | 'ebooks' | 'condolences' | 'billing'>('settings');
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeSaving, setYoutubeSaving] = useState(false);
  const [galleryMedias, setGalleryMedias] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [annActive, setAnnActive] = useState(true);
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
        if (meData.authenticated) {
          setUserPhone(meData.phone);
        }

        const res = await fetch('/api/tenant/list-mine');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setWebsites(data.websites || []);
        if (data.websites && data.websites.length > 0) {
          selectWebsite(data.websites[0]);
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

  const uploadGalleryMedia = async (file: File) => {
    if (!activeSite) return;
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
        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      setSuccess('อัปโหลดไฟล์สำเร็จ');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดไฟล์ขัดข้อง');
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
      setDefaultFontSize(config.defaultFontSize || 'NORMAL');
      setDeceasedAvatarUrl(config.avatarUrl || '');
      setDeceasedAvatarScale(config.avatarScale || 1);
      setDeceasedAvatarX(config.avatarX || 0);
      setDeceasedAvatarY(config.avatarY || 0);
      setDeceasedAvatarRotate(config.avatarRotate || 0);
      setDeceasedCoverUrl(config.coverUrl || '');
      setDeceasedCoverScale(config.coverScale || 1);
      setDeceasedCoverX(config.coverX || 0);
      setDeceasedCoverY(config.coverY || 0);
      setDeceasedCoverRotate(config.coverRotate || 0);

      const ann = config.announcement || {};
      setAnnActive(ann.active !== false);
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
            biography,
            features,
            announcement: {
              active: annActive,
              text: annText,
              style: annStyle,
              fontFamily: annFontFamily,
              waterDate: annWaterDate,
              waterTime: annWaterTime,
              abhidhammaDateRange: annAbhidhammaDateRange,
              abhidhammaTime: annAbhidhammaTime,
              cremationDate: annCremationDate,
              cremationTime: annCremationTime,
              templeName: annTempleName,
              pavilion: annPavilion,
              mapLink: annMapLink,
              dressCode: annDressCode,
              wreathPolicy: annWreathPolicy,
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
    if (action === 'DELETE' && !force) {
      showConfirm(
        'ยืนยันการลบข้อมูล',
        'คุณต้องการลบข้อความแสดงความไว้อาลัยนี้ใช่หรือไม่? การลบนี้จะไม่สามารถย้อนกลับได้',
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

      setSuccess(action === 'APPROVE' ? 'อนุมัติคำไว้อาลัยออกเผยแพร่สำเร็จ' : 'ลบคำไว้อาลัยสำเร็จ');
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
          fileName: `avatar-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl && !data.uploadUrl.includes('upload-mock')) {
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
      const res = await fetch('/api/media/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          youtubeUrl,
          title: 'วิดีโอ YouTube',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('แนบลิงก์วิดีโอ YouTube สำเร็จ');
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์ YouTube ล้มเหลว');
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
        <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลดแผงควบคุมหลังบ้าน...</p>
      </div>
    );
  }

  if (websites.length === 0) {
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
      const res = await fetch('/api/media/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          youtubeUrl,
          title: 'วิดีโอ YouTube',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('แนบลิงก์วิดีโอ YouTube สำเร็จ');
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์ YouTube ล้มเหลว');
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
      <main className="min-h-screen bg-stone-50 text-stone-850 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
          <Flame className="w-8 h-8 text-emerald-700 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-stone-900">ยินดีต้อนรับสู่ FOREVER</h1>
          <p className="text-stone-500 text-sm max-w-sm mx-auto">
            คุณยังไม่มีเว็บไซต์ความทรงจำในระบบบัญชีของคุณในขณะนี้ มาสร้างหน้ารำลึกแด่ผู้ล่วงลับคนแรกของคุณกันเถอะ
          </p>
        </div>
        <Link href="/manage/create" className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition active:scale-95 shadow-sm">
          สร้างเว็บไซต์แรกของคุณ
        </Link>
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
      const res = await fetch('/api/media/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          youtubeUrl,
          title: 'วิดีโอ YouTube',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('แนบลิงก์วิดีโอ YouTube สำเร็จ');
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์ YouTube ล้มเหลว');
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
    <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <header className="md:hidden w-full bg-stone-100/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <span className="text-lg font-black tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          FOREVER MANAGE
        </span>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-xl border border-stone-200 text-stone-650 hover:bg-stone-50 transition cursor-pointer active:scale-95"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
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
        fixed inset-y-0 left-0 z-40 w-64 bg-stone-100 border-r border-stone-200/80 p-6 flex flex-col justify-between overflow-y-auto shrink-0 transition-transform duration-300 transform
        md:relative md:translate-x-0 md:h-screen md:sticky md:top-0 md:bg-stone-100/60
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              FOREVER MANAGE
            </span>
          </div>
          <nav className="space-y-1">
            {features.gallery && (
              <button 
                type="button"
                onClick={() => handleTabClick('gallery')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                  activeTab === 'gallery' 
                    ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                    : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
                }`}
              >
                <Camera className={`w-3.5 h-3.5 ${activeTab === 'gallery' ? 'text-white' : 'text-stone-500'}`} />
                <span>คลังภาพรำลึก ({photoMedias.length})</span>
              </button>
            )}
            {features.videos && (
              <button 
                type="button"
                onClick={() => handleTabClick('videos')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                  activeTab === 'videos' 
                    ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                    : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
                }`}
              >
                <Video className={`w-3.5 h-3.5 ${activeTab === 'videos' ? 'text-white' : 'text-stone-500'}`} />
                <span>คลังวิดีโอ ({videoMedias.length})</span>
              </button>
            )}
            {features.family && (
              <button 
                type="button"
                onClick={() => handleTabClick('family')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                  activeTab === 'family' 
                    ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                    : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
                }`}
              >
                <GitBranch className={`w-3.5 h-3.5 ${activeTab === 'family' ? 'text-white' : 'text-stone-500'}`} />
                <span>ผังครอบครัว ({familyMembers.length})</span>
              </button>
            )}
            {features.ebooks && (
              <button 
                type="button"
                onClick={() => handleTabClick('ebooks')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                  activeTab === 'ebooks' 
                    ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                    : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'ebooks' ? 'text-white' : 'text-stone-500'}`} />
                <span>หนังสือของชำร่วย ({ebooks.length})</span>
              </button>
            )}
            {(features.condolence || features.memory) && (
              <button 
                type="button"
                onClick={() => handleTabClick('condolences')}
                className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                  activeTab === 'condolences' 
                    ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                    : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Flame className={`w-3.5 h-3.5 ${activeTab === 'condolences' ? 'text-white' : 'text-stone-500'}`} />
                  <span>
                    {features.condolence && features.memory
                      ? 'กลั่นกรองเนื้อหา'
                      : features.memory
                      ? 'กลั่นกรองความทรงจำ'
                      : 'กลั่นกรองคำไว้อาลัย'}
                  </span>
                </div>
                
                {/* LINE-style Notification Badge */}
                {(condolences.length + pendingPosts.length) > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[9px] font-black text-white ring-2 ring-rose-300/30 animate-pulse">
                    {condolences.length + pendingPosts.length}
                  </span>
                )}
              </button>
            )}

            <div className="pt-4 mt-4 border-t border-stone-200/60">
              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2 px-4">SYSTEM CONFIG</label>
              <button 
                type="button"
                onClick={() => handleTabClick('settings')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                    : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
                }`}
              >
                <Settings className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-white' : 'text-stone-500'}`} />
                <span>ตั้งค่าเว็บไซต์</span>
              </button>
              <Link href="/manage/create" className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-955 hover:bg-stone-200/30 text-xs transition font-semibold mt-1">
                <Plus className="w-3.5 h-3.5 text-stone-400" />
                <span>สร้างเว็บไซต์เพิ่ม</span>
              </Link>
            </div>
          </nav>


        </div>
        
        <div className="mt-8 border-t border-stone-200 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-250 flex items-center justify-center text-sm text-stone-650">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">ผู้ใช้งานบัญชี</p>
              <p className="text-[10px] text-stone-555 font-mono font-medium">{userPhone}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-655 hover:bg-stone-200/50 transition cursor-pointer active:scale-95 border-0"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {success && <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-2xl font-semibold animate-fade-in">✓ {success}</div>}
        {error && <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 rounded-2xl font-semibold animate-fade-in">⚠️ {error}</div>}

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
      const res = await fetch('/api/media/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          youtubeUrl,
          title: 'วิดีโอ YouTube',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('แนบลิงก์วิดีโอ YouTube สำเร็จ');
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์ YouTube ล้มเหลว');
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
              <button 
                type="button"
                onClick={handleRequestRenewal}
                disabled={renewLoading}
                className="px-4 py-2.5 bg-amber-650 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-xl transition flex-shrink-0 text-[10px] shadow-sm flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>ต่ออายุบริการ 1 ปี (2,000 บาท)</span>
              </button>
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
                <button 
                  type="button"
                  onClick={handleSimulateRenewSuccess}
                  disabled={renewLoading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm active:scale-95"
                >
                  {renewLoading ? 'กำลังจำลอง...' : '✓ จำลองต่ออายุสำเร็จ'}
                </button>
                <button 
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  disabled={renewLoading}
                  className="px-4 py-2.5 border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold rounded-xl text-xs transition"
                >
                  ปิด
                </button>
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
                className="text-emerald-700 font-semibold hover:text-emerald-855 underline"
              >
                forever.co.th/{selectedSite.slug}
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`forever.co.th/${selectedSite.slug}`);
                  setSuccess('คัดลอกลิงก์สำเร็จ!');
                }}
                className="p-1 hover:bg-stone-100 rounded-md text-stone-400 hover:text-stone-750 transition cursor-pointer border-0"
                title="คัดลอกลิงก์"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Website Selector Dropdown */}
            <select 
              value={selectedSite.id} 
              onChange={(e) => {
                const site = websites.find(w => w.id === e.target.value);
                if (site) selectWebsite(site);
              }}
              className="px-3 py-1.5 bg-white border border-stone-250 rounded-xl text-xs text-stone-850 focus:outline-none focus:border-emerald-500 font-bold cursor-pointer shadow-xs"
            >
              {websites.map(w => (
                <option key={w.id} value={w.id}>/{w.slug} ({w.name.substring(0, 10)})</option>
              ))}
            </select>

            {/* Quick settings button */}
            <button
              type="button"
              onClick={() => handleTabClick('settings')}
              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>ตั้งค่า</span>
            </button>

            {/* Live website link */}
            <a
              href={`/${selectedSite.slug}`}
              target="_blank"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
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
              
              {/* Settings Sub-Tabs Header (Capsule-style horizontal scroll list) */}
              <div className="w-full bg-stone-100/60 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none mb-6 select-none border border-stone-200/30">
                {[
                  { id: 'general', label: 'ข้อมูลทั่วไป & ประกาศ', icon: Globe },
                  { id: 'media', label: 'รูปโปรไฟล์ & หน้าปก', icon: ImageIcon },
                  { id: 'theme', label: 'ธีม & สี & ฟอนต์', icon: Palette },
                  { id: 'features', label: 'ฟีเจอร์ที่เปิดใช้งาน', icon: Grid },
                  { id: 'billing', label: 'พื้นที่จัดเก็บ & การชำระเงิน', icon: CreditCard },
                ].map(sub => {
                  const Icon = sub.icon;
                  const isActive = activeSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveSubTab(sub.id as any)}
                      className={`px-4 py-2 flex items-center gap-2 rounded-xl text-xs font-bold transition select-none cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white shadow-xs text-stone-900 border border-stone-200/40 font-extrabold'
                          : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 1. ข้อมูลทั่วไป & ประกาศ Tab */}
              {activeSubTab === 'general' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-600 tracking-wide">
                      {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                        ? 'ชื่อคู่รัก / ชื่อหน้าความรัก'
                        : selectedSite.category === 'Pet Memorial'
                        ? 'ชื่อสัตว์เลี้ยง / หน้าความทรงจำ'
                        : 'ชื่อหน้ารำลึก'}
                    </label>
                    <input 
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
                        : 'คำอาลัยและคำรำลึก (ประวัติโดยย่อ)'}
                    </label>
                    <textarea 
                      value={biography} 
                      onChange={(e) => setBiography(e.target.value)} 
                      rows={4}
                      placeholder={
                        selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                          ? 'เช่น เรื่องราวความรักของเราสองคน เริ่มต้นจากการพบกันครั้งแรกในที่ทำงาน และร่วมทุกข์ร่วมสุขด้วยกันมา...'
                          : selectedSite.category === 'Pet Memorial'
                          ? 'เช่น น้องเป็นหมาที่ร่าเริงและแสนรู้ที่สุด นำความสุขและรอยยิ้มมาให้ครอบครัวเราตลอดเวลาที่อยู่ด้วยกัน...'
                          : 'เช่น คุณพ่อสมศักดิ์เป็นคนดี มีความเสียสละ...'
                      }
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                    />
                  </div>

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
                            <input
                              type="checkbox"
                              checked={annActive}
                              onChange={() => setAnnActive(!annActive)}
                              className="w-4 h-4 accent-emerald-650 cursor-pointer"
                            />
                            <span>เปิดแสดงผลการ์ด</span>
                          </label>
                        </div>

                        {annActive && (
                          <div className="space-y-4 text-xs">
                            {/* Theme and Font selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-bold text-stone-600">รูปแบบธีมการ์ด</label>
                                <select
                                  value={annStyle}
                                  onChange={(e) => setAnnStyle(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                                >
                                  <option value="ELEGANT_WHITE">Classic White (สีขาวเรียบหรู)</option>
                                  <option value="WARM_CREAM">Warm Cream (สีครีมวินเทจ)</option>
                                  <option value="CHARCOAL_SLATE">{getStyle3Label(selectedSite?.category || 'Memorial')}</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-stone-600">แบบอักษร (Font)</label>
                                <select
                                  value={annFontFamily}
                                  onChange={(e) => setAnnFontFamily(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                                >
                                  <option value="LINE Seed Sans TH">LINE Seed (ตัวหนา ทันสมัย)</option>
                                  <option value="Charmonman">Charmonman (ตัวเขียนทางการ)</option>
                                  <option value="Srisakdi">Srisakdi (ตัวอักษรไทยคลาสสิก)</option>
                                  <option value="Charm">Charm (ตัวเขียนอ่อนช้อย)</option>
                                  <option value="Thasadith">Thasadith (ตัวพิมพ์ทางการ)</option>
                                </select>
                              </div>
                            </div>

                            {/* Default Font Size selector */}
                            <div className="space-y-1">
                              <label className="font-bold text-stone-600">ขนาดตัวอักษรเริ่มต้นของเว็บไซต์</label>
                              <select
                                value={defaultFontSize}
                                onChange={(e) => setDefaultFontSize(e.target.value as any)}
                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                              >
                                <option value="NORMAL">ขนาดปกติ (100% - มาตรฐานทั่วไป)</option>
                                <option value="MEDIUM">ขนาดค่อนข้างใหญ่ (112% - อ่านง่ายสบายตา)</option>
                                <option value="LARGE">ขนาดใหญ่พิเศษ (125% - แนะนำสำหรับผู้สูงอายุ)</option>
                              </select>
                            </div>

                            {/* Header Text */}
                            <div className="space-y-1">
                              <label className="font-bold text-stone-600">คำเชิญชวนหลักด้านบน</label>
                              <input
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
                                {/* 1. รดน้ำ */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-100/50 rounded-xl border border-stone-200/50">
                                  <div className="space-y-1 col-span-2 font-bold text-stone-700">{sLabels.item1}</div>
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">วันที่จัด</label>
                                    <div className="flex gap-1.5 items-center relative">
                                      <input
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
                                    <label className="text-stone-500 font-medium">เวลาเริ่ม</label>
                                    <div className="space-y-1.5">
                                      <select
                                        value={isCustomWaterTime ? 'CUSTOM' : annWaterTime}
                                        onChange={(e) => {
                                          const val = e.target.value;
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
                                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 cursor-pointer text-sm font-semibold"
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
                                          value={annWaterTime}
                                          onChange={(e) => setAnnWaterTime(e.target.value)}
                                          placeholder="ระบุเวลา เช่น 16:15 น."
                                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 text-sm animate-fade-in"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* 2. สวดพระอภิธรรม */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-100/50 rounded-xl border border-stone-200/50">
                                  <div className="space-y-1 col-span-2 font-bold text-stone-700">{sLabels.item2}</div>
                                  <div className="space-y-1">
                                    <label className="text-stone-500 font-medium">ช่วงวันที่จัด</label>
                                    <div className="flex gap-1.5 items-center relative">
                                      <input
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
                                      <select
                                        value={isCustomAbhidhammaTime ? 'CUSTOM' : annAbhidhammaTime}
                                        onChange={(e) => {
                                          const val = e.target.value;
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
                                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 cursor-pointer text-sm font-semibold"
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
                                      <input
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
                                      <select
                                        value={isCustomCremationTime ? 'CUSTOM' : annCremationTime}
                                        onChange={(e) => {
                                          const val = e.target.value;
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
                                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 cursor-pointer text-sm font-semibold"
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
                                          value={annCremationTime}
                                          onChange={(e) => setAnnCremationTime(e.target.value)}
                                          placeholder="ระบุเวลา เช่น 16:15 น."
                                          className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 text-sm animate-fade-in"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
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
                                      : 'ชื่อวัด / สถานที่จัดงาน'}
                                  </label>
                                  <input
                                    type="text"
                                    value={annTempleName}
                                    onChange={(e) => setAnnTempleName(e.target.value)}
                                    placeholder={sLabels.venuePlaceholder}
                                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-stone-600 font-semibold">{sLabels.pavilionLabel}</label>
                                  <input
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
                                <input
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
                                  : 'คำแนะนำการร่วมงาน'}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-stone-600 font-semibold">การแต่งกาย</label>
                                  <input
                                    type="text"
                                    value={annDressCode}
                                    onChange={(e) => setAnnDressCode(e.target.value)}
                                    placeholder={
                                      selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                        ? 'เช่น ธีมสีชมพู/พาสเทล หรือ ตามความสะดวก'
                                        : 'เช่น ชุดสุภาพสีขาว/ดำ'
                                    }
                                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-stone-600 font-semibold">เบอร์โทรติดต่อประสานงาน</label>
                                  <input
                                    type="text"
                                    value={annContactPhone}
                                    onChange={(e) => setAnnContactPhone(e.target.value)}
                                    placeholder="เช่น 081-234-5678"
                                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-stone-600 font-semibold">
                                  {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                    ? 'นโยบายการรับซอง/ของขวัญ'
                                    : 'นโยบายการรับพวงหรีด'}
                                </label>
                                <select
                                  value={annWreathPolicy}
                                  onChange={(e) => setAnnWreathPolicy(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                                >
                                  {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding' ? (
                                    <>
                                      <option value="NORMAL">ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ</option>
                                      <option value="NO_FLOWERS">ขออภัย งดรับของขวัญ (เน้นการร่วมแสดงความยินดีและอวยพรแทน)</option>
                                      <option value="DONATION_ONLY">ขออภัย งดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)</option>
                                      <option value="NO_WREATH">ขออภัย งดรับซองและของขวัญทุกประเภท</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="NORMAL">รับพวงหรีดตามปกติ</option>
                                      <option value="NO_FLOWERS">งดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)</option>
                                      <option value="DONATION_ONLY">งดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)</option>
                                      <option value="NO_WREATH">งดรับพวงหรีดทุกประเภท</option>
                                    </>
                                  )}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Live Preview Card */}
                      <div className="sticky top-6 space-y-4">
                        <p className="text-xs font-bold text-stone-500 text-left uppercase tracking-wider">💡 ตัวอย่างแสดงผลการ์ดจริงบนหน้าเว็บ (Live Preview)</p>
                        
                        {!annActive ? (
                          <div className="p-12 text-center border border-dashed border-stone-200 rounded-3xl text-stone-500 text-xs bg-stone-50">
                            การ์ดปิดการแสดงผลอยู่ จะไม่ถูกแสดงในหน้าแรกของเว็บไซต์สาธารณะ
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
                                  src={deceasedAvatarUrl.replace('https://storage.forever.co.th', '')}
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
                              <p className="text-[10px] tracking-widest opacity-80 uppercase">{annText || 'กราบเรียนเชิญด้วยความเคารพอย่างสูง'}</p>
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
                              {/* 1. Water */}
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

                              {/* 2. Abhidhamma */}
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

                              {/* 3. Cremation */}
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

                                {(annDressCode || annContactPhone || annWreathPolicy !== 'NORMAL') && (
                                  <div className="space-y-1">
                                    <p className="font-bold text-[10px] opacity-80 uppercase tracking-wide">
                                      {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                        ? 'คำแนะนำการร่วมงานแสดงความยินดี'
                                        : 'ข้อแนะนำการร่วมแสดงความอาลัย'}
                                    </p>
                                    {annDressCode && <p className="opacity-90">👗 การแต่งกาย: {annDressCode}</p>}
                                    {annContactPhone && <p className="opacity-90">📞 ติดต่อประสานงาน: {annContactPhone}</p>}
                                    {annWreathPolicy === 'NO_FLOWERS' && (
                                      <p className="text-amber-800 font-bold">
                                        🎗️ {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                          ? 'งดรับของขวัญ เน้นการร่วมอวยพรแทน'
                                          : 'งดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)'}
                                      </p>
                                    )}
                                    {annWreathPolicy === 'NO_WREATH' && (
                                      <p className="text-red-650 font-bold">
                                        🚫 {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
                                          ? 'งดรับซองและของขวัญทุกประเภท'
                                          : 'งดรับพวงหรีดทุกประเภท'}
                                      </p>
                                    )}
                                    {annWreathPolicy === 'DONATION_ONLY' && (
                                      <p className="text-amber-800 font-bold">
                                        🎗️ {selectedSite.category === 'Couple' || selectedSite.category === 'Wedding'
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
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-700" />
                        <span>เปิดใช้บริการรับเงินทำบุญ (Donation QR Settings)</span>
                      </h4>
                      <input 
                        type="checkbox" 
                        checked={donationActive}
                        onChange={() => setDonationActive(!donationActive)}
                        className="w-5 h-5 accent-emerald-650 cursor-pointer"
                      />
                    </div>

                    {donationActive && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-stone-600 tracking-wide">หมายเลขพร้อมเพย์ (PromptPay)</label>
                          <input 
                            type="text" 
                            value={donationPromptPay} 
                            onChange={(e) => setDonationPromptPay(e.target.value)} 
                            placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
                            className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-stone-600 tracking-wide">ชื่อบัญชีผู้รับเงิน</label>
                          <input 
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
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-stone-900">อัปโหลดและจัดตำแหน่งภาพ</h4>
                    <p className="text-xs text-stone-500">จัดการรูปโปรไฟล์หลักและภาพหน้าปกด้านหลัง โดยการกดที่รูปกล้องเพื่ออัปโหลด ปรับเลื่อน หรือลบรูปภาพ</p>
                  </div>

                  {/* Hidden input file fields */}
                  <input
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

                  <input
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

                  {/* Unified LINE-style Live Preview Simulator Card */}
                  <div className="relative w-full max-w-xl mx-auto h-48 sm:h-56 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center group select-none">
                    {/* Cover Photo Background */}
                    {deceasedCoverUrl ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img 
                          src={deceasedCoverUrl.replace('https://storage.forever.co.th', '')} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover" 
                          style={{
                            transform: `translate(${((deceasedCoverX || 0) / 320) * 100}%, ${((deceasedCoverY || 0) / 160) * 100}%) rotate(${deceasedCoverRotate || 0}deg) scale(${deceasedCoverScale || 1})`,
                            transformOrigin: 'center center',
                          }}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-stone-55/40 flex flex-col items-center justify-center gap-1.5 text-stone-400">
                        <ImageIcon className="w-8 h-8 text-stone-300" />
                        <span className="text-[10px] font-bold">ยังไม่ได้อัปโหลดรูปภาพหน้าปกหลัก</span>
                      </div>
                    )}

                    {/* Circular Avatar (Overlapping in the center) */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-stone-50 shadow-md flex items-center justify-center overflow-hidden z-10">
                      {deceasedAvatarUrl ? (
                        <div className="w-full h-full relative">
                          <img 
                            src={deceasedAvatarUrl.replace('https://storage.forever.co.th', '')} 
                            alt="Avatar Preview" 
                            className="pointer-events-none w-full h-full object-cover" 
                            style={{
                              transform: `translate(${((deceasedAvatarX || 0) / 224) * 100}%, ${((deceasedAvatarY || 0) / 224) * 100}%) rotate(${deceasedAvatarRotate}deg) scale(${(deceasedAvatarScale || 1) * (300 / 224)})`,
                              transformOrigin: 'center center',
                            }}
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
                      <button
                        type="button"
                        onClick={() => {
                          setIsAvatarMenuOpen(!isAvatarMenuOpen);
                          setIsCoverMenuOpen(false);
                        }}
                        className="w-8 h-8 rounded-full bg-stone-850 hover:bg-stone-900 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                        title="จัดการรูปโปรไฟล์"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      {/* Avatar Menu Popover */}
                      {isAvatarMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsAvatarMenuOpen(false)} />
                          <div className="absolute left-[calc(50%-88px)] bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-44 text-stone-850 text-xs font-bold z-30 animate-fade-in text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAvatarMenuOpen(false);
                                document.getElementById('deceased-avatar-file-input')?.click();
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left"
                            >
                              📸 อัปโหลดรูปภาพใหม่
                            </button>
                            {deceasedAvatarUrl && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAvatarMenuOpen(false);
                                    setIsCropModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                                >
                                  ⚙️ ปรับแต่งรูปโปรไฟล์
                                </button>
                                <button
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
                                  🗑️ ลบรูปโปรไฟล์
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* LINE-Style camera icon trigger overlay on Cover Banner */}
                    <div className="absolute bottom-3 right-3 z-20">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsCoverMenuOpen(!isCoverMenuOpen);
                          setIsAvatarMenuOpen(false);
                        }}
                        className="w-8 h-8 rounded-full bg-stone-850 hover:bg-stone-900 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                        title="จัดการรูปหน้าปก"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      {/* Cover Menu Popover */}
                      {isCoverMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsCoverMenuOpen(false)} />
                          <div className="absolute right-0 bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-44 text-stone-850 text-xs font-bold z-30 animate-fade-in text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCoverMenuOpen(false);
                                document.getElementById('deceased-cover-file-input')?.click();
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left"
                            >
                              📸 อัปโหลดรูปปกใหม่
                            </button>
                            {deceasedCoverUrl && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCoverMenuOpen(false);
                                    setIsCoverCropModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                                >
                                  ⚙️ ปรับแต่งหน้าปก
                                </button>
                                <button
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
                                  🗑️ ลบรูปหน้าปก
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Image crop adjustment buttons under the preview card */}
                  <div className="flex justify-center mt-3 gap-3">
                    {deceasedAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setIsCropModalOpen(true)}
                        className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 font-bold text-xs rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1.5 justify-center w-full max-w-[200px] cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>ปรับรูปโปรไฟล์</span>
                      </button>
                    )}
                    {deceasedCoverUrl && (
                      <button
                        type="button"
                        onClick={() => setIsCoverCropModalOpen(true)}
                        className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 font-bold text-xs rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1.5 justify-center w-full max-w-[200px] cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>ปรับรูปหน้าปก</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 3. ธีม & สี & ฟอนต์ Tab */}
              {activeSubTab === 'theme' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-stone-500" />
                      <span>ธีมสำเร็จรูป (Theme Templates)</span>
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { name: 'Peaceful Mint', primary: '#7ea18b', hover: '#668571', secondary: '#d4be95', light: '#f4f6f3', badge: 'ไว้อาลัย / รำลึกอย่างสงบ' },
                        { name: 'Sweet Peach', primary: '#e09f9f', hover: '#c48282', secondary: '#e6c1a8', light: '#fff7f5', badge: 'งานแต่งงาน / คู่รักแสนรัก' },
                        { name: 'Warm Caramel', primary: '#c29a7c', hover: '#a67f62', secondary: '#dcc6a8', light: '#fbf8f5', badge: 'สัตว์เลี้ยง / บันทึกการเดินทาง' },
                        { name: 'Classic Olive', primary: '#96a288', hover: '#7a866d', secondary: '#cfc5b0', light: '#f7f8f5', badge: 'สายใยตระกูล / ครอบครัว' },
                        { name: 'Ocean Breeze', primary: '#8ba8bd', hover: '#708d9e', secondary: '#ded2af', light: '#f5f7f9', badge: 'มิตรภาพ / ย้อนวันวาน' },
                        { name: 'Lilac Dream', primary: '#a49cb5', hover: '#89819a', secondary: '#c8bfcb', light: '#f7f6f8', badge: 'หรูหรา / ทางการทั่วไป' }
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
                            className={`p-4 rounded-2xl bg-white border-2 text-left relative transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                              isActive 
                                ? 'border-sky-500 ring-4 ring-sky-500/10 scale-102 shadow-xs' 
                                : 'border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {isActive && (
                              <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-xs">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <h5 className="text-xs font-black text-stone-900 leading-tight">
                                  {t.name}
                                </h5>
                                <span className="text-[9px] text-stone-400 font-semibold block leading-none">
                                  {t.badge}
                                </span>
                              </div>
                              
                              {/* Color dots row */}
                              <div className="flex gap-1 items-center">
                                <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.primary }} />
                                <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.hover }} />
                                <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.secondary }} />
                                <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.light }} />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPrimaryColor('#0d9488');
                        setSecondaryColor('#f59e0b');
                      }}
                      className="px-3.5 py-2 border border-stone-250 hover:bg-stone-50 rounded-xl text-[10px] sm:text-xs font-bold text-stone-600 transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-stone-500" />
                      <span>รีเซ็ตเป็นธีมเริ่มต้น (Reset to Default)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Primary Color (กำหนดสีเอง)</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                          className="w-10 h-10 rounded-xl border border-stone-200 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                          className="flex-1 px-4 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl text-stone-905 font-mono focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Secondary Color (กำหนดสีเอง)</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)} 
                          className="w-10 h-10 rounded-xl border border-stone-200 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)} 
                          className="flex-1 px-4 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl text-stone-905 font-mono focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Font Style (Family)</label>
                    <select 
                      value={fontFamily} 
                      onChange={(e) => setFontFamily(e.target.value)} 
                      className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-500/80 transition font-bold"
                    >
                      <option value="LINE Seed Sans TH" style={{ fontFamily: 'LINE Seed Sans TH' }}>LINE Seed Sans TH (แนะนำ)</option>
                      <option value="Inter">Inter (เรียบหรูสากล)</option>
                      <option value="Sarabun">Sarabun (ไทยทางการ)</option>
                      <option value="Niramit">Niramit (ไทยร่วมสมัย)</option>
                    </select>
                  </div>
                </div>
              )}
              {/* 4. ฟีเจอร์ที่เปิดใช้งาน Tab */}
              {activeSubTab === 'features' && (
                <div className="pt-2 space-y-4 text-left animate-fade-in">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>ฟีเจอร์ที่เปิดใช้งาน (Features checklist)</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    เลือกส่วนที่คุณต้องการแสดงบนหน้าเว็บไซต์อนุสรณ์ (สามารถเปิด-ปิดได้ทุกเมื่อ)
                  </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Storage Quota Card */}
                    <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/20 space-y-4">
                      <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-emerald-700" />
                        <span>พื้นที่จัดเก็บมีเดีย S3 / R2</span>
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-stone-550 font-semibold font-mono">
                          <span>{(storageUsedBytes / (1024 * 1024)).toFixed(1)}MB</span>
                          <span>/ {(storageQuotaBytes / (1024 * 1024 * 1024)).toFixed(1)}GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${storagePercentage}%` }} />
                        </div>
                      </div>
                      
                      <div className="border-t border-stone-100 pt-3 space-y-1.5">
                        <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wide">จำลองอัปโหลดไฟล์ทดสอบ</p>
                        <div className="flex gap-1.5">
                          <button 
                            type="button"
                            onClick={() => handleMockUpload(10)} 
                            disabled={uploadLoading}
                            className="flex-1 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-[9px] text-stone-700 font-bold transition cursor-pointer"
                          >
                            รูป (10MB)
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleMockUpload(250)} 
                            disabled={uploadLoading}
                            className="flex-1 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-[9px] text-amber-850 font-bold transition cursor-pointer"
                          >
                            วิดีโอ (250MB)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Export backups Card */}
                    <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/20 space-y-3">
                      <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-emerald-700" />
                        <span>ส่งออกข้อมูลสำรอง (ZIP Export)</span>
                      </h4>
                      <p className="text-[10px] text-stone-550 leading-normal">
                        ดาวน์โหลดข้อมูลทั้งหมด ประวัติคำไว้อาลัย ผังครอบครัว และหนังสือที่ระลึกในเว็บเป็นไฟล์ ZIP สำรองเก็บไว้แบบออฟไลน์
                      </p>
                      <button 
                        type="button"
                        onClick={handleExportZip}
                        disabled={exportLoading}
                        className="w-full py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs text-emerald-800 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        {exportLoading ? 'กำลังส่งออก...' : 'ดาวน์โหลด ZIP สำรองข้อมูล'}
                      </button>
                    </div>
                  </div>

                  {/* Billing invoice logs list */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-4">
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <CreditCard className="w-4 h-4 text-emerald-755" />
                      <span>ประวัติการชำระเงินค่าบริการ (Payment History)</span>
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                            <th className="pb-3 pl-2">เลขที่ใบเสร็จ</th>
                            <th className="pb-3">วันที่ชำระเงิน</th>
                            <th className="pb-3">รายละเอียดสินค้า</th>
                            <th className="pb-3">ยอดชำระ</th>
                            <th className="pb-3 font-semibold">สถานะ</th>
                            <th className="pb-3 pr-2 text-right">ดาวน์โหลด</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {invoiceLogs.map(log => (
                            <tr key={log.id} className="hover:bg-stone-50/80 transition">
                              <td className="py-4 pl-2 font-mono font-bold text-stone-700">{log.id}</td>
                              <td className="py-4 text-stone-500">{log.date}</td>
                              <td className="py-4 text-stone-650 max-w-[280px] truncate">{log.desc}</td>
                              <td className="py-4 text-stone-900 font-bold">{log.amount}</td>
                              <td className="py-4">
                                <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-250">
                                  {log.status}
                                </span>
                              </td>
                              <td className="py-4 pr-2 text-right">
                                <a 
                                  href={`/api/payment/invoice?refId=${log.refId}`}
                                  download
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-250 text-[10px] font-bold transition active:scale-95 shadow-sm"
                                >
                                  <span>📥</span> PDF
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditionally display Save Button only on configuration sub-tabs */}
              {activeSubTab !== 'billing' && (
                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 justify-center"
                >
                  {saveLoading ? (
                    'กำลังบันทึกข้อมูล...'
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>บันทึกการตั้งค่าเว็บไซต์</span>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        )}
        {activeTab === 'gallery' && (
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
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={async (e) => {
                    if (e.target.files) {
                      for (let i = 0; i < e.target.files.length; i++) {
                        await uploadGalleryMedia(e.target.files[i]);
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

            {galleryUploading && (
              <div className="p-4 bg-stone-50 border border-stone-200 text-xs text-stone-600 rounded-2xl font-semibold animate-pulse flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>กำลังอัปโหลดรูปภาพไปยังคลังเก็บข้อมูล...</span>
              </div>
            )}

            {photoMedias.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-stone-200 rounded-3xl text-stone-500 text-sm">
                ยังไม่มีการอัปโหลดไฟล์รูปภาพความทรงจำ
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {photoMedias.map((m, index) => {
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
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGalleryMedia(m.id);
                          }}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
                          title="ลบรูปภาพ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

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

            {/* YouTube Link Form */}
            <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4 text-left">
              <h4 className="text-sm font-bold text-stone-900">แนบลิงก์วิดีโอจาก YouTube</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="วางลิงก์ เช่น https://www.youtube.com/watch?v=..."
                  className="flex-1 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500/80 transition"
                />
                <button
                  onClick={handleSaveYoutubeLink}
                  disabled={youtubeSaving}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition active:scale-95 flex-shrink-0 cursor-pointer"
                >
                  {youtubeSaving ? 'กำลังบันทึก...' : 'บันทึกลิงก์'}
                </button>
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
                        <button
                          onClick={() => deleteGalleryMedia(m.id)}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-md cursor-pointer"
                          title="ลบวิดีโอ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-stone-900 font-sans flex items-center gap-1.5">
                <GitBranch className="w-5 h-5 text-emerald-700" />
                <span>ผังครอบครัวและเครือญาติ 3 รุ่น ({familyMembers.length})</span>
              </h3>
              <p className="text-xs text-stone-500">เพิ่มรายละเอียดของบิดา มารดา คู่สมรส พี่น้อง และบุตรธิดาของผู้ล่วงลับ</p>
            </div>
            <button 
              onClick={() => { resetFamilyForm(); setFamilyFormOpen(!familyFormOpen); }}
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-200 text-xs font-bold transition flex items-center gap-1"
            >
              {familyFormOpen ? (
                'ปิดหน้าต่าง'
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มสมาชิกครอบครัว</span>
                </>
              )}
            </button>
          </div>

          {familyFormOpen && (
            <form onSubmit={handleSaveFamilyMember} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4 max-w-xl animate-fade-in">
              <h4 className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
                {familyId ? (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>แก้ไขสมาชิกญาติ</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>เพิ่มสมาชิกญาติใหม่</span>
                  </>
                )}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">ชื่อ-นามสกุล</label>
                  <input 
                    type="text" 
                    value={familyName} 
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                    placeholder="เช่น นายสมจิตร์ รักสงบ"
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base focus:outline-none focus:border-emerald-500/80 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">ความสัมพันธ์</label>
                  <select
                    value={familyRelationship}
                    onChange={(e) => setFamilyRelationship(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base focus:outline-none focus:border-emerald-500/80 transition"
                  >
                    <option value="PARENT_1">บิดา (Father)</option>
                    <option value="PARENT_2">มารดา (Mother)</option>
                    <option value="SPOUSE">คู่สมรส (Spouse)</option>
                    <option value="SIBLING">พี่น้อง (Sibling)</option>
                    <option value="CHILD">บุตร/ธิดา (Child)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">ปีเกิด (พ.ศ.)</label>
                  <input 
                    type="text" 
                    value={familyBirthYear} 
                    onChange={(e) => setFamilyBirthYear(e.target.value)}
                    placeholder="เช่น 2490"
                    maxLength={4}
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base font-mono focus:outline-none focus:border-emerald-500/80 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-stone-600 block">ปีที่ล่วงลับ (พ.ศ.)</label>
                  <input 
                    type="text" 
                    value={familyDeathYear} 
                    onChange={(e) => setFamilyDeathYear(e.target.value)}
                    disabled={!familyIsDeceased}
                    placeholder="เช่น 2565"
                    maxLength={4}
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base font-mono disabled:opacity-40 focus:outline-none focus:border-emerald-500/80 transition"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input 
                    type="checkbox" 
                    id="isDeceased"
                    checked={familyIsDeceased}
                    onChange={(e) => setFamilyIsDeceased(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="isDeceased" className="text-xs text-stone-750 font-bold cursor-pointer select-none">เสียชีวิตแล้ว (Deceased)</label>
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-sm font-bold text-stone-600 block">รูปถ่ายประวัติเครือญาติ (แนะนำอัตราส่วน 1:1)</label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Thumbnail Preview */}
                    {familyAvatarUrl && (
                      <div className="relative w-20 h-20 rounded-full border border-stone-250 bg-stone-50 overflow-hidden flex-shrink-0 shadow-sm group">
                        <img 
                          src={familyAvatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`;
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setFamilyAvatarUrl('')}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold cursor-pointer border-0"
                        >
                          ลบรูปภาพ
                        </button>
                      </div>
                    )}

                    {/* Custom Dropzone */}
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
                      className={`flex-1 w-full border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer relative ${
                        familyIsDragActive 
                          ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
                          : 'border-stone-300 hover:border-emerald-500 bg-stone-50/30 hover:bg-stone-50/60'
                      }`}
                    >
                      <input
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
                      <label htmlFor="avatar-file-input" className="cursor-pointer flex flex-col items-center gap-1">
                        <User className={`w-8 h-8 mb-1 ${familyIsDragActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                        <span className="text-xs font-bold text-stone-700">
                          {avatarUploading 
                            ? 'กำลังอัปโหลด...' 
                            : familyIsDragActive 
                            ? 'วางรูปภาพที่นี่ได้เลย' 
                            : 'ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่ออัปโหลด'}
                        </span>
                        <span className="text-[10px] text-stone-400">รองรับไฟล์ PNG, JPG หรือ WEBP (ไม่เกิน 5MB)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm"
                >
                  {saveLoading ? 'กำลังบันทึก...' : '💾 บันทึกข้อมูลญาติ'}
                </button>
                <button 
                  type="button" 
                  onClick={resetFamilyForm}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          )}

          {familyMembers.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-stone-200 rounded-2xl text-stone-500 text-xs">
              ยังไม่มีการระบุข้อมูลสมาชิกครอบครัว
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
      const res = await fetch('/api/media/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          youtubeUrl,
          title: 'วิดีโอ YouTube',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('แนบลิงก์วิดีโอ YouTube สำเร็จ');
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์ YouTube ล้มเหลว');
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
                  <div key={m.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/40 flex justify-between items-start hover:border-stone-300 transition gap-3">
                    <div className="flex items-center gap-3">
                      {m.avatarUrl ? (
                        <img 
                          src={m.avatarUrl} 
                          alt={m.name} 
                          className="w-10 h-10 rounded-full object-cover border border-stone-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-650 font-bold text-xs flex-shrink-0 border border-stone-250">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-stone-900">{m.name}</p>
                        <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold bg-stone-200/50 text-stone-605 rounded mt-1">
                          ความสัมพันธ์: {relLabel}
                        </span>
                        <p className="text-[10px] text-stone-500 font-semibold mt-1 flex items-center gap-1">
                          <span>อายุขัย: {m.birthYear || 'N/A'} - {m.deathYear || 'N/A'}</span>
                          {m.isDeceased && <Flame className="w-3 h-3 text-stone-500 animate-pulse" />}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => editFamilyMember(m)}
                        className="p-1.5 rounded-lg bg-white border border-stone-250 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition"
                        title="แก้ไข"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteFamilyMember(m.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition flex items-center justify-center"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
            <button 
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
            </button>
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
                  <input 
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
                  <input 
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
                  <input 
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
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => setEbookFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-stone-600 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-stone-200 file:text-xs file:font-semibold file:bg-stone-50 file:text-stone-705 hover:file:bg-stone-100 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-600 block">ข้อความเนื้อหาในแต่ละหน้า (แยกหน้าโดยใช้เครื่องหมาย `[PAGE]`)</label>
                <textarea 
                  value={ebookPagesText} 
                  onChange={(e) => setEbookPagesText(e.target.value)}
                  rows={6}
                  placeholder="บทนำ...&#10;[PAGE]&#10;หน้าที่ 2...&#10;[PAGE]&#10;หน้าที่ 3..."
                  className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base font-serif leading-relaxed focus:outline-none focus:border-emerald-500/80 transition"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm"
                >
                  {saveLoading ? 'กำลังบันทึกและอัปโหลด...' : '💾 บันทึกและออกบริการ'}
                </button>
                <button 
                  type="button" 
                  onClick={resetEbookForm}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition"
                >
                  ยกเลิก
                </button>
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
                    <button 
                      onClick={() => editEbook(b)}
                      className="p-2 rounded-xl bg-white border border-stone-250 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition text-[10px]"
                      title="แก้ไข"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEbook(b.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition text-[10px] flex items-center justify-center"
                      title="ลบ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-emerald-700 animate-pulse" />
                  <span>คำไว้อาลัยรออนุมัติ ({condolences.length})</span>
                </h3>

                {condolences.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-stone-200 rounded-2xl text-stone-500 text-xs">
                    ไม่มีข้อความไว้อาลัยค้างอนุมัติในเวลานี้
                  </div>
                ) : (
                  <div className="space-y-4">
                    {condolences.map(c => (
                      <div key={c.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/45 hover:bg-stone-50/75 transition flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">{c.senderName}</span>
                            <span className="px-2 py-0.5 text-[9px] font-semibold bg-stone-200/50 text-stone-600 rounded">
                              ความสัมพันธ์: {c.relationship}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-stone-705 leading-relaxed font-semibold">"{c.message}"</p>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto flex-shrink-0">
                          <button 
                            onClick={() => handleModerateCondolence(c.id, 'APPROVE')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 shadow-sm"
                          >
                            อนุมัติ
                          </button>
                          <button 
                            onClick={() => handleModerateCondolence(c.id, 'DELETE')}
                            className="px-4 py-2 rounded-xl border border-red-300 text-red-755 hover:bg-red-50 text-xs font-bold transition active:scale-95"
                          >
                            ลบออก
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {features.memory && (
              <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                  <Camera className="w-5 h-5 text-emerald-700" />
                  <span>เรื่องราวรออนุมัติบน Memory Wall ({pendingPosts.length})</span>
                </h3>

                {pendingPosts.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-stone-200 rounded-2xl text-stone-500 text-xs">
                    ไม่มีเรื่องราวหรือรูปถ่ายค้างอนุมัติในเวลานี้
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPosts.map(p => (
                      <div key={p.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/45 hover:bg-stone-50/75 transition flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">ส่งโดย: {p.senderName}</span>
                            {p.title && <span className="text-xs font-semibold text-stone-600">| หัวข้อ: {p.title}</span>}
                          </div>
                          {p.mediaUrl && <p className="text-[10px] text-stone-500 font-mono">แนบไฟล์รูป: {p.mediaUrl}</p>}
                          {p.content && <p className="text-xs sm:text-sm text-stone-705 leading-relaxed font-semibold">"{p.content}"</p>}
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto flex-shrink-0">
                          <button 
                            onClick={() => handleModerateMemoryPost(p.id, 'APPROVE')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 shadow-sm"
                          >
                            อนุมัติลงบอร์ด
                          </button>
                          <button 
                            onClick={() => handleModerateMemoryPost(p.id, 'DELETE')}
                            className="px-4 py-2 rounded-xl border border-red-300 text-red-755 hover:bg-red-50 text-xs font-bold transition active:scale-95"
                          >
                            ลบออก
                          </button>
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
              <button 
                type="button" 
                onClick={() => setIsCoverCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Repositioning viewport Container */}
            <div 
              className="relative w-full aspect-video sm:h-52 bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden cursor-move flex items-center justify-center"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = rect.width;
                const viewportHeight = rect.height;
                const startX = e.clientX - deceasedCoverX;
                const startY = e.clientY - deceasedCoverY;
                
                const handleMouseMove = (ev: MouseEvent) => {
                  let newX = ev.clientX - startX;
                  let newY = ev.clientY - startY;
                  
                  // Calculate dynamic viewport limits
                  const limitX = Math.max(0, (viewportWidth * deceasedCoverScale - viewportWidth) / 2);
                  const limitY = Math.max(0, (viewportHeight * deceasedCoverScale - viewportHeight) / 2);
                  
                  newX = Math.min(limitX, Math.max(-limitX, newX));
                  newY = Math.min(limitY, Math.max(-limitY, newY));
                  
                  setDeceasedCoverX(newX);
                  setDeceasedCoverY(newY);
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
                const startX = touch.clientX - deceasedCoverX;
                const startY = touch.clientY - deceasedCoverY;
                
                const handleTouchMove = (ev: TouchEvent) => {
                  const t = ev.touches[0];
                  let newX = t.clientX - startX;
                  let newY = t.clientY - startY;
                  
                  // Calculate dynamic viewport limits
                  const limitX = Math.max(0, (viewportWidth * deceasedCoverScale - viewportWidth) / 2);
                  const limitY = Math.max(0, (viewportHeight * deceasedCoverScale - viewportHeight) / 2);
                  
                  newX = Math.min(limitX, Math.max(-limitX, newX));
                  newY = Math.min(limitY, Math.max(-limitY, newY));
                  
                  setDeceasedCoverX(newX);
                  setDeceasedCoverY(newY);
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
                src={deceasedCoverUrl.replace('https://storage.forever.co.th', '')}
                alt="Cover Repositioning"
                className="pointer-events-none max-w-none origin-center"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `translate(${deceasedCoverX}px, ${deceasedCoverY}px) rotate(${deceasedCoverRotate}deg) scale(${deceasedCoverScale})`,
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
                <button
                  type="button"
                  onClick={() => setDeceasedCoverScale(Math.max(1, deceasedCoverScale - 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="ลดขนาด"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedCoverScale}
                  onChange={(e) => setDeceasedCoverScale(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-stone-250 rounded-lg appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setDeceasedCoverScale(Math.min(4, deceasedCoverScale + 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setDeceasedCoverRotate((deceasedCoverRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs font-bold text-stone-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>หมุนภาพ 90°</span>
              </button>

              <button
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
              </button>
            </div>

            {/* Save Crop button */}
            <button
              type="button"
              onClick={() => setIsCoverCropModalOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>เสร็จสิ้นและนำไปใช้</span>
            </button>
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
              <button 
                type="button" 
                onClick={() => setIsCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Container with Circular Overlay mask */}
            <div className="flex items-center justify-center bg-stone-50 border border-stone-200/60 p-6 rounded-2xl">
              <div 
                className="relative w-48 h-48 rounded-full border-2 border-emerald-600/80 overflow-hidden cursor-move flex items-center justify-center bg-stone-100 shadow-inner"
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const viewportWidth = rect.width;
                  const startX = e.clientX - deceasedAvatarX;
                  const startY = e.clientY - deceasedAvatarY;
                  
                  const handleMouseMove = (ev: MouseEvent) => {
                    let newX = ev.clientX - startX;
                    let newY = ev.clientY - startY;
                    
                    // Boundary constraint for circular mask (192px size)
                    const limit = Math.max(0, (viewportWidth * deceasedAvatarScale - viewportWidth) / 2);
                    newX = Math.min(limit, Math.max(-limit, newX));
                    newY = Math.min(limit, Math.max(-limit, newY));
                    
                    setDeceasedAvatarX(newX);
                    setDeceasedAvatarY(newY);
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
                  const startX = touch.clientX - deceasedAvatarX;
                  const startY = touch.clientY - deceasedAvatarY;
                  
                  const handleTouchMove = (ev: TouchEvent) => {
                    const t = ev.touches[0];
                    let newX = t.clientX - startX;
                    let newY = t.clientY - startY;
                    
                    // Boundary constraint for circular mask (192px size)
                    const limit = Math.max(0, (viewportWidth * deceasedAvatarScale - viewportWidth) / 2);
                    newX = Math.min(limit, Math.max(-limit, newX));
                    newY = Math.min(limit, Math.max(-limit, newY));
                    
                    setDeceasedAvatarX(newX);
                    setDeceasedAvatarY(newY);
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
                  src={deceasedAvatarUrl.replace('https://storage.forever.co.th', '')}
                  alt="Avatar Repositioning"
                  className="pointer-events-none max-w-none origin-center"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translate(${deceasedAvatarX}px, ${deceasedAvatarY}px) rotate(${deceasedAvatarRotate}deg) scale(${deceasedAvatarScale})`,
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
                <button
                  type="button"
                  onClick={() => setDeceasedAvatarScale(Math.max(1, deceasedAvatarScale - 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="ลดขนาด"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedAvatarScale}
                  onChange={(e) => setDeceasedAvatarScale(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-stone-250 rounded-lg appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setDeceasedAvatarScale(Math.min(4, deceasedAvatarScale + 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setDeceasedAvatarRotate((deceasedAvatarRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs font-bold text-stone-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>หมุนภาพ 90°</span>
              </button>

              <button
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
              </button>
            </div>

            {/* Save Crop button */}
            <button
              type="button"
              onClick={() => setIsCropModalOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>เสร็จสิ้นและนำไปใช้</span>
            </button>
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
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmConfig(null);
                }}
                className="flex-1 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-250 text-stone-700 font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
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
              </button>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';

import CoupleJourneyCard from '@/components/announcement/CoupleJourneyCard';
import FriendsMeetupCard from '@/components/announcement/FriendsMeetupCard';
import MemorialScheduleCard from '@/components/announcement/MemorialScheduleCard';
import CoupleMilestonesEditor from '@/components/manage/CoupleMilestonesEditor';
import { AnnouncementPreviewSticky } from '@/components/manage/AnnouncementCardChrome';
import { IdentitySectionHeader } from '@/components/manage/IdentitySetupChrome';
import ThaiDatePicker from '@/components/ThaiDatePicker';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { resolveAnnouncementCardTheme } from '@/lib/announcementCardTheme';
import {
  announcementUploadHint,
  categorySupportsCardOrientation,
  ANNOUNCEMENT_FRAMED_CARD_CLASS,
  type AnnouncementOrientation,
} from '@/lib/announcementCardLayout';
import type { CoupleMilestone } from '@/lib/coupleMilestones';
import { coupleMilestonesForSave } from '@/lib/coupleMilestones';
import { cn } from '@/lib/utils';
import { AlertCircle, Trash2, Upload } from 'lucide-react';

const CONTROL_CHECKED_CLASS =
  'data-checked:border-[#0071e3] data-checked:bg-[#0071e3]';

const DATE_TIME_CONTROL_CLASS =
  'h-9 min-h-9 w-full rounded-xl border border-stone-200 bg-white px-3 py-0 text-sm text-stone-900 shadow-none focus:border-emerald-500 focus:outline-none focus-visible:ring-0';

function OptionRadio({
  id,
  value,
  label,
}: {
  id: string;
  value: string;
  label: string;
}) {
  return (
    <Field orientation="horizontal" className="min-w-0">
      <RadioGroupItem value={value} id={id} className={CONTROL_CHECKED_CLASS} />
      <FieldLabel htmlFor={id} className="font-normal">
        {label}
      </FieldLabel>
    </Field>
  );
}

const TIME_PRESETS = [
  '09:00 น.', '10:00 น.', '13:00 น.', '14:00 น.', '15:00 น.',
  '15:30 น.', '16:00 น.', '16:30 น.', '17:00 น.', '19:00 น.', '19:30 น.', '20:00 น.',
];

type ScheduleLabels = {
  subtitle: string;
  item1: string;
  item1Placeholder?: string;
  item2: string;
  item2Placeholder?: string;
  item3: string;
  item3Placeholder?: string;
  venueLabel: string;
  venuePlaceholder?: string;
  pavilionLabel: string;
  pavilionPlaceholder?: string;
  invitePlaceholder: string;
  guidelinesTitle: string;
  dateLabel?: string;
  timeLabel?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
};

function isCoupleCategory(category: string) {
  return category === 'Couple';
}

function usesSingleMilestoneSchedule(category: string) {
  return category === 'Friends';
}

function cardFooterText(category: string) {
  if (category === 'Wedding') return 'ขอขอบคุณแขกผู้มีเกียรติทุกท่านที่มาร่วมแสดงความยินดี จากเจ้าภาพ';
  if (category === 'Pet Memorial') return 'ขอบคุณทุกคนที่มาร่วมส่งความรักและความคิดถึงให้น้อง จากครอบครัว';
  if (category === 'Family Legacy') return 'กราบขอบพระคุณทุกท่านที่ร่วมสืบสานสายสัมพันธ์และส่งต่อความรัก จากครอบครัว';
  if (category === 'Friends') return 'ขอขอบคุณทุกคนที่ร่วมแบ่งปันความทรงจำและมิตรภาพ จากกลุ่ม';
  if (category === 'Couple') return 'ขอบคุณที่มาร่วมเป็นส่วนหนึ่งของเส้นทางความรักของเรา';
  return 'กราบขอบพระคุณทุกท่านที่มาร่วมไว้อาลัย จากคณะเจ้าภาพ';
}

function TimePresetField({
  value,
  isCustom,
  emptyLabel,
  defaultCustomTime,
  onCustomChange,
  onValueChange,
}: {
  value: string;
  isCustom: boolean;
  emptyLabel: string;
  defaultCustomTime: string;
  onCustomChange: (custom: boolean) => void;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Select
        value={(isCustom ? 'CUSTOM' : value) || '__empty__'}
        onValueChange={(raw) => {
          const val = raw === '__empty__' ? '' : raw;
          if (val === 'CUSTOM') {
            onCustomChange(true);
            if (!value || TIME_PRESETS.includes(value)) onValueChange(defaultCustomTime);
          } else {
            onCustomChange(false);
            onValueChange(val);
          }
        }}
      >
        <SelectTrigger
          className={cn(
            DATE_TIME_CONTROL_CLASS,
            'cursor-pointer data-[size=default]:h-9 data-[size=default]:min-h-9',
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="__empty__">{emptyLabel}</SelectItem>
          {TIME_PRESETS.map((preset) => (
            <SelectItem key={preset} value={preset}>{preset}</SelectItem>
          ))}
          <SelectItem value="CUSTOM">พิมพ์ระบุเวลาเอง...</SelectItem>
        </SelectContent>
      </Select>
      {isCustom ? (
        <Input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="ระบุเวลา เช่น 16:15 น."
          className={cn(DATE_TIME_CONTROL_CLASS, 'animate-fade-in')}
        />
      ) : null}
    </div>
  );
}

function DateField({
  value,
  onChange,
  placeholder,
  picker,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  picker: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl" data-date-field>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(DATE_TIME_CONTROL_CLASS, 'pr-9')}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
        <div className="pointer-events-auto">{picker}</div>
      </div>
    </div>
  );
}

export default function AnnouncementCardSettings({
  category,
  siteName,
  sLabels,
  themeStyle3Label,
  formatThaiDate,
  formatThaiDateRange,
  active,
  onActiveChange,
  cardMode,
  onCardModeChange,
  orientation,
  onOrientationChange,
  showPhoto,
  onShowPhotoChange,
  customCardUrl,
  onCustomCardUrlChange,
  uploading,
  uploadError,
  onUploadErrorChange,
  onUploadFile,
  text,
  onTextChange,
  style,
  onStyleChange,
  fontFamily,
  onFontFamilyChange,
  siteFontFamily,
  avatarUrl,
  avatarScale,
  avatarX,
  avatarY,
  avatarRotate,
  waterDate,
  onWaterDateChange,
  waterTime,
  onWaterTimeChange,
  isCustomWaterTime,
  onCustomWaterTimeChange,
  abhidhammaDateRange,
  onAbhidhammaDateRangeChange,
  abhidhammaTime,
  onAbhidhammaTimeChange,
  isCustomAbhidhammaTime,
  onCustomAbhidhammaTimeChange,
  abhidhammaStartDate,
  abhidhammaEndDate,
  onAbhidhammaRangeChange,
  cremationDate,
  onCremationDateChange,
  cremationTime,
  onCremationTimeChange,
  isCustomCremationTime,
  onCustomCremationTimeChange,
  templeName,
  onTempleNameChange,
  pavilion,
  onPavilionChange,
  mapLink,
  onMapLinkChange,
  dressCode,
  onDressCodeChange,
  contactPhone,
  onContactPhoneChange,
  wreathPolicy,
  onWreathPolicyChange,
  milestones,
  onMilestonesChange,
}: {
  category: string;
  siteName: string;
  sLabels: ScheduleLabels;
  themeStyle3Label: string;
  formatThaiDate: (isoDate: string) => string;
  formatThaiDateRange: (start: string, end: string) => string;
  active: boolean;
  onActiveChange: (value: boolean) => void;
  cardMode: 'template' | 'custom';
  onCardModeChange: (mode: 'template' | 'custom') => void;
  orientation: AnnouncementOrientation;
  onOrientationChange: (value: AnnouncementOrientation) => void;
  showPhoto: boolean;
  onShowPhotoChange: (value: boolean) => void;
  customCardUrl: string;
  onCustomCardUrlChange: (url: string) => void;
  uploading: boolean;
  uploadError: string;
  onUploadErrorChange: (message: string) => void;
  onUploadFile: (file: File) => void;
  text: string;
  onTextChange: (value: string) => void;
  style: string;
  onStyleChange: (value: string) => void;
  fontFamily: string;
  onFontFamilyChange: (value: string) => void;
  siteFontFamily: string;
  avatarUrl: string;
  avatarScale: number;
  avatarX: number;
  avatarY: number;
  avatarRotate: number;
  waterDate: string;
  onWaterDateChange: (value: string) => void;
  waterTime: string;
  onWaterTimeChange: (value: string) => void;
  isCustomWaterTime: boolean;
  onCustomWaterTimeChange: (value: boolean) => void;
  abhidhammaDateRange: string;
  onAbhidhammaDateRangeChange: (value: string) => void;
  abhidhammaTime: string;
  onAbhidhammaTimeChange: (value: string) => void;
  isCustomAbhidhammaTime: boolean;
  onCustomAbhidhammaTimeChange: (value: boolean) => void;
  abhidhammaStartDate: string;
  abhidhammaEndDate: string;
  onAbhidhammaRangeChange: (start: string, end: string) => void;
  cremationDate: string;
  onCremationDateChange: (value: string) => void;
  cremationTime: string;
  onCremationTimeChange: (value: string) => void;
  isCustomCremationTime: boolean;
  onCustomCremationTimeChange: (value: boolean) => void;
  templeName: string;
  onTempleNameChange: (value: string) => void;
  pavilion: string;
  onPavilionChange: (value: string) => void;
  mapLink: string;
  onMapLinkChange: (value: string) => void;
  dressCode: string;
  onDressCodeChange: (value: string) => void;
  contactPhone: string;
  onContactPhoneChange: (value: string) => void;
  wreathPolicy: string;
  onWreathPolicyChange: (value: string) => void;
  milestones: CoupleMilestone[];
  onMilestonesChange: (value: CoupleMilestone[]) => void;
}) {
  const showOrientation = categorySupportsCardOrientation(category);
  const uploadHint = announcementUploadHint(orientation);
  const isTemplate = cardMode === 'template';
  const couple = isCoupleCategory(category);
  const single = usesSingleMilestoneSchedule(category);
  const theme = resolveAnnouncementCardTheme(category, style);
  const scheduleTitle = couple
    ? 'วันสำคัญของเรา'
    : single
      ? 'วันเวลานัดพบ'
      : 'วันเวลาพิธี';
  const detailsTitle = couple ? 'โน้ตเพิ่มเติม' : 'สถานที่และรายละเอียด';

  const previewCard = !active ? null : cardMode === 'custom' ? (
    customCardUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={customCardUrl} alt="พรีวิวการ์ด" className="h-full w-full object-contain bg-stone-50" />
    ) : (
      <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 p-6 text-center text-stone-400">
        <Upload className="size-6 text-stone-300" />
        <p className="text-xs font-medium">ยังไม่มีรูปการ์ด</p>
      </div>
    )
  ) : couple ? (
    <CoupleJourneyCard
      className={ANNOUNCEMENT_FRAMED_CARD_CLASS}
      tenantName={siteName}
      inviteText={text}
      inviteFallback={sLabels.invitePlaceholder}
      footerText={cardFooterText(category)}
      theme={theme}
      milestones={coupleMilestonesForSave(milestones)}
      timelineTitle="เส้นทางที่ผ่านมา"
      fontFamily={fontFamily}
      siteFontFamily={siteFontFamily}
      avatarUrl={avatarUrl}
      avatarScale={avatarScale}
      avatarX={avatarX}
      avatarY={avatarY}
      avatarRotate={avatarRotate}
      showPhoto={showPhoto}
      notes={dressCode}
      contactPhone={contactPhone}
    />
  ) : category === 'Friends' ? (
    <FriendsMeetupCard
      className={ANNOUNCEMENT_FRAMED_CARD_CLASS}
      tenantName={siteName}
      inviteText={text}
      inviteFallback={sLabels.invitePlaceholder}
      footerText={cardFooterText(category)}
      theme={theme}
      fontFamily={fontFamily}
      siteFontFamily={siteFontFamily}
      avatarUrl={avatarUrl}
      avatarScale={avatarScale}
      avatarX={avatarX}
      avatarY={avatarY}
      avatarRotate={avatarRotate}
      showPhoto={showPhoto}
      meetupDate={waterDate}
      meetupTime={waterTime}
      venueName={templeName}
      venueDetail={pavilion}
      mapLink={mapLink}
      notes={dressCode}
      contactPhone={contactPhone}
    />
  ) : (
    <MemorialScheduleCard
      className={ANNOUNCEMENT_FRAMED_CARD_CLASS}
      compact
      category={category}
      tenantName={siteName}
      inviteText={text}
      inviteFallback={sLabels.invitePlaceholder}
      labels={{
        title: sLabels.subtitle,
        item1: sLabels.item1,
        item2: sLabels.item2,
        item3: sLabels.item3,
        venueTitle: sLabels.venueLabel,
        venueLabel: sLabels.venueLabel.replace(' (VENUE)', ''),
        venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังสถานที่จัดงาน',
        guidelinesTitle: sLabels.guidelinesTitle,
        contactLabel: 'ติดต่อประสานงาน:',
        notesLabel: sLabels.notesLabel,
        footerText: cardFooterText(category),
      }}
      theme={theme}
      fontFamily={fontFamily}
      siteFontFamily={siteFontFamily}
      avatarUrl={avatarUrl}
      avatarScale={avatarScale}
      avatarX={avatarX}
      avatarY={avatarY}
      avatarRotate={avatarRotate}
      showPhoto={showPhoto}
      waterDate={waterDate}
      waterTime={waterTime}
      abhidhammaDateRange={abhidhammaDateRange}
      abhidhammaTime={abhidhammaTime}
      cremationDate={cremationDate}
      cremationTime={cremationTime}
      templeName={templeName}
      pavilion={pavilion}
      mapLink={mapLink}
      dressCode={dressCode}
      contactPhone={contactPhone}
      wreathPolicy={wreathPolicy}
      wreathPolicies={
        category === 'Wedding'
          ? {
              NORMAL: 'ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ',
              NO_FLOWERS: 'ขออภัย เจ้าภาพงดรับของขวัญ (เน้นการร่วมแสดงความยินดีและอวยพรแทน)',
              DONATION_ONLY: 'ขออภัย เจ้าภาพงดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)',
              NO_WREATH: 'ขออภัย เจ้าภาพงดรับซองและของขวัญทุกประเภท',
            }
          : {
              NORMAL: 'เปิดรับพวงหรีดแสดงความอาลัยตามปกติ',
              NO_FLOWERS: 'เจ้าภาพขอความร่วมมืองดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)',
              DONATION_ONLY: 'เจ้าภาพขอความร่วมมืองดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)',
              NO_WREATH: 'เจ้าภาพขอความร่วมมืองดรับพวงหรีดทุกประเภท',
            }
      }
      showWreathPolicy={category === 'Wedding' && !!wreathPolicy}
      isWedding={category === 'Wedding'}
    />
  );

  return (
    <div className="animate-fade-in text-left">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
      <div className="order-2 min-w-0 space-y-6 text-xs lg:order-1">
      <IdentitySectionHeader step={1} title="รูปแบบการ์ด" />

      <FieldGroup>
        <FieldSet className="gap-3">
          <FieldLegend className="sr-only">รูปแบบการ์ด</FieldLegend>
          <RadioGroup
            value={active ? 'on' : 'off'}
            onValueChange={(value) => onActiveChange(value === 'on')}
            className="grid-cols-2 gap-x-4"
          >
            <OptionRadio id="ann-card-on" value="on" label="แสดงการ์ด" />
            <OptionRadio id="ann-card-off" value="off" label="ไม่แสดง" />
          </RadioGroup>

          {active ? (
            <>
              <RadioGroup
                value={cardMode}
                onValueChange={(value) => {
                  if (value !== 'template' && value !== 'custom') return;
                  onCardModeChange(value);
                  if (value === 'custom') onUploadErrorChange('');
                }}
                className="grid-cols-2 gap-x-4"
              >
                <OptionRadio id="ann-card-template" value="template" label="แสดงการ์ดของระบบ" />
                <OptionRadio id="ann-card-custom" value="custom" label="อัปโหลดการ์ดของฉัน" />
              </RadioGroup>

              {showOrientation ? (
                <RadioGroup
                  value={orientation}
                  onValueChange={(value) => {
                    if (value === 'portrait' || value === 'landscape') {
                      onOrientationChange(value);
                    }
                  }}
                  className="grid-cols-2 gap-x-4"
                >
                  <OptionRadio id="ann-card-portrait" value="portrait" label="วางการ์ดแนวตั้ง 3:4" />
                  <OptionRadio id="ann-card-landscape" value="landscape" label="วางการ์ดแนวนอน 4:3" />
                </RadioGroup>
              ) : null}

              {cardMode === 'template' ? (
                <RadioGroup
                  value={showPhoto ? 'on' : 'off'}
                  onValueChange={(value) => onShowPhotoChange(value === 'on')}
                  className="grid-cols-2 gap-x-4"
                >
                  <OptionRadio id="ann-card-photo-on" value="on" label="แสดงรูปบนการ์ด" />
                  <OptionRadio id="ann-card-photo-off" value="off" label="ไม่แสดงรูปบนการ์ด" />
                </RadioGroup>
              ) : null}
            </>
          ) : null}
        </FieldSet>
      </FieldGroup>

      {active ? (
        <>
          {!isTemplate ? (
            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-stone-500">
                แนะนำขนาด <span className="font-semibold text-stone-700">{uploadHint.size}</span>
                {' '}(อัตราส่วน {uploadHint.ratio}) · รองรับ JPG, PNG, WEBP ไม่เกิน 10MB
              </p>
              <input
                type="file"
                id="announcement-card-file-input"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadFile(file);
                  e.target.value = '';
                }}
              />
              {customCardUrl ? (
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                  <div className="flex gap-2 p-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => document.getElementById('announcement-card-file-input')?.click()}
                      disabled={uploading}
                      className="h-9 flex-1 rounded-xl border border-stone-200 text-xs font-bold"
                    >
                      {uploading ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูป'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        onCustomCardUrlChange('');
                        onUploadErrorChange('');
                      }}
                      disabled={uploading}
                      className="h-9 rounded-xl border border-rose-200 px-3 text-xs font-bold text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => document.getElementById('announcement-card-file-input')?.click()}
                  className={cn(
                    'flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition',
                    uploading
                      ? 'cursor-wait border-[#0071e3]/40 bg-blue-50/40'
                      : 'cursor-pointer border-stone-300 bg-white hover:border-[#0071e3]/50 hover:bg-blue-50/20',
                  )}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-stone-100">
                    <Upload className="size-4 text-stone-500" />
                  </div>
                  <span className="text-xs font-bold text-stone-700">
                    {uploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัปโหลดการ์ด'}
                  </span>
                  <span className="max-w-[260px] text-xs leading-relaxed text-stone-400">
                    JPG, PNG หรือ WEBP · ไม่เกิน 10MB
                  </span>
                </button>
              )}
              {uploadError ? (
                <p className="flex items-start gap-1.5 text-xs font-semibold text-rose-600">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </p>
              ) : null}
              <p className="text-xs leading-relaxed text-stone-400">
                เหมาะกับการ์ดที่ออกแบบเองหรือสร้างจาก AI การ์ดจะแสดงเป็นรูปเต็มใบตามแนวที่เลือก
              </p>
            </div>
          ) : (
            <>
              <IdentitySectionHeader step={2} title="ธีมและตัวอักษร" />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-stone-900">รูปแบบธีมการ์ด</label>
                  <Select value={style} onValueChange={onStyleChange}>
                    <SelectTrigger className="h-10 w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-900 focus:border-emerald-500 focus:outline-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="ELEGANT_WHITE">Classic White (สีขาวเรียบหรู)</SelectItem>
                      <SelectItem value="WARM_CREAM">Warm Cream (สีครีมวินเทจ)</SelectItem>
                      <SelectItem value="CHARCOAL_SLATE">{themeStyle3Label}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-stone-900">ฟอนต์บนการ์ด</label>
                  <Select value={fontFamily} onValueChange={onFontFamilyChange}>
                    <SelectTrigger className="h-10 w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-900 focus:border-emerald-500 focus:outline-none">
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

              <IdentitySectionHeader step={3} title="ข้อความบนการ์ด" />
              <Textarea
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder={sLabels.invitePlaceholder}
                rows={2}
                className="min-h-16 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-500 focus:outline-none"
              />

              <IdentitySectionHeader step={4} title={scheduleTitle} />

              {couple ? (
                <CoupleMilestonesEditor
                  milestones={milestones}
                  onChange={onMilestonesChange}
                  formatThaiDate={formatThaiDate}
                />
              ) : (
                <div className="space-y-5">
                  <div className="space-y-3">
                    {!single ? (
                      <p className="text-sm font-medium text-stone-900">{sLabels.item1}</p>
                    ) : null}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-stone-900">
                        {single ? (sLabels.dateLabel || 'วันนัดพบ') : 'วันที่จัด'}
                      </label>
                      <DateField
                        value={waterDate}
                        onChange={onWaterDateChange}
                        placeholder={sLabels.item1Placeholder}
                        picker={
                          <ThaiDatePicker
                            variant="inline"
                            align="right"
                            onChange={(val) => {
                              if (val) onWaterDateChange(formatThaiDate(val));
                            }}
                          />
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-stone-900">
                        {single ? (sLabels.timeLabel || 'เวลานัด (ไม่บังคับ)') : 'เวลาเริ่ม'}
                      </label>
                      <TimePresetField
                        value={waterTime}
                        isCustom={isCustomWaterTime}
                        emptyLabel={single ? 'ไม่ระบุเวลา' : 'เลือกเวลา'}
                        defaultCustomTime="16:00 น."
                        onCustomChange={onCustomWaterTimeChange}
                        onValueChange={onWaterTimeChange}
                      />
                    </div>
                    </div>
                  </div>

                  {!single ? (
                    <>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-stone-900">{sLabels.item2}</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-stone-900">ช่วงวันที่จัด</label>
                          <DateField
                            value={abhidhammaDateRange}
                            onChange={onAbhidhammaDateRangeChange}
                            placeholder={sLabels.item2Placeholder}
                            picker={
                              <ThaiDatePicker
                                variant="inline"
                                mode="range"
                                align="right"
                                rangeStart={abhidhammaStartDate}
                                rangeEnd={abhidhammaEndDate}
                                onChangeRange={(start, end) => {
                                  onAbhidhammaRangeChange(start, end);
                                  if (start) onAbhidhammaDateRangeChange(formatThaiDateRange(start, end));
                                }}
                              />
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-stone-900">เวลาเริ่ม</label>
                          <TimePresetField
                            value={abhidhammaTime}
                            isCustom={isCustomAbhidhammaTime}
                            emptyLabel="เลือกเวลา"
                            defaultCustomTime="19:00 น."
                            onCustomChange={onCustomAbhidhammaTimeChange}
                            onValueChange={onAbhidhammaTimeChange}
                          />
                        </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-stone-900">{sLabels.item3}</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-stone-900">วันที่จัด</label>
                          <DateField
                            value={cremationDate}
                            onChange={onCremationDateChange}
                            placeholder={sLabels.item3Placeholder}
                            picker={
                              <ThaiDatePicker
                                variant="inline"
                                align="right"
                                onChange={(val) => {
                                  if (val) onCremationDateChange(formatThaiDate(val));
                                }}
                              />
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-stone-900">เวลาเริ่ม</label>
                          <TimePresetField
                            value={cremationTime}
                            isCustom={isCustomCremationTime}
                            emptyLabel="เลือกเวลา"
                            defaultCustomTime="16:00 น."
                            onCustomChange={onCustomCremationTimeChange}
                            onValueChange={onCremationTimeChange}
                          />
                        </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              <IdentitySectionHeader step={5} title={detailsTitle} />

              {!couple ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-600">
                        {category === 'Wedding'
                          ? 'สถานที่จัดงาน (เช่น โรงแรม/โบสถ์)'
                          : single
                            ? 'ชื่อสถานที่นัดพบ'
                            : 'ชื่อวัด / สถานที่จัดงาน'}
                      </label>
                      <Input
                        type="text"
                        value={templeName}
                        onChange={(e) => onTempleNameChange(e.target.value)}
                        placeholder={sLabels.venuePlaceholder}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-600">{sLabels.pavilionLabel}</label>
                      <Input
                        type="text"
                        value={pavilion}
                        onChange={(e) => onPavilionChange(e.target.value)}
                        placeholder={sLabels.pavilionPlaceholder}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-600">ลิงก์ Google Maps สำหรับนำทาง (ถ้ามี)</label>
                    <Input
                      type="text"
                      value={mapLink}
                      onChange={(e) => onMapLinkChange(e.target.value)}
                      placeholder="เช่น https://goo.gl/maps/..."
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-600">
                    {category === 'Wedding'
                      ? 'การแต่งกาย'
                      : couple
                        ? 'โน้ตทั่วไป'
                        : single
                          ? (sLabels.notesLabel || 'โน้ต / รายละเอียด')
                          : category === 'Family Legacy'
                            ? (sLabels.notesLabel || 'โน้ต / รายละเอียด')
                            : 'การแต่งกาย'}
                  </label>
                  <Input
                    type="text"
                    value={dressCode}
                    onChange={(e) => onDressCodeChange(e.target.value)}
                    placeholder={
                      category === 'Wedding'
                        ? 'เช่น ธีมสีชมพู/พาสเทล หรือ ตามความสะดวก'
                        : couple
                          ? 'เช่น ข้อความท้ายการ์ด หรือคำอธิษฐานถึงกัน'
                          : single
                            ? (sLabels.notesPlaceholder || 'เช่น แต่งตามสบาย, ธีมสีกลุ่ม')
                            : category === 'Family Legacy'
                              ? (sLabels.notesPlaceholder || 'เช่น แต่งกายสบาย ๆ, ของฝาก (ถ้ามี)')
                              : 'เช่น ชุดสุภาพสีขาว/ดำ'
                    }
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-600">เบอร์โทรติดต่อประสานงาน</label>
                  <Input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => onContactPhoneChange(e.target.value)}
                    placeholder="เช่น 081-234-5678"
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {!single && category !== 'Family Legacy' && !couple ? (
                <div className="space-y-1">
                  <label className="font-semibold text-stone-600">
                    {category === 'Wedding' ? 'นโยบายการรับซอง/ของขวัญ' : 'นโยบายการรับพวงหรีด'}
                  </label>
                  <Select value={wreathPolicy} onValueChange={onWreathPolicyChange}>
                    <SelectTrigger className="w-full cursor-pointer rounded-lg border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-900 focus:border-emerald-500 focus:outline-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {category === 'Wedding' ? (
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
              ) : null}
            </>
          )}
        </>
      ) : null}
      </div>
      <div className="order-1 lg:order-2">
      <AnnouncementPreviewSticky orientation={orientation} active={active}>
        {previewCard}
      </AnnouncementPreviewSticky>
      </div>
      </div>
    </div>
  );
}

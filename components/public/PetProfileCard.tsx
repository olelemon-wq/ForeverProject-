import {
  Cake,
  Heart,
  Star,
  Sparkles,
  Frown,
  PawPrint,
  type LucideIcon,
} from 'lucide-react';
import { resolveMediaSrc } from '@/lib/mediaUrl';

const PET_CARD_PATTERN = '/patterns/pet-condolence-floral-right.png';

export type PetProfileCardSubject = {
  name: string;
  avatarUrl?: string;
  breed?: string;
  personality?: string;
  favorite?: string;
  dislike?: string;
  isAlive?: boolean;
  birthDate?: string | null;
  deathDate?: string | null;
  birthYearOnly?: boolean;
  deathYearOnly?: boolean;
  birthYear?: number | null;
  deathYear?: number | null;
};

type PetProfileCardProps = {
  subject: PetProfileCardSubject;
  index: number;
  fallbackAvatar?: string;
};

function formatPetDate(
  raw?: string | null,
  yearOnly?: boolean,
  year?: number | null,
): string {
  if (yearOnly && year) return `พ.ศ. ${year + 543}`;
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getAgeLabel(subject: PetProfileCardSubject): string {
  const startDate = subject.birthDate ? new Date(subject.birthDate) : null;
  const endDate =
    !subject.isAlive && subject.deathDate ? new Date(subject.deathDate) : new Date();

  if (startDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    let totalMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      endDate.getMonth() -
      startDate.getMonth();
    if (endDate.getDate() < startDate.getDate()) totalMonths -= 1;
    totalMonths = Math.max(0, totalMonths);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const parts = [
      years > 0 ? `${years} ปี` : '',
      months > 0 ? `${months} เดือน` : '',
    ].filter(Boolean);
    if (parts.length === 0) return 'ไม่ถึง 1 เดือน';
    return parts.join(' ');
  }

  if (subject.birthYear) {
    const endYear =
      !subject.isAlive && subject.deathYear
        ? subject.deathYear
        : new Date().getFullYear();
    const years = Math.max(0, endYear - subject.birthYear);
    return years > 0 ? `ประมาณ ${years} ปี` : '';
  }

  return '';
}

export default function PetProfileCard({
  subject: s,
  index,
  fallbackAvatar,
}: PetProfileCardProps) {
  const petAvatar = s.avatarUrl || (index === 0 ? fallbackAvatar : '');
  const birth = formatPetDate(s.birthDate, s.birthYearOnly, s.birthYear);
  const passed = !s.isAlive
    ? formatPetDate(s.deathDate, s.deathYearOnly, s.deathYear)
    : '';
  const ageLabel = getAgeLabel(s);

  const details = [
    birth && { icon: Cake, label: 'วันเกิด / วันที่รับมา', value: birth },
    passed && { icon: Star, label: 'วันที่จากไป', value: passed },
    s.personality && { icon: Sparkles, label: 'บุคลิก', value: s.personality },
    s.favorite && { icon: Heart, label: 'ของโปรด', value: s.favorite },
    s.dislike && { icon: Frown, label: 'สิ่งที่ไม่ชอบ', value: s.dislike },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100/60 bg-[#fbfdfb] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[54%] w-[46%] min-h-[108px] max-w-[132px] bg-[length:auto_100%] bg-right-bottom bg-no-repeat opacity-[0.4] sm:max-w-[148px]"
        style={{
          backgroundImage: `url(${PET_CARD_PATTERN})`,
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 100% 100%, black 0%, rgba(0,0,0,0.6) 38%, transparent 74%)',
          maskImage:
            'radial-gradient(ellipse 90% 80% at 100% 100%, black 0%, rgba(0,0,0,0.6) 38%, transparent 74%)',
        }}
        aria-hidden
      />

      <div
        className="relative flex flex-col items-center px-6 pb-5 pt-8 text-center"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--theme-primary) 8%, white), transparent)',
        }}
      >
        <span
          className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            s.isAlive
              ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border border-amber-100 bg-amber-50 text-amber-700'
          }`}
        >
          {s.isAlive ? (
            <Heart className="h-3 w-3" aria-hidden />
          ) : (
            <Star className="h-3 w-3" aria-hidden />
          )}
          {s.isAlive ? 'อยู่ด้วยกัน' : 'ในความทรงจำ'}
        </span>

        <div
          className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-stone-50 shadow-lg ring-1 ring-stone-200"
          style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, white)' }}
        >
          {petAvatar ? (
            <img
              src={resolveMediaSrc(petAvatar)}
              alt={`รูปประจำตัวของ ${s.name}`}
              width={112}
              height={112}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <PawPrint
              className="h-10 w-10 opacity-50"
              style={{ color: 'var(--theme-primary)' }}
              aria-hidden
            />
          )}
        </div>

        <h3 className="mt-4 text-xl font-black text-stone-900">{s.name}</h3>
        {s.breed && <p className="mt-1 text-xs font-medium text-stone-500">{s.breed}</p>}
        {ageLabel && (
          <span
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
            style={{
              color: 'var(--theme-primary)',
              backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, white)',
            }}
          >
            <Cake className="h-3.5 w-3.5" aria-hidden />
            {s.isAlive ? `อายุ ${ageLabel}` : `ช่วงเวลาที่อยู่ด้วยกัน ${ageLabel}`}
          </span>
        )}
      </div>

      {details.length > 0 && (
        <div className="relative flex-1 px-5 pb-6 pt-1 sm:px-6">
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, white)',
                  }}
                >
                  <detail.icon
                    className="h-4 w-4"
                    style={{ color: 'var(--theme-primary)' }}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-[11px] font-semibold text-stone-400">{detail.label}</dt>
                  <dd className="mt-0.5 break-words text-sm font-bold leading-relaxed text-stone-700">
                    {detail.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}

import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { GitBranch, Flame } from 'lucide-react';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getFamilyMembers(websiteId: string) {
  return await db.familyMember.findMany({
    where: { websiteId },
  });
}

function FamilyNode({
  name,
  relationship,
  birthYear,
  deathYear,
  isDeceased,
  avatarUrl,
  isMain = false,
}: {
  name: string;
  relationship: string;
  birthYear: string | null;
  deathYear: string | null;
  isDeceased: boolean;
  avatarUrl?: string | null;
  isMain?: boolean;
}) {
  let tagColor = 'bg-stone-500';
  let borderColor = 'border-stone-200';
  let placeholderBg = 'bg-stone-100 text-stone-600';
  let relName = '';

  switch (relationship) {
    case 'PARENT_1':
      tagColor = 'bg-purple-600';
      borderColor = 'border-purple-200';
      placeholderBg = 'bg-purple-50 text-purple-600';
      relName = 'บิดา';
      break;
    case 'PARENT_2':
      tagColor = 'bg-purple-600';
      borderColor = 'border-purple-200';
      placeholderBg = 'bg-purple-50 text-purple-600';
      relName = 'มารดา';
      break;
    case 'SPOUSE':
      tagColor = 'bg-emerald-600';
      borderColor = 'border-emerald-200';
      placeholderBg = 'bg-emerald-50 text-emerald-700';
      relName = 'คู่สมรส';
      break;
    case 'SIBLING':
      tagColor = 'bg-amber-500';
      borderColor = 'border-amber-200';
      placeholderBg = 'bg-amber-50 text-amber-700';
      relName = 'พี่น้อง';
      break;
    case 'CHILD':
      tagColor = 'bg-blue-600';
      borderColor = 'border-blue-200';
      placeholderBg = 'bg-blue-50 text-blue-700';
      relName = 'บุตร/ธิดา';
      break;
    default:
      tagColor = 'bg-stone-550';
      borderColor = 'border-stone-200';
      placeholderBg = 'bg-stone-100 text-stone-600';
      relName = relationship;
  }

  if (isMain) {
    tagColor = 'bg-rose-600';
    borderColor = 'border-rose-300 ring-4 ring-rose-50';
    placeholderBg = 'bg-rose-50 text-rose-600';
    relName = 'ผู้ล่วงลับ';
  }

  return (
    <div className="flex flex-col items-center group relative z-10">
      {/* Circle Avatar with Border */}
      <div 
        className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 shadow-md bg-stone-50 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${borderColor}`}
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`;
            }}
          />
        ) : isDeceased ? (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100/50 flex items-center justify-center">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 animate-pulse" />
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-bold text-sm sm:text-base ${placeholderBg}`}>
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <span className="text-[11px] sm:text-xs font-black text-stone-900 mt-2.5 block max-w-[110px] truncate text-center transition group-hover:text-stone-950">
        {name}
      </span>

      {/* Role Tag */}
      <div className={`px-2.5 py-0.5 mt-1 rounded-full text-[8px] font-extrabold uppercase tracking-wider text-white shadow-3xs ${tagColor}`}>
        {relName}
      </div>

      {/* Lifespan */}
      <span className="text-[9px] text-stone-400 mt-1 font-semibold flex items-center gap-0.5">
        <span>{birthYear || 'N/A'} - {deathYear || 'N/A'}</span>
        {isDeceased && <Flame className="w-2.5 h-2.5 text-stone-400" />}
      </span>
    </div>
  );
}

export default async function PublicFamilyTreePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const members = await getFamilyMembers(tenant.id);

  // Group members into 3 generations for direct presentation
  const parents = members.filter(m => m.relationship === 'PARENT_1' || m.relationship === 'PARENT_2');
  const spouses = members.filter(m => m.relationship === 'SPOUSE');
  const siblings = members.filter(m => m.relationship === 'SIBLING');
  const children = members.filter(m => m.relationship === 'CHILD');

  // Deceased Lifespan Extract from default strings (Mock years or mock defaults)
  const deceasedBirthYear = '2488';
  const deceasedDeathYear = '2569';

  return (
    <div className="space-y-10 animate-fade-in text-center font-sans">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <GitBranch className="w-5 h-5" />
          <span>แผนผังครอบครัวและเครือญาติ (Family Tree)</span>
        </h2>
        <p className="text-stone-500 text-xs leading-normal max-w-md mx-auto">
          ผังลำดับเครือญาติเชื่อมโยง 3 รุ่นของผู้ล่วงลับ แสดงความสัมพันธ์ของบิดา-มารดา คู่สมรส พี่น้อง และทายาทสืบตระกูล
        </p>
      </div>

      {/* Visual Family Tree Flowchart Wrapper */}
      <div className="w-full mx-auto space-y-8 p-6 sm:p-10 rounded-3xl border border-stone-205/60 bg-stone-50/30 shadow-sm relative overflow-hidden">
        
        {/* GENERATION 1: PARENTS */}
        {parents.length > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-4 block">
              รุ่นบรรพบุรุษ (Parents)
            </span>
            <div className="relative">
              <div className="flex justify-center gap-16 sm:gap-24">
                {parents.map(p => (
                  <FamilyNode
                    key={p.id}
                    name={p.name}
                    relationship={p.relationship}
                    birthYear={p.birthYear}
                    deathYear={p.deathYear}
                    isDeceased={p.isDeceased}
                    avatarUrl={p.avatarUrl}
                  />
                ))}
              </div>
              {/* Horizontal line connecting parents */}
              {parents.length > 1 && (
                <div className="absolute top-9 sm:top-10 left-[20%] right-[20%] h-0.5 bg-stone-300/80 -z-10 hidden sm:block" />
              )}
            </div>
            {/* Vertical connector line */}
            <div className="w-0.5 h-8 bg-stone-300/80" />
          </div>
        )}

        {/* GENERATION 2: DECEASED & SPOUSES & SIBLINGS */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-4 block">
            รุ่นผู้ล่วงลับและคู่สมรส (Deceased, Spouses & Siblings)
          </span>
          <div className="relative w-full">
            <div className="flex flex-wrap justify-center items-start gap-12 sm:gap-16">
              
              {/* SIBLINGS (Left Branch) */}
              {siblings.map(sib => (
                <FamilyNode
                  key={sib.id}
                  name={sib.name}
                  relationship={sib.relationship}
                  birthYear={sib.birthYear}
                  deathYear={sib.deathYear}
                  isDeceased={sib.isDeceased}
                  avatarUrl={sib.avatarUrl}
                />
              ))}

              {/* MAIN DECEASED NODE */}
              <FamilyNode
                name={tenant.name.replace('คุณพ่อ ', '').replace('คุณแม่ ', '')}
                relationship="DECEASED"
                birthYear={deceasedBirthYear}
                deathYear={deceasedDeathYear}
                isDeceased={true}
                isMain={true}
              />

              {/* SPOUSES (Right Branch) */}
              {spouses.map(sp => (
                <FamilyNode
                  key={sp.id}
                  name={sp.name}
                  relationship={sp.relationship}
                  birthYear={sp.birthYear}
                  deathYear={sp.deathYear}
                  isDeceased={sp.isDeceased}
                  avatarUrl={sp.avatarUrl}
                />
              ))}
            </div>

            {/* Horizontal line between Deceased and Spouse */}
            {spouses.length > 0 && (
              <div className="absolute top-9 sm:top-10 left-[35%] right-[15%] h-0.5 bg-stone-300/80 -z-10 hidden sm:block" />
            )}
          </div>
          
          {/* Vertical connector to children */}
          {children.length > 0 && (
            <div className="w-0.5 h-8 bg-stone-300/80" />
          )}
        </div>

        {/* GENERATION 3: CHILDREN */}
        {children.length > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider mb-4 block">
              รุ่นผู้สืบทอดทายาท (Children)
            </span>
            <div className="relative w-full">
              {/* Horizontal bar across children */}
              {children.length > 1 && (
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-stone-300/80 hidden sm:block" 
                  style={{ width: `calc(100% - ${100 / children.length}%)`, maxWidth: '500px' }}
                />
              )}
              
              <div className="flex flex-wrap justify-center gap-10 sm:gap-14 pt-4">
                {children.map(c => (
                  <div key={c.id} className="relative">
                    {/* Vertical tick line */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-stone-300/80 hidden sm:block" />
                    <FamilyNode
                      name={c.name}
                      relationship={c.relationship}
                      birthYear={c.birthYear}
                      deathYear={c.deathYear}
                      isDeceased={c.isDeceased}
                      avatarUrl={c.avatarUrl}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="pt-4">
        <Link href={`/${slug}`} className="px-6 py-2.5 rounded-full border border-stone-300 text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs font-semibold transition cursor-pointer">
          ย้อนกลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}

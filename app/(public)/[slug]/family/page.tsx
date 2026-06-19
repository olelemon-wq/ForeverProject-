import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';

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

export default async function PublicFamilyTreePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const members = await getFamilyMembers(tenant.id);

  // Group members into 3 generations for direct presentation (GRILL DECISION)
  const parents = members.filter(m => m.relationship === 'PARENT_1' || m.relationship === 'PARENT_2');
  const spouses = members.filter(m => m.relationship === 'SPOUSE');
  const siblings = members.filter(m => m.relationship === 'SIBLING');
  const children = members.filter(m => m.relationship === 'CHILD');

  // Deceased Lifespan Extract from default strings (Mock years or mock defaults)
  const deceasedBirthYear = '2488';
  const deceasedDeathYear = '2569';

  return (
    <div className="space-y-12 animate-fade-in text-center font-sans">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <span>🌳</span> แผนผังครอบครัวและเครือญาติ (Family Tree)
        </h2>
        <p className="text-stone-500 text-xs leading-normal max-w-md mx-auto">
          ผังลำดับเครือญาติ 3 รุ่นของผู้ล่วงลับ แสดงความสัมพันธ์ของบรรพบุรุษ คู่สมรส พี่น้อง และทายาทสืบตระกูล
        </p>
      </div>

      {/* Visual Family Tree Flowchart Wrapper */}
      <div className="max-w-xl mx-auto space-y-10 p-6 rounded-3xl border border-stone-205/60 bg-stone-50/30 shadow-sm relative">
        
        {/* GENERATION 1: PARENTS */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider">รุ่นบรรพบุรุษ (Parents)</span>
          <div className="flex justify-center gap-4">
            {parents.length === 0 ? (
              <div className="px-4 py-2 border border-stone-200 bg-stone-50/80 rounded-xl text-xs text-stone-600 italic">ไม่ระบุข้อมูลบิดา/มารดา</div>
            ) : (
              parents.map(p => (
                <div key={p.id} className="px-4 py-3 rounded-2xl border border-stone-200 bg-white min-w-[120px] shadow-sm">
                  <p className="text-xs font-bold text-stone-900">{p.name}</p>
                  <p className="text-[10px] text-stone-500 font-semibold">{p.birthYear || 'N/A'} - {p.deathYear || 'N/A'} {p.isDeceased && '🕯️'}</p>
                  <span className="text-[9px] text-stone-400 block mt-1">บิดา/มารดา</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connector vertical line */}
        <div className="w-0.5 h-6 bg-stone-300 mx-auto" />

        {/* GENERATION 2: DECEASED & SPOUSES & SIBLINGS */}
        <div className="space-y-4">
          <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider block">รุ่นผู้ล่วงลับและคู่สมรส (Deceased & Spouses)</span>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            
            {/* Siblings on Left (if any) */}
            {siblings.map(sib => (
              <div key={sib.id} className="px-4 py-3 rounded-2xl border border-stone-200 bg-white min-w-[110px] shadow-sm">
                <p className="text-xs font-bold text-stone-800">{sib.name}</p>
                <p className="text-[9px] text-stone-500">{sib.birthYear || 'N/A'} - {sib.deathYear || 'N/A'} {sib.isDeceased && '🕯️'}</p>
                <span className="text-[8px] text-stone-400 block mt-1">พี่น้อง</span>
              </div>
            ))}

            {/* MAIN DECEASED CARD (HIGHLIGHTED) */}
            <div 
              className="px-5 py-4 rounded-3xl border bg-white min-w-[150px] shadow-md relative"
              style={{ borderColor: 'var(--theme-primary, #0d9488)', borderWidth: '2px' }}
            >
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 border text-[8px] font-bold px-2.5 py-0.5 rounded-full bg-white z-10"
                    style={{ color: 'var(--theme-primary, #0d9488)', borderColor: 'var(--theme-primary, #0d9488)' }}>
                ผู้ล่วงลับ
              </span>
              <p className="text-sm font-black text-stone-900 mt-1">{tenant.name.replace('คุณพ่อ ', '').replace('คุณแม่ ', '')}</p>
              <p className="text-[10px] text-stone-600 font-semibold mt-1">{deceasedBirthYear} - {deceasedDeathYear} 🕯️</p>
            </div>

            {/* Spouses on Right (if any) */}
            {spouses.length === 0 ? (
              <div className="px-4 py-3 border border-dashed border-stone-300 rounded-2xl text-[10px] text-stone-600 italic">ไม่มีข้อมูลคู่สมรส</div>
            ) : (
              spouses.map(sp => (
                <div key={sp.id} className="px-4 py-3 rounded-2xl border border-stone-200 bg-white min-w-[120px] shadow-sm">
                  <p className="text-xs font-bold text-stone-900">{sp.name}</p>
                  <p className="text-[10px] text-stone-500">{sp.birthYear || 'N/A'} - {sp.deathYear || 'N/A'} {sp.isDeceased && '🕯️'}</p>
                  <span className="text-[9px] text-stone-400 block mt-1">คู่สมรส</span>
                </div>
              ))
            )}

          </div>
        </div>

        {/* Connector vertical line */}
        <div className="w-0.5 h-6 bg-stone-300 mx-auto" />

        {/* GENERATION 3: CHILDREN */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider">รุ่นผู้สืบทอดทายาท (Children)</span>
          <div className="flex flex-wrap justify-center gap-4">
            {children.length === 0 ? (
              <div className="px-4 py-2 border border-stone-200 bg-stone-50/80 rounded-xl text-xs text-stone-600 italic">ไม่ระบุข้อมูลบุตร/ธิดา</div>
            ) : (
              children.map(c => (
                <div key={c.id} className="px-4 py-3 rounded-2xl border border-stone-200 bg-white min-w-[120px] shadow-sm">
                  <p className="text-xs font-bold text-stone-900">{c.name}</p>
                  <p className="text-[10px] text-stone-500 font-semibold">{c.birthYear || 'N/A'} - {c.deathYear || 'N/A'} {c.isDeceased && '🕯️'}</p>
                  <span className="text-[9px] text-stone-400 block mt-1">บุตร/ธิดา</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="pt-4">
        <Link href={`/${slug}`} className="px-6 py-2.5 rounded-full border border-stone-300 text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-xs transition">
          ย้อนกลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}

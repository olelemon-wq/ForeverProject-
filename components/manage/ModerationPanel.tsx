'use client';

import type { ComponentType, ReactNode } from 'react';
import { Camera, Check, Flag, Flame, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CondolenceRow = {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  createdAt: string;
};

type ReportedRow = {
  condolence: CondolenceRow;
  reports: Array<{
    id: string;
    reasonLabel: string;
    details: string | null;
    createdAt: string;
  }>;
};

type MemoryPostRow = {
  id: string;
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  senderName: string;
  createdAt: string;
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  Family: 'ครอบครัวใกล้ชิด',
  Relative: 'ญาติพี่น้อง',
  Friend: 'เพื่อน',
  Colleague: 'เพื่อนร่วมงาน',
};

function formatModerationDate(value: string) {
  return new Date(value).toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function relationshipLabel(value: string) {
  if (!value || value === '—') return null;
  return RELATIONSHIP_LABELS[value] ?? value;
}

function SectionHeading({
  icon: Icon,
  title,
  count,
  tone = 'default',
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  count: number;
  tone?: 'default' | 'alert';
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-lg',
            tone === 'alert' ? 'bg-rose-500/10 text-rose-600' : 'bg-[#0071e3]/10 text-[#0071e3]',
          )}
        >
          <Icon className="size-3.5" aria-hidden />
        </div>
        <h3 className="truncate text-sm font-bold text-stone-900">{title}</h3>
      </div>
      {count > 0 && (
        <span
          className={cn(
            'inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums text-white',
            tone === 'alert' ? 'bg-rose-500' : 'bg-amber-500',
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyQueue({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-stone-200/90 bg-stone-50/50 px-4 py-5 text-center text-xs text-stone-500">
      {message}
    </p>
  );
}

function AuthorMeta({
  name,
  relationship,
  createdAt,
  tone = 'default',
}: {
  name: string;
  relationship: string | null;
  createdAt?: string;
  tone?: 'default' | 'alert';
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <div
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          tone === 'alert'
            ? 'border border-rose-100 bg-white text-rose-600'
            : 'bg-[#0071e3]/10 text-[#0071e3]',
        )}
      >
        {name?.charAt(0) || '?'}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-stone-900">{name}</p>
        <p className="truncate text-xs text-stone-500">
          {[relationship, createdAt ? formatModerationDate(createdAt) : null].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}

function MessageQuote({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'alert' }) {
  return (
    <p
      className={cn(
        'line-clamp-3 text-xs leading-relaxed text-stone-600 sm:line-clamp-4 sm:text-sm',
        tone === 'alert' ? 'border-l-2 border-rose-200 pl-2.5' : 'border-l-2 border-stone-200 pl-2.5',
      )}
    >
      &ldquo;{children}&rdquo;
    </p>
  );
}

function ApproveDeleteActions({
  onApprove,
  onDelete,
}: {
  onApprove: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onDelete}
        className="size-8 rounded-lg border-stone-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        aria-label="ลบออก"
        title="ลบออก"
      >
        <Trash2 className="size-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={onApprove}
        className="h-8 rounded-lg bg-emerald-600 px-2.5 text-xs font-bold text-white hover:bg-emerald-700 sm:px-3 sm:text-xs"
        aria-label="อนุมัติเผยแพร่"
      >
        <Check className="size-3.5 sm:mr-1" />
        <span className="hidden sm:inline">อนุมัติ</span>
      </Button>
    </div>
  );
}

function ReportActions({
  onKeep,
  onDelete,
}: {
  onKeep: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onKeep}
        className="size-8 rounded-lg border-stone-200 text-stone-600"
        aria-label="ปิดรายงาน"
        title="ปิดรายงาน"
      >
        <X className="size-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={onDelete}
        className="h-8 rounded-lg bg-rose-600 px-2.5 text-xs font-bold text-white hover:bg-rose-700 sm:px-3 sm:text-xs"
        aria-label="ลบข้อความ"
      >
        <Trash2 className="size-3.5 sm:mr-1" />
        <span className="hidden sm:inline">ลบ</span>
      </Button>
    </div>
  );
}

type ModerationPanelProps = {
  category: string;
  showCondolence: boolean;
  showMemory: boolean;
  condolences: CondolenceRow[];
  reportedCondolences: ReportedRow[];
  pendingPosts: MemoryPostRow[];
  onApproveCondolence: (id: string) => void;
  onDeleteCondolence: (id: string) => void;
  onKeepReported: (id: string) => void;
  onDeleteReported: (id: string) => void;
  onApproveMemory: (id: string) => void;
  onDeleteMemory: (id: string) => void;
};

export default function ModerationPanel({
  category,
  showCondolence,
  showMemory,
  condolences,
  reportedCondolences,
  pendingPosts,
  onApproveCondolence,
  onDeleteCondolence,
  onKeepReported,
  onDeleteReported,
  onApproveMemory,
  onDeleteMemory,
}: ModerationPanelProps) {
  const pendingTitle =
    category === 'Friends'
      ? 'รออนุมัติ'
      : category === 'Couple' || category === 'Wedding'
        ? 'คำอวยพรรออนุมัติ'
        : 'คำไว้อาลัยรออนุมัติ';

  const totalPending = condolences.length + reportedCondolences.length + pendingPosts.length;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">กลั่นกรองเนื้อหา</h2>
          <p className="mt-0.5 hidden text-xs text-stone-500 sm:block">
            ตรวจสอบข้อความก่อนเผยแพร่ หรือจัดการรายการที่ถูกแจ้ง
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold text-stone-600">
          {showCondolence && (
            <>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 tabular-nums">รอ {condolences.length}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 tabular-nums',
                  reportedCondolences.length > 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100',
                )}
              >
                แจ้ง {reportedCondolences.length}
              </span>
            </>
          )}
          {showMemory && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 tabular-nums">
              Memory {pendingPosts.length}
            </span>
          )}
          {totalPending === 0 && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800">ว่าง</span>
          )}
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm sm:rounded-3xl">
        {showCondolence && (
          <section className="space-y-3 p-3 sm:p-5">
            <SectionHeading icon={Flame} title={pendingTitle} count={condolences.length} />

            {condolences.length === 0 ? (
              <EmptyQueue message="ไม่มีข้อความค้างอนุมัติ" />
            ) : (
              <ul className="divide-y divide-stone-100 rounded-xl border border-stone-100">
                {condolences.map((item) => (
                  <li key={item.id} className="space-y-2 p-3 sm:p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <AuthorMeta
                        name={item.senderName}
                        relationship={relationshipLabel(item.relationship)}
                        createdAt={item.createdAt}
                      />
                      <ApproveDeleteActions
                        onApprove={() => onApproveCondolence(item.id)}
                        onDelete={() => onDeleteCondolence(item.id)}
                      />
                    </div>
                    <MessageQuote>{item.message}</MessageQuote>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {showCondolence && (
          <section
            className={cn(
              'space-y-3 border-t border-stone-100 p-3 sm:p-5',
              reportedCondolences.length > 0 && 'bg-rose-50/15',
            )}
          >
            <SectionHeading
              icon={Flag}
              title="ถูกแจ้งไม่เหมาะสม"
              count={reportedCondolences.length}
              tone="alert"
            />

            {reportedCondolences.length === 0 ? (
              <EmptyQueue message="ไม่มีรายงานค้างตรวจสอบ" />
            ) : (
              <ul className="divide-y divide-rose-100/70 rounded-xl border border-rose-100/80">
                {reportedCondolences.map((item) => (
                  <li key={item.condolence.id} className="space-y-2 p-3 sm:p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <AuthorMeta
                        name={item.condolence.senderName}
                        relationship={relationshipLabel(item.condolence.relationship)}
                        createdAt={item.condolence.createdAt}
                        tone="alert"
                      />
                      <ReportActions
                        onKeep={() => onKeepReported(item.condolence.id)}
                        onDelete={() => onDeleteReported(item.condolence.id)}
                      />
                    </div>
                    <MessageQuote tone="alert">{item.condolence.message}</MessageQuote>
                    {item.reports.map((report) => (
                      <p
                        key={report.id}
                        className="rounded-lg bg-rose-50/80 px-2.5 py-1.5 text-xs leading-snug text-rose-950/80"
                      >
                        <span className="font-semibold text-rose-950">{report.reasonLabel}</span>
                        {report.details ? ` — ${report.details}` : ''}
                        <span className="ml-1 text-rose-900/65 tabular-nums">
                          · {formatModerationDate(report.createdAt)}
                        </span>
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {showMemory && (
          <section className="space-y-3 border-t border-stone-100 p-3 sm:p-5">
            <SectionHeading icon={Camera} title="Memory Wall รออนุมัติ" count={pendingPosts.length} />

            {pendingPosts.length === 0 ? (
              <EmptyQueue message="ไม่มีเรื่องราวค้างอนุมัติ" />
            ) : (
              <ul className="divide-y divide-stone-100 rounded-xl border border-stone-100">
                {pendingPosts.map((post) => (
                  <li key={post.id} className="space-y-2 p-3 sm:p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <AuthorMeta name={post.senderName} relationship={null} createdAt={post.createdAt} />
                        {post.title && (
                          <span className="inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">
                            {post.title}
                          </span>
                        )}
                        {post.mediaUrl && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0071e3]">
                            <ImageIcon className="size-3" />
                            แนบรูปภาพ
                          </span>
                        )}
                      </div>
                      <ApproveDeleteActions
                        onApprove={() => onApproveMemory(post.id)}
                        onDelete={() => onDeleteMemory(post.id)}
                      />
                    </div>
                    {post.content && <MessageQuote>{post.content}</MessageQuote>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

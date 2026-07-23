import { Calendar, ExternalLink, MapPin } from 'lucide-react';
import type { CoupleMilestone } from '@/lib/coupleMilestones';

interface CoupleMilestoneListProps {
  milestones: CoupleMilestone[];
  title?: string;
  headingColorClass: string;
  innerCardBg: string;
  textMutedClass: string;
  compact?: boolean;
}

export default function CoupleMilestoneList({
  milestones,
  title = 'วันสำคัญของเรา',
  headingColorClass,
  innerCardBg,
  textMutedClass,
  compact = false,
}: CoupleMilestoneListProps) {
  if (milestones.length === 0) return null;

  return (
    <div className="space-y-4 text-left">
      <h3
        className={`${compact ? 'text-[10px]' : 'text-xs'} font-black uppercase tracking-wider flex items-center gap-1.5 ${headingColorClass}`}
      >
        <Calendar className="w-4 h-4" />
        <span>{title}</span>
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id || `milestone-${index}`}
            className={`${compact ? 'p-3' : 'p-4'} rounded-2xl border ${innerCardBg}`}
          >
            <h4 className={`text-xs font-bold ${headingColorClass}`}>
              {milestone.title || `วันสำคัญที่ ${index + 1}`}
            </h4>
            {(milestone.date || milestone.time) && (
              <p className={`text-sm mt-1 font-bold ${headingColorClass}`}>
                {[milestone.date, milestone.time ? `เวลา ${milestone.time}` : '']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
            {milestone.place && (
              <p className={`text-xs mt-2 flex items-start gap-1.5 ${textMutedClass}`}>
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{milestone.place}</span>
              </p>
            )}
            {milestone.note && (
              <p className={`text-xs mt-1.5 ${textMutedClass}`}>{milestone.note}</p>
            )}
            {milestone.mapLink && (
              <a
                href={milestone.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-2 bg-stone-900 hover:bg-black text-white text-[11px] font-bold rounded-xl transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดแผนที่</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

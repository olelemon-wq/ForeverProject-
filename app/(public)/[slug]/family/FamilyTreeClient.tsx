'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  Handle, 
  Position, 
  useNodesState, 
  useEdgesState,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize2, Minimize2, GitBranch, Heart, RotateCw, ArrowLeft } from 'lucide-react';
import { getInitialLetter } from '@/lib/utils';
import Link from 'next/link';
import { getFeatureLabel } from '@/lib/categories';
import CategoryOrnament from '@/components/public/CategoryOrnament';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';
import { clampImagePan, imageTransformStyle, toRelativeOffset } from '@/lib/imagePosition';
import { resolveMediaSrc } from '@/lib/mediaUrl';

interface FamilyMember {
  id: string;
  name: string;
  nickname?: string | null;
  relationship: string;
  birthYear: string | null;
  deathYear: string | null;
  isDeceased: boolean;
  hideAge?: boolean;
  avatarUrl?: string | null;
  avatarScale?: number | null;
  avatarX?: number | null;
  avatarY?: number | null;
  avatarRotate?: number | null;
  spouseOfId?: string | null;
  parentId?: string | null;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  themeConfig?: any;
  category?: string;
}

interface FamilyTreeClientProps {
  tenant: Tenant;
  members: FamilyMember[];
}

// Custom Node for Family Member
function CustomFamilyNode({ data }: { data: any }) {
  const { 
    name, 
    nickname,
    birthYear, 
    deathYear, 
    isDeceased, 
    hideAge,
    avatarUrl, 
    isMain, 
    ringColor, 
    placeholderBg,
    avatarScale,
    avatarX,
    avatarY,
    avatarRotate,
    imageCoordSpace,
  } = data;
  const [imageError, setImageError] = useState(false);
  
  const getAgeText = () => {
    if (!birthYear) return '';
    const b = parseInt(birthYear, 10);
    if (isNaN(b)) return '';
    const currentBE = new Date().getFullYear() + 543;
    if (isDeceased) {
      if (!deathYear) return '';
      const d = parseInt(deathYear, 10);
      if (isNaN(d)) return '';
      const age = d - b;
      return age > 0 ? `อายุ ${age} ปี` : '';
    } else {
      const age = currentBE - b;
      return age > 0 ? `อายุ ${age} ปี` : '';
    }
  };

  const lifespanText = hideAge ? '' : getAgeText();

  let cleanedAvatarUrl = resolveMediaSrc(avatarUrl || '');
  const hasValidAvatar = !!cleanedAvatarUrl && !imageError;

  const avatarImgStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
  if (isMain) {
    const scale = avatarScale || 1;
    const x = clampImagePan(toRelativeOffset(avatarX || 0, 224, imageCoordSpace), scale);
    const y = clampImagePan(toRelativeOffset(avatarY || 0, 224, imageCoordSpace), scale);
    Object.assign(avatarImgStyle, imageTransformStyle({
      x,
      y,
      scale,
      rotate: avatarRotate || 0,
    }));
  }

  return (
    <div className="flex flex-col items-center group select-none w-[130px] bg-transparent relative">
      {/* Target handle at Top for parent-to-child connections */}
      <Handle type="target" position={Position.Top} className="opacity-0" id="top" />
      {/* Handles at Left, Right aligned with the avatar center/top of card */}
      <Handle type="source" position={Position.Left} className="opacity-0" id="left" style={{ top: '32px' }} />
      <Handle type="source" position={Position.Right} className="opacity-0" id="right" style={{ top: '32px' }} />
      {/* Bottom handle at bottom of card */}
      <Handle type="source" position={Position.Bottom} className="opacity-0" id="bottom" style={{ top: 'auto', bottom: '0px' }} />

      {/* Circle Avatar (Z-Index is high to overlap the card) */}
      <div 
        className={`w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-md z-10 border-2 relative ${ringColor}`}
      >
        {hasValidAvatar ? (
          <img 
            src={cleanedAvatarUrl} 
            alt={name} 
            className="pointer-events-none" 
            draggable={false}
            style={avatarImgStyle}
            onError={() => {
              setImageError(true);
            }}
          />
        ) : isDeceased ? (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100/50 flex items-center justify-center font-bold text-lg text-amber-600">
            {getInitialLetter(name)}
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-bold text-lg ${placeholderBg}`}>
            {getInitialLetter(name)}
          </div>
        )}
      </div>

      {/* Name Card (Positioned slightly overlapping under the avatar) */}
      <div className="w-full bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_10px_30px_-5px_rgba(0,0,0,0.03)] pt-9 pb-3 px-2 text-center -mt-8 flex flex-col justify-center min-h-[100px] z-0 transition-all duration-300 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.06),0_20px_40px_-5px_rgba(0,0,0,0.06)]">
        {(() => {
          const parts = name.split(/\s+/).filter(Boolean);
          const firstName = parts[0] || '';
          const lastName = parts.slice(1).join(' ');
          
          const firstNameClass = firstName.length > 12 
            ? 'text-[9.5px] sm:text-xs font-bold text-stone-900 block w-full whitespace-normal break-words leading-tight transition group-hover:text-stone-955'
            : 'text-xs sm:text-xs font-bold text-stone-900 block w-full whitespace-normal break-words leading-tight transition group-hover:text-stone-955';
            
          const lastNameClass = lastName.length > 14
            ? 'block text-xs sm:text-[9.5px] font-medium text-stone-500 mt-0.5 w-full whitespace-normal break-words leading-tight'
            : 'block text-xs sm:text-xs font-medium text-stone-500 mt-0.5 w-full whitespace-normal break-words leading-tight';

          const nicknameText = nickname ? `(${nickname})` : '';
          const ageText = lifespanText ? lifespanText : '';
          const bottomText = [nicknameText, ageText].filter(Boolean).join(' • ');

          return (
            <>
              {/* First Name */}
              <span className={firstNameClass}>{firstName}</span>
              
              {/* Last Name */}
              {lastName && <span className={lastNameClass}>{lastName}</span>}
              
              {/* Nickname & Age */}
              {bottomText && (
                <span className="text-xs text-stone-400 mt-1.5 font-semibold block leading-none">
                  {bottomText}
                </span>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

// Custom Node for Union (Heart Badge)
function UnionNode() {
  return (
    <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs select-none">
      <Heart className="w-2.5 h-2.5 fill-current" />
      <Handle type="target" position={Position.Left} className="opacity-0" id="left" />
      <Handle type="target" position={Position.Right} className="opacity-0" id="right" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" id="bottom" />
    </div>
  );
}

const nodeTypes = {
  familyNode: CustomFamilyNode,
  unionNode: UnionNode,
};

const createCoupleEdge = (id: string, source: string, target: string, sourceHandle?: string, targetHandle?: string) => ({
  id,
  source,
  target,
  sourceHandle,
  targetHandle,
  type: 'straight',
  style: { stroke: '#d2d2d7', strokeWidth: 2, vectorEffect: 'non-scaling-stroke' },
});

const createBezierEdge = (id: string, source: string, target: string, sourceHandle?: string, targetHandle?: string) => ({
  id,
  source,
  target,
  sourceHandle,
  targetHandle,
  type: 'default',
  style: { stroke: '#d2d2d7', strokeWidth: 2, vectorEffect: 'non-scaling-stroke' },
});

function FamilyTreeCanvas({ tenant, members }: FamilyTreeClientProps) {
  const { fitView } = useReactFlow();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { label: familyLabel } = getFeatureLabel(tenant.category || 'Memorial', 'family');

  // Group members into 4 generations for direct presentation
  const parents = members.filter(m => m.relationship === 'PARENT_1' || m.relationship === 'PARENT_2');
  const spouses = members.filter(m => m.relationship === 'SPOUSE');
  const siblings = members.filter(m => m.relationship === 'SIBLING');
  
  const children = members.filter(m => m.relationship === 'CHILD');
  const childrenSpouses = members.filter(m => m.relationship === 'SON_IN_LAW' || m.relationship === 'DAUGHTER_IN_LAW');
  const grandchildren = members.filter(m => m.relationship === 'GRANDCHILD');

  // Pair children with their spouses, and query grandchildren
  const childCouples = children.map(child => {
    const spouse = childrenSpouses.find(s => s.spouseOfId === child.id);
    const kids = grandchildren.filter(g => g.parentId === child.id);
    return { child, spouse, kids };
  });

  // Find any orphan spouses (not linked to any existing child)
  const orphanSpouses = childrenSpouses.filter(s => !children.some(c => c.id === s.spouseOfId));

  // Find any orphan grandchildren (not linked to any existing child)
  const orphanGrandchildren = grandchildren.filter(g => !children.some(c => c.id === g.parentId));

  // Extract birth/death year from first subject in themeConfig
  const firstSubject = (tenant.themeConfig as any)?.subjects?.[0];
  const subjectIsAlive = !!firstSubject?.isAlive;

  const deceasedBirthYear = (() => {
    if (!firstSubject) return null;
    if (firstSubject.birthYearOnly && firstSubject.birthYear != null) {
      return String(firstSubject.birthYear + 543);
    }
    if (firstSubject.birthDate) {
      const d = new Date(firstSubject.birthDate);
      return isNaN(d.getTime()) ? null : String(d.getFullYear() + 543);
    }
    return null;
  })();

  const deceasedDeathYear = (() => {
    if (subjectIsAlive) return null;
    if (!firstSubject) return null;
    if (firstSubject.deathYearOnly && firstSubject.deathYear != null) {
      return String(firstSubject.deathYear + 543);
    }
    if (firstSubject.deathDate) {
      const d = new Date(firstSubject.deathDate);
      return isNaN(d.getTime()) ? null : String(d.getFullYear() + 543);
    }
    return null;
  })();

  // Bottom-up layout solver to generate nodes & edges with dynamic coordinates
  const buildReactFlowElements = () => {
    const rfNodes: any[] = [];
    const rfEdges: any[] = [];

    // Spacing constants
    const G1_Y = 20;
    const G2_Y = 180;
    const G3_Y = 380;
    const G4_Y = 580;

    const branchWidths: { [childId: string]: number } = {};
    const grandchildrenWidths: { [childId: string]: number } = {};

    childCouples.forEach(({ child, spouse, kids }) => {
      const hasSpouse = !!spouse;
      const kidsCount = kids ? kids.length : 0;
      
      const kidsWidth = kidsCount > 0 ? (kidsCount * 120 + (kidsCount - 1) * 40) : 0;
      grandchildrenWidths[child.id] = kidsWidth;

      const coupleWidth = hasSpouse ? 280 : 120;
      branchWidths[child.id] = Math.max(coupleWidth, kidsWidth);
    });

    orphanSpouses.forEach(s => {
      branchWidths[s.id] = 120;
    });
    orphanGrandchildren.forEach(g => {
      branchWidths[g.id] = 120;
    });

    // Collate G3 Row
    const gen3Items = [
      ...childCouples.map(c => ({ id: c.child.id, type: 'couple', data: c })),
      ...orphanSpouses.map(s => ({ id: s.id, type: 'orphan-spouse', data: s })),
      ...orphanGrandchildren.map(g => ({ id: g.id, type: 'orphan-grandchild', data: g }))
    ];

    let currentX = 0;
    const G3_GAP = 80;
    const itemXPositions: { [itemId: string]: number } = {};

    gen3Items.forEach((item, index) => {
      const width = branchWidths[item.id];
      if (index > 0) {
        currentX += G3_GAP;
      }
      const centerX = currentX + width / 2;
      itemXPositions[item.id] = centerX;
      currentX += width;
    });

    const totalG3Width = currentX;
    const offsetG3 = -totalG3Width / 2;

    // Render G3 Children and G4 Grandchildren
    gen3Items.forEach(item => {
      const branchCenterX = itemXPositions[item.id] + offsetG3;
      
      if (item.type === 'couple') {
        const { child, spouse, kids } = item.data as any;
        const hasSpouse = !!spouse;

        if (hasSpouse) {
          // Perfectly centered horizontal coordinate mapping:
          // Midpoint is exactly branchCenterX.
          // Child is at left (-140px offset from branchCenterX, node width is 120px, so child right edge is at branchCenterX - 20px)
          // Spouse is at right (+20px offset from branchCenterX, spouse left edge is at branchCenterX + 20px)
          // Union sits exactly in the 40px gap, from branchCenterX - 10px to branchCenterX + 10px (width is 20px)
          const childX = branchCenterX - 140;
          const spouseX = branchCenterX + 20;
          const unionX = branchCenterX - 10;
          const unionY = G3_Y + 20;

          rfNodes.push({
            id: child.id,
            type: 'familyNode',
            position: { x: childX, y: G3_Y },
            data: { ...child, ringColor: 'border-blue-500', placeholderBg: 'bg-blue-50 text-blue-600' }
          });

          const spouseRing = spouse.relationship === 'SON_IN_LAW' || spouse.relationship === 'DAUGHTER_IN_LAW'
            ? 'border-teal-500'
            : 'border-emerald-500';
          const spouseBg = spouse.relationship === 'SON_IN_LAW' || spouse.relationship === 'DAUGHTER_IN_LAW'
            ? 'bg-teal-50 text-teal-600'
            : 'bg-emerald-50 text-emerald-600';

          rfNodes.push({
            id: spouse.id,
            type: 'familyNode',
            position: { x: spouseX, y: G3_Y },
            data: { ...spouse, ringColor: spouseRing, placeholderBg: spouseBg }
          });

          // Union heart badge
          const unionId = `union-${child.id}`;
          rfNodes.push({
            id: unionId,
            type: 'unionNode',
            position: { x: unionX, y: unionY },
            data: {}
          });

          rfEdges.push(createCoupleEdge(`edge-${child.id}-union`, child.id, unionId, 'right', 'left'));
          rfEdges.push(createCoupleEdge(`edge-${spouse.id}-union`, spouse.id, unionId, 'left', 'right'));

          if (kids && kids.length > 0) {
            const kidsWidth = grandchildrenWidths[child.id];
            const startKidsX = branchCenterX - kidsWidth / 2;
            
            kids.forEach((kid: any, kIndex: number) => {
              const kidX = startKidsX + kIndex * 160;
              rfNodes.push({
                id: kid.id,
                type: 'familyNode',
                position: { x: kidX, y: G4_Y },
                data: { ...kid, ringColor: 'border-indigo-500', placeholderBg: 'bg-indigo-50 text-indigo-600' }
              });

              rfEdges.push(createBezierEdge(`edge-${unionId}-${kid.id}`, unionId, kid.id, 'bottom', 'top'));
            });
          }
        } else {
          // Single child
          rfNodes.push({
            id: child.id,
            type: 'familyNode',
            position: { x: branchCenterX - 60, y: G3_Y }, // offset by half node width to center
            data: { ...child, ringColor: 'border-blue-500', placeholderBg: 'bg-blue-50 text-blue-600' }
          });

          if (kids && kids.length > 0) {
            const kidsWidth = grandchildrenWidths[child.id];
            const startKidsX = branchCenterX - kidsWidth / 2;
            
            kids.forEach((kid: any, kIndex: number) => {
              const kidX = startKidsX + kIndex * 160;
              rfNodes.push({
                id: kid.id,
                type: 'familyNode',
                position: { x: kidX, y: G4_Y },
                data: { ...kid, ringColor: 'border-indigo-500', placeholderBg: 'bg-indigo-50 text-indigo-600' }
              });

              rfEdges.push(createBezierEdge(`edge-${child.id}-${kid.id}`, child.id, kid.id, 'right', 'top'));
            });
          }
        }
      } else {
        const member = item.data as any;
        rfNodes.push({
          id: member.id,
          type: 'familyNode',
          position: { x: branchCenterX - 60, y: G3_Y },
          data: { ...member, ringColor: 'border-stone-300', placeholderBg: 'bg-stone-50 text-stone-550' }
        });
      }
    });

    // Deceased Couple coordinates
    const deceasedCoupleCenter = 0;
    const deceasedName = tenant.name.replace(/^(ด้วยรักและคิดถึง|ด้วยรักและอาลัย|ร่วมรำลึกถึง|รำลึกถึง|คิดถึง|อาลัยแด่)\s*/, '');
    const deceasedId = 'deceased-node';

    const mainSpouse = spouses[0];
    const hasSpouse = !!mainSpouse;
    
    let deceasedX = deceasedCoupleCenter - 60;
    let deceasedUnionId = deceasedId;

    const themeConfig = tenant.themeConfig as any;
    const deceasedAvatarUrl = themeConfig?.avatarUrl || null;
    const deceasedAvatarScale = themeConfig?.avatarScale || 1;
    const deceasedAvatarX = themeConfig?.avatarX || 0;
    const deceasedAvatarY = themeConfig?.avatarY || 0;
    const deceasedAvatarRotate = themeConfig?.avatarRotate || 0;
    const deceasedImageCoordSpace = themeConfig?.imageCoordSpace || null;

    if (hasSpouse) {
      deceasedX = deceasedCoupleCenter - 140;
      const spouseX = deceasedCoupleCenter + 20;
      const unionX = deceasedCoupleCenter - 10;
      const unionY = G2_Y + 20;
      deceasedUnionId = `union-${deceasedId}`;

      rfNodes.push({
        id: deceasedId,
        type: 'familyNode',
        position: { x: deceasedX, y: G2_Y },
        data: {
          id: deceasedId,
          name: deceasedName,
          relationship: 'DECEASED',
          birthYear: deceasedBirthYear,
          deathYear: deceasedDeathYear,
          isDeceased: !subjectIsAlive,
          isMain: true,
          avatarUrl: deceasedAvatarUrl,
          avatarScale: deceasedAvatarScale,
          avatarX: deceasedAvatarX,
          avatarY: deceasedAvatarY,
          avatarRotate: deceasedAvatarRotate,
          imageCoordSpace: deceasedImageCoordSpace,
          ringColor: subjectIsAlive ? 'border-amber-500' : 'border-rose-500',
          placeholderBg: subjectIsAlive ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
        }
      });

      rfNodes.push({
        id: mainSpouse.id,
        type: 'familyNode',
        position: { x: spouseX, y: G2_Y },
        data: { ...mainSpouse, ringColor: 'border-emerald-500', placeholderBg: 'bg-emerald-50 text-emerald-600' }
      });

      rfNodes.push({
        id: deceasedUnionId,
        type: 'unionNode',
        position: { x: unionX, y: unionY },
        data: {}
      });

      rfEdges.push(createCoupleEdge(`edge-${deceasedId}-union`, deceasedId, deceasedUnionId, 'right', 'left'));
      rfEdges.push(createCoupleEdge(`edge-${mainSpouse.id}-union`, mainSpouse.id, deceasedUnionId, 'left', 'right'));
    } else {
      rfNodes.push({
        id: deceasedId,
        type: 'familyNode',
        position: { x: deceasedX, y: G2_Y },
        data: {
          id: deceasedId,
          name: deceasedName,
          relationship: 'DECEASED',
          birthYear: deceasedBirthYear,
          deathYear: deceasedDeathYear,
          isDeceased: !subjectIsAlive,
          isMain: true,
          avatarUrl: deceasedAvatarUrl,
          avatarScale: deceasedAvatarScale,
          avatarX: deceasedAvatarX,
          avatarY: deceasedAvatarY,
          avatarRotate: deceasedAvatarRotate,
          imageCoordSpace: deceasedImageCoordSpace,
          ringColor: subjectIsAlive ? 'border-amber-500' : 'border-rose-500',
          placeholderBg: subjectIsAlive ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
        }
      });
    }

    // Connect Deceased to G3 Row
    gen3Items.forEach(item => {
      if (item.type === 'couple') {
        const child = (item.data as any).child;
        rfEdges.push(createBezierEdge(`edge-${deceasedUnionId}-${child.id}`, deceasedUnionId, child.id, 'bottom', 'top'));
      } else {
        rfEdges.push(createBezierEdge(`edge-${deceasedUnionId}-${item.id}`, deceasedUnionId, item.id, 'bottom', 'top'));
      }
    });

    // Generation 2 Siblings
    const sibCount = siblings.length;
    siblings.forEach((sib, index) => {
      const sibX = deceasedX - (sibCount - index) * 185;
      rfNodes.push({
        id: sib.id,
        type: 'familyNode',
        position: { x: sibX, y: G2_Y },
        data: { ...sib, ringColor: 'border-amber-500', placeholderBg: 'bg-amber-50 text-amber-600' }
      });
    });

    // Generation 1 Parents
    if (parents.length > 0) {
      const father = parents.find(p => p.relationship === 'PARENT_1');
      const mother = parents.find(p => p.relationship === 'PARENT_2');
      const parentCenter = deceasedCoupleCenter;
      
      let parentUnionId = '';

      if (father && mother) {
        const fatherX = parentCenter - 140;
        const motherX = parentCenter + 20;
        const unionX = parentCenter - 10;
        const unionY = G1_Y + 20;
        parentUnionId = `union-parents`;

        rfNodes.push({
          id: father.id,
          type: 'familyNode',
          position: { x: fatherX, y: G1_Y },
          data: { ...father, ringColor: 'border-purple-500', placeholderBg: 'bg-purple-50 text-purple-600' }
        });

        rfNodes.push({
          id: mother.id,
          type: 'familyNode',
          position: { x: motherX, y: G1_Y },
          data: { ...mother, ringColor: 'border-purple-500', placeholderBg: 'bg-purple-50 text-purple-600' }
        });

        rfNodes.push({
          id: parentUnionId,
          type: 'unionNode',
          position: { x: unionX, y: unionY },
          data: {}
        });

        rfEdges.push(createCoupleEdge(`edge-${father.id}-union`, father.id, parentUnionId, 'right', 'left'));
        rfEdges.push(createCoupleEdge(`edge-${mother.id}-union`, mother.id, parentUnionId, 'left', 'right'));
      } else {
        const singleParent = parents[0];
        parentUnionId = singleParent.id;
        rfNodes.push({
          id: singleParent.id,
          type: 'familyNode',
          position: { x: parentCenter - 60, y: G1_Y },
          data: { ...singleParent, ringColor: 'border-purple-500', placeholderBg: 'bg-purple-50 text-purple-600' }
        });
      }

      // Connect Parents to Deceased Couple and Siblings
      rfEdges.push(createBezierEdge(`edge-${parentUnionId}-${deceasedId}`, parentUnionId, deceasedId, 'bottom', 'top'));
      siblings.forEach(sib => {
        rfEdges.push(createBezierEdge(`edge-${parentUnionId}-${sib.id}`, parentUnionId, sib.id, 'bottom', 'top'));
      });
    }

    return { nodes: rfNodes, edges: rfEdges };
  };

  const { nodes: initialNodes, edges: initialEdges } = buildReactFlowElements();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Synchronize dynamic data updates
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = buildReactFlowElements();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [members, tenant]);

  // Prevent parent scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  const exitFullscreen = () => setIsFullscreen(false);
  const enterFullscreen = () => setIsFullscreen(true);

  const handleResetLayout = () => {
    const { nodes: newNodes, edges: newEdges } = buildReactFlowElements();
    setNodes(newNodes);
    setEdges(newEdges);
    setTimeout(() => {
      fitView({ duration: 400, padding: 0.2 });
    }, 50);
  };

  const treeToolbarClass =
    'absolute z-20 flex items-center gap-1 rounded-xl border border-stone-200 bg-white/95 p-1 shadow-sm backdrop-blur-sm';

  const renderTreeControls = (positionClass: string) => (
    <div className={`${treeToolbarClass} ${positionClass}`}>
      <button
        type="button"
        onClick={handleResetLayout}
        title="จัดตำแหน่งกึ่งกลางและรีเซ็ตการลาก"
        className="inline-flex size-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-50 hover:text-stone-900"
      >
        <RotateCw className="size-4" />
      </button>
      {!isFullscreen ? (
        <button
          type="button"
          onClick={enterFullscreen}
          title="ขยายเต็มจอ"
          className="inline-flex size-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-50 hover:text-stone-900"
        >
          <Maximize2 className="size-4" />
        </button>
      ) : null}
    </div>
  );

  const renderFlow = (className: string) => (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.2}
      maxZoom={2}
      preventScrolling
      zoomOnScroll
      zoomOnPinch
      panOnDrag
      nodesConnectable={false}
      nodesDraggable
      elementsSelectable={false}
      className={className}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e7e5e4" />
      <MiniMap
        position="bottom-left"
        nodeColor={(node) => (node.type === 'unionNode' ? '#f43f5e' : '#e7e5e4')}
        maskColor="rgba(245, 245, 244, 0.4)"
        style={{ borderRadius: '12px', border: '1px solid #e7e5e4', width: 120, height: 80 }}
      />
      <Controls
        position="bottom-right"
        showInteractive={false}
        style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e7e5e4' }}
      />
    </ReactFlow>
  );

  return (
    <div className="animate-fade-in text-center">
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-stone-50 select-none">
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-stone-200 bg-white px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
            <button
              type="button"
              onClick={exitFullscreen}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 sm:px-4 sm:text-xs"
            >
              <Minimize2 className="size-3.5 shrink-0" />
              <span>ปิดเต็มจอ</span>
            </button>

            <h2
              className="min-w-0 truncate text-xs font-bold text-stone-800 sm:text-sm"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              {familyLabel}
            </h2>

            <Link
              href={`/${tenant.slug}`}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 sm:px-4 sm:text-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">ย้อนกลับหน้าแรก</span>
              <span className="sm:hidden">กลับ</span>
            </Link>
          </header>

          <div ref={viewportRef} className="relative min-h-0 flex-1">
            {renderFlow('h-full w-full')}
            {renderTreeControls('top-3 right-3 sm:top-4 sm:right-4')}
          </div>

          <p className="shrink-0 border-t border-stone-200 bg-white py-2 text-xs text-stone-400 sm:text-xs">
            กด <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-xs text-stone-500">Esc</kbd> เพื่อออกจากโหมดเต็มจอ
          </p>
        </div>
      ) : (
        <div className={`${FEATURE_CARD_CLASS} rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-8 relative overflow-hidden`}>
          {/* Page Header with CategoryOrnament and Wing lines */}
          {(() => {
            const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category || 'Memorial', 'family');
            return (
              <div className="flex flex-col items-center text-center space-y-3">
                <h2 className="text-2xl font-black text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
                  {fLabel}
                </h2>
                <p className="text-stone-500 text-xs max-w-lg leading-normal">
                  {fDesc}
                </p>
                {/* Centered Motif with Wing lines divider */}
                <div className="w-full flex items-center justify-center gap-4 pt-4 select-none">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-stone-200" />
                  <div className="flex-shrink-0">
                    <CategoryOrnament category={tenant.category || 'Memorial'} count={1} />
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-stone-200" />
                </div>
              </div>
            );
          })()}

          <div
            ref={viewportRef}
            className="relative h-[550px] w-full select-none overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 sm:h-[650px]"
          >
            {renderFlow('h-full w-full')}
            {renderTreeControls('top-3 right-3 sm:top-4 sm:right-4')}
          </div>

          {/* Back button */}
          <div className="pt-4 border-t border-stone-100">
            <Link href={`/${tenant.slug}`} className="px-6 py-2.5 rounded-full border border-stone-300 text-stone-550 hover:text-stone-900 hover:bg-stone-100 text-xs font-semibold transition cursor-pointer">
              ย้อนกลับหน้าแรก
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FamilyTreeClient(props: FamilyTreeClientProps) {
  return (
    <ReactFlowProvider>
      <FamilyTreeCanvas {...props} />
    </ReactFlowProvider>
  );
}

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
import { Maximize2, Minimize2, GitBranch, X, Heart, RotateCw } from 'lucide-react';
import { getInitialLetter } from '@/lib/utils';
import Link from 'next/link';
import { getFeatureLabel } from '@/lib/categories';
import CategoryOrnament from '@/components/public/CategoryOrnament';
import { imageTransformStyle, toRelativeOffset } from '@/lib/imagePosition';

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
    avatarRotate
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

  let cleanedAvatarUrl = avatarUrl || '';
  if (cleanedAvatarUrl && !cleanedAvatarUrl.startsWith('http') && !cleanedAvatarUrl.startsWith('/')) {
    cleanedAvatarUrl = '/' + cleanedAvatarUrl;
  }
  const hasValidAvatar = !!cleanedAvatarUrl && !imageError;

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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...imageTransformStyle({
                x: toRelativeOffset(avatarX || 0, 224),
                y: toRelativeOffset(avatarY || 0, 224),
                scale: avatarScale || 1,
                rotate: avatarRotate || 0,
              }),
            }}
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
            ? 'text-[9.5px] sm:text-[10px] font-bold text-stone-900 block w-full whitespace-normal break-words leading-tight transition group-hover:text-stone-955'
            : 'text-[11px] sm:text-xs font-bold text-stone-900 block w-full whitespace-normal break-words leading-tight transition group-hover:text-stone-955';
            
          const lastNameClass = lastName.length > 14
            ? 'block text-[9px] sm:text-[9.5px] font-medium text-stone-500 mt-0.5 w-full whitespace-normal break-words leading-tight'
            : 'block text-[10px] sm:text-[11px] font-medium text-stone-500 mt-0.5 w-full whitespace-normal break-words leading-tight';

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
                <span className="text-[9px] text-stone-400 mt-1.5 font-semibold block leading-none">
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleResetLayout = () => {
    const { nodes: newNodes, edges: newEdges } = buildReactFlowElements();
    setNodes(newNodes);
    setEdges(newEdges);
    setTimeout(() => {
      fitView({ duration: 400, padding: 0.2 });
    }, 50);
  };

  return (
    <div className="animate-fade-in text-center font-sans">
      {isFullscreen ? (
        <div 
          ref={viewportRef}
          className="fixed inset-0 z-50 p-6 w-screen h-screen select-none bg-stone-50"
        >
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
            preventScrolling={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            panOnDrag={true}
            nodesConnectable={false}
            nodesDraggable={true}
            elementsSelectable={false}
            className="w-full h-full"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e7e5e4" />
            <MiniMap 
              position="bottom-left" 
              nodeColor={(node) => {
                if (node.type === 'unionNode') return '#f43f5e';
                return '#e7e5e4';
              }}
              maskColor="rgba(245, 245, 244, 0.4)"
              style={{ borderRadius: '12px', border: '1px solid #e7e5e4', width: 120, height: 80 }}
            />
            <Controls 
              position="bottom-right" 
              showInteractive={false}
              style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e7e5e4' }}
            />
          </ReactFlow>

          <button 
            onClick={handleResetLayout}
            title="จัดตำแหน่งกึ่งกลางและรีเซ็ตการลาก (Reset positions)"
            className="absolute z-20 p-3 rounded-full shadow-md bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 flex items-center justify-center cursor-pointer transition top-6 right-20"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button 
            onClick={toggleFullscreen}
            title="ออกจากหน้าต่างเต็มจอ"
            className="absolute z-20 p-3 rounded-full shadow-md bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 flex items-center justify-center cursor-pointer transition top-6 right-6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-8 relative overflow-hidden">
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
                    <CategoryOrnament category={tenant.category || 'Memorial'} />
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-stone-200" />
                </div>
              </div>
            );
          })()}

          {/* React Flow Viewport Container */}
          <div 
            ref={viewportRef}
            className="w-full h-[550px] sm:h-[650px] rounded-2xl border border-stone-200 bg-stone-50 relative select-none overflow-hidden"
          >
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
              preventScrolling={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              panOnDrag={true}
              nodesConnectable={false}
              nodesDraggable={true}
              elementsSelectable={false}
              className="w-full h-full"
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e7e5e4" />
              <MiniMap 
                position="bottom-left" 
                nodeColor={(node) => {
                  if (node.type === 'unionNode') return '#f43f5e';
                  return '#e7e5e4';
                }}
                maskColor="rgba(245, 245, 244, 0.4)"
                style={{ borderRadius: '12px', border: '1px solid #e7e5e4', width: 120, height: 80 }}
              />
              <Controls 
                position="bottom-right" 
                showInteractive={false}
                style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e7e5e4' }}
              />
            </ReactFlow>

            <button 
              onClick={handleResetLayout}
              title="จัดตำแหน่งกึ่งกลางและรีเซ็ตการลาก (Reset positions)"
              className="absolute z-20 p-2.5 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-stone-900 shadow-xs hover:bg-stone-50 flex items-center justify-center cursor-pointer transition bottom-4 right-28"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button 
              onClick={toggleFullscreen}
              title="แสดงเต็มจอ (Fullscreen)"
              className="absolute z-20 p-2.5 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-stone-900 shadow-xs hover:bg-stone-50 flex items-center justify-center cursor-pointer transition bottom-4 right-16"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
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

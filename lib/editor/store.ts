import { create } from 'zustand';
import { EditorElement } from './schema';

export interface AnnouncementFormData {
  siteId: string;
  siteName: string;
  announcementActive: boolean;
  announcementText: string;
  announcementStyle: string;
  announcementWaterDate: string;
  announcementWaterTime: string;
  announcementAbhidhammaDateRange: string;
  announcementAbhidhammaTime: string;
  announcementCremationDate: string;
  announcementCremationTime: string;
  announcementTempleName: string;
  announcementPavilion: string;
  announcementMapLink: string;
  announcementDressCode: string;
  announcementWreathPolicy: string;
  announcementContactPhone: string;
  subjects: any[];
}

interface EditorState {
  elements: EditorElement[];
  selectedId: string | null;
  editingId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  background: string;
  
  // Announcement Form Data
  formData: AnnouncementFormData;
  saveStatus: { type: 'idle' | 'loading' | 'success' | 'error'; message: string };
  
  // Actions
  addElement: (element: EditorElement) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  removeElement: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  setEditingId: (id: string | null) => void;
  setElements: (elements: EditorElement[]) => void;
  setBackground: (background: string) => void;
  setCanvasSize: (width: number, height: number) => void;
  clearSelection: () => void;
  
  setFormData: (updates: Partial<AnnouncementFormData>) => void;
  setSaveStatus: (status: { type: 'idle' | 'loading' | 'success' | 'error'; message: string }) => void;
  saveCard: () => Promise<void>;
}

export const useEditorStore = create<EditorState>((set) => ({
  elements: [],
  selectedId: null,
  editingId: null,
  canvasWidth: 600,
  canvasHeight: 600,
  background: '#FAF6EE', // default warm cream invitation background

  formData: {
    siteId: '',
    siteName: '',
    announcementActive: true,
    announcementText: '',
    announcementStyle: 'ELEGANT_WHITE',
    announcementWaterDate: '',
    announcementWaterTime: '',
    announcementAbhidhammaDateRange: '',
    announcementAbhidhammaTime: '',
    announcementCremationDate: '',
    announcementCremationTime: '',
    announcementTempleName: '',
    announcementPavilion: '',
    announcementMapLink: '',
    announcementDressCode: '',
    announcementWreathPolicy: 'NORMAL',
    announcementContactPhone: '',
    subjects: [],
  },
  saveStatus: { type: 'idle', message: '' },

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element].sort((a, b) => a.zIndex - b.zIndex),
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } as EditorElement : el
      ),
    })),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      editingId: state.editingId === id ? null : state.editingId,
    })),

  setSelectedId: (id) => set({ selectedId: id }),
  
  setEditingId: (id) => set({ editingId: id }),

  setElements: (elements) =>
    set({ elements: [...elements].sort((a, b) => a.zIndex - b.zIndex) }),

  setBackground: (background) => set({ background }),

  setCanvasSize: (width, height) =>
    set({ canvasWidth: width, canvasHeight: height }),

  clearSelection: () => set({ selectedId: null, editingId: null }),

  setFormData: (updates) =>
    set((state) => ({ formData: { ...state.formData, ...updates } })),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  saveCard: async () => {
    const { formData, elements, background } = useEditorStore.getState();
    set({ saveStatus: { type: 'loading', message: 'กำลังบันทึกกำหนดการและดีไซน์การ์ด...' } });
    try {
      const res = await fetch('/api/tenant/save-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: formData.siteId,
          name: formData.siteName,
          announcementActive: formData.announcementActive,
          announcementText: formData.announcementText,
          announcementStyle: formData.announcementStyle,
          announcementWaterDate: formData.announcementWaterDate,
          announcementWaterTime: formData.announcementWaterTime,
          announcementAbhidhammaDateRange: formData.announcementAbhidhammaDateRange,
          announcementAbhidhammaTime: formData.announcementAbhidhammaTime,
          announcementCremationDate: formData.announcementCremationDate,
          announcementCremationTime: formData.announcementCremationTime,
          announcementTempleName: formData.announcementTempleName,
          announcementPavilion: formData.announcementPavilion,
          announcementMapLink: formData.announcementMapLink,
          announcementDressCode: formData.announcementDressCode,
          announcementWreathPolicy: formData.announcementWreathPolicy,
          announcementContactPhone: formData.announcementContactPhone,
          subjects: formData.subjects,
          elements,
          background,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set({ saveStatus: { type: 'success', message: 'บันทึกจัดวางองค์ประกอบการ์ดดิจิทัลเรียบร้อยแล้วค่ะ' } });
      setTimeout(() => set({ saveStatus: { type: 'idle', message: '' } }), 4000);
    } catch (err: any) {
      set({ saveStatus: { type: 'error', message: err.message || 'เกิดข้อผิดพลาดในการบันทึกการ์ด' } });
    }
  },
}));

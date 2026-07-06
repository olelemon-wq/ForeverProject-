import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove duplicate state declarations (deceasedAvatarUrl, deceasedAvatarScale, deceasedAvatarX, deceasedAvatarY, deceasedAvatarRotate, isCropModalOpen)
target_state_block = """  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');
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
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);"""

# Keep only the cover variables and activeSubTab (since avatar variables are already declared on lines 159-166)
replacement_state_block = """  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');
  const [deceasedCoverUrl, setDeceasedCoverUrl] = useState('');
  const [deceasedCoverScale, setDeceasedCoverScale] = useState(1);
  const [deceasedCoverX, setDeceasedCoverX] = useState(0);
  const [deceasedCoverY, setDeceasedCoverY] = useState(0);
  const [deceasedCoverRotate, setDeceasedCoverRotate] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);
  const [isCoverCropModalOpen, setIsCoverCropModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);"""

content = content.replace(target_state_block, replacement_state_block)

# 2. Remove duplicate uploadDeceasedAvatar definition
target_upload_block = """  const uploadDeceasedAvatar = async (file: File) => {
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

  const uploadDeceasedCover = async (file: File) => {"""

replacement_upload_block = """  const uploadDeceasedCover = async (file: File) => {"""

content = content.replace(target_upload_block, replacement_upload_block)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Duplicates cleaned up successfully!")

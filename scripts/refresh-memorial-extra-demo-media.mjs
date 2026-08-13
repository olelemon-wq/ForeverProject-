/**
 * Point mae-somsri + ajarn-somchai at dedicated demo-media folders,
 * then rewrites cover/avatar/gallery/memory/family/activity image paths.
 *
 * Usage: node scripts/refresh-memorial-extra-demo-media.mjs
 */
import { randomUUID } from "crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_PATH = join(ROOT, "prisma/data/demo-sites.json");

const MAE_ID = "a1b2c3d4-mae1-4f01-9e11-somsri000001";
const AJARN_ID = "a1b2c3d4-aja1-4f01-9e11-somchai00001";

function listPublicPaths(folderId, prefix) {
  const dir = join(ROOT, "public/demo-media", folderId);
  return readdirSync(dir)
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .filter((name) => !prefix || name.startsWith(prefix))
    .sort()
    .map((name) => `/demo-media/${folderId}/${name}`);
}

function mediaRecord(filePath, album, sortOrder) {
  const abs = join(ROOT, "public", filePath.replace(/^\//, ""));
  const size = statSync(abs).size;
  const ext = filePath.split(".").pop()?.toLowerCase();
  const mimeType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return {
    id: randomUUID(),
    websiteId: "pending",
    filePath,
    thumbnailPath: null,
    fileName: filePath.split("/").pop(),
    fileSize: String(size),
    mimeType,
    fileHash: `demo-${sortOrder}-${filePath.split("/").pop()}`,
    album,
    isDeleted: false,
    sortOrder,
    createdAt: new Date().toISOString(),
  };
}

function patchMae(site, paths) {
  const cover = paths.find((p) => p.endsWith("mae-05.jpg")) || paths[4];
  const avatar = paths.find((p) => p.endsWith("mae-08.jpg")) || paths[0];
  // Only use downloaded mae-NN assets — never marketing memorial-features copies
  // (memory.jpg / gallery.jpg are the same photos as boonkrua).
  const gallery = paths.filter((p) => /\/mae-\d+\.(jpe?g|png)$/i.test(p));

  site.tenant.themeConfig.coverUrl = cover;
  site.tenant.themeConfig.avatarUrl = avatar;
  site.tenant.themeConfig.coverScale = 1.15;
  site.tenant.themeConfig.avatarScale = 1.2;

  site.medias = gallery.map((p, i) => mediaRecord(p, "GALLERY", i + 1));

  const memPaths = [
    paths.find((p) => p.includes("mae-03")) || gallery[2],
    paths.find((p) => p.includes("mae-04")) || gallery[3],
    paths.find((p) => p.includes("mae-memory")) || gallery[1],
  ];
  site.memoryPosts = (site.memoryPosts || []).map((post, i) => ({
    ...post,
    mediaUrl: memPaths[i % memPaths.length],
    mediaType: "IMAGE",
  }));

  const familyAvatars = [
    avatar,
    paths.find((p) => p.endsWith("mae-02.jpg")) || gallery[1],
    paths.find((p) => p.endsWith("mae-08.jpg")) || gallery[2],
    paths.find((p) => p.endsWith("mae-06.jpg")) || gallery[3],
  ];
  site.familyMembers = (site.familyMembers || []).map((m, i) => ({
    ...m,
    avatarUrl: familyAvatars[i % familyAvatars.length],
  }));

  return { cover, avatar };
}

function patchAjarn(site, paths) {
  const cover =
    paths.find((p) => p.includes("ajarn-activities-extra")) ||
    paths.find((p) => p.endsWith("ajarn-03.jpg")) ||
    paths[2];
  const avatar = paths.find((p) => p.endsWith("ajarn-01.jpg")) || paths[0];
  const gallery = paths.filter(
    (p) =>
      !p.includes("donation-extra") &&
      !p.includes("family-extra")
  );

  site.tenant.themeConfig.coverUrl = cover;
  site.tenant.themeConfig.avatarUrl = avatar;
  site.tenant.themeConfig.coverScale = 1.15;
  site.tenant.themeConfig.avatarScale = 1.15;

  site.medias = gallery.map((p, i) =>
    mediaRecord(
      p,
      p.includes("activities") ? "ACTIVITIES" : "GALLERY",
      i + 1
    )
  );

  const actImgs = [
    paths.find((p) => p.includes("activities-extra")) || gallery[2],
    paths.find((p) => p.endsWith("ajarn-07.jpg")) || gallery[3],
    paths.find((p) => p.endsWith("ajarn-09.jpg")) || gallery[4],
    paths.find((p) => p.includes("donation-extra")) || gallery[5],
  ];
  site.activities = (site.activities || []).map((a, i) => ({
    ...a,
    images:
      i === 0
        ? [actImgs[0], actImgs[1]]
        : [actImgs[2] || actImgs[3], actImgs[3]],
  }));

  return { cover, avatar };
}

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const maePaths = listPublicPaths(MAE_ID);
const ajarnPaths = listPublicPaths(AJARN_ID);

if (maePaths.length < 8 || ajarnPaths.length < 8) {
  console.error("Missing demo-media files", { maePaths, ajarnPaths });
  process.exit(1);
}

const mae = data.sites.find((s) => s.slug === "mae-somsri");
const ajarn = data.sites.find((s) => s.slug === "ajarn-somchai");
if (!mae || !ajarn) {
  console.error("Demo sites not found in demo-sites.json");
  process.exit(1);
}

const maeMeta = patchMae(mae, maePaths);
const ajarnMeta = patchAjarn(ajarn, ajarnPaths);

writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
console.log("mae-somsri cover/avatar:", maeMeta.cover, maeMeta.avatar);
console.log("ajarn-somchai cover/avatar:", ajarnMeta.cover, ajarnMeta.avatar);
console.log("medias:", mae.medias.length, ajarn.medias.length);

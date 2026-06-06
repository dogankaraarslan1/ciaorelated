import type { PrismaClient } from "@prisma/client";
import {
  ADMIN_PROFILE_IDS,
  ADMIN_USERNAMES,
  WELCOME_MESSAGE_ADMIN_PROFILE_ID,
  WELCOME_MESSAGE_TEXT,
} from "../config";
import { createThread, sendMessage } from "../chat/service";

async function resolveWelcomeAdminProfileId(prisma: PrismaClient) {
  if (WELCOME_MESSAGE_ADMIN_PROFILE_ID) {
    const profile = await prisma.profile.findUnique({
      where: { id: WELCOME_MESSAGE_ADMIN_PROFILE_ID },
      select: { id: true },
    });
    if (profile) return profile.id;
  }

  for (const id of ADMIN_PROFILE_IDS) {
    const profile = await prisma.profile.findUnique({ where: { id }, select: { id: true } });
    if (profile) return profile.id;
  }

  if (ADMIN_USERNAMES.length) {
    const profile = await prisma.profile.findFirst({
      where: { username: { in: ADMIN_USERNAMES } },
      select: { id: true },
    });
    if (profile) return profile.id;
  }

  const roleAdmin = await prisma.profile.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return roleAdmin?.id ?? null;
}

export async function sendWelcomeMessageToProfile(prisma: PrismaClient, profileId: string) {
  const text = WELCOME_MESSAGE_TEXT.trim();
  if (!text) return;

  const adminProfileId = await resolveWelcomeAdminProfileId(prisma);
  if (!adminProfileId || adminProfileId === profileId) return;

  const thread = await createThread(prisma, adminProfileId, [adminProfileId, profileId]);
  await sendMessage(prisma, adminProfileId, {
    threadId: thread.id,
    kind: "text",
    text,
  });
}

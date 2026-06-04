import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Svg, { Rect } from "react-native-svg";
import { captureRef } from "react-native-view-shot";

import Screen from "./components/Screen";
import { AvatarImage } from "./components/AvatarImage";
import { useTheme } from "../theme/ThemeProvider";
import { PostCard } from "./components/feed/PostCard";
import { useMarkPostViewed } from "../hooks/useMarkPostViewed";
import { buildJoinUrl } from "../config/webLinks";

const heroBackground = require("../../assets/sticky-header-bg.png");

const QR_CARD_SIZE = 1080;
const QR_GRID_SIZE = 820;

type QrModule = { x: number; y: number; size: number };
const QRCode = require("qrcode/lib/core/qrcode") as {
  create: (value: string, options: { errorCorrectionLevel: "H" }) => {
    modules: {
      size: number;
      get: (x: number, y: number) => boolean | number;
    };
  };
};

const COMMUNITY_SPACE = gql`
  query CommunitySpace($id: ID!, $offset: Int = 0, $limit: Int = 30) {
    groupLink(id: $id) {
      id
      title
      type
      slug
      memberCount
      viewerIsOwner
      viewerIsMember
      owner {
        id
        username
        avatarUrl
        avatarThumbUrl
      }
    }
    groupLinkMembers(groupId: $id, limit: 18) {
      id
      username
      name
      avatarUrl
      avatarThumbUrl
      isFollowing
      followRequested
      isPrivate
    }
    groupLinkPosts(groupId: $id, offset: $offset, limit: $limit) {
      id
      kind
      imageUrl
      videoUrl
      thumbUrl
      caption
      location
      createdAt
      likeCount
      commentCount
      isLiked
      communityContext {
        groupId
        title
        type
        slug
      }
      taggedUsers {
        status
        showOnProfile
        user {
          id
          username
          avatarUrl
          avatarThumbUrl
        }
      }
      author {
        id
        username
        avatarUrl
        avatarThumbUrl
        isFollowing
        followRequested
        isPrivate
      }
      isCarousel
      media {
        id
        idx
        kind
        imageUrl
        videoUrl
        thumbUrl
        width
        height
        durationS
      }
    }
  }
`;

const COMMUNITY_THREAD = gql`
  query CommunityThread($groupId: ID!) {
    communityThread(groupId: $groupId) {
      id
      title
    }
  }
`;

function inviteUrl(slug?: string | null) {
  return slug ? buildJoinUrl(slug) : "";
}

function createQrModules(value: string): { modules: QrModule[]; size: number } {
  if (!value) return { modules: [], size: 0 };
  const qr = QRCode.create(value, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const modules: QrModule[] = [];
  const centerFrom = Math.floor(size * 0.36);
  const centerTo = Math.ceil(size * 0.64);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (x >= centerFrom && x <= centerTo && y >= centerFrom && y <= centerTo) continue;
      if (qr.modules.get(x, y)) modules.push({ x, y, size: 1 });
    }
  }

  return { modules, size };
}

export default function CommunitySpaceScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const groupId = route.params?.id;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const C = theme.colors as any;
  const s = useMemo(() => styles(C), [C]);

  const { data, loading, error, refetch } = useQuery(COMMUNITY_SPACE, {
    variables: { id: groupId, offset: 0, limit: 30 },
    skip: !groupId,
    fetchPolicy: "cache-and-network",
  });
  const [loadCommunityThread, { data: threadData, loading: chatLoading }] = useLazyQuery(COMMUNITY_THREAD, {
    fetchPolicy: "network-only",
  });

  const fallbackGroup = {
    id: groupId,
    title: route.params?.title ?? t("communityspace.communityFallback"),
    type: route.params?.type ?? "COMMUNITY",
    slug: route.params?.slug ?? null,
    memberCount: 0,
  };
  const group = data?.groupLink ?? fallbackGroup;
  const posts = data?.groupLinkPosts ?? [];
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const markPostViewed = useMarkPostViewed();
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const top = viewableItems?.find((v: any) => v.isViewable && v.item?.id);
    const id = top?.item?.id ?? null;
    setActivePostId(id);
    markPostViewed(id);
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;
  const members = data?.groupLinkMembers ?? [];
  const isEvent = group?.type === "EVENT";
  const link = inviteUrl(group?.slug);
  const communityThread = threadData?.communityThread;
  const qrShareRef = useRef<View>(null);
  const [qrSharing, setQrSharing] = useState(false);
  const qr = useMemo(() => createQrModules(link), [link]);

  const shareLink = async () => {
    if (!link) return;
    await Share.share({ message: link });
  };

  const copyLink = async () => {
    if (!link) return;
    await Clipboard.setStringAsync(link);
    Alert.alert(t("communityspace.linkCopiedTitle"), t("communityspace.linkCopiedBody"));
  };

  const openCommunityChat = async () => {
    try {
      const result = communityThread
        ? { data: { communityThread } }
        : await loadCommunityThread({ variables: { groupId: String(group?.id ?? groupId) } });
      const thread = result?.data?.communityThread;
      const threadId = thread?.id;
      if (!threadId) {
        Alert.alert(t("communityspace.chatUnavailableTitle"), t("communityspace.chatUnavailableBody"));
        return;
      }

      nav.navigate("Chat", {
        threadId,
        title: thread?.title ?? group?.title ?? t("communityspace.communityFallback"),
      });
    } catch {
      Alert.alert(t("communityspace.chatUnavailableTitle"), t("communityspace.chatUnavailableBody"));
    }
  };

  const shareQrCode = async () => {
    if (!link || !qrShareRef.current || qrSharing) return;
    try {
      setQrSharing(true);
      const uri = await captureRef(qrShareRef, {
        format: "png",
        quality: 1,
        width: QR_CARD_SIZE,
        height: QR_CARD_SIZE,
        result: "tmpfile",
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: group?.title ?? t("communityspace.communityFallback"),
          mimeType: "image/png",
          UTI: "public.png",
        });
      } else {
        await Share.share({ message: link });
      }
    } catch {
      Alert.alert(t("communityspace.qrShareFailedTitle"), t("communityspace.qrShareFailedBody"));
    } finally {
      setQrSharing(false);
    }
  };

  const Header = (
    <View>
      <View style={s.hero}>
        <Image source={heroBackground} style={s.heroImage} />
        <TouchableOpacity onPress={() => nav.goBack()} hitSlop={12} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={s.heroShade} />
        <View style={s.heroContent}>
          <View style={s.pill}>
            <Ionicons name={isEvent ? "flash" : "people"} size={14} color="#fff" />
            <Text style={s.pillText}>{isEvent ? t("communityspace.festivalFeed") : t("communityspace.communityLiveFeed")}</Text>
          </View>
          <Text style={s.title} numberOfLines={2}>{group?.title ?? t("communityspace.communityFallback")}</Text>
          <Text style={s.sub} numberOfLines={2}>
            {isEvent ? t("communityspace.liveMomentsFromEvent") : t("communityspace.momentsFromCommunity")}
          </Text>
          <View style={s.metaRow}>
            <Text style={s.meta}>{t("communityspace.peopleHere", { count: group?.memberCount ?? 0 })}</Text>
            <Text style={s.metaDot}>•</Text>
            <Text style={s.meta}>{t("communityspace.joinWithLink")}</Text>
          </View>
        </View>
      </View>

      <View style={s.actions}>
        <TouchableOpacity
          style={s.primaryAction}
          onPress={() => nav.navigate("CreateMedia", { initialMode: "POST" })}
          activeOpacity={0.9}
        >
          <Ionicons name="camera-outline" size={18} color={C.bg} />
          <Text style={s.primaryActionText}>{t("communityspace.createEventMoment")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryAction} onPress={shareLink} activeOpacity={0.9}>
          <Ionicons name="share-outline" size={18} color={C.text} />
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryAction} onPress={copyLink} activeOpacity={0.9}>
          <Ionicons name="link-outline" size={18} color={C.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={s.secondaryAction}
          onPress={openCommunityChat}
          activeOpacity={0.9}
          accessibilityLabel={t("communityspace.openChat")}
          disabled={chatLoading || !groupId}
        >
          {chatLoading ? (
            <ActivityIndicator size="small" color={C.text} />
          ) : (
            <Ionicons name="chatbubbles-outline" size={18} color={C.text} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={s.secondaryAction}
          onPress={shareQrCode}
          activeOpacity={0.9}
          accessibilityLabel={t("communityspace.shareQr")}
          disabled={qrSharing || !link}
        >
          {qrSharing ? (
            <ActivityIndicator size="small" color={C.text} />
          ) : (
            <Ionicons name="qr-code-outline" size={18} color={C.text} />
          )}
        </TouchableOpacity>
      </View>

      <View style={s.peopleSection}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{isEvent ? t("communityspace.peopleInEvent") : t("communityspace.peopleInCommunity")}</Text>
          <Text style={s.sectionHint}>{t("communityspace.alsoAt", { title: group?.title ?? t("communityspace.thisCommunity") })}</Text>
        </View>
        <FlatList
          data={members}
          horizontal
          keyExtractor={(item: any) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, gap: 10 }}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={s.personCard}
              activeOpacity={0.85}
              onPress={() => nav.navigate("UserProfile", { username: item.username, userId: item.id })}
            >
              <AvatarImage
                thumb={item.avatarThumbUrl}
                full={item.avatarUrl}
                style={s.avatar}
                recyclingKey={`community-member:${item.id}`}
              />
              <Text style={s.personName} numberOfLines={1}>@{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={s.feedIntro}>
        <Text style={s.sectionTitle}>{isEvent ? t("communityspace.liveMomentsFromEvent") : t("communityspace.communityMoments")}</Text>
        <Text style={s.sectionHint}>{t("communityspace.onlyContextPosts")}</Text>
      </View>
    </View>
  );

  if (loading && !data?.groupLink && !route.params?.title) {
    return (
      <Screen scroll={false}>
        <View style={s.center}>
          <ActivityIndicator color={C.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} edges={["top", "left", "right"]}>
      <FlatList
        data={posts}
        keyExtractor={(item: any) => String(item.id)}
        ListHeaderComponent={Header}
        refreshing={loading}
        onRefresh={() => refetch()}
        contentContainerStyle={{ paddingBottom: 48 }}
        ListEmptyComponent={
          error ? (
            <View style={s.empty}>
              <Ionicons name="cloud-offline-outline" size={28} color={C.subtext} />
              <Text style={s.emptyTitle}>{t("communityspace.feedUnavailableTitle")}</Text>
              <Text style={s.emptySub}>
                {t("communityspace.feedUnavailableBody")}
              </Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => refetch()}>
                <Text style={s.emptyBtnText}>{t("communityspace.tryAgain")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.empty}>
              <Ionicons name="sparkles-outline" size={28} color={C.subtext} />
              <Text style={s.emptyTitle}>{t("communityspace.createFirstMoment")}</Text>
              <Text style={s.emptySub}>
                {t("communityspace.emptyBody")}
              </Text>
              <TouchableOpacity style={s.emptyBtn} onPress={copyLink}>
                <Text style={s.emptyBtnText}>{t("communityspace.inviteWithGroupLink")}</Text>
              </TouchableOpacity>
            </View>
          )
        }
        renderItem={({ item }: any) => (
          <View style={s.postWrap}>
            <PostCard
              post={item}
              isActive={item.id === activePostId}
              screenFocused
              C={C}
              source={{
                kind: "GROUP",
                groupId: String(group?.id ?? groupId),
                title: group?.title ?? t("communityspace.communityFallback"),
                groupType: group?.type,
              }}
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <View
        ref={qrShareRef}
        collapsable={false}
        pointerEvents="none"
        style={s.qrShareCard}
      >
        <Svg width={QR_GRID_SIZE} height={QR_GRID_SIZE} viewBox={`0 0 ${qr.size || 1} ${qr.size || 1}`}>
          <Rect x={0} y={0} width={qr.size || 1} height={qr.size || 1} fill="#fff" />
          {qr.modules.map((m, idx) => (
            <Rect key={`${m.x}:${m.y}:${idx}`} x={m.x} y={m.y} width={m.size} height={m.size} fill="#000" />
          ))}
        </Svg>
        <View style={s.qrCenterLabel} pointerEvents="none">
          <Text style={s.qrCenterText}>ciaorelated</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = (C: any) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    hero: {
      height: 260,
      backgroundColor: "#111827",
      overflow: "hidden",
      justifyContent: "flex-end",
    },
    heroImage: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
      opacity: 0.82,
    },
    heroShade: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.36)",
    },
    backBtn: {
      position: "absolute",
      top: 12,
      left: 12,
      zIndex: 2,
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.16)",
    },
    heroContent: { padding: 18, gap: 8 },
    pill: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.18)",
    },
    pillText: { color: "#fff", fontWeight: "800", fontSize: 12 },
    title: { color: "#fff", fontSize: 34, fontWeight: "900", letterSpacing: 0 },
    sub: { color: "rgba(255,255,255,0.82)", fontSize: 15, fontWeight: "700" },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    meta: { color: "rgba(255,255,255,0.72)", fontSize: 13, fontWeight: "700" },
    metaDot: { color: "rgba(255,255,255,0.55)", fontWeight: "900" },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 14,
      backgroundColor: C.bg,
    },
    primaryAction: {
      flex: 1,
      height: 46,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: C.text,
    },
    primaryActionText: { color: C.bg, fontWeight: "900" },
    secondaryAction: {
      width: 42,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: C.border,
      backgroundColor: C.card,
    },
    peopleSection: { paddingVertical: 8, backgroundColor: C.bg },
    sectionHeader: { paddingHorizontal: 14, marginBottom: 10 },
    sectionTitle: { color: C.text, fontWeight: "900", fontSize: 17 },
    sectionHint: { color: C.subtext, marginTop: 3, fontWeight: "600", fontSize: 12 },
    personCard: {
      width: 92,
      padding: 10,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: C.border,
      backgroundColor: C.card,
    },
    avatar: { width: 54, height: 54, borderRadius: 27, marginBottom: 8 },
    personName: { color: C.text, fontWeight: "800", fontSize: 12, maxWidth: 72 },
    feedIntro: { paddingHorizontal: 14, paddingTop: 18, paddingBottom: 8 },
    postWrap: { paddingBottom: 14 },
    empty: {
      margin: 14,
      padding: 20,
      borderRadius: 18,
      alignItems: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: C.border,
      backgroundColor: C.card,
    },
    emptyTitle: { color: C.text, fontWeight: "900", fontSize: 17, marginTop: 10 },
    emptySub: { color: C.subtext, textAlign: "center", marginTop: 6, lineHeight: 19 },
    emptyBtn: {
      marginTop: 14,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: C.text,
    },
    emptyBtnText: { color: C.bg, fontWeight: "900" },
    qrShareCard: {
      position: "absolute",
      left: -10000,
      top: 0,
      width: QR_CARD_SIZE,
      height: QR_CARD_SIZE,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    qrCenterLabel: {
      position: "absolute",
      left: (QR_CARD_SIZE - 420) / 2,
      top: (QR_CARD_SIZE - 190) / 2,
      width: 420,
      height: 190,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    qrCenterText: {
      color: "#000",
      fontFamily: "Pacifico",
      fontSize: 108,
      lineHeight: 156,
      fontWeight: "400",
      letterSpacing: 0,
    },
  });

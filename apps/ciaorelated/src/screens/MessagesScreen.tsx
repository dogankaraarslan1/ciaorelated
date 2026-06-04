import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, gql, useSubscription } from "@apollo/client";
import { Image as ExpoImage } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { avatarPlaceholder } from "../../assets/placeholders";

import { useTranslation } from "react-i18next";

/* ───────────────── GraphQL ───────────────── */

const UNREAD_Q = gql`query { unreadCount { total } }`;



const THREADS = gql`
  query Threads {
    threads {
      id
      title
      lastMessageAt
      unreadCount
      members {
        id
        username
        avatarThumbUrl
        avatarUrl
      }
    }
  }
`;

const SEARCH_USERS = gql`
  query SearchUsers($q: String!, $limit: Int!) {
    searchUsers(q: $q, limit: $limit) {
      id
      username
      avatarThumbUrl
      avatarUrl
      isFollowing
    }
    me {
      id
    }
  }
`;

const CREATE_THREAD = gql`
  mutation CreateThread($memberUserIds: [ID!]!, $title: String) {
    createThread(memberUserIds: $memberUserIds, title: $title) {
      id
      title
      members {
        id
        username
        avatarThumbUrl
        avatarUrl
      }
    }
  }
`;

const ME_Q = gql`
  query MeForThreads {
    me {
      id
      username
      avatarThumbUrl
      avatarUrl
    }
  }
`;

const UNREAD_SUB = gql`
  subscription {
    unreadUpdated {
      total
      perThread {
        threadId
        count
      }
    }
  }
`;


/* ───────────────── Screen ───────────────── */

export default function MessagesScreen() {
  const { t } = useTranslation();

  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // Theme colors (mit Fallbacks falls deine theme.colors andere keys hat)
  const C = useMemo(() => {
    const x: any = theme?.colors ?? {};
    return {
      bg: x.bg ?? x.background ?? "#0B0B0B",
      card: x.card ?? x.surface ?? "#111214",
      text: x.text ?? "#F3F4F6",
      subtext: x.subtext ?? x.sub ?? "#9CA3AF",
      border: x.border ?? "#1f2126",
      primary: x.primary ?? x.accent ?? "#4f46e5",
      danger: x.danger ?? "#ef4444",
    };
  }, [theme]);

  const styles = useMemo(() => makeStyles(C), [C]);

  const [q, setQ] = useState("");

  // Threads laden
  const {
    data: tData,
    loading: tLoading,
    refetch: refetchThreads,
  } = useQuery(THREADS, { fetchPolicy: "cache-and-network" });

  // Me laden (für 1:1 dedupe + "anderen" user finden)
  const { data: meData } = useQuery(ME_Q, { fetchPolicy: "cache-first" });
  const { refetch: refetchUnread } = useQuery(UNREAD_Q, {
    fetchPolicy: "cache-and-network",
  });
  const meId = meData?.me?.id;

  // Suche (aktiv ab 2 Zeichen)
  const trimmedQ = q.trim();
  const doSearch = trimmedQ.length >= 2;

  const { data: sData, loading: sLoading } = useQuery(SEARCH_USERS, {
    variables: { q: trimmedQ, limit: 30 },
    skip: !doSearch,
    fetchPolicy: "cache-and-network",
  });

  const [createThread, { loading: creating }] = useMutation(CREATE_THREAD);

  useFocusEffect(
    React.useCallback(() => {
      // ✅ wenn man zurück in den MessagesScreen kommt, alles “nachziehen”
      refetchUnread().catch(() => {});
      refetchThreads().catch(() => {});
    }, [refetchUnread, refetchThreads])
  );

  useSubscription(UNREAD_SUB, {
    onData: ({ data, client }) => {
      const unread = data.data?.unreadUpdated;
      if (!unread) return;

      // ✅ pro Thread unreadCount direkt patchen
      for (const t of unread.perThread ?? []) {
        const cacheId = client.cache.identify({ __typename: "Thread", id: t.threadId });
        if (!cacheId) continue;

        client.cache.writeFragment({
          id: cacheId,
          fragment: gql`
            fragment _ThreadUnreadPatch on Thread {
              unreadCount
            }
          `,
          data: { unreadCount: t.count },
        });
      }

      // ✅ total ebenfalls in den Cache schreiben
      client.cache.writeQuery({
        query: UNREAD_Q,
        data: {
          unreadCount: { __typename: "UnreadCount", total: unread.total ?? 0 },
        },
      });
    },
  });



  // Sort helper: newest first
  const sortByLast = useCallback(
    (a: any, b: any) =>
      (b?.lastMessageAt ? +new Date(b.lastMessageAt) : 0) -
      (a?.lastMessageAt ? +new Date(a.lastMessageAt) : 0),
    []
  );

  // Raw threads
  const rawThreads = tData?.threads ?? [];

  /**
   * ✅ Fix: Alte Chats waren in deiner neuen Version teils "weg",
   * weil das Dedupe mit meId undefined falsche "other" berechnet hat.
   *
   * -> Dedupe nur, wenn meId existiert.
   */
  const threads = useMemo(() => {
    const sorted = rawThreads.slice().sort(sortByLast);

    // Wenn meId noch nicht da ist: NICHT dedupen, sonst verschwinden Threads.
    if (!meId) return sorted;

    const map = new Map<string, string>(); // otherUserId -> threadId
    const out: any[] = [];

    for (const t of sorted) {
      const members = Array.isArray(t.members) ? t.members : [];

      // 1:1 Thread?
      if (members.length === 2) {
        const other = members.find((m: any) => m?.id && m.id !== meId)?.id;
        if (other) {
          // keep newest per other user
          if (!map.has(other)) {
            map.set(other, t.id);
            out.push(t);
          }
          continue;
        }
      }

      // groups or fallback
      out.push(t);
    }

    return out;
  }, [rawThreads, sortByLast, meId]);

  // Suchresultate: Followings zuerst, dann Präfix, dann alpha
  const results = useMemo(() => {
    if (!doSearch) return [];
    const list = (sData?.searchUsers ?? []).slice();
    const ql = trimmedQ.toLowerCase();

    list.sort((a: any, b: any) => {
      const fA = a.isFollowing ? 0 : 1;
      const fB = b.isFollowing ? 0 : 1;
      if (fA !== fB) return fA - fB;

      const pA = (a.username || "").toLowerCase().startsWith(ql) ? 0 : 1;
      const pB = (b.username || "").toLowerCase().startsWith(ql) ? 0 : 1;
      if (pA !== pB) return pA - pB;

      return (a.username || "").localeCompare(b.username || "");
    });

    return list;
  }, [sData?.searchUsers, doSearch, trimmedQ]);

  // Navigation
  const goBack = () => nav.goBack();

  const openThread = (thr: any) =>
    nav.navigate("Chat", {
      threadId: thr.id,
      title: thr.title || readableThreadTitle(thr.members, meId),
    });

  // Prüfen: existiert 1:1 Thread mit userId?
  function findExistingThreadFor(userId: string) {
    for (const t of threads) {
      const ids = (t.members ?? []).map((m: any) => m.id);
      if (ids.length === 2 && ids.includes(userId)) return t;
    }
    return null;
  }

  // Start mit User: vorhandenen Thread öffnen, sonst anlegen
  const startWithUser = async (user: any) => {
    const existing = findExistingThreadFor(user.id);
    if (existing) return openThread(existing);

    const { data } = await createThread({
      variables: { memberUserIds: [user.id], title: null },
    });

    const thr = data?.createThread;
    if (thr?.id) openThread(thr);
  };

  // Anzeige-Infos für Thread (Titel/Avatar): bei 1:1 "anderer" User
  const getThreadDisplay = (thr: any) => {
    const members = Array.isArray(thr.members) ? thr.members : [];
    const title = thr.title || readableThreadTitle(members, meId);

    let avatar = members?.[0]?.avatarThumbUrl || members?.[0]?.avatarUrl || null;

    if (members.length === 2 && meId) {
      const other = members.find((m: any) => m?.id !== meId);
      avatar = other?.avatarThumbUrl || other?.avatarUrl || avatar;
    }

    return {
      title,
      avatar,
    };
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header (Theme) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerBtn} hitSlop={12} activeOpacity={0.78}>
          <Ionicons name="chevron-back" size={28} color={C.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("messages.news")}</Text>

        <View style={styles.headerBtn} />
      </View>

      {/* Suche (inline) */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={C.subtext} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("messages.seek")}
          placeholderTextColor={C.subtext}
          value={q}
          onChangeText={setQ}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>

      {/* Inhalt */}
      {!doSearch ? (
        <FlatList
          data={threads}
          keyExtractor={(i: any) => i.id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          refreshing={tLoading}
          onRefresh={() => refetchThreads()}
          ListEmptyComponent={
            tLoading ? (
              <View style={{ padding: 24 }}>
                <ActivityIndicator />
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>{t("messages.noChatsYet")}</Text>
                <Text style={styles.emptyText}>
                  {t("messages.startAConversationUsingTheSearchFunc47e2cb")}</Text>
              </View>
            )
          }
          renderItem={({ item }: any) => {
            const { title, avatar } = getThreadDisplay(item);

            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => openThread(item)}
                activeOpacity={0.85}
              >
                <ExpoImage
                  source={avatar ? { uri: avatar } : avatarPlaceholder}
                  style={styles.avatar}
                  contentFit="cover"
                  cachePolicy="disk"
                  transition={120}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  <Text style={styles.itemSub} numberOfLines={1}>
                    {item.lastMessageAt ? dateShort(item.lastMessageAt) : "—"}
                  </Text>
                </View>

                {!!item.unreadCount && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(u: any) => u.id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListHeaderComponent={
            sLoading || creating ? (
              <View style={{ padding: 12 }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !sLoading && doSearch ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>{t("messages.noResultsFound")}</Text>
                <Text style={styles.emptyText}>
                  {t("messages.tryADifferentName")}</Text>
              </View>
            ) : null
          }
          renderItem={({ item: u }: any) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => startWithUser(u)}
              activeOpacity={0.9}
            >
              <ExpoImage
                source={(u.avatarThumbUrl || u.avatarUrl || null)? { uri: (u.avatarThumbUrl || u.avatarUrl || null)} : avatarPlaceholder }
                style={styles.avatar}
                contentFit="cover"
                cachePolicy="disk"
                transition={120}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {u.username}
                  {u.isFollowing ? (
                    <Text style={styles.followingPill}> {t("messages.followsYou")}</Text>
                  ) : null}
                </Text>
                <Text style={styles.itemSub} numberOfLines={1}>
                  {t("messages.sendMessage")}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={C.subtext} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

/* ───────────────── Helpers ───────────────── */

function readableThreadTitle(members: any[], meId?: string) {
  const list = (members || [])
    .map((m) => ({ id: m?.id, username: m?.username }))
    .filter((x) => !!x.username);

  // bei 1:1: zeig bevorzugt den anderen
  if (meId && list.length === 2) {
    const other = list.find((x) => x.id !== meId);
    if (other?.username) return other.username;
  }

  const names = list.map((x) => x.username);
  const base = names.slice(0, 3).join(", ");
  return base + (names.length > 3 ? ` +${names.length - 3}` : "");
}

function dateShort(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return "—";
  }
}

/* ───────────────── Styles ───────────────── */

const makeStyles = (C: {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  danger: string;
}) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },

    header: {
      paddingHorizontal: 12,
      paddingBottom: 10,
      paddingTop: 6,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    headerBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    headerTitle: {
      flex: 1,
      color: C.text,
      fontSize: 20,
      fontWeight: "800",
      textAlign: "center",
    },

    searchRow: {
      marginHorizontal: 16,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: C.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.border,
      paddingHorizontal: 12,
      height: 44,
      gap: 8,
    },
    searchInput: { flex: 1, color: C.text, fontSize: 16 },

    sep: { height: 1, backgroundColor: C.border, opacity: 0.6 },

    item: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: C.border,
    },
    itemTitle: { color: C.text, fontWeight: "700", fontSize: 16 },
    itemSub: { color: C.subtext, fontSize: 12, marginTop: 2 },

    badge: {
      backgroundColor: C.danger,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignSelf: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
    },
    badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },

    emptyBox: { padding: 24, alignItems: "center" },
    emptyTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 6 },
    emptyText: { color: C.subtext, textAlign: "center" },

    followingPill: {
      color: C.subtext,
      fontSize: 12,
      fontWeight: "600",
    },
  });

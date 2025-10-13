/**
 * Leaderboard Tab Screen
 * Displays top users ranked by XP in a systematic view
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore, useAuthStore } from '../../services/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import database from '../../services/database';
import { LeaderboardEntry } from '../../types';

export default function LeaderboardScreen() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      // Update leaderboard rankings
      await database.updateLeaderboard();
      
      // Get top 50 users
      const data = await database.getLeaderboard(50);
      setLeaderboard(data);
      
      // Get current user's rank
      if (user) {
        const rank = await database.getUserRank(user.id);
        setUserRank(rank);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadLeaderboard();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return colors.textSecondary;
    }
  };

  const renderTopThree = () => {
    const topThree = leaderboard.slice(0, 3);
    if (topThree.length === 0) return null;

    // Reorder for podium display: 2nd, 1st, 3rd
    const podiumOrder = [
      topThree[1], // 2nd place (left)
      topThree[0], // 1st place (center)
      topThree[2], // 3rd place (right)
    ].filter(Boolean);

    const podiumHeights = [100, 140, 80]; // Heights for 2nd, 1st, 3rd

    return (
      <View style={styles.podiumContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🏆 Top Champions
        </Text>
        <View style={styles.podium}>
          {podiumOrder.map((entry, index) => {
            if (!entry) return null;
            
            const actualRank = entry.rank;
            const height = podiumHeights[index];
            
            return (
              <View key={entry.id} style={[styles.podiumPosition, { flex: 1 }]}>
                {/* Avatar and Info */}
                <View style={styles.podiumUser}>
                  <View style={[styles.podiumAvatar, { borderColor: getRankColor(actualRank) }]}>
                    <MaterialIcons name="person" size={32} color={colors.primary} />
                    <View style={[styles.rankBadge, { backgroundColor: getRankColor(actualRank) }]}>
                      <Text style={styles.rankBadgeText}>{actualRank}</Text>
                    </View>
                  </View>
                  <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                    {entry.userName}
                  </Text>
                  <View style={styles.podiumXP}>
                    <MaterialIcons name="star" size={14} color={colors.warning} />
                    <Text style={[styles.podiumXPText, { color: colors.textSecondary }]}>
                      {entry.totalXp.toLocaleString()} XP
                    </Text>
                  </View>
                </View>

                {/* Podium Stand */}
                <View style={[styles.podiumStand, { height, backgroundColor: getRankColor(actualRank) + '20' }]}>
                  <Text style={styles.podiumMedal}>{getRankMedal(actualRank)}</Text>
                  <Text style={[styles.podiumLevel, { color: colors.text }]}>
                    Lvl {entry.level}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderLeaderboardList = () => {
    const restOfList = leaderboard.slice(3);
    
    return (
      <View style={styles.listContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          📊 All Rankings
        </Text>
        
        {restOfList.map((entry, index) => {
          const isCurrentUser = user && entry.userId === user.id;
          
          return (
            <View
              key={entry.id}
              style={[
                styles.listItem,
                { backgroundColor: isCurrentUser ? colors.primaryLight : colors.surface },
                Shadows.sm,
              ]}
            >
              {/* Rank */}
              <View style={[styles.rankContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.rankNumber, { color: colors.text }]}>
                  #{entry.rank}
                </Text>
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                  <MaterialIcons name="person" size={24} color={colors.primary} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                    {entry.userName}
                    {isCurrentUser && (
                      <Text style={[styles.youBadge, { color: colors.primary }]}> (You)</Text>
                    )}
                  </Text>
                  <View style={styles.levelContainer}>
                    <MaterialIcons name="trending-up" size={14} color={colors.textSecondary} />
                    <Text style={[styles.levelText, { color: colors.textSecondary }]}>
                      Level {entry.level}
                    </Text>
                  </View>
                </View>
              </View>

              {/* XP */}
              <View style={styles.xpContainer}>
                <Text style={[styles.xpValue, { color: colors.primary }]}>
                  {entry.totalXp.toLocaleString()}
                </Text>
                <Text style={[styles.xpLabel, { color: colors.textSecondary }]}>
                  XP
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderUserRankCard = () => {
    if (!user || userRank === 0) return null;

    return (
      <LinearGradient
        colors={[colors.primary, colors.science]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.userRankCard}
      >
        <View style={styles.userRankContent}>
          <View>
            <Text style={styles.userRankLabel}>Your Rank</Text>
            <Text style={styles.userRankValue}>#{userRank}</Text>
          </View>
          <View style={styles.userRankDivider} />
          <View>
            <Text style={styles.userRankLabel}>Your XP</Text>
            <Text style={styles.userRankValue}>{user.xp.toLocaleString()}</Text>
          </View>
          <View style={styles.userRankDivider} />
          <View>
            <Text style={styles.userRankLabel}>Level</Text>
            <Text style={styles.userRankValue}>{user.level}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading leaderboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.science]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialIcons name="leaderboard" size={40} color="#ffffff" />
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <Text style={styles.headerSubtitle}>Compete with top learners</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* User Rank Card */}
        {renderUserRankCard()}

        {/* Top 3 Podium */}
        {renderTopThree()}

        {/* Full Leaderboard List */}
        {renderLeaderboardList()}

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Rankings Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Start learning to earn XP and climb the leaderboard!
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
  },
  header: {
    paddingTop: Spacing.xl + 40,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
    marginTop: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  userRankCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  userRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userRankLabel: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  userRankValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
    marginTop: 4,
    textAlign: 'center',
  },
  userRankDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  podiumContainer: {
    marginBottom: Spacing.xl,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  podiumPosition: {
    alignItems: 'center',
  },
  podiumUser: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    position: 'relative',
    ...Shadows.md,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
  },
  podiumName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  podiumXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  podiumXPText: {
    fontSize: Typography.fontSize.xs,
  },
  podiumStand: {
    width: '100%',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  podiumMedal: {
    fontSize: 32,
  },
  podiumLevel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginTop: 4,
  },
  listContainer: {
    marginBottom: Spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  rankContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rankNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  youBadge: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  levelText: {
    fontSize: Typography.fontSize.xs,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  xpLabel: {
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
  },
});

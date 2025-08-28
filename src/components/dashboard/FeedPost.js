import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import Card from '../ui/Card';

const FeedPost = ({ post, onAction }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
    onAction(post.id, 'like');
  };

  const handleComment = () => {
    onAction(post.id, 'comment');
  };

  const handleShare = () => {
    onAction(post.id, 'share');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'bronze':
        return colors.bronze;
      case 'silver':
        return colors.silver;
      case 'gold':
        return colors.gold;
      case 'platinum':
        return colors.platinum;
      default:
        return colors.textMuted;
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'ride':
        return 'bicycle';
      case 'bike':
        return 'car-sport';
      case 'alert':
        return 'warning';
      default:
        return 'document-text';
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'ride':
        return colors.accent;
      case 'bike':
        return colors.primary;
      case 'alert':
        return colors.warning;
      default:
        return colors.textMuted;
    }
  };

  return (
    <Card style={styles.container}>
      {/* Post Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: post.user.avatar }} 
              style={styles.avatar}
              defaultSource={require('../../../assets/default-avatar.png')}
            />
            {post.user.role && (
              <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(post.user.role) }]}>
                <Ionicons name="trophy" size={10} color={colors.textPrimary} />
              </View>
            )}
          </View>
          
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.user.name}</Text>
            <View style={styles.postMeta}>
              <View style={styles.postType}>
                <Ionicons 
                  name={getPostTypeIcon(post.type)} 
                  size={14} 
                  color={getPostTypeColor(post.type)} 
                />
                <Text style={[styles.postTypeText, { color: getPostTypeColor(post.type) }]}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Text>
              </View>
              <Text style={styles.timestamp}>• {post.timestamp}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={styles.postText}>{post.content}</Text>
        
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        )}
        
        {post.isAlert && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning" size={16} color={colors.warning} />
            <Text style={styles.alertText}>Weather Alert</Text>
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons 
            name={isLiked ? 'heart' : 'heart-outline'} 
            size={20} 
            color={isLiked ? colors.error : colors.textMuted} 
          />
          <Text style={[styles.actionText, isLiked && { color: colors.error }]}>
            {likeCount}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textMuted} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={colors.textMuted} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  
  roleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  
  userDetails: {
    flex: 1,
  },
  
  userName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  postType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  
  postTypeText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  
  moreButton: {
    padding: spacing.xs,
  },
  
  content: {
    marginBottom: spacing.md,
  },
  
  postText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: post.image ? spacing.md : 0,
  },
  
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface,
  },
  
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.sm,
    marginTop: spacing.md,
  },
  
  alertText: {
    ...typography.bodySmall,
    color: colors.warning,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  
  actionText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
});

export default FeedPost;

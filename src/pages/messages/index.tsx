import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import MessageItem from '@/components/MessageItem';
import Empty from '@/components/Empty';
import { messages as mockMessages } from '@/data/messages';
import { pets as mockPets } from '@/data/pets';
import type { Message, MessageType } from '@/types/message';
import dayjs from 'dayjs';

type TabType = 'all' | 'system' | 'order' | 'care';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统' },
  { key: 'order', label: '订单' },
  { key: 'care', label: '照护' }
];

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState<string>('');

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);
  const systemUnread = useMemo(
    () => messages.filter((m) => m.type === 'system' && !m.read).length,
    [messages]
  );
  const orderUnread = useMemo(
    () => messages.filter((m) => m.type === 'order' && !m.read).length,
    [messages]
  );
  const careUnread = useMemo(
    () => messages.filter((m) => m.type === 'care' && !m.read).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    switch (activeTab) {
      case 'system':
        return messages.filter((m) => m.type === 'system');
      case 'order':
        return messages.filter((m) => m.type === 'order');
      case 'care':
        return messages.filter((m) => m.type === 'care');
      default:
        return messages;
    }
  }, [activeTab, messages]);

  const chatSessions = [
    {
      id: 'staff',
      name: '专属照护师 小林',
      avatar: '👩‍🔬',
      avatarSecondary: false,
      online: true,
      lastMessage: '好的，豆豆今天胃口很好，您放心~',
      lastTime: '10:32',
      unread: 2
    },
    {
      id: 'customer',
      name: '门店客服',
      avatar: '📞',
      avatarSecondary: true,
      online: true,
      lastMessage: '感谢您的评价，我们会继续努力！',
      lastTime: '昨天',
      unread: 0
    }
  ];

  const pendingReview = {
    orderNo: 'ORD20250108001',
    pet: mockPets[0],
    roomName: '豪华观景房',
    checkIn: '01月05日',
    checkOut: '01月10日'
  };

  const handleReadMessage = (msg: Message) => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
    if (msg.actionUrl) {
      Taro.navigateTo({ url: msg.actionUrl });
    }
  };

  const handleChatClick = (chatId: string) => {
    Taro.showToast({ title: `打开聊天窗口: ${chatId}`, icon: 'none' });
  };

  const handleQuickAction = (action: string) => {
    const actions: Record<string, string> = {
      contact: '正在联系客服...',
      complaint: '投诉建议功能开发中',
      invoice: '发票申请功能开发中',
      feedback: '意见反馈功能开发中'
    };
    Taro.showToast({ title: actions[action] || '功能开发中', icon: 'none' });
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      Taro.showToast({ title: '请先选择评分', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '提交评价',
      content: `确认提交 ${reviewRating} 星评价？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '评价提交成功！', icon: 'success' });
          setReviewRating(0);
          setReviewContent('');
        }
      }
    });
  };

  const getTabBadge = (key: string) => {
    switch (key) {
      case 'system':
        return systemUnread;
      case 'order':
        return orderUnread;
      case 'care':
        return careUnread;
      default:
        return 0;
    }
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        {/* 消息统计卡片 */}
        <View className={styles.statsBar}>
          <View className={styles.statCard}>
            <View className={styles.statIcon}>🔔</View>
            <View className={styles.statNumber}>{unreadCount}</View>
            <View className={styles.statLabel}>未读消息</View>
            {unreadCount > 0 && <View className={styles.statBadge}>{unreadCount > 99 ? '99+' : unreadCount}</View>}
          </View>
          <View className={styles.statCard}>
            <View className={styles.statIcon}>📦</View>
            <View className={styles.statNumber}>{messages.filter((m) => m.type === 'order').length}</View>
            <View className={styles.statLabel}>订单提醒</View>
          </View>
          <View className={styles.statCard}>
            <View className={styles.statIcon}>🐾</View>
            <View className={styles.statNumber}>{messages.filter((m) => m.type === 'care').length}</View>
            <View className={styles.statLabel}>照护动态</View>
          </View>
        </View>

        {/* 快捷操作 */}
        <View className={styles.quickActions}>
          <View className={styles.quickAction} onClick={() => handleQuickAction('contact')}>
            <View className={classnames(styles.quickActionIcon, styles.iconPrimary)}>📞</View>
            <Text className={styles.quickActionLabel}>联系客服</Text>
          </View>
          <View className={styles.quickAction} onClick={() => handleQuickAction('complaint')}>
            <View className={classnames(styles.quickActionIcon, styles.iconSuccess)}>💬</View>
            <Text className={styles.quickActionLabel}>投诉建议</Text>
          </View>
          <View className={styles.quickAction} onClick={() => handleQuickAction('invoice')}>
            <View className={classnames(styles.quickActionIcon, styles.iconInfo)}>📄</View>
            <Text className={styles.quickActionLabel}>发票申请</Text>
          </View>
          <View className={styles.quickAction} onClick={() => handleQuickAction('feedback')}>
            <View className={classnames(styles.quickActionIcon, styles.iconWarning)}>✨</View>
            <Text className={styles.quickActionLabel}>意见反馈</Text>
          </View>
        </View>

        {/* 待评价订单 */}
        {pendingReview && (
          <View className={styles.reviewCard}>
            <View className={styles.reviewHeader}>
              <Image
                className={styles.reviewAvatar}
                src={pendingReview.pet.avatar}
                mode="aspectFill"
              />
              <View className={styles.reviewInfo}>
                <Text className={styles.reviewTitle}>✨ 服务评价</Text>
                <Text className={styles.reviewSubtitle}>
                  {pendingReview.pet.name} · {pendingReview.roomName} ·{' '}
                  {pendingReview.checkIn} - {pendingReview.checkOut}
                </Text>
              </View>
            </View>
            <View className={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Text
                  key={n}
                  className={classnames(styles.star, n <= reviewRating && styles.starActive)}
                  onClick={() => setReviewRating(n)}
                >
                  ⭐
                </Text>
              ))}
            </View>
            <Textarea
              className={styles.reviewInput}
              placeholder="和我们分享您和毛孩子的寄养体验吧~"
              value={reviewContent}
              onInput={(e) => setReviewContent(e.detail.value)}
              maxlength={500}
            />
            <View className={styles.reviewButtons}>
              <Button
                className={classnames(styles.reviewBtn, styles.reviewBtnOutline)}
                onClick={() => {
                  setReviewRating(0);
                  setReviewContent('');
                }}
              >
                稍后评价
              </Button>
              <Button
                className={classnames(styles.reviewBtn, styles.reviewBtnPrimary)}
                onClick={handleSubmitReview}
              >
                提交评价
              </Button>
            </View>
          </View>
        )}

        {/* 聊天会话列表 */}
        <View className={styles.chatSection}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text>💬</Text>
              <Text>在线沟通</Text>
            </View>
            <Text className={styles.sectionCount}>{chatSessions.length}个会话</Text>
          </View>
          <View className={styles.chatList}>
            {chatSessions.map((chat) => (
              <View
                key={chat.id}
                className={styles.chatItem}
                onClick={() => handleChatClick(chat.id)}
              >
                <View
                  className={classnames(
                    styles.chatAvatar,
                    chat.avatarSecondary && styles.chatAvatarSecondary
                  )}
                >
                  <Text>{chat.avatar}</Text>
                  {chat.online && <View className={styles.chatOnline} />}
                </View>
                <View className={styles.chatContent}>
                  <View className={styles.chatHeader}>
                    <Text className={styles.chatName}>{chat.name}</Text>
                    <Text className={styles.chatTime}>{chat.lastTime}</Text>
                  </View>
                  <View className={styles.chatPreview}>
                    <Text className={styles.chatPreviewText}>{chat.lastMessage}</Text>
                    {chat.unread > 0 && <View className={styles.chatBadge}>{chat.unread}</View>}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tab切换 */}
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <Text>📋</Text>
            <Text>消息通知</Text>
          </View>
          <Text className={styles.sectionCount}>共{filteredMessages.length}条</Text>
        </View>
        <View className={styles.tabs}>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.activeTab)}
              onClick={() => setActiveTab(tab.key as TabType)}
            >
              {tab.label}
              {getTabBadge(tab.key) > 0 && (
                <View className={styles.tabBadge}>
                  {getTabBadge(tab.key) > 99 ? '99+' : getTabBadge(tab.key)}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 消息列表 */}
        <View className={styles.messageList}>
          {filteredMessages.length === 0 ? (
            <Empty
              icon="📭"
              title="暂无消息"
              desc="最新的消息通知将显示在这里"
            />
          ) : (
            filteredMessages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                onClick={() => handleReadMessage(msg)}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default MessagesPage;

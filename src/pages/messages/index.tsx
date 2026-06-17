import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import MessageItem from '@/components/MessageItem';
import Empty from '@/components/Empty';
import { useMessageStore } from '@/store/useMessageStore';
import { useOrderStore } from '@/store/useOrderStore';
import { usePetStore } from '@/store/usePetStore';
import type { Message } from '@/types/message';
import dayjs from 'dayjs';

type TabType = 'all' | 'system' | 'order' | 'reminder' | 'chat';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统' },
  { key: 'order', label: '订单' },
  { key: 'reminder', label: '提醒' },
  { key: 'chat', label: '聊天' }
];

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { messages, markAsRead, deleteMessage, markBatchAsRead, deleteBatch, getUnreadCount } =
    useMessageStore();
  const pets = usePetStore((state) => state.pets);
  const orders = useOrderStore((state) => state.orders);

  const unreadCount = getUnreadCount();
  const systemUnread = useMemo(
    () => messages.filter((m) => m.type === 'system' && m.status === 'unread').length,
    [messages]
  );
  const orderUnread = useMemo(
    () => messages.filter((m) => m.type === 'order' && m.status === 'unread').length,
    [messages]
  );
  const reminderUnread = useMemo(
    () => messages.filter((m) => m.type === 'reminder' && m.status === 'unread').length,
    [messages]
  );
  const chatUnread = useMemo(
    () => messages.filter((m) => m.type === 'chat' && m.status === 'unread').length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    switch (activeTab) {
      case 'system':
        return messages.filter((m) => m.type === 'system' || m.type === 'review');
      case 'order':
        return messages.filter((m) => m.type === 'order');
      case 'reminder':
        return messages.filter((m) => m.type === 'reminder');
      case 'chat':
        return messages.filter((m) => m.type === 'chat');
      default:
        return messages;
    }
  }, [activeTab, messages]);

  const chatSessions = useMemo(() => {
    const sessionMap = new Map<string, Message>();
    messages
      .filter((m) => m.type === 'chat')
      .forEach((m) => {
        const senderId = m.senderId || 'unknown';
        if (!sessionMap.has(senderId)) {
          sessionMap.set(senderId, m);
        }
      });
    return Array.from(sessionMap.values()).map((m) => ({
      id: m.senderId || 'unknown',
      name: m.senderName || '店员',
      avatar: m.senderAvatar || '',
      lastMessage: m.summary || m.content,
      lastTime: dayjs(m.timestamp).format('HH:mm'),
      unread: m.status === 'unread' ? 1 : 0,
      online: true
    }));
  }, [messages]);

  const pendingReview = useMemo(() => {
    const reviewMsg = messages.find((m) => m.type === 'review' && m.status === 'unread');
    if (!reviewMsg) return null;
    const order = orders.find((o) => o.id === reviewMsg.orderId);
    if (!order) return null;
    const pet = order.pets?.[0] || pets[0];
    return {
      orderNo: order.orderNo,
      pet,
      roomName: order.room?.name || '豪华观景房',
      checkIn: dayjs(order.checkinDate).format('MM月DD日'),
      checkOut: dayjs(order.checkoutDate).format('MM月DD日')
    };
  }, [messages, orders, pets]);

  const handleReadMessage = (msg: Message) => {
    if (selectMode) return;

    markAsRead(msg.id);

    let targetUrl = '';
    if (msg.action && msg.action.type === 'navigate' && msg.action.target) {
      targetUrl = msg.action.target;
    } else if (msg.orderId) {
      targetUrl = `/pages/order-detail/index?id=${msg.orderId}`;
    } else if (msg.logId) {
      targetUrl = `/pages/log-detail/index?id=${msg.logId}`;
    }

    if (targetUrl) {
      const tabPages = ['/pages/care', '/pages/messages', '/pages/booking', '/pages/pets', '/pages/home'];
      const isTabPage = tabPages.some((p) => targetUrl.startsWith(p));
      if (isTabPage) {
        Taro.switchTab({ url: targetUrl.split('?')[0] });
      } else {
        Taro.navigateTo({ url: targetUrl });
      }
    }
  };

  const handleLongPress = (msg: Message) => {
    if (selectMode) return;
    setSelectMode(true);
    setSelectedIds([msg.id]);
  };

  const handleSelectChange = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id));
    }
  };

  const handleBatchRead = () => {
    if (selectedIds.length === 0) return;
    markBatchAsRead(selectedIds);
    Taro.showToast({ title: `已标读${selectedIds.length}条`, icon: 'none' });
    setSelectMode(false);
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    Taro.showModal({
      title: '删除消息',
      content: `确定要删除选中的 ${selectedIds.length} 条消息吗？`,
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          deleteBatch(selectedIds);
          Taro.showToast({ title: '删除成功', icon: 'success' });
          setSelectMode(false);
          setSelectedIds([]);
        }
      }
    });
  };

  const handleCancelSelect = () => {
    setSelectMode(false);
    setSelectedIds([]);
  };

  const handleChatClick = (chatId: string) => {
    if (selectMode) return;
    const chatMsg = messages.find((m) => m.senderId === chatId);
    if (chatMsg) {
      markAsRead(chatMsg.id);
    }
    Taro.showToast({ title: '聊天功能开发中', icon: 'none' });
  };

  const handleQuickAction = (action: string) => {
    if (selectMode) return;
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
          const reviewMsg = messages.find((m) => m.type === 'review');
          if (reviewMsg) {
            markAsRead(reviewMsg.id);
          }
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
      case 'reminder':
        return reminderUnread;
      case 'chat':
        return chatUnread;
      default:
        return 0;
    }
  };

  const pageTitle = selectMode
    ? `已选${selectedIds.length}条`
    : '消息中心';

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>{pageTitle}</Text>
        {selectMode ? (
          <View className={styles.headerActions}>
            <Text className={styles.headerAction} onClick={handleCancelSelect}>
              取消
            </Text>
          </View>
        ) : (
          <View className={styles.headerActions}>
            <Text className={styles.headerAction} onClick={handleQuickAction.bind(null, 'feedback')}>
              更多
            </Text>
          </View>
        )}
      </View>

      <ScrollView className={styles.scrollContainer} scrollY>
        <View className={styles.container}>
          {!selectMode && (
            <>
              {/* 消息统计卡片 */}
              <View className={styles.statsBar}>
                <View className={styles.statCard}>
                  <View className={styles.statIcon}>
                    <Text>🔔</Text>
                  </View>
                  <Text className={styles.statNumber}>{unreadCount}</Text>
                  <Text className={styles.statLabel}>未读消息</Text>
                  {unreadCount > 0 && (
                    <View className={styles.statBadge}>
                      <Text>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                    </View>
                  )}
                </View>
                <View className={styles.statCard}>
                  <View className={styles.statIcon}>
                    <Text>📦</Text>
                  </View>
                  <Text className={styles.statNumber}>
                    {messages.filter((m) => m.type === 'order').length}
                  </Text>
                  <Text className={styles.statLabel}>订单提醒</Text>
                </View>
                <View className={styles.statCard}>
                  <View className={styles.statIcon}>
                    <Text>🐾</Text>
                  </View>
                  <Text className={styles.statNumber}>
                    {messages.filter((m) => m.type === 'reminder').length}
                  </Text>
                  <Text className={styles.statLabel}>照护提醒</Text>
                </View>
              </View>

              {/* 快捷操作 */}
              <View className={styles.quickActions}>
                <View
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('contact')}
                >
                  <View className={classnames(styles.quickActionIcon, styles.iconPrimary)}>
                    <Text>📞</Text>
                  </View>
                  <Text className={styles.quickActionLabel}>联系客服</Text>
                </View>
                <View
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('complaint')}
                >
                  <View className={classnames(styles.quickActionIcon, styles.iconSuccess)}>
                    <Text>💬</Text>
                  </View>
                  <Text className={styles.quickActionLabel}>投诉建议</Text>
                </View>
                <View
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('invoice')}
                >
                  <View className={classnames(styles.quickActionIcon, styles.iconInfo)}>
                    <Text>📄</Text>
                  </View>
                  <Text className={styles.quickActionLabel}>发票申请</Text>
                </View>
                <View
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('feedback')}
                >
                  <View className={classnames(styles.quickActionIcon, styles.iconWarning)}>
                    <Text>✨</Text>
                  </View>
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
              {chatSessions.length > 0 && (
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
                        <View className={styles.chatAvatarBox}>
                          {chat.avatar ? (
                            <Image
                              className={styles.chatAvatar}
                              src={chat.avatar}
                              mode="aspectFill"
                            />
                          ) : (
                            <View className={styles.chatAvatarEmoji}>
                              <Text>👩‍🔬</Text>
                            </View>
                          )}
                          {chat.online && <View className={styles.chatOnline} />}
                        </View>
                        <View className={styles.chatContent}>
                          <View className={styles.chatHeader}>
                            <Text className={styles.chatName}>{chat.name}</Text>
                            <Text className={styles.chatTime}>{chat.lastTime}</Text>
                          </View>
                          <View className={styles.chatPreview}>
                            <Text className={styles.chatPreviewText} numberOfLines={1}>
                              {chat.lastMessage}
                            </Text>
                            {chat.unread > 0 && (
                              <View className={styles.chatBadge}>
                                <Text>{chat.unread}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

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
                    <Text>{tab.label}</Text>
                    {getTabBadge(tab.key) > 0 && (
                      <View className={styles.tabBadge}>
                        <Text>{getTabBadge(tab.key) > 99 ? '99+' : getTabBadge(tab.key)}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* 选择模式下的全选栏 */}
          {selectMode && (
            <View className={styles.selectBar}>
              <View className={styles.selectAll} onClick={handleSelectAll}>
                <View
                  className={classnames(
                    styles.selectCheckbox,
                    selectedIds.length === filteredMessages.length && filteredMessages.length > 0 && styles.checked
                  )}
                >
                  <Text>
                    {selectedIds.length === filteredMessages.length && filteredMessages.length > 0 ? '✓' : ''}
                  </Text>
                </View>
                <Text className={styles.selectAllText}>全选</Text>
              </View>
              <Text className={styles.selectCount}>
                已选 {selectedIds.length}/{filteredMessages.length}
              </Text>
            </View>
          )}

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
                  onLongPress={handleLongPress}
                  selectMode={selectMode}
                  selected={selectedIds.includes(msg.id)}
                  onSelectChange={handleSelectChange}
                />
              ))
            )}
          </View>

          <View className={styles.bottomSpace} />
        </View>
      </ScrollView>

      {/* 批量操作底部栏 */}
      {selectMode && (
        <View className={styles.batchFooter}>
          <Button
            className={classnames(styles.batchBtn, styles.batchBtnOutline)}
            onClick={handleBatchRead}
            disabled={selectedIds.length === 0}
          >
            标为已读
          </Button>
          <Button
            className={classnames(styles.batchBtn, styles.batchBtnDanger)}
            onClick={handleBatchDelete}
            disabled={selectedIds.length === 0}
          >
            删除
          </Button>
        </View>
      )}
    </View>
  );
};

export default MessagesPage;

import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import CareLogCard from '@/components/CareLogCard';
import Empty from '@/components/Empty';
import { careLogs as mockLogs, careTodos, careSummary } from '@/data/care-logs';
import { orders as mockOrders } from '@/data/orders';
import type { CareLog, CareTodo } from '@/types/care';
import dayjs from 'dayjs';

type LogTab = 'all' | 'today' | 'abnormal' | 'photo';

const logTabs = [
  { key: 'all', label: '全部' },
  { key: 'today', label: '今日' },
  { key: 'photo', label: '📷 相册' },
  { key: 'abnormal', label: '⚠️ 异常' }
];

const CarePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LogTab>('all');
  const [todos, setTodos] = useState<CareTodo[]>(careTodos);
  const [careLogs] = useState<CareLog[]>(mockLogs);

  const currentOrder = useMemo(() => {
    return mockOrders.find((o) => o.status === 'care' || o.status === 'checkin');
  }, []);

  const filteredLogs = useMemo(() => {
    switch (activeTab) {
      case 'today':
        return careLogs.filter((l) =>
          dayjs(l.timestamp).isSame(dayjs(), 'day') ||
          dayjs(l.timestamp).isSame(dayjs('2026-06-18'), 'day')
        );
      case 'photo':
        return careLogs.filter((l) => l.medias && l.medias.length > 0);
      case 'abnormal':
        return careLogs.filter((l) => l.type === 'abnormal');
      default:
        return careLogs;
    }
  }, [activeTab, careLogs]);

  const abnormalLogs = useMemo(
    () => careLogs.filter((l) => l.type === 'abnormal'),
    [careLogs]
  );
  const completedCount = todos.filter((t) => t.completed).length;

  const handleToggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleViewLog = (log: CareLog) => {
    Taro.navigateTo({ url: `/pages/log-detail/index?id=${log.id}` });
  };

  const handleContactStaff = () => {
    Taro.showToast({ title: '正在连接客服...', icon: 'loading' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/messages/index' });
    }, 800);
  };

  const getTodoIconClass = (type: string) => {
    switch (type) {
      case 'feeding':
        return styles.iconFeeding;
      case 'walking':
        return styles.iconWalking;
      case 'medication':
        return styles.iconMedication;
      case 'photo':
        return styles.iconPhoto;
      default:
        return styles.iconFeeding;
    }
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        {/* 顶部状态卡片 */}
        {currentOrder && currentOrder.pets && currentOrder.pets.length > 0 && currentOrder.room ? (
          <View className={styles.statusCard}>
            <View className={styles.statusContent}>
              <View className={styles.statusRow}>
                <View className={styles.petInfo}>
                  <Image
                    className={styles.petAvatar}
                    src={currentOrder.pets[0]?.avatar}
                    mode="aspectFill"
                  />
                  <View>
                    <View className={styles.petNameRow}>
                      <Text className={styles.petName}>{currentOrder.pets[0]?.name}</Text>
                      <View className={styles.statusBadge}>
                        <Text>照护中</Text>
                      </View>
                    </View>
                    <Text className={styles.petRoom}>🏠 {currentOrder.room.name}</Text>
                  </View>
                </View>
                <View className={styles.datesInfo}>
                  <Text className={styles.datesLabel}>入住 → 离店</Text>
                  <View className={styles.datesValue}>
                    {dayjs(currentOrder.checkinDate).format('MM/DD')} -{' '}
                    {dayjs(currentOrder.checkoutDate).format('MM/DD')}
                  </View>
                  <View className={styles.daysLeft}>
                    还剩 {dayjs(currentOrder.checkoutDate).diff(dayjs('2026-06-18'), 'day') + 1} 天
                  </View>
                </View>
              </View>
              <View className={styles.statsRow}>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.feedingCount}</Text>
                  <Text className={styles.statsLabel}>喂食</Text>
                </View>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.walkingCount}</Text>
                  <Text className={styles.statsLabel}>遛弯</Text>
                </View>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.cleaningCount}</Text>
                  <Text className={styles.statsLabel}>清洁</Text>
                </View>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.photoCount}</Text>
                  <Text className={styles.statsLabel}>照片</Text>
                </View>
              </View>
            </View>
            <Text className={styles.statusDecor}>🐾</Text>
          </View>
        ) : null}

        {/* 异常提醒 */}
        {abnormalLogs.length > 0 && (
          <View className={styles.alertSection}>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>
                <Text>🚨</Text>
                <Text>异常提醒</Text>
              </View>
              <Text className={styles.sectionCount}>{abnormalLogs.length}条</Text>
            </View>
            {abnormalLogs.map((log) => (
              <View key={log.id} className={styles.alertCard}>
                <View className={styles.alertHeader}>
                  <View className={styles.alertIcon}>⚠️</View>
                  <View style={{ flex: 1 }}>
                    <Text className={styles.alertTitle}>{log.title}</Text>
                    <Text className={styles.alertTime}>
                      {dayjs(log.timestamp).format('今天 HH:mm')} · {log.staffName}
                    </Text>
                  </View>
                </View>
                <View className={styles.alertContent}>{log.abnormalDetails || log.content}</View>
                <View className={styles.alertStatus}>
                  <View className={log.handled ? styles.statusHandled : styles.statusPending}>
                    <Text>{log.handled ? '✅' : '⏳'}</Text>
                    <Text>{log.handled ? '已处理' : '处理中'}</Text>
                  </View>
                  {log.handledBy && (
                    <Text className={styles.handledBy}>处理人: {log.handledBy}</Text>
                  )}
                  <View className={styles.alertActions}>
                    <Button
                      className={classnames(styles.alertBtn, styles.alertBtnOutline)}
                      onClick={handleContactStaff}
                    >
                      联系店员
                    </Button>
                    <Button
                      className={classnames(styles.alertBtn, styles.alertBtnPrimary)}
                      onClick={() => handleViewLog(log)}
                    >
                      查看详情
                    </Button>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 今日待办 */}
        <View className={styles.todoSection}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text>📋</Text>
              <Text>今日照护计划</Text>
            </View>
            <Text className={styles.sectionCount}>
              {completedCount}/{todos.length} 已完成
            </Text>
          </View>
          <View className={styles.todoList}>
            {todos.map((todo) => (
              <View
                key={todo.id}
                className={classnames(styles.todoItem, todo.completed && styles.todoDone)}
                onClick={() => handleToggleTodo(todo.id)}
              >
                <View
                  className={classnames(
                    styles.todoCheckbox,
                    todo.completed && styles.todoCheckboxDone
                  )}
                >
                  {todo.completed && <Text className={styles.todoCheckIcon}>✓</Text>}
                </View>
                <View className={classnames(styles.todoIcon, getTodoIconClass(todo.type))}>
                  {todo.type === 'feeding' && '🍽️'}
                  {todo.type === 'walking' && '🐕'}
                  {todo.type === 'medication' && '💊'}
                  {todo.type === 'photo' && '📷'}
                  {todo.type === 'cleaning' && '🧹'}
                  {todo.type === 'grooming' && '🛁'}
                </View>
                <View className={styles.todoContent}>
                  <Text className={styles.todoTitle}>{todo.title}</Text>
                  <View className={styles.todoTime}>
                    <Text>🕐</Text>
                    <Text>{dayjs(todo.scheduledTime).format('HH:mm')}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 日志Tab切换 */}
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <Text>📝</Text>
            <Text>照护日志</Text>
          </View>
          <Text className={styles.sectionCount}>共{filteredLogs.length}条</Text>
        </View>
        <View className={styles.logTabs}>
          {logTabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.logTab, activeTab === tab.key && styles.activeLogTab)}
              onClick={() => setActiveTab(tab.key as LogTab)}
            >
              {tab.label}
            </View>
          ))}
        </View>

        {/* 相册视图 */}
        {activeTab === 'photo' && filteredLogs.length > 0 ? (
          <View className={styles.photoGallery}>
            {filteredLogs.flatMap((log) =>
              log.medias.map((media) => (
                <View
                  key={`${log.id}-${media.id}`}
                  className={styles.galleryItem}
                  onClick={() => {
                    if (media.type === 'image') {
                      const imageUrls = log.medias
                        .filter((m) => m.type === 'image')
                        .map((m) => m.url);
                      const currentIndex = log.medias
                        .filter((m) => m.type === 'image')
                        .findIndex((m) => m.id === media.id);
                      Taro.previewImage({
                        current: currentIndex >= 0 ? currentIndex : 0,
                        urls: imageUrls
                      });
                    } else if (media.type === 'video') {
                      Taro.previewMedia({
                        sources: [
                          {
                            url: media.url,
                            type: 'video',
                            poster: (media as any).poster || ''
                          }
                        ]
                      });
                    }
                  }}
                >
                  <Image
                    className={styles.galleryImg}
                    src={media.type === 'video' ? (media as any).poster || media.url : media.url}
                    mode="aspectFill"
                  />
                  {media.type === 'video' && (
                    <View className={styles.galleryPlayBtn}>
                      <Text>▶</Text>
                    </View>
                  )}
                  <View className={styles.galleryInfo}>
                    <Text className={styles.galleryTime}>
                      {dayjs(log.timestamp).format('HH:mm')}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : filteredLogs.length === 0 ? (
          <Empty
            icon="📝"
            title="暂无日志记录"
            desc="今天的照护记录将在这里显示"
          />
        ) : (
          <View className={styles.timeline}>
            {filteredLogs.map((log) => (
              <View key={log.id} className={styles.timelineItem}>
                <View
                  className={classnames(
                    styles.timelineDot,
                    log.type === 'abnormal' && styles.timelineDotAbnormal
                  )}
                />
                <View className={styles.logCardWrapper}>
                  <CareLogCard log={log} onClick={() => handleViewLog(log)} />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CarePage;

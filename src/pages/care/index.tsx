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

  // 当前寄养中的宠物（取第一个进行中订单）
  const currentOrder = useMemo(() => {
    return mockOrders.find((o) => o.status === 'ongoing');
  }, []);

  const filteredLogs = useMemo(() => {
    switch (activeTab) {
      case 'today':
        return careLogs.filter((l) => dayjs(l.time).isSame(dayjs(), 'day'));
      case 'photo':
        return careLogs.filter((l) => l.photos && l.photos.length > 0);
      case 'abnormal':
        return careLogs.filter((l) => l.type === 'abnormal');
      default:
        return careLogs;
    }
  }, [activeTab, careLogs]);

  const abnormalLogs = useMemo(() => careLogs.filter((l) => l.type === 'abnormal'), [careLogs]);
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

  const handleMarkHandled = (logId: string) => {
    Taro.showToast({ title: '已标记为处理中', icon: 'success' });
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
        {currentOrder ? (
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
                    {dayjs(currentOrder.checkInDate).format('MM/DD')} -{' '}
                    {dayjs(currentOrder.checkOutDate).format('MM/DD')}
                  </View>
                  <View className={styles.daysLeft}>
                    还剩 {dayjs(currentOrder.checkOutDate).diff(dayjs(), 'day') + 1} 天
                  </View>
                </View>
              </View>
              <View className={styles.statsRow}>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.feedings}</Text>
                  <Text className={styles.statsLabel}>喂食</Text>
                </View>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.walkings}</Text>
                  <Text className={styles.statsLabel}>遛弯</Text>
                </View>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.cleanings}</Text>
                  <Text className={styles.statsLabel}>清洁</Text>
                </View>
                <View className={styles.statsItem}>
                  <Text className={styles.statsNumber}>{careSummary.photos}</Text>
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
                      {dayjs(log.time).format('今天 HH:mm')} · {log.operator}
                    </Text>
                  </View>
                </View>
                <View className={styles.alertContent}>{log.content}</View>
                <View className={styles.alertStatus}>
                  <View className={styles.statusHandled}>
                    <Text>👨‍⚕️</Text>
                    <Text>店员处理中</Text>
                  </View>
                  <View className={styles.alertActions}>
                    <Button
                      className={classnames(styles.alertBtn, styles.alertBtnOutline)}
                      onClick={handleContactStaff}
                    >
                      联系店员
                    </Button>
                    <Button
                      className={classnames(styles.alertBtn, styles.alertBtnPrimary)}
                      onClick={() => handleMarkHandled(log.id)}
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
                    <Text>{todo.scheduledTime}</Text>
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

        {/* 日志时间轴 */}
        {filteredLogs.length === 0 ? (
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

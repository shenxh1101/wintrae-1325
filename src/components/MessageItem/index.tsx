import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Message, MessageType } from '@/types/message';
import dayjs from 'dayjs';

interface MessageItemProps {
  message: Message;
  onClick?: (message: Message) => void;
}

const typeIconMap: Record<MessageType, string> = {
  system: '🔔',
  order: '📋',
  reminder: '⏰',
  review: '⭐',
  chat: '💬'
};

const MessageItem: React.FC<MessageItemProps> = ({ message, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(message);
    } else if (message.action?.target) {
      Taro.navigateTo({ url: message.action.target });
    }
  };

  const formatTime = (timestamp: string) => {
    const now = dayjs();
    const msgTime = dayjs(timestamp);
    const diffDays = now.diff(msgTime, 'day');

    if (diffDays === 0) {
      return msgTime.format('HH:mm');
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return msgTime.format('MM-DD');
    }
  };

  const isUnread = message.status === 'unread';

  return (
    <View className={classnames(styles.item, isUnread && styles.unread)} onClick={handleClick}>
      {message.type === 'chat' && message.senderAvatar ? (
        <View className={styles.icon} style={{ padding: 0, overflow: 'hidden' }}>
          <Image className={styles.avatar} src={message.senderAvatar} mode="aspectFill" />
          {isUnread && <View className={styles.unreadDot}></View>}
        </View>
      ) : (
        <View className={classnames(styles.icon, styles[message.type])}>
          {typeIconMap[message.type]}
          {isUnread && <View className={styles.unreadDot}></View>}
        </View>
      )}

      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{message.title}</Text>
          <Text className={styles.time}>{formatTime(message.timestamp)}</Text>
        </View>

        <Text className={styles.summary}>{message.summary || message.content}</Text>

        <View className={styles.footer}>
          {message.type === 'chat' && message.senderName ? (
            <Text className={styles.senderName}>{message.senderName}</Text>
          ) : message.orderNo ? (
            <Text className={styles.senderName}>订单号: {message.orderNo}</Text>
          ) : (
            <View></View>
          )}

          {message.action && (
            <Button
              className={styles.actionBtn}
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) {
                  onClick(message);
                }
              }}
            >
              {message.action.label}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageItem;

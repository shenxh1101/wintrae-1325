import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { CareLog, CareLogType, AbnormalLevel } from '@/types/care';
import dayjs from 'dayjs';

interface CareLogCardProps {
  log: CareLog;
}

const typeIconMap: Record<CareLogType, string> = {
  feeding: '🍖',
  walking: '🐕',
  cleaning: '🧹',
  medication: '💊',
  grooming: '🛁',
  abnormal: '⚠️',
  photo: '📷',
  other: '📝'
};

const typeNameMap: Record<CareLogType, string> = {
  feeding: '喂食',
  walking: '遛弯',
  cleaning: '清洁',
  medication: '用药',
  grooming: '洗护',
  abnormal: '异常',
  photo: '照片',
  other: '其他'
};

const abnormalLevelText: Record<AbnormalLevel, string> = {
  low: '轻微',
  medium: '中等',
  high: '严重'
};

const CareLogCard: React.FC<CareLogCardProps> = ({ log }) => {
  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/log-detail/index?id=${log.id}` });
  };

  const handleMediaPreview = (e: React.MouseEvent, current: string, urls: string[]) => {
    e.stopPropagation();
    Taro.previewImage({ current, urls });
  };

  const mediaUrls = log.medias.filter((m) => m.type === 'image').map((m) => m.url);

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.left}>
          <Image
            className={styles.petAvatar}
            src={log.petAvatar || 'https://picsum.photos/id/237/100/100'}
            mode="aspectFill"
          />
          <View className={styles.petInfo}>
            <Text className={styles.petName}>{log.petName}</Text>
            <View className={styles.staff}>
              <Text>👩‍⚕️ {log.staffName}</Text>
            </View>
          </View>
        </View>
        <View className={classnames(styles.typeIcon, styles[log.type])}>
          {typeIconMap[log.type]}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.title}>
          <Text>{log.title}</Text>
          <Text
            className={classnames({
              [styles.levelLow]: log.abnormalLevel === 'low',
              [styles.levelMedium]: log.abnormalLevel === 'medium',
              [styles.levelHigh]: log.abnormalLevel === 'high'
            })}
            style={{ fontSize: '22rpx', fontWeight: '500' }}
          >
            {typeNameMap[log.type]}
          </Text>
        </View>
        <Text className={styles.desc}>{log.content}</Text>
      </View>

      {log.medias && log.medias.length > 0 && (
        <View className={styles.medias}>
          {log.medias.slice(0, 4).map((media) => (
            <View
              className={styles.mediaItem}
              key={media.id}
              onClick={(e) =>
                media.type === 'image' && handleMediaPreview(e, media.url, mediaUrls)
              }
            >
              <Image className={styles.mediaImg} src={media.url} mode="aspectFill" />
              {media.type === 'video' && <View className={styles.videoBadge}>▶</View>}
            </View>
          ))}
          {log.medias.length > 4 && (
            <View
              className={styles.mediaItem}
              style={{
                backgroundColor: '$color-bg-hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: '$font-size-lg',
                  fontWeight: '$font-weight-semibold',
                  color: '$color-text-secondary'
                }}
              >
                +{log.medias.length - 4}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className={styles.footer}>
        <View className={styles.time}>
          <Text>🕐</Text>
          <Text>{dayjs(log.timestamp).format('MM-DD HH:mm')}</Text>
        </View>
        <View className={styles.status}>
          {log.type === 'abnormal' && (
            <>
              <View
                className={classnames(
                  styles.abnormalTag,
                  log.handled ? styles.handled : styles[`level${log.abnormalLevel?.charAt(0).toUpperCase() + log.abnormalLevel?.slice(1)}`]
                )}
              >
                {log.handled ? '已处理' : abnormalLevelText[log.abnormalLevel || 'low']}
              </View>
              {log.handled && log.handledBy && (
                <Text style={{ fontSize: '22rpx', color: '$color-text-tertiary' }}>
                  {log.handledBy}处理
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default CareLogCard;

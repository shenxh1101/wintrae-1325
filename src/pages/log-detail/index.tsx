import React, { useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { careLogs } from '@/data/care-logs';
import type { CareLogType } from '@/types/care';
import dayjs from 'dayjs';

const typeConfig: Record<CareLogType | string, { icon: string; class: string; decor: string }> = {
  feeding: { icon: '🍽️', class: styles.typeFeeding, decor: '🍽️' },
  walking: { icon: '🐕', class: styles.typeWalking, decor: '🌿' },
  cleaning: { icon: '🧹', class: styles.typeCleaning, decor: '✨' },
  grooming: { icon: '🛁', class: styles.typeGrooming, decor: '💅' },
  medication: { icon: '💊', class: styles.typeMedication, decor: '💊' },
  photo: { icon: '📷', class: styles.typePhoto, decor: '📸' },
  abnormal: { icon: '🚨', class: styles.typeAbnormal, decor: '⚠️' },
  other: { icon: '📝', class: styles.typeOther, decor: '📋' }
};

const LogDetailPage: React.FC = () => {
  const router = useRouter();
  const logId = router.params.id;

  const log = useMemo(() => careLogs.find((l) => l.id === logId) || careLogs[0], [logId]);
  const config = typeConfig[log.type] || typeConfig.other;

  const imageUrls = useMemo(() => {
    return log.medias.filter((m) => m.type === 'image').map((m) => m.url);
  }, [log]);

  const videoUrls = useMemo(() => {
    return log.medias.filter((m) => m.type === 'video');
  }, [log]);

  const handlePreviewPhoto = (index: number) => {
    if (imageUrls.length > 0) {
      Taro.previewImage({
        current: index,
        urls: imageUrls
      });
    }
  };

  const handleContactStaff = () => {
    Taro.showToast({ title: '正在联系照护师...', icon: 'loading' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/messages/index' });
    }, 800);
  };

  const getAbnormalLevelText = (level?: string) => {
    switch (level) {
      case 'high':
        return '🔴 紧急';
      case 'medium':
        return '🟡 注意';
      case 'low':
        return '🟢 轻微';
      default:
        return '🟡 注意';
    }
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        {/* 类型卡片 */}
        <View className={[styles.typeCard, config.class]}>
          <View className={styles.typeHeader}>
            <View className={styles.typeIcon}>
              <Text>{config.icon}</Text>
            </View>
            <View className={styles.typeTitleBox}>
              <Text className={styles.typeTitle}>{log.title}</Text>
              <Text className={styles.typeTime}>
                {dayjs(log.timestamp).format('YYYY年MM月DD日 HH:mm')}
              </Text>
            </View>
            {log.type === 'abnormal' && log.abnormalLevel && (
              <View className={styles.typeLevel}>
                {getAbnormalLevelText(log.abnormalLevel)}
              </View>
            )}
          </View>
          <View className={styles.typeMeta}>
            <View className={styles.metaItem}>
              <Text>👩‍🔬</Text>
              <Text>{log.staffName}</Text>
            </View>
            {log.petName && (
              <View className={styles.metaItem}>
                <Text>🐾</Text>
                <Text>{log.petName}</Text>
              </View>
            )}
            {log.orderNo && (
              <View className={styles.metaItem}>
                <Text>📋</Text>
                <Text>{log.orderNo}</Text>
              </View>
            )}
          </View>
          <Text className={styles.typeDecor}>{config.decor}</Text>
        </View>

        {/* 内容卡片 */}
        <View className={styles.contentCard}>
          <View className={styles.sectionTitle}>
            <Text>📝</Text>
            <Text>详情描述</Text>
          </View>
          <Text className={styles.contentText}>{log.content}</Text>

          {/* 喂食详情 */}
          {log.type === 'feeding' && (
            <View className={styles.detailBox}>
              <Text className={styles.detailTitle}>🍽️ 喂食详情</Text>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>食物类型</Text>
                <Text className={styles.detailValue}>日常主粮</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>份量</Text>
                <Text className={styles.detailValue}>约150g</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>食欲</Text>
                <Text className={styles.detailValue}>良好 ✓</Text>
              </View>
            </View>
          )}

          {/* 遛弯详情 */}
          {log.type === 'walking' && (
            <View className={styles.detailBox}>
              <Text className={styles.detailTitle}>🚶 遛弯详情</Text>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>时长</Text>
                <Text className={styles.detailValue}>约40分钟</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>距离</Text>
                <Text className={styles.detailValue}>约1.5公里</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>排便情况</Text>
                <Text className={styles.detailValue}>正常 ✓</Text>
              </View>
            </View>
          )}

          {/* 用药详情 */}
          {log.type === 'medication' && (
            <View className={styles.detailBox}>
              <Text className={styles.detailTitle}>💊 用药详情</Text>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>药品</Text>
                <Text className={styles.detailValue}>外用抗过敏药膏</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>剂量</Text>
                <Text className={styles.detailValue}>适量涂抹</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>方式</Text>
                <Text className={styles.detailValue}>外用涂抹</Text>
              </View>
            </View>
          )}
        </View>

        {/* 照片视频记录 */}
        {log.medias.length > 0 && (
          <View className={styles.contentCard}>
            <View className={styles.sectionTitle}>
              <Text>📷</Text>
              <Text>
                照片视频记录 ({imageUrls.length}张
                {videoUrls.length > 0 && ` · ${videoUrls.length}个视频`})
              </Text>
            </View>
            <View className={styles.photoGrid}>
              {imageUrls.slice(0, 9).map((url, index) => (
                <View
                  key={index}
                  className={styles.photoItem}
                  onClick={() => handlePreviewPhoto(index)}
                >
                  <Image className={styles.photoImg} src={url} mode="aspectFill" />
                  {index === 8 && imageUrls.length > 9 && (
                    <View className={styles.photoCount}>
                      <Text>+{imageUrls.length - 9}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
            {imageUrls.length > 9 && (
              <View
                className={[styles.actionBtn, styles.actionBtnOutline]}
                onClick={() => handlePreviewPhoto(0)}
              >
                查看全部照片
              </View>
            )}
          </View>
        )}

        {/* 异常处理 */}
        {log.type === 'abnormal' && (
          <View className={styles.handleCard}>
            <View className={styles.handleTitle}>
              <Text>🏥</Text>
              <Text>处理情况</Text>
            </View>
            <View className={styles.handleStatusRow}>
              <View className={log.handled ? styles.statusHandled : styles.statusPending}>
                <Text>{log.handled ? '✅' : '⏳'}</Text>
                <Text>{log.handled ? '已处理' : '处理中'}</Text>
              </View>
              {log.handledBy && (
                <Text className={styles.handledByText}>
                  处理人: {log.handledBy}
                </Text>
              )}
            </View>
            {log.abnormalDetails && (
              <View className={styles.handleContent}>
                {log.abnormalDetails}
              </View>
            )}
            {log.handledAt && (
              <Text className={styles.handleTime}>
                处理时间: {dayjs(log.handledAt).format('MM月DD日 HH:mm')}
              </Text>
            )}
            {log.handled && (
              <View className={styles.handleNote}>
                <Text className={styles.handleNoteIcon}>💬</Text>
                <Text className={styles.handleNoteText}>
                  已同步主人，持续观察中，如有异常将第一时间通知
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 店员信息 */}
        <View className={styles.staffCard}>
          <View className={styles.staffAvatar}>
            <Text>👩‍🔬</Text>
          </View>
          <View className={styles.staffInfo}>
            <Text className={styles.staffName}>{log.staffName}</Text>
            <Text className={styles.staffRole}>⭐ 资深照护师</Text>
            <Text className={styles.staffCert}>国家宠物护理师认证 · 从业5年</Text>
          </View>
          <Button className={styles.staffBtn} onClick={handleContactStaff}>
            联系TA
          </Button>
        </View>

        {/* 操作按钮 */}
        <View className={styles.actionRow}>
          <Button
            className={[styles.actionBtn, styles.actionBtnOutline]}
            onClick={() => Taro.navigateBack()}
          >
            返回列表
          </Button>
          <Button
            className={[styles.actionBtn, styles.actionBtnPrimary]}
            onClick={handleContactStaff}
          >
            联系店员
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default LogDetailPage;

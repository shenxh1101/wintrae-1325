import React, { useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { careLogs } from '@/data/care-logs';
import type { CareLogType } from '@/types/care';
import dayjs from 'dayjs';

const typeConfig: Record<CareLogType, { icon: string; class: string; decor: string }> = {
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

  const handlePreviewPhoto = (index: number) => {
    if (log.photos && log.photos.length > 0) {
      Taro.previewImage({
        current: index,
        urls: log.photos
      });
    }
  };

  const handleContactStaff = () => {
    Taro.showToast({ title: '正在联系照护师...', icon: 'loading' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/messages/index' });
    }, 800);
  };

  const handleViewAllPhotos = () => {
    Taro.showToast({ title: '查看全部照片', icon: 'none' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        {/* 类型卡片 */}
        <View className={[styles.typeCard, config.class]}>
          <View className={styles.typeHeader}>
            <View className={styles.typeIcon}>{config.icon}</View>
            <View className={styles.typeTitleBox}>
              <Text className={styles.typeTitle}>{log.title}</Text>
              <Text className={styles.typeTime}>
                {dayjs(log.time).format('YYYY年MM月DD日 HH:mm')}
              </Text>
            </View>
            {log.type === 'abnormal' && log.abnormalLevel && (
              <View className={styles.typeLevel}>
                {log.abnormalLevel === 'high'
                  ? '🔴 紧急'
                  : log.abnormalLevel === 'medium'
                  ? '🟡 注意'
                  : '🟢 轻微'}
              </View>
            )}
          </View>
          <View className={styles.typeMeta}>
            <View className={styles.metaItem}>
              <Text>👩‍🔬</Text>
              <Text>{log.operator}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text>🏠</Text>
              <Text>豪华观景房</Text>
            </View>
            {log.mood && (
              <View className={styles.metaItem}>
                <Text>😊</Text>
                <Text>{log.mood}</Text>
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
          {log.type === 'feeding' && log.feedingDetail && (
            <View style={{ marginTop: 24, padding: 16, backgroundColor: '#FFF8E1', borderRadius: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 600, color: '#E65100', marginBottom: 8 }}>
                🍽️ 喂食详情
              </Text>
              <Text style={{ fontSize: 13, color: '#5D4037', lineHeight: 1.8 }}>
                食物类型: {log.feedingDetail.foodType}
                {'\n'}
                份量: {log.feedingDetail.amount}g
                {'\n'}
                食欲: {log.feedingDetail.appetite}
                {log.feedingDetail.note && `\n备注: ${log.feedingDetail.note}`}
              </Text>
            </View>
          )}

          {/* 遛弯详情 */}
          {log.type === 'walking' && log.walkingDetail && (
            <View style={{ marginTop: 24, padding: 16, backgroundColor: '#E8F5E9', borderRadius: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 600, color: '#2E7D32', marginBottom: 8 }}>
                🚶 遛弯详情
              </Text>
              <Text style={{ fontSize: 13, color: '#1B5E20', lineHeight: 1.8 }}>
                时长: {log.walkingDetail.duration}分钟
                {'\n'}
                距离: {log.walkingDetail.distance}km
                {'\n'}
                排便: {log.walkingDetail.poop}次 / 排尿: {log.walkingDetail.pee}次
              </Text>
            </View>
          )}

          {/* 用药详情 */}
          {log.type === 'medication' && log.medicationDetail && (
            <View style={{ marginTop: 24, padding: 16, backgroundColor: '#FFEBEE', borderRadius: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 600, color: '#C62828', marginBottom: 8 }}>
                💊 用药详情
              </Text>
              <Text style={{ fontSize: 13, color: '#B71C1C', lineHeight: 1.8 }}>
                药品: {log.medicationDetail.name}
                {'\n'}
                剂量: {log.medicationDetail.dosage}
                {'\n'}
                方式: {log.medicationDetail.method}
                {log.medicationDetail.effect && `\n效果: ${log.medicationDetail.effect}`}
              </Text>
            </View>
          )}
        </View>

        {/* 照片卡片 */}
        {log.photos && log.photos.length > 0 && (
          <View className={styles.contentCard}>
            <View className={styles.sectionTitle}>
              <Text>📷</Text>
              <Text>照片记录 ({log.photos.length}张</Text>
            </View>
            <View className={styles.photoGrid}>
              {log.photos.slice(0, 6).map((photo, index) => (
                <View key={index} className={styles.photoItem} onClick={() => handlePreviewPhoto(index)}>
                  <Image className={styles.photoImg} src={photo} mode="aspectFill" />
                  {index === 5 && log.photos.length > 6 && (
                    <View className={styles.photoCount}>+{log.photos.length - 6}</View>
                  )}
                </View>
              ))}
            </View>
            {log.photos.length > 6 && (
              <View
                className={[styles.actionBtn, styles.actionBtnOutline]}
                onClick={handleViewAllPhotos}
                style={{ marginTop: 24, textAlign: 'center', lineHeight: '88rpx' }}
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
            <View className={styles.handleStatus}>
              <Text>✅</Text>
              <Text>店员已处理</Text>
            </View>
            <View className={styles.handleContent}>
              已联系主人说明情况，观察2小时后精神状态恢复正常，已安排兽医进行远程会诊，暂无大碍。继续密切观察中，如有异常会第一时间通知主人。
            </View>
            <Text className={styles.handleTime}>处理时间: 今天 15:30</Text>
          </View>
        )}

        {/* 店员信息 */}
        <View className={styles.staffCard}>
          <View className={styles.staffAvatar}>👩‍🔬</View>
          <View className={styles.staffInfo}>
            <Text className={styles.staffName}>{log.operator}</Text>
            <Text className={styles.staffRole}>⭐ 资深照护师</Text>
            <Text className={styles.staffCert}>国家宠物护理师认证 · 从业5年</Text>
          </View>
          <Button className={styles.staffBtn} onClick={handleContactStaff}>
            联系TA
          </Button>
        </View>

        {/* 操作按钮 */}
        <View className={styles.actionRow}>
          <Button className={[styles.actionBtn, styles.actionBtnOutline]} onClick={() => Taro.navigateBack()}>
            返回列表
          </Button>
          <Button className={[styles.actionBtn, styles.actionBtnPrimary]} onClick={handleContactStaff}>
            联系店员
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default LogDetailPage;

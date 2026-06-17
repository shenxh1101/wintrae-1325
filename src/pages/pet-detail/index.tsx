import React, { useMemo } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { pets } from '@/data/pets';
import dayjs from 'dayjs';

const fosterHistory = [
  {
    id: 'h1',
    month: '01月',
    day: '05-10',
    room: '豪华观景房',
    nights: 5,
    rating: 5,
    comment: '豆豆玩得很开心，下次还来！'
  },
  {
    id: 'h2',
    month: '12月',
    day: '20-25',
    room: '温馨家庭间',
    nights: 5,
    rating: 5,
    comment: '照护非常细心，每天都有照片反馈'
  },
  {
    id: 'h3',
    month: '11月',
    day: '10-15',
    room: '舒适标准间',
    nights: 5,
    rating: 4,
    comment: '整体满意，下次还会选择'
  }
];

const PetDetailPage: React.FC = () => {
  const router = useRouter();
  const petId = router.params.id;

  const pet = useMemo(() => pets.find((p) => p.id === petId) || pets[0], [petId]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleEdit = () => {
    Taro.showToast({ title: '编辑宠物档案', icon: 'none' });
  };

  const handleBook = () => {
    Taro.switchTab({
      url: '/pages/booking/index',
      success: () => {
        Taro.showToast({ title: '已选择此宠物', icon: 'none' });
      }
    });
  };

  const getVaccineStatus = (nextDate?: string) => {
    if (!nextDate) return 'normal';
    const diff = dayjs(nextDate).diff(dayjs(), 'day');
    if (diff < 0) return 'expired';
    if (diff <= 30) return 'soon';
    return 'normal';
  };

  return (
    <View className={styles.page}>
      {/* 头部头像区 */}
      <View className={styles.header}>
        <View className={styles.headerBack} onClick={handleBack}>
          <Text className={styles.headerBackIcon}>‹</Text>
        </View>
        <View className={styles.headerContent}>
          <Image className={styles.headerAvatar} src={pet.avatar} mode="aspectFill" />
          <View className={styles.headerInfo}>
            <View className={styles.headerNameRow}>
              <Text className={styles.headerName}>{pet.name}</Text>
              <View className={styles.headerGender}>
                {pet.gender === 'male' ? '♂' : '♀'}
              </View>
            </View>
            <Text className={styles.headerBreed}>{pet.breed}</Text>
            <View className={styles.headerMetaRow}>
              <View className={styles.headerMeta}>🎂 {pet.age}岁</View>
              <View className={styles.headerMeta}>⚖️ {pet.weight}kg</View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.container}>
        {/* 基本信息 */}
        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <Text>📋</Text>
            <Text>基本信息</Text>
          </View>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>宠物类型</Text>
              <Text className={styles.infoValue}>
                {pet.type === 'dog' ? '🐕 狗狗' : pet.type === 'cat' ? '🐱 猫咪' : '🐾 其他'}
              </Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>绝育情况</Text>
              <Text className={styles.infoValue}>{pet.sterilized ? '✅ 已绝育' : '⏳ 未绝育'}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>疫苗状态</Text>
              <Text className={styles.infoValue}>
                {pet.vaccineStatus === 'completed' ? '✅ 齐全' : '⚠️ 待补'}
              </Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>驱虫情况</Text>
              <Text className={styles.infoValue}>{pet.dewormed ? '✅ 已驱虫' : '⏳ 待驱虫'}</Text>
            </View>
          </View>
        </View>

        {/* 疫苗记录 */}
        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <Text>💉</Text>
            <Text>疫苗记录</Text>
          </View>
          <View className={styles.vaccineList}>
            {pet.vaccines.map((v) => {
              const status = getVaccineStatus(v.nextDate);
              return (
                <View
                  key={v.id}
                  className={classnames(
                    styles.vaccineItem,
                    status === 'expired' && styles.vaccineItemExpired,
                    status === 'soon' && styles.vaccineItemSoon
                  )}
                >
                  <View className={styles.vaccineLeft}>
                    <Text className={styles.vaccineName}>{v.name}</Text>
                    <Text className={styles.vaccineDate}>接种时间: {v.date}</Text>
                    {v.nextDate && <Text className={styles.vaccineNext}>下次: {v.nextDate}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 饮食禁忌 */}
        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <Text>🚫</Text>
            <Text>饮食禁忌</Text>
          </View>
          {pet.dietRestrictions && pet.dietRestrictions.length > 0 ? (
            <View className={styles.tagList}>
              {pet.dietRestrictions.map((item, i) => (
                <View key={i} className={classnames(styles.tagItem, styles.tagError)}>
                  {item}
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.dietWarning}>
              <Text className={styles.dietText}>暂无特殊饮食禁忌，可正常喂养。</Text>
            </View>
          )}
        </View>

        {/* 性格备注 */}
        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <Text>💭</Text>
            <Text>性格特点</Text>
          </View>
          <View className={styles.tagList}>
            {pet.personalityTags?.map((tag, i) => (
              <View key={i} className={styles.tagItem}>
                {tag}
              </View>
            ))}
          </View>
          {pet.notes && (
            <View className={styles.personalityBox} style={{ marginTop: 16 }}>
              <Text className={styles.personalityText}>📝 {pet.notes}</Text>
            </View>
          )}
        </View>

        {/* 寄养历史 */}
        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <Text>📅</Text>
            <Text>寄养历史</Text>
          </View>
          {fosterHistory.map((h) => (
            <View key={h.id} className={styles.historyItem}>
              <View className={styles.historyDates}>
                <Text className={styles.historyMonth}>{h.month}</Text>
                <Text className={styles.historyDay}>{h.day.split('-')[0]}</Text>
              </View>
              <View className={styles.historyContent}>
                <Text className={styles.historyRoom}>{h.room}</Text>
                <Text className={styles.historyMeta}>共{h.nights}晚 · {h.comment}</Text>
                <View className={styles.historyRating}>
                  {Array.from({ length: h.rating }).map((_, i) => (
                    <Text key={i} className={styles.historyStar}>
                      ⭐
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className={styles.footer}>
        <Button className={[styles.footerBtn, styles.footerBtnOutline]} onClick={handleEdit}>
          编辑档案
        </Button>
        <Button className={[styles.footerBtn, styles.footerBtnPrimary]} onClick={handleBook}>
          立即寄养
        </Button>
      </View>
    </View>
  );
};

export default PetDetailPage;

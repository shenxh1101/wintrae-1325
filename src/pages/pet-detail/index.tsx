import React, { useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { usePetStore } from '@/store/usePetStore';
import type { Pet, VaccineRecord } from '@/types/pet';
import dayjs from 'dayjs';

const PetDetailPage: React.FC = () => {
  const router = useRouter();
  const petId = router.params.id;
  const { getPetById } = usePetStore();

  const pet = useMemo<Pet | undefined>(() => getPetById(petId || ''), [petId, getPetById]);

  if (!pet) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.headerBack} onClick={() => Taro.navigateBack()}>
            <Text className={styles.headerBackIcon}>‹</Text>
          </View>
        </View>
        <View className={styles.emptyBox}>
          <Text style={{ fontSize: '80rpx' }}>🐾</Text>
          <Text style={{ fontSize: '32rpx', color: '#333', marginTop: '20rpx' }}>宠物不存在</Text>
          <Text style={{ fontSize: '26rpx', color: '#999', marginTop: '12rpx' }}>该宠物档案可能已被删除</Text>
        </View>
      </View>
    );
  }

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleEdit = () => {
    Taro.showToast({ title: '编辑宠物档案', icon: 'none' });
  };

  const handleBook = () => {
    Taro.switchTab({
      url: '/pages/booking/index'
    });
  };

  const getVaccineStatusText = (status: string) => {
    const map: Record<string, string> = {
      completed: '✅ 已完成',
      pending: '⏳ 待接种',
      expired: '⚠️ 已过期'
    };
    return map[status] || status;
  };

  const getVaccineStatusClass = (status: string) => {
    const map: Record<string, string> = {
      completed: styles.vaccineStatusCompleted,
      pending: styles.vaccineStatusPending,
      expired: styles.vaccineStatusExpired
    };
    return map[status] || '';
  };

  const personalityTags = useMemo(() => {
    const text = pet.personality || '';
    const tags = text.split(/[，,。.\s]+/).filter((t) => t.length > 0 && t.length <= 6);
    return tags.slice(0, 6);
  }, [pet.personality]);

  const dietaryTags = useMemo(() => {
    const text = pet.dietaryRestrictions || '';
    if (!text) return [];
    const tags = text.split(/[，,。.\s]+/).filter((t) => t.length > 0 && t.length <= 8);
    return tags.slice(0, 6);
  }, [pet.dietaryRestrictions]);

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
                <Text>{pet.gender === 'male' ? '♂' : '♀'}</Text>
              </View>
            </View>
            <Text className={styles.headerBreed}>{pet.breed}</Text>
            <View className={styles.headerMetaRow}>
              <View className={styles.headerMeta}>
                <Text>🎂 {pet.age}岁</Text>
              </View>
              <View className={styles.headerMeta}>
                <Text>⚖️ {pet.weight}kg</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className={styles.scrollContainer} scrollY>
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
                <Text className={styles.infoValue}>
                  {pet.neutered ? '✅ 已绝育' : '⏳ 未绝育'}
                </Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>疫苗状态</Text>
                <Text className={styles.infoValue}>
                  {pet.vaccineStatus === 'completed' ? '✅ 齐全' : '⚠️ 待补'}
                </Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>出生日期</Text>
                <Text className={styles.infoValue}>
                  {dayjs(pet.birthday).format('YYYY-MM-DD')}
                </Text>
              </View>
            </View>
            {pet.medicalHistory && (
              <View className={styles.medicalBox}>
                <Text className={styles.medicalLabel}>🏥 病史记录</Text>
                <Text className={styles.medicalText}>{pet.medicalHistory}</Text>
              </View>
            )}
          </View>

          {/* 疫苗记录 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>💉</Text>
              <Text>疫苗记录</Text>
            </View>
            <View className={styles.vaccineList}>
              {pet.vaccines && pet.vaccines.length > 0 ? (
                pet.vaccines.map((v: VaccineRecord) => (
                  <View
                    key={v.id}
                    className={classnames(styles.vaccineItem, getVaccineStatusClass(v.status))}
                  >
                    <View className={styles.vaccineLeft}>
                      <Text className={styles.vaccineName}>{v.name}</Text>
                      <Text className={styles.vaccineDate}>接种时间: {v.date}</Text>
                      {v.nextDate && (
                        <Text className={styles.vaccineNext}>下次: {v.nextDate}</Text>
                      )}
                    </View>
                    <View className={styles.vaccineRight}>
                      <Text
                        className={classnames(
                          styles.vaccineStatus,
                          v.status === 'completed' && styles.vaccineStatusCompleted,
                          v.status === 'pending' && styles.vaccineStatusPending,
                          v.status === 'expired' && styles.vaccineStatusExpired
                        )}
                      >
                        {getVaccineStatusText(v.status)}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.emptyBox}>
                  <Text className={styles.emptyText}>暂无疫苗记录</Text>
                </View>
              )}
            </View>
          </View>

          {/* 饮食禁忌 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>🚫</Text>
              <Text>饮食禁忌</Text>
            </View>
            {pet.dietaryRestrictions ? (
              <View>
                <View className={styles.tagList}>
                  {dietaryTags.length > 0 ? (
                    dietaryTags.map((tag, i) => (
                      <View key={i} className={classnames(styles.tagItem, styles.tagError)}>
                        <Text>{tag}</Text>
                      </View>
                    ))
                  ) : (
                    <View className={classnames(styles.tagItem, styles.tagError)}>
                      <Text>{pet.dietaryRestrictions}</Text>
                    </View>
                  )}
                </View>
                <View className={styles.dietDetailBox}>
                  <Text className={styles.dietDetailText}>📝 {pet.dietaryRestrictions}</Text>
                </View>
              </View>
            ) : (
              <View className={styles.emptyBox}>
                <Text className={styles.emptyText}>暂无特殊饮食禁忌，可正常喂养。</Text>
              </View>
            )}
          </View>

          {/* 性格备注 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>💭</Text>
              <Text>性格特点</Text>
            </View>
            {pet.personality ? (
              <View>
                {personalityTags.length > 0 && (
                  <View className={styles.tagList}>
                    {personalityTags.map((tag, i) => (
                      <View key={i} className={styles.tagItem}>
                        <Text>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View className={styles.personalityBox}>
                  <Text className={styles.personalityText}>
                    💡 {pet.personality}
                  </Text>
                </View>
              </View>
            ) : (
              <View className={styles.emptyBox}>
                <Text className={styles.emptyText}>暂无性格备注</Text>
              </View>
            )}
          </View>

          {/* 主人信息 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>👤</Text>
              <Text>主人信息</Text>
            </View>
            <View className={styles.ownerInfo}>
              <View className={styles.ownerRow}>
                <Text className={styles.ownerLabel}>主人姓名</Text>
                <Text className={styles.ownerValue}>{pet.ownerName}</Text>
              </View>
              <View className={styles.ownerRow}>
                <Text className={styles.ownerLabel}>联系电话</Text>
                <Text className={styles.ownerValue}>{pet.ownerPhone}</Text>
              </View>
              <View className={styles.ownerRow}>
                <Text className={styles.ownerLabel}>建档时间</Text>
                <Text className={styles.ownerValue}>
                  {dayjs(pet.createdAt).format('YYYY年MM月DD日')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.bottomSpace} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.footer}>
        <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleEdit}>
          编辑档案
        </Button>
        <Button className={classnames(styles.footerBtn, styles.footerBtnPrimary)} onClick={handleBook}>
          立即寄养
        </Button>
      </View>
    </View>
  );
};

export default PetDetailPage;

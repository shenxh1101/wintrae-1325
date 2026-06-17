import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import PetCard from '@/components/PetCard';
import Empty from '@/components/Empty';
import { usePetStore } from '@/store/usePetStore';
import type { Pet } from '@/types/pet';
import { pets as mockPets } from '@/data/pets';
import dayjs from 'dayjs';

type TabType = 'all' | 'dog' | 'cat' | 'other';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'dog', label: '🐕 狗狗' },
  { key: 'cat', label: '🐱 猫咪' },
  { key: 'other', label: '🐾 其他' }
];

const PetsPage: React.FC = () => {
  const { pets } = usePetStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredPets = useMemo(() => {
    if (activeTab === 'all') return pets;
    return pets.filter((p) => p.type === activeTab);
  }, [pets, activeTab]);

  const vaccineReminders = useMemo(() => {
    const now = dayjs();
    return pets
      .map((pet) => {
        const upcoming = pet.vaccines.filter((v) => {
          if (!v.nextDate) return false;
          const next = dayjs(v.nextDate);
          const diff = next.diff(now, 'day');
          return diff >= 0 && diff <= 60;
        });
        return { pet, upcoming };
      })
      .filter((item) => item.upcoming.length > 0);
  }, [pets]);

  const petStats = useMemo(() => {
    return {
      total: pets.length,
      dog: pets.filter((p) => p.type === 'dog').length,
      cat: pets.filter((p) => p.type === 'cat').length,
      vaccine: pets.filter((p) => p.vaccineStatus === 'completed').length
    };
  }, [pets]);

  const handleAddPet = () => {
    Taro.showToast({ title: '添加宠物功能开发中', icon: 'none' });
  };

  const handleViewPet = (pet: Pet) => {
    Taro.navigateTo({ url: `/pages/pet-detail/index?id=${pet.id}` });
  };

  const handleDeletePet = (pet: Pet) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除 ${pet.name} 的档案吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  const handleBookVaccine = () => {
    Taro.showToast({ title: '疫苗预约功能开发中', icon: 'none' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        {/* 统计卡片 */}
        <View className={styles.statsCard}>
          <View className={styles.statsContent}>
            <Text className={styles.statsTitle}>我的毛孩子 🐾</Text>
            <View className={styles.statsGrid}>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{petStats.total}</Text>
                <Text className={styles.statLabel}>宠物总数</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{petStats.dog}</Text>
                <Text className={styles.statLabel}>狗狗</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{petStats.cat}</Text>
                <Text className={styles.statLabel}>猫咪</Text>
              </View>
            </View>
          </View>
          <Text className={styles.statsDecor}>🐕</Text>
        </View>

        {/* Tab切换 */}
        <View className={styles.tabs}>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.activeTab)}
              onClick={() => setActiveTab(tab.key as TabType)}
            >
              {tab.label}
            </View>
          ))}
        </View>

        {/* 疫苗提醒 */}
        {vaccineReminders.length > 0 && (
          <View className={styles.vaccineSection}>
            <View className={styles.sectionTitle}>
              <Text>💉</Text>
              <Text>疫苗提醒</Text>
            </View>
            {vaccineReminders.map(({ pet, upcoming }) => (
              <View key={pet.id} className={styles.vaccineCard}>
                <View className={styles.vaccineHeader}>
                  <View className={styles.vaccinePetInfo}>
                    <Image className={styles.vaccinePetAvatar} src={pet.avatar} mode="aspectFill" />
                    <View>
                      <Text className={styles.vaccinePetName}>{pet.name}</Text>
                      <Text className={styles.vaccinePetBreed}>{pet.breed}</Text>
                    </View>
                  </View>
                  <View className={styles.urgentBadge}>即将到期</View>
                </View>
                <View className={styles.vaccineDetail}>
                  {upcoming.map((v) => (
                    <View className={styles.vaccineItem} key={v.id}>
                      <Text className={styles.vaccineName}>{v.name}</Text>
                      <Text className={styles.vaccineDate}>{v.nextDate}</Text>
                    </View>
                  ))}
                </View>
                <Button className={styles.vaccineAction} onClick={handleBookVaccine}>
                  一键预约接种
                </Button>
              </View>
            ))}
          </View>
        )}

        {/* 宠物列表 */}
        <View className={styles.filterBar}>
          <Text className={styles.filterTitle}>宠物档案</Text>
          <Text className={styles.filterCount}>共 {filteredPets.length} 只</Text>
        </View>

        <View className={styles.petList}>
          {filteredPets.length === 0 ? (
            <View className={styles.emptyWrapper}>
              <Empty
                icon="🐾"
                title="暂无宠物档案"
                desc="点击右下角按钮添加您的第一只宠物吧~"
                buttonText="添加宠物"
                onButtonClick={handleAddPet}
              />
            </View>
          ) : (
            filteredPets.map((pet: Pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                showActions
                onEdit={handleViewPet}
                onDelete={handleDeletePet}
              />
            ))
          )}
        </View>

        {/* 健康概览（最近寄养的宠物） */}
        {filteredPets.length > 0 && (
          <View>
            <View className={styles.sectionTitle}>
              <Text>📊</Text>
              <Text>健康概览</Text>
            </View>
            {filteredPets.slice(0, 2).map((pet) => (
              <View key={pet.id} className={styles.healthCard}>
                <View className={styles.healthHeader}>
                  <Image className={styles.healthAvatar} src={pet.avatar} mode="aspectFill" />
                  <View>
                    <Text className={styles.healthName}>{pet.name}</Text>
                    <Text className={styles.healthMeta}>
                      {pet.breed} · {pet.age}岁 · {pet.weight}kg
                    </Text>
                  </View>
                </View>
                <View className={styles.healthStats}>
                  <View className={styles.healthStat}>
                    <Text className={styles.healthStatIcon}>💉</Text>
                    <Text className={styles.healthStatValue}>{pet.vaccines.length}</Text>
                    <Text className={styles.healthStatLabel}>疫苗</Text>
                  </View>
                  <View className={styles.healthStat}>
                    <Text className={styles.healthStatIcon}>⚖️</Text>
                    <Text className={styles.healthStatValue}>{pet.weight}</Text>
                    <Text className={styles.healthStatLabel}>体重/kg</Text>
                  </View>
                  <View className={styles.healthStat}>
                    <Text className={styles.healthStatIcon}>🎂</Text>
                    <Text className={styles.healthStatValue}>{pet.age}</Text>
                    <Text className={styles.healthStatLabel}>年龄/岁</Text>
                  </View>
                  <View className={styles.healthStat}>
                    <Text className={styles.healthStatIcon}>
                      {pet.vaccineStatus === 'completed' ? '✅' : '⚠️'}
                    </Text>
                    <Text className={styles.healthStatValue}>
                      {pet.vaccineStatus === 'completed' ? '齐' : '待补'}
                    </Text>
                    <Text className={styles.healthStatLabel}>防疫</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 浮动添加按钮 */}
      <View className={styles.fab} onClick={handleAddPet}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </ScrollView>
  );
};

export default PetsPage;

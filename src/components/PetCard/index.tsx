import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import type { Pet, VaccineStatus } from '@/types/pet';

interface PetCardProps {
  pet: Pet;
  selectable?: boolean;
  selected?: boolean;
  showActions?: boolean;
  onSelect?: (pet: Pet) => void;
  onEdit?: (pet: Pet) => void;
  onDelete?: (pet: Pet) => void;
}

const vaccineStatusMap: Record<VaccineStatus, { text: string; type: 'success' | 'warning' | 'error' }> = {
  completed: { text: '疫苗齐全', type: 'success' },
  pending: { text: '待接种', type: 'warning' },
  expired: { text: '已过期', type: 'error' }
};

const PetCard: React.FC<PetCardProps> = ({
  pet,
  selectable = false,
  selected = false,
  showActions = false,
  onSelect,
  onEdit,
  onDelete
}) => {
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(pet);
    } else {
      Taro.navigateTo({ url: `/pages/pet-detail/index?id=${pet.id}` });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(pet);
    } else {
      Taro.navigateTo({ url: `/pages/pet-detail/index?id=${pet.id}` });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(pet);
    }
  };

  const vaccineInfo = vaccineStatusMap[pet.vaccineStatus];
  const typeIcon = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🐾';

  return (
    <View
      className={classnames(styles.card, selectable && selected && styles.selected)}
      onClick={handleClick}
    >
      <View className={styles.header}>
        {selectable && (
          <View className={classnames(styles.selectBox, selected && styles.selectedBox)}>
            {selected && <Text className={styles.checkIcon}>✓</Text>}
          </View>
        )}

        <View className={styles.avatarWrapper}>
          <Image className={styles.avatar} src={pet.avatar} mode="aspectFill" />
          <View
            className={classnames(
              styles.genderIcon,
              pet.gender === 'male' ? styles.male : styles.female
            )}
          >
            {pet.gender === 'male' ? '♂' : '♀'}
          </View>
        </View>

        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{pet.name}</Text>
            <Text className={styles.typeIcon}>{typeIcon}</Text>
            {pet.neutered && <Tag size="small" type="default">已绝育</Tag>}
          </View>
          <Text className={styles.breed}>{pet.breed}</Text>
          <View className={styles.meta}>
            <View className={styles.metaItem}>
              <Text>{pet.age}岁</Text>
            </View>
            <View className={styles.metaItem}>
              <Text>·</Text>
            </View>
            <View className={styles.metaItem}>
              <Text>{pet.weight}kg</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.statusRow}>
        <Tag type={vaccineInfo.type} size="small">
          {vaccineInfo.text}
        </Tag>
        {pet.vaccines.length > 0 && pet.vaccines[0].nextDate && (
          <Text className={styles.statusLabel}>
            下次疫苗: {pet.vaccines[0].nextDate}
          </Text>
        )}
      </View>

      {showActions && (
        <View className={styles.actionRow}>
          <Button className={classnames(styles.actionBtn, styles.secondaryBtn)} onClick={handleEdit}>
            查看详情
          </Button>
          <Button className={classnames(styles.actionBtn, styles.primaryBtn)} onClick={handleDelete}>
            删除
          </Button>
        </View>
      )}
    </View>
  );
};

export default PetCard;

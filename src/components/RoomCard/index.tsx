import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import type { Room } from '@/types/room';

interface RoomCardProps {
  room: Room;
  onBook?: (room: Room) => void;
  showBookBtn?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook, showBookBtn = true }) => {
  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/room-detail/index?id=${room.id}` });
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBook) {
      onBook(room);
    } else {
      Taro.switchTab({ url: '/pages/booking/index' });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image className={styles.image} src={room.image} mode="aspectFill" />
        {room.originalPrice && (
          <View className={styles.badge}>限时特惠</View>
        )}
        <View className={styles.rating}>
          <Text className={styles.ratingStar}>★</Text>
          <Text>{room.rating}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{room.name}</Text>
          <View className={styles.priceArea}>
            <Text className={styles.price}>¥{room.price}</Text>
            <Text className={styles.priceUnit}>/晚</Text>
            {room.originalPrice && (
              <Text className={styles.originalPrice}>¥{room.originalPrice}</Text>
            )}
          </View>
        </View>

        <View className={styles.meta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>📐</Text>
            <Text>{room.size}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>🐾</Text>
            <Text>可住{room.capacity}只</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>
              {room.isAvailable ? '✅' : '❌'}
            </Text>
            <Text>{room.isAvailable ? '有房' : '已满'}</Text>
          </View>
        </View>

        <Text className={styles.description}>{room.description}</Text>

        <View className={styles.facilities}>
          {room.facilities.slice(0, 4).map((facility, idx) => (
            <View className={styles.facilityTag} key={idx}>
              {facility}
            </View>
          ))}
          {room.facilities.length > 4 && (
            <View className={styles.facilityTag}>+{room.facilities.length - 4}项</View>
          )}
        </View>

        <View className={styles.tags}>
          {room.tags.map((tag, idx) => (
            <Tag key={idx} type="outline-primary" size="small">
              {tag}
            </Tag>
          ))}
        </View>

        <View className={styles.footer}>
          <Text className={styles.reviewInfo}>{room.reviewCount}条主人评价</Text>
          {showBookBtn && (
            <Button className={styles.bookBtn} onClick={handleBook} disabled={!room.isAvailable}>
              {room.isAvailable ? '立即预订' : '暂无房'}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default RoomCard;

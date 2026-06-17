import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import Tag from '@/components/Tag';
import type { Order, OrderStatus } from '@/types/order';
import { rooms } from '@/data/rooms';
import { pets as allPets } from '@/data/pets';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

const statusTextMap: Record<OrderStatus, { text: string; type: 'statusPending' | 'statusConfirmed' | 'statusCheckin' | 'statusCare' | 'statusCheckout' | 'statusCompleted' | 'statusCancelled' }> = {
  pending: { text: '待确认', type: 'statusPending' },
  confirmed: { text: '已确认', type: 'statusConfirmed' },
  checkin: { text: '已入住', type: 'statusCheckin' },
  care: { text: '照护中', type: 'statusCare' },
  checkout: { text: '待离店', type: 'statusCheckout' },
  completed: { text: '已完成', type: 'statusCompleted' },
  cancelled: { text: '已取消', type: 'statusCancelled' }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, showActions = true }) => {
  const room = rooms.find((r) => r.id === order.roomId);
  const orderPets = allPets.filter((p) => order.petIds.includes(p.id));
  const statusInfo = statusTextMap[order.status];

  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` });
  };

  const handleCare = (e: React.MouseEvent) => {
    e.stopPropagation();
    Taro.switchTab({ url: '/pages/care/index' });
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    Taro.switchTab({ url: '/pages/messages/index' });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Text className={styles.orderNo}>订单号: {order.orderNo}</Text>
        <Text className={classnames(styles.status, styles[statusInfo.type])}>
          {statusInfo.text}
        </Text>
      </View>

      <View className={styles.info}>
        <View className={styles.roomInfo}>
          <Image
            className={styles.roomImage}
            src={room?.image || 'https://picsum.photos/id/237/300/200'}
            mode="aspectFill"
          />
          <View className={styles.roomDetails}>
            <Text className={styles.roomName}>{room?.name || '房间'}</Text>
            <View className={styles.dates}>
              <Text>📅</Text>
              <Text>
                {order.checkinDate} ~ {order.checkoutDate}
              </Text>
            </View>
            <View>
              <Tag size="small" type="info">共{order.nights}晚</Tag>
              {order.cageNumber && (
                <Tag size="small" type="outline" style={{ marginLeft: '8rpx' }}>
                  笼位: {order.cageNumber}
                </Tag>
              )}
            </View>
          </View>
        </View>

        <View className={styles.petRow}>
          {orderPets.map((pet) => (
            <React.Fragment key={pet.id}>
              <Image className={styles.petAvatar} src={pet.avatar} mode="aspectFill" />
              <Text className={styles.petName}>{pet.name}</Text>
            </React.Fragment>
          ))}
        </View>
      </View>

      {order.addonServices && order.addonServices.length > 0 && (
        <View className={styles.addonList}>
          {order.addonServices.map((service) => (
            <View className={styles.addonItem} key={service.id}>
              <Text className={styles.addonName}>· {service.name}</Text>
              <Text className={styles.addonPrice}>¥{service.price}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.footer}>
        <View className={styles.totalPrice}>
          <Text className={styles.priceLabel}>合计</Text>
          <Text className={styles.priceValue}>¥{order.totalAmount}</Text>
          {order.depositAmount > 0 && (
            <Text className={styles.deposit}>含押金¥{order.depositAmount}</Text>
          )}
        </View>

        {showActions && (order.status === 'care' || order.status === 'checkin') && (
          <View className={styles.actions}>
            <Button className={classnames(styles.actionBtn, styles.outlineBtn)} onClick={handleContact}>
              联系护理
            </Button>
            <Button className={classnames(styles.actionBtn, styles.primaryBtn)} onClick={handleCare}>
              查看照护
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderCard;

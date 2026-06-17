import React, { useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useOrderStore } from '@/store/useOrderStore';
import dayjs from 'dayjs';

const serviceIcons: Record<string, string> = {
  grooming: '🛁',
  transport: '🚗',
  medical: '💊',
  other: '✨'
};

const OrderConfirmPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id;
  const {
    getSelectedRoom,
    getSelectedPets,
    getSelectedAddons,
    calculateNights,
    calculateTotal,
    checkinDate,
    checkoutDate,
    specialNotes,
    getOrderById,
    orders,
    createOrder,
    resetBooking
  } = useOrderStore();

  const fromOrder = useMemo(() => {
    if (orderId) {
      return getOrderById(orderId);
    }
    return undefined;
  }, [orderId, orders, getOrderById]);

  const room = fromOrder ? fromOrder.room : getSelectedRoom();
  const pets = fromOrder ? fromOrder.pets : getSelectedPets();
  const addons = fromOrder ? fromOrder.addonServices : getSelectedAddons();
  const nights = fromOrder ? fromOrder.nights : calculateNights();
  const checkin = fromOrder ? fromOrder.checkinDate : checkinDate;
  const checkout = fromOrder ? fromOrder.checkoutDate : checkoutDate;
  const notes = fromOrder ? fromOrder.specialNotes : specialNotes;
  const totalAmount = fromOrder ? fromOrder.totalAmount : calculateTotal();
  const depositAmount = fromOrder ? fromOrder.depositAmount : (room ? room.price * 0.5 : 0);

  const orderNo = useMemo(() => {
    if (fromOrder) return fromOrder.orderNo;
    const now = dayjs();
    const prefix = 'FY' + now.format('YYYYMMDD');
    const suffix = String(orders.length + 1).padStart(3, '0');
    return prefix + suffix;
  }, [fromOrder, orders.length]);

  const feeDetails = useMemo(() => {
    if (fromOrder && fromOrder.feeDetails) {
      return fromOrder.feeDetails;
    }
    const details: { id: string; name: string; amount: number; quantity?: number }[] = [];
    if (room) {
      details.push({
        id: 'room',
        name: `${room.name} × ${nights}晚`,
        amount: room.price * nights,
        quantity: nights
      });
    }
    if (pets.length > 1) {
      details.push({
        id: 'extraPet',
        name: `多宠物附加费 × ${pets.length - 1}只`,
        amount: (pets.length - 1) * 30 * nights,
        quantity: pets.length - 1
      });
    }
    addons?.forEach((addon) => {
      details.push({
        id: addon.id,
        name: addon.name,
        amount: addon.price
      });
    });
    return details;
  }, [fromOrder, room, pets, addons, nights]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handlePay = () => {
    if (!room) {
      Taro.showToast({ title: '房型信息异常', icon: 'none' });
      return;
    }
    if (!pets || pets.length === 0) {
      Taro.showToast({ title: '请至少选择一只宠物', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '模拟支付',
      content: `确认支付 ¥${(totalAmount + depositAmount).toFixed(2)}？`,
      success: (res) => {
        if (res.confirm) {
          let newOrderId: string;
          if (fromOrder) {
            newOrderId = fromOrder.id;
          } else {
            const newOrder = createOrder();
            newOrderId = newOrder.id;
            resetBooking();
          }
          Taro.showToast({ title: '支付成功！', icon: 'success' });
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/order-detail/index?id=${newOrderId}`
            });
          }, 1500);
        }
      }
    });
  };

  const handleContact = () => {
    Taro.showToast({ title: '正在联系门店...', icon: 'none' });
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '取消订单',
      content: '您确定要取消此订单吗？',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '订单已取消', icon: 'none' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        }
      }
    });
  };

  const handleCopy = (text: string) => {
    Taro.setClipboardData({
      data: text,
      success: () => Taro.showToast({ title: '已复制', icon: 'none' })
    });
  };

  if (!room || !pets || pets.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.headerBack} onClick={handleBack}>
            <Text className={styles.headerBackIcon}>‹</Text>
          </View>
          <Text className={styles.headerTitle}>订单确认</Text>
        </View>
        <View className={styles.emptyBox}>
          <Text style={{ fontSize: '80rpx' }}>📋</Text>
          <Text style={{ fontSize: '32rpx', color: '#333', marginTop: '20rpx' }}>
            {!room ? '请先选择房型' : '请至少选择一只宠物'}
          </Text>
          <Text style={{ fontSize: '26rpx', color: '#999', marginTop: '12rpx' }}>
            请返回预约页重新选择
          </Text>
          <Button className={styles.retryBtn} onClick={handleBack}>
            返回预约
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollContainer} scrollY>
        <View className={styles.container}>
          {/* 订单状态 */}
          <View className={styles.statusBanner}>
            <View className={styles.statusIcon}>
              <Text>✅</Text>
            </View>
            <Text className={styles.statusTitle}>订单提交成功</Text>
            <Text className={styles.statusDesc}>请在30分钟内完成支付，订单将自动确认</Text>
            <View className={styles.statusDecor}>
              <Text>🐾</Text>
            </View>
          </View>

          {/* 房间信息 */}
          <View className={styles.infoCard}>
            <View className={styles.cardTitle}>
              <Text>🏠</Text>
              <Text>房型信息</Text>
            </View>
            <View className={styles.roomInfo}>
              <Image className={styles.roomImg} src={room.image} mode="aspectFill" />
              <View className={styles.roomDetail}>
                <Text className={styles.roomName}>{room.name}</Text>
                <View className={styles.roomMeta}>
                  <Text>{room.size}</Text>
                  <Text>·</Text>
                  <Text>可住{room.capacity}只</Text>
                </View>
                <Text className={styles.roomPrice}>¥{room.price}/晚</Text>
              </View>
            </View>
          </View>

          {/* 入住日期 */}
          <View className={styles.infoCard}>
            <View className={styles.cardTitle}>
              <Text>📅</Text>
              <Text>入住信息</Text>
            </View>
            <View className={styles.dateRow}>
              <View className={styles.dateLabel}>
                <Text>🛬</Text>
                <Text>入住日期</Text>
              </View>
              <Text className={styles.dateValue}>
                {dayjs(checkin).format('YYYY年MM月DD日')}
              </Text>
            </View>
            <View className={styles.dateRow}>
              <View className={styles.dateLabel}>
                <Text>🛫</Text>
                <Text>离店日期</Text>
              </View>
              <Text className={styles.dateValue}>
                {dayjs(checkout).format('YYYY年MM月DD日')}
              </Text>
            </View>
            <View className={styles.dateRow}>
              <View className={styles.dateLabel}>
                <Text>🌙</Text>
                <Text>入住天数</Text>
              </View>
              <Text className={styles.dateValue}>共 {nights} 晚</Text>
            </View>
          </View>

          {/* 宠物信息 */}
          <View className={styles.infoCard}>
            <View className={styles.cardTitle}>
              <Text>🐾</Text>
              <Text>宠物信息</Text>
            </View>
            {pets && pets.length > 0 ? (
              pets.map((pet) => (
                <View key={pet.id} className={styles.petItem}>
                  <Image className={styles.petAvatar} src={pet.avatar} mode="aspectFill" />
                  <View className={styles.petInfo}>
                    <Text className={styles.petName}>{pet.name}</Text>
                    <Text className={styles.petMeta}>
                      {pet.breed} · {pet.gender === 'male' ? '公' : '母'} · {pet.age}岁 ·{' '}
                      {pet.weight}kg
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyTip}>
                <Text>暂无宠物信息</Text>
              </View>
            )}
          </View>

          {/* 附加服务 */}
          {addons && addons.length > 0 && (
            <View className={styles.infoCard}>
              <View className={styles.cardTitle}>
                <Text>🎁</Text>
                <Text>附加服务</Text>
              </View>
              {addons.map((addon) => (
                <View key={addon.id} className={styles.serviceItem}>
                  <View className={styles.serviceLeft}>
                    <View className={styles.serviceIcon}>
                      <Text>{serviceIcons[addon.type] || '✨'}</Text>
                    </View>
                    <Text className={styles.serviceName}>{addon.name}</Text>
                  </View>
                  <Text className={styles.servicePrice}>+¥{addon.price.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 特殊备注 */}
          {notes && (
            <View className={styles.infoCard}>
              <View className={styles.cardTitle}>
                <Text>📝</Text>
                <Text>特殊备注</Text>
              </View>
              <Text className={styles.notesText}>{notes}</Text>
            </View>
          )}

          {/* 订单信息 */}
          <View className={styles.infoCard}>
            <View className={styles.cardTitle}>
              <Text>📋</Text>
              <Text>订单信息</Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>订单编号</Text>
              <Text className={styles.copyable} onClick={() => handleCopy(orderNo)}>
                <Text>{orderNo}</Text>
                <Text> 📋</Text>
              </Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>下单时间</Text>
              <Text className={styles.orderValue}>
                {fromOrder
                  ? dayjs(fromOrder.createdAt).format('YYYY-MM-DD HH:mm')
                  : dayjs().format('YYYY-MM-DD HH:mm')}
              </Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>押金状态</Text>
              <Text className={styles.orderValue}>
                ¥{depositAmount.toFixed(2)}
                <View className={styles.depositBadge}>
                  <Text>🔒</Text>
                  <Text>离店退还</Text>
                </View>
              </Text>
            </View>
          </View>

          {/* 费用明细 */}
          <View className={styles.infoCard}>
            <View className={styles.cardTitle}>
              <Text>💰</Text>
              <Text>费用明细</Text>
            </View>
            {feeDetails.map((fee) => (
              <View key={fee.id} className={styles.feeRow}>
                <Text className={styles.feeLabel}>{fee.name}</Text>
                <Text className={styles.feeValue}>¥{fee.amount.toFixed(2)}</Text>
              </View>
            ))}
            <View className={styles.feeRow}>
              <Text className={styles.feeLabel}>押金</Text>
              <Text className={styles.feeValue}>¥{depositAmount.toFixed(2)}</Text>
            </View>
            <View className={classnames(styles.feeRow, styles.feeRowTotal)}>
              <Text className={styles.feeLabelTotal}>应付总计</Text>
              <Text className={styles.feeValueTotal}>
                ¥{(totalAmount + depositAmount).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View className={styles.bottomSpace} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.footer}>
        <View className={styles.footerInfo}>
          <Text className={styles.footerLabel}>实付金额</Text>
          <View className={styles.footerPriceRow}>
            <Text className={styles.footerPrice}>¥{(totalAmount + depositAmount).toFixed(2)}</Text>
            <Text className={styles.footerPriceUnit}>(含押金)</Text>
          </View>
        </View>
        <View className={styles.footerButtons}>
          <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleCancel}>
            取消
          </Button>
          <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleContact}>
            咨询
          </Button>
          <Button className={classnames(styles.footerBtn, styles.footerBtnPrimary)} onClick={handlePay}>
            立即支付
          </Button>
        </View>
      </View>
    </View>
  );
};

export default OrderConfirmPage;

import React from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { orders } from '@/data/orders';
import dayjs from 'dayjs';

const serviceIcons: Record<string, string> = {
  '基础洗护': '🛁',
  '精致洗护': '💅',
  'SPA护理': '✨',
  '上门接送': '🚗',
  '实时摄像': '📹',
  '每日报告': '📋'
};

const OrderConfirmPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id;
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handlePay = () => {
    Taro.showModal({
      title: '模拟支付',
      content: `确认支付 ¥${order.totalAmount.toFixed(2)}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '支付成功！', icon: 'success' });
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

  return (
    <View className={styles.page}>
      <View className={styles.container}>
        {/* 订单状态 */}
        <View className={styles.statusBanner}>
          <View className={styles.statusIcon}>✅</View>
          <Text className={styles.statusTitle}>订单提交成功</Text>
          <Text className={styles.statusDesc}>请在30分钟内完成支付，订单将自动确认</Text>
          <Text className={styles.statusDecor}>🐾</Text>
        </View>

        {/* 房间信息 */}
        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text>🏠</Text>
            <Text>房型信息</Text>
          </View>
          <View className={styles.roomInfo}>
            <Image className={styles.roomImg} src={order.room.image} mode="aspectFill" />
            <View className={styles.roomDetail}>
              <Text className={styles.roomName}>{order.room.name}</Text>
              <View className={styles.roomMeta}>
                {order.room.tags.slice(0, 3).join(' · ')}
              </View>
              <Text className={styles.roomPrice}>¥{order.room.price}/晚</Text>
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
            <Text className={styles.dateLabel}>
              <Text>🛬</Text>
              <Text>入住日期</Text>
            </Text>
            <Text className={styles.dateValue}>
              {dayjs(order.checkinDate).format('YYYY年MM月DD日')}
            </Text>
          </View>
          <View className={styles.dateRow}>
            <Text className={styles.dateLabel}>
              <Text>🛫</Text>
              <Text>离店日期</Text>
            </Text>
            <Text className={styles.dateValue}>
              {dayjs(order.checkoutDate).format('YYYY年MM月DD日')}
            </Text>
          </View>
          <View className={styles.dateRow}>
            <Text className={styles.dateLabel}>
              <Text>🌙</Text>
              <Text>入住天数</Text>
            </Text>
            <Text className={styles.dateValue}>共 {order.nights} 晚</Text>
          </View>
        </View>

        {/* 宠物信息 */}
        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text>🐾</Text>
            <Text>宠物信息</Text>
          </View>
          {order.pets.map((pet) => (
            <View key={pet.id} className={styles.petItem}>
              <Image className={styles.petAvatar} src={pet.avatar} mode="aspectFill" />
              <View className={styles.petInfo}>
                <Text className={styles.petName}>{pet.name}</Text>
                <Text className={styles.petMeta}>
                  {pet.breed} · {pet.gender === 'male' ? '公' : '母'} · {pet.age}岁 · {pet.weight}kg
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 附加服务 */}
        {order.addonServices && order.addonServices.length > 0 && (
          <View className={styles.infoCard}>
            <View className={styles.cardTitle}>
              <Text>🎁</Text>
              <Text>附加服务</Text>
            </View>
            {order.addonServices.map((addon) => (
              <View key={addon.id} className={styles.serviceItem}>
                <View className={styles.serviceLeft}>
                  <View className={styles.serviceIcon}>
                    {serviceIcons[addon.name] || '✨'}
                  </View>
                  <Text className={styles.serviceName}>{addon.name}</Text>
                </View>
                <Text className={styles.servicePrice}>+¥{addon.price.toFixed(2)}</Text>
              </View>
            ))}
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
            <Text className={styles.copyable} onClick={() => handleCopy(order.orderNo)}>
              {order.orderNo}
              <Text>📋</Text>
            </Text>
          </View>
          <View className={styles.orderRow}>
            <Text className={styles.orderLabel}>下单时间</Text>
            <Text className={styles.orderValue}>{dayjs(order.createdAt).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <View className={styles.orderRow}>
            <Text className={styles.orderLabel}>联系电话</Text>
            <Text className={styles.orderValue}>{order.contactPhone}</Text>
          </View>
          <View className={styles.orderRow}>
            <Text className={styles.orderLabel}>押金状态</Text>
            <Text className={styles.orderValue}>
              ¥{order.depositAmount.toFixed(2)}
              <Text className={styles.depositBadge}>
                <Text>🔒</Text>
                <Text>离店退还</Text>
              </Text>
            </Text>
          </View>
        </View>

        {/* 费用明细 */}
        <View className={styles.infoCard}>
          <View className={styles.cardTitle}>
            <Text>💰</Text>
            <Text>费用明细</Text>
          </View>
          {order.feeDetails.map((fee) => (
            <View key={fee.id} className={styles.feeRow}>
              <Text className={styles.feeLabel}>{fee.name}</Text>
              <Text className={styles.feeValue}>¥{fee.amount.toFixed(2)}</Text>
            </View>
          ))}
          <View className={[styles.feeRow, styles.feeRowTotal]}>
            <Text className={styles.feeLabelTotal}>应付总计</Text>
            <Text className={styles.feeValueTotal}>¥{order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className={styles.footer}>
        <View className={styles.footerInfo}>
          <Text className={styles.footerLabel}>实付金额</Text>
          <View>
            <Text className={styles.footerPrice}>¥{order.totalAmount.toFixed(2)}</Text>
            <Text className={styles.footerPriceUnit}>(含押金)</Text>
          </View>
        </View>
        <View className={styles.footerButtons}>
          <Button className={[styles.footerBtn, styles.footerBtnOutline]} onClick={handleCancel}>
            取消
          </Button>
          <Button className={[styles.footerBtn, styles.footerBtnOutline]} onClick={handleContact}>
            咨询
          </Button>
          <Button className={[styles.footerBtn, styles.footerBtnPrimary]} onClick={handlePay}>
            立即支付
          </Button>
        </View>
      </View>
    </View>
  );
};

export default OrderConfirmPage;

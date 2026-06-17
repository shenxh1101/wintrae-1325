import React, { useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useOrderStore } from '@/store/useOrderStore';
import dayjs from 'dayjs';

const statusConfig: Record<string, {
  title: string;
  desc: string;
  icon: string;
  bannerClass: string;
}> = {
  pending: {
    title: '待确认',
    desc: '订单已提交，等待门店确认',
    icon: '⏳',
    bannerClass: styles.statusBannerPending
  },
  confirmed: {
    title: '已确认',
    desc: '门店已确认，等待入住',
    icon: '✅',
    bannerClass: ''
  },
  checkin: {
    title: '已入住',
    desc: '宠物已安全入住',
    icon: '🏠',
    bannerClass: ''
  },
  care: {
    title: '照护中',
    desc: '宠物正在享受快乐时光 🐾',
    icon: '💕',
    bannerClass: ''
  },
  checkout: {
    title: '待离店',
    desc: '寄养服务即将结束',
    icon: '🧳',
    bannerClass: ''
  },
  completed: {
    title: '已完成',
    desc: '寄养服务已完成',
    icon: '🎉',
    bannerClass: styles.statusBannerCompleted
  },
  cancelled: {
    title: '已取消',
    desc: '订单已取消',
    icon: '❌',
    bannerClass: ''
  }
};

const serviceTypeIcons: Record<string, string> = {
  grooming: '🛁',
  transport: '🚗',
  medical: '💊',
  other: '✨'
};

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id;
  const { getOrderById } = useOrderStore();

  const order = useMemo(() => {
    if (!orderId) return undefined;
    return getOrderById(orderId);
  }, [orderId, getOrderById]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleCopy = (text: string) => {
    Taro.setClipboardData({
      data: text,
      success: () => Taro.showToast({ title: '已复制', icon: 'none' })
    });
  };

  const handleContact = () => {
    Taro.showToast({ title: '正在联系门店...', icon: 'none' });
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？取消后押金将原路退还。',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '订单已取消', icon: 'none' });
        }
      }
    });
  };

  const handlePay = () => {
    if (!order) return;
    Taro.showModal({
      title: '模拟支付',
      content: `确认支付 ¥${(order.totalAmount + order.depositAmount).toFixed(2)}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '支付成功！', icon: 'success' });
        }
      }
    });
  };

  const handleCare = () => {
    Taro.switchTab({ url: '/pages/care/index' });
  };

  const handleReview = () => {
    Taro.switchTab({ url: '/pages/messages/index' });
  };

  if (!order) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.headerBack} onClick={handleBack}>
            <Text className={styles.headerBackIcon}>‹</Text>
          </View>
          <Text className={styles.headerTitle}>订单详情</Text>
        </View>
        <View className={styles.emptyBox}>
          <Text style={{ fontSize: '80rpx' }}>📋</Text>
          <Text style={{ fontSize: '32rpx', color: '#333', marginTop: '20rpx' }}>订单不存在</Text>
          <Text style={{ fontSize: '26rpx', color: '#999', marginTop: '12rpx' }}>
            该订单可能已被删除或不存在
          </Text>
          <Button className={styles.retryBtn} onClick={handleBack}>
            返回上一页
          </Button>
        </View>
      </View>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  const steps = [
    { label: '提交订单', time: order.createdAt, desc: '订单创建成功', done: true },
    {
      label: '门店确认',
      time: order.confirmedAt || '--',
      desc: '等待门店确认',
      done: order.status !== 'pending' && order.status !== 'cancelled'
    },
    {
      label: '宠物入住',
      time: order.checkinDate,
      desc: '入住当天办理入住',
      done:
        order.status === 'checkin' ||
        order.status === 'care' ||
        order.status === 'checkout' ||
        order.status === 'completed'
    },
    {
      label: '服务完成',
      time: order.checkoutDate,
      desc: '寄养服务完成，宠物回家',
      done: order.status === 'completed'
    }
  ];

  const renderFooter = () => {
    switch (order.status) {
      case 'pending':
        return (
          <>
            <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleCancel}>
              取消订单
            </Button>
            <Button className={classnames(styles.footerBtn, styles.footerBtnPrimary)} onClick={handlePay}>
              立即支付
            </Button>
          </>
        );
      case 'confirmed':
        return (
          <>
            <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleContact}>
              联系门店
            </Button>
            <Button className={classnames(styles.footerBtn, styles.footerBtnPrimary)} onClick={handleCancel}>
              取消订单
            </Button>
          </>
        );
      case 'checkin':
      case 'care':
      case 'checkout':
        return (
          <>
            <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleContact}>
              联系门店
            </Button>
            <Button className={classnames(styles.footerBtn, styles.footerBtnSuccess)} onClick={handleCare}>
              查看照护
            </Button>
          </>
        );
      case 'completed':
        return (
          <>
            <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleContact}>
              再次预约
            </Button>
            <Button className={classnames(styles.footerBtn, styles.footerBtnPrimary)} onClick={handleReview}>
              去评价
            </Button>
          </>
        );
      default:
        return (
          <Button className={classnames(styles.footerBtn, styles.footerBtnPrimary)} onClick={handleContact}>
            联系门店
          </Button>
        );
    }
  };

  return (
    <View className={styles.page}>
      {/* 状态横幅 */}
      <View className={classnames(styles.statusBanner, status.bannerClass)}>
        <View className={styles.statusRow1}>
          <View>
            <Text className={styles.statusTitle}>{status.title}</Text>
            <Text className={styles.statusDesc}>{status.desc}</Text>
          </View>
          <Text className={styles.statusProgress}>{status.icon}</Text>
        </View>
        <View className={styles.statusDecor}>
          <Text>🐾</Text>
        </View>
      </View>

      {/* 进度条 */}
      <View className={styles.progressBar}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <View key={i} className={styles.progressItem}>
              {!isLast && (
                <View
                  className={classnames(
                    styles.progressLine,
                    step.done && styles.progressLineActive
                  )}
                />
              )}
              <View
                className={classnames(
                  styles.progressIcon,
                  step.done && styles.progressIconActive
                )}
              >
                <Text>{step.done ? '✓' : i + 1}</Text>
              </View>
              <Text
                className={classnames(
                  styles.progressLabel,
                  step.done && styles.progressLabelActive
                )}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView className={styles.scrollContainer} scrollY>
        <View className={styles.container}>
          {/* 房间信息 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>🏠</Text>
              <Text>房型信息</Text>
            </View>
            {order.room && (
              <View className={styles.roomRow}>
                <Image className={styles.roomImg} src={order.room.image} mode="aspectFill" />
                <View className={styles.roomDetail}>
                  <Text className={styles.roomName}>{order.room.name}</Text>
                  <Text className={styles.roomMeta}>
                    {order.room.size} · 可住{order.room.capacity}只
                  </Text>
                  <Text className={styles.roomPrice}>
                    ¥{order.room.price}/晚 × {order.nights}晚
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* 入住信息 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>📅</Text>
              <Text>入住信息</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>入住日期</Text>
              <Text className={styles.infoValue}>
                {dayjs(order.checkinDate).format('YYYY-MM-DD')}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>离店日期</Text>
              <Text className={styles.infoValue}>
                {dayjs(order.checkoutDate).format('YYYY-MM-DD')}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>入住天数</Text>
              <Text className={styles.infoValue}>共 {order.nights} 晚</Text>
            </View>
            {order.cageNumber && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>笼位号</Text>
                <Text className={styles.infoValue}>{order.cageNumber}</Text>
              </View>
            )}
          </View>

          {/* 宠物信息 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>🐾</Text>
              <Text>寄养宠物 ({order.pets?.length || 0}只)</Text>
            </View>
            {order.pets && order.pets.length > 0 ? (
              order.pets.map((pet) => (
                <View key={pet.id} className={styles.petRow}>
                  <Image className={styles.petAvatar} src={pet.avatar} mode="aspectFill" />
                  <View className={styles.petDetail}>
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
          {order.addonServices && order.addonServices.length > 0 && (
            <View className={styles.card}>
              <View className={styles.cardTitle}>
                <Text>🎁</Text>
                <Text>附加服务</Text>
              </View>
              {order.addonServices.map((a) => (
                <View key={a.id} className={styles.serviceRow}>
                  <View className={styles.serviceLeft}>
                    <View className={styles.serviceIcon}>
                      <Text>{serviceTypeIcons[a.type] || '✨'}</Text>
                    </View>
                    <Text className={styles.serviceName}>{a.name}</Text>
                  </View>
                  <Text className={styles.servicePrice}>+¥{a.price.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 特殊备注 */}
          {order.specialNotes && (
            <View className={styles.card}>
              <View className={styles.cardTitle}>
                <Text>📝</Text>
                <Text>特殊备注</Text>
              </View>
              <Text className={styles.notesText}>{order.specialNotes}</Text>
            </View>
          )}

          {/* 费用明细 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>💰</Text>
              <Text>费用明细</Text>
            </View>
            {order.feeDetails && order.feeDetails.length > 0 ? (
              order.feeDetails.map((f) => (
                <View key={f.id} className={styles.feeRow}>
                  <Text className={styles.feeLabel}>
                    {f.name}
                    {f.quantity && f.quantity > 1 && (
                      <Text className={styles.feeQty}> × {f.quantity}{f.unit || ''}</Text>
                    )}
                  </Text>
                  <Text className={styles.feeValue}>¥{f.amount.toFixed(2)}</Text>
                </View>
              ))
            ) : (
              <View className={styles.emptyTip}>
                <Text>暂无费用明细</Text>
              </View>
            )}
            <View className={styles.feeTotalRow}>
              <Text className={styles.feeTotalLabel}>实付总计</Text>
              <Text className={styles.feeTotalValue}>¥{order.totalAmount.toFixed(2)}</Text>
            </View>
            <View className={styles.depositRow}>
              <View className={styles.depositLeft}>
                <Text className={styles.depositIcon}>🔒</Text>
                <Text className={styles.depositText}>押金 ¥{order.depositAmount.toFixed(2)}</Text>
              </View>
              <View className={styles.depositStatus}>
                <Text>离店原路退还</Text>
              </View>
            </View>
          </View>

          {/* 订单信息 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>📋</Text>
              <Text>订单信息</Text>
            </View>
            <View className={styles.orderNoRow}>
              <Text className={styles.orderNoLabel}>订单编号</Text>
              <Text className={styles.orderNoValue} onClick={() => handleCopy(order.orderNo)}>
                <Text>{order.orderNo}</Text>
                <Text> 📋</Text>
              </Text>
            </View>
            <View className={styles.orderNoRow}>
              <Text className={styles.orderNoLabel}>下单时间</Text>
              <Text className={styles.infoValue}>
                {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm')}
              </Text>
            </View>
            <View className={styles.orderNoRow}>
              <Text className={styles.orderNoLabel}>联系电话</Text>
              <Text className={styles.infoValue}>{order.contactPhone || '--'}</Text>
            </View>
          </View>

          {/* 订单时间轴 */}
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <Text>⏰</Text>
              <Text>订单进度</Text>
            </View>
            <View className={styles.timeLine}>
              {steps.map((step, i) => (
                <View key={i} className={styles.timeItem}>
                  <View
                    className={classnames(
                      styles.timeDot,
                      !step.done && styles.timeDotPending
                    )}
                  />
                  <View className={styles.timeContent}>
                    <Text className={styles.timeTitle}>{step.label}</Text>
                    <Text className={styles.timeDate}>
                      {dayjs(step.time).isValid()
                        ? dayjs(step.time).format('YYYY-MM-DD HH:mm')
                        : step.time}
                    </Text>
                    <Text className={styles.timeDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className={styles.bottomSpace} />
      </ScrollView>

      {/* 底部操作栏 */}
      {order.status !== 'cancelled' && (
        <View className={styles.footer}>
          <View className={styles.footerInfo}>
            <Text className={styles.footerLabel}>订单金额</Text>
            <Text className={styles.footerPrice}>¥{order.totalAmount.toFixed(2)}</Text>
          </View>
          <View className={styles.footerButtons}>{renderFooter()}</View>
        </View>
      )}
    </View>
  );
};

export default OrderDetailPage;

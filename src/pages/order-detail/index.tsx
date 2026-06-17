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
  const orders = useOrderStore((state) => state.orders);
  const { getOrderById, applyCancelOrder, contactStoreFromOrder, updateOrderDates, addonServices } =
    useOrderStore();

  const order = useMemo(() => {
    if (!orderId) return undefined;
    return getOrderById(orderId);
  }, [orderId, orders, getOrderById]);

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
    if (!order) return;
    Taro.showActionSheet({
      itemList: ['在线咨询', '拨打电话', '留言给门店'],
      success: (res) => {
        if (res.tapIndex === 0) {
          contactStoreFromOrder(order.id, '主人发起了在线咨询');
          Taro.showToast({ title: '已通知门店客服', icon: 'none' });
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/messages/index' });
          }, 800);
        } else if (res.tapIndex === 1) {
          Taro.makePhoneCall({ phoneNumber: '4008888888' });
        } else if (res.tapIndex === 2) {
          Taro.showModal({
            title: '留言给门店',
            editable: true,
            placeholderText: '请输入您想咨询的内容',
            success: (modalRes) => {
              if (modalRes.confirm && modalRes.content) {
                contactStoreFromOrder(order.id, modalRes.content);
                Taro.showToast({ title: '留言已发送', icon: 'success' });
              }
            }
          });
        }
      }
    });
  };

  const handleCancel = () => {
    if (!order) return;
    Taro.showModal({
      title: '申请取消订单',
      content: '确定要取消该订单吗？取消后押金将原路退回。',
      confirmColor: '#F44336',
      editable: true,
      placeholderText: '请输入取消原因（可选）',
      success: (res) => {
        if (res.confirm) {
          applyCancelOrder(order.id, res.content || '');
          Taro.showToast({ title: '订单已取消', icon: 'success' });
        }
      }
    });
  };

  const handleReschedule = () => {
    if (!order) return;
    Taro.showActionSheet({
      itemList: ['修改入住日期', '修改离店日期', '调整附加服务'],
      success: (sheetRes) => {
        if (sheetRes.tapIndex === 0 || sheetRes.tapIndex === 1) {
          const isCheckin = sheetRes.tapIndex === 0;
          const defaultDate = isCheckin ? order.checkinDate : order.checkoutDate;
          Taro.chooseDate && Taro.chooseDate
            ? // @ts-ignore
              Taro.chooseDate({
                type: 'date',
                current: defaultDate,
                success: (dateRes) => {
                  const newDate = dateRes.value;
                  if (isCheckin) {
                    if (new Date(newDate) >= new Date(order.checkoutDate)) {
                      Taro.showToast({ title: '入住日期需早于离店日期', icon: 'none' });
                      return;
                    }
                    updateOrderDates(order.id, newDate, order.checkoutDate);
                  } else {
                    if (new Date(newDate) <= new Date(order.checkinDate)) {
                      Taro.showToast({ title: '离店日期需晚于入住日期', icon: 'none' });
                      return;
                    }
                    updateOrderDates(order.id, order.checkinDate, newDate);
                  }
                  Taro.showToast({ title: '改期成功', icon: 'success' });
                }
              })
            : Taro.showToast({ title: '当前环境不支持日期选择', icon: 'none' });
        } else if (sheetRes.tapIndex === 2) {
          const addonNames = addonServices.map((a) => a.name);
          const currentIds = order.addonServices?.map((a) => a.id) || [];
          Taro.showActionSheet({
            itemList: addonNames.map((name, i) => {
              const id = addonServices[i].id;
              return currentIds.includes(id) ? `✓ ${name}` : name;
            }),
            success: (addonRes) => {
              const clickedId = addonServices[addonRes.tapIndex].id;
              const newIds = currentIds.includes(clickedId)
                ? currentIds.filter((id) => id !== clickedId)
                : [...currentIds, clickedId];
              useOrderStore.getState().updateOrderAddons(order.id, newIds);
              Taro.showToast({ title: '附加服务已更新', icon: 'success' });
            }
          });
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
            <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleReschedule}>
              改期
            </Button>
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
            <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleReschedule}>
              改期
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
            <Button className={classnames(styles.footerBtn, styles.footerBtnOutline)} onClick={handleReschedule}>
              改期
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

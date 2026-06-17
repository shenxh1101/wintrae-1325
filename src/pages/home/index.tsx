import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import SectionHeader from '@/components/SectionHeader';
import RoomCard from '@/components/RoomCard';
import Tag from '@/components/Tag';
import { rooms } from '@/data/rooms';
import { orders } from '@/data/orders';
import { pets as allPets } from '@/data/pets';
import { rooms as roomsData } from '@/data/rooms';
import { useOrderStore } from '@/store/useOrderStore';
import type { Room } from '@/types/room';

const roomFilters = [
  { key: 'all', label: '全部房型' },
  { key: 'standard', label: '标准间' },
  { key: 'deluxe', label: '豪华房' },
  { key: 'vip', label: 'VIP套房' },
  { key: 'suite', label: '特色间' }
];

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const setSelectedRoom = useOrderStore((state) => state.setSelectedRoom);

  const currentOrder = useMemo(() => {
    return orders.find((o) => o.status === 'care' || o.status === 'checkin' || o.status === 'confirmed');
  }, []);

  const orderRoom = currentOrder ? roomsData.find((r) => r.id === currentOrder.roomId) : null;
  const orderPet = currentOrder ? allPets.find((p) => p.id === currentOrder.petIds[0]) : null;

  const filteredRooms = useMemo(() => {
    if (activeFilter === 'all') return rooms;
    return rooms.filter((r) => r.type === activeFilter);
  }, [activeFilter]);

  const handleQuickBook = () => {
    Taro.switchTab({ url: '/pages/booking/index' });
  };

  const handleRoomBook = (room: Room) => {
    setSelectedRoom(room.id);
    Taro.switchTab({ url: '/pages/booking/index' });
  };

  const handleEntryClick = (type: string) => {
    switch (type) {
      case 'booking':
        Taro.switchTab({ url: '/pages/booking/index' });
        break;
      case 'pets':
        Taro.switchTab({ url: '/pages/pets/index' });
        break;
      case 'care':
        Taro.switchTab({ url: '/pages/care/index' });
        break;
      case 'chat':
        Taro.switchTab({ url: '/pages/messages/index' });
        break;
    }
  };

  const handleCall = () => {
    Taro.makePhoneCall({ phoneNumber: '4008888888' });
  };

  const handleNavigate = () => {
    Taro.showToast({ title: '导航功能开发中', icon: 'none' });
  };

  const handleViewOrder = () => {
    if (currentOrder) {
      Taro.navigateTo({ url: `/pages/order-detail/index?id=${currentOrder.id}` });
    }
  };

  const handleViewCare = () => {
    Taro.switchTab({ url: '/pages/care/index' });
  };

  const handleContactStaff = () => {
    Taro.switchTab({ url: '/pages/messages/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        {/* 欢迎区域 + Hero卡片 */}
        <View className={styles.banner}>
          <View className={styles.greeting}>
            <View className={styles.welcome}>
              <Text className={styles.hello}>欢迎回来 👋</Text>
              <Text className={styles.subtitle}>让爱宠享受星级寄养体验</Text>
            </View>
            <View className={styles.storeBadge}>
              <Text>🏠</Text>
              <Text className={styles.storeName}>萌宠之家旗舰店</Text>
            </View>
          </View>

          <View className={styles.heroCard}>
            <View className={styles.heroContent}>
              <Text className={styles.heroTitle}>夏季寄养特惠 🐾</Text>
              <Text className={styles.heroDesc}>
                新用户首单立减50元，连住3晚以上享9折优惠！免费接送服务，专业护理团队24小时在线。
              </Text>
              <View className={styles.heroActions}>
                <Button className={classnames(styles.heroBtn, styles.btnWhite)} onClick={handleQuickBook}>
                  立即预订
                </Button>
                <Button className={classnames(styles.heroBtn, styles.btnOutline)} onClick={handleContactStaff}>
                  在线咨询
                </Button>
              </View>
            </View>
            <Text className={styles.heroDecor}>🐕</Text>
          </View>
        </View>

        {/* 公告通知 */}
        <View className={styles.noticeBar}>
          <View className={styles.noticeIcon}>📢</View>
          <View className={styles.noticeContent}>
            <Text className={styles.noticeText}>
              【温馨提示】夏季高温，请主人提前为宠物做好防暑准备，门店提供24小时空调服务~
            </Text>
          </View>
          <Text className={styles.noticeArrow}>›</Text>
        </View>

        {/* 快捷功能入口 */}
        <View className={styles.quickEntries}>
          <View className={styles.entryItem} onClick={() => handleEntryClick('booking')}>
            <View className={classnames(styles.entryIcon, styles.icon1)}>📅</View>
            <Text className={styles.entryLabel}>寄养预约</Text>
          </View>
          <View className={styles.entryItem} onClick={() => handleEntryClick('pets')}>
            <View className={classnames(styles.entryIcon, styles.icon2)}>🐾</View>
            <Text className={styles.entryLabel}>我的宠物</Text>
          </View>
          <View className={styles.entryItem} onClick={() => handleEntryClick('care')}>
            <View className={classnames(styles.entryIcon, styles.icon3)}>📸</View>
            <Text className={styles.entryLabel}>照护日志</Text>
          </View>
          <View className={styles.entryItem} onClick={() => handleEntryClick('chat')}>
            <View className={classnames(styles.entryIcon, styles.icon4)}>💬</View>
            <Text className={styles.entryLabel}>联系客服</Text>
          </View>
        </View>

        {/* 进行中订单 */}
        {currentOrder && (
          <View className={styles.currentOrder}>
            <View className={styles.orderHeader}>
              <View className={styles.orderTitle}>
                <Text>进行中订单</Text>
                {currentOrder.status === 'care' && <View className={styles.liveBadge}>照护中</View>}
              </View>
              <Text className={styles.viewBtn} onClick={handleViewOrder}>
                查看详情 ›
              </Text>
            </View>

            <View className={styles.orderInfo}>
              <Image
                className={styles.orderPetAvatar}
                src={orderPet?.avatar || 'https://picsum.photos/id/237/100/100'}
                mode="aspectFill"
              />
              <View className={styles.orderDetails}>
                <View className={styles.petNameRow}>
                  <Text className={styles.orderPetName}>{orderPet?.name || '宠物'}</Text>
                  <Tag size="small" type={currentOrder.status === 'care' ? 'primary' : 'info'}>
                    {currentOrder.status === 'care' ? '照护中' : currentOrder.status === 'checkin' ? '已入住' : '已确认'}
                  </Tag>
                </View>
                <Text className={styles.orderRoomName}>{orderRoom?.name || '房间'}</Text>
                <View className={styles.orderDates}>
                  <Text>📅</Text>
                  <Text>
                    {currentOrder.checkinDate} ~ {currentOrder.checkoutDate}（{currentOrder.nights}晚）
                  </Text>
                </View>
              </View>
            </View>

            <View className={styles.orderActionRow}>
              <Button
                className={classnames(styles.orderAction, styles.orderActionOutline)}
                onClick={handleContactStaff}
              >
                联系护理
              </Button>
              <Button
                className={classnames(styles.orderAction, styles.orderActionPrimary)}
                onClick={handleViewCare}
              >
                查看照护日志
              </Button>
            </View>
          </View>
        )}

        {/* 房型列表 */}
        <View className={styles.roomsSection}>
          <SectionHeader
            title="精选房型"
            subtitle="多种房型任选，为爱宠选择最舒适的家"
            actionText="全部房型"
          />

          <ScrollView className={styles.filterBar} scrollX enhanced showScrollbar={false}>
            {roomFilters.map((filter) => (
              <View
                key={filter.key}
                className={classnames(styles.filterItem, activeFilter === filter.key && styles.activeFilter)}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </View>
            ))}
          </ScrollView>

          <View className={styles.roomsList}>
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={handleRoomBook} />
            ))}
          </View>
        </View>

        {/* 门店信息 */}
        <View className={styles.storeSection}>
          <View className={styles.storeTitle}>
            <Text>🏠</Text>
            <Text>门店信息</Text>
          </View>

          <View className={styles.storeInfo}>
            <View className={styles.infoRow}>
              <View className={styles.infoIcon}>📍</View>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>门店地址</Text>
                <Text className={styles.infoValue}>北京市朝阳区建国路88号SOHO现代城A座1层</Text>
              </View>
            </View>

            <View className={styles.infoRow}>
              <View className={styles.infoIcon}>⏰</View>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>营业时间</Text>
                <Text className={styles.infoValue}>周一至周日 08:00 - 22:00（24小时值班）</Text>
              </View>
            </View>

            <View className={styles.infoRow}>
              <View className={styles.infoIcon}>📞</View>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>联系电话</Text>
                <Text className={styles.infoValue}>400-888-8888 / 010-88888888</Text>
              </View>
            </View>
          </View>

          <View className={styles.contactRow}>
            <Button className={classnames(styles.contactBtn, styles.btnCall)} onClick={handleCall}>
              📞 拨打电话
            </Button>
            <Button className={classnames(styles.contactBtn, styles.btnNav)} onClick={handleNavigate}>
              🧭 导航到店
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;

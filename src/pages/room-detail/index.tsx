import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { rooms } from '@/data/rooms';
import { useOrderStore } from '@/store/useOrderStore';

const facilityIcons: Record<string, { icon: string; bg: string }> = {
  '独立通风': { icon: '💨', bg: 'rgba(76, 175, 80, 0.1)' },
  '恒温空调': { icon: '❄️', bg: 'rgba(66, 165, 245, 0.1)' },
  '柔软睡床': { icon: '🛏️', bg: 'rgba(255, 152, 0, 0.1)' },
  '每日消毒': { icon: '🧼', bg: 'rgba(0, 188, 212, 0.1)' },
  '饮水器': { icon: '💧', bg: 'rgba(33, 150, 243, 0.1)' },
  '监控摄像': { icon: '📹', bg: 'rgba(156, 39, 176, 0.1)' },
  '宽敞空间': { icon: '🏠', bg: 'rgba(255, 193, 7, 0.1)' },
  '多张睡床': { icon: '🛏️', bg: 'rgba(255, 152, 0, 0.15)' },
  '玩具区': { icon: '🎾', bg: 'rgba(255, 193, 7, 0.12)' },
  '落地窗': { icon: '🪟', bg: 'rgba(103, 58, 183, 0.1)' },
  '阳光充足': { icon: '☀️', bg: 'rgba(255, 235, 59, 0.2)' },
  '豪华软垫': { icon: '🛋️', bg: 'rgba(233, 30, 99, 0.1)' },
  '猫爬架': { icon: '🏔️', bg: 'rgba(121, 85, 72, 0.12)' },
  '独立空调': { icon: '🌬️', bg: 'rgba(66, 165, 245, 0.1)' },
  '24h监控': { icon: '📹', bg: 'rgba(156, 39, 176, 0.15)' },
  '自动喂食器': { icon: '🍽️', bg: 'rgba(76, 175, 80, 0.1)' },
  '独立套房': { icon: '🏡', bg: 'rgba(255, 152, 0, 0.15)' },
  '高级家具': { icon: '🛋️', bg: 'rgba(121, 85, 72, 0.1)' },
  '护理台': { icon: '💉', bg: 'rgba(244, 67, 54, 0.1)' },
  '专属保姆': { icon: '👩‍🍳', bg: 'rgba(156, 39, 176, 0.1)' },
  '定制餐食': { icon: '🍖', bg: 'rgba(255, 87, 34, 0.1)' },
  '每日SPA': { icon: '✨', bg: 'rgba(0, 188, 212, 0.1)' },
  '视频直播': { icon: '📺', bg: 'rgba(33, 150, 243, 0.12)' },
  '磨爪柱': { icon: '🐱', bg: 'rgba(121, 85, 72, 0.1)' },
  '躲藏洞穴': { icon: '🕳️', bg: 'rgba(96, 125, 139, 0.1)' },
  '多层跳台': { icon: '📶', bg: 'rgba(66, 165, 245, 0.1)' },
  '猫砂盆': { icon: '📦', bg: 'rgba(158, 158, 158, 0.1)' },
  '超宽敞': { icon: '🏟️', bg: 'rgba(76, 175, 80, 0.1)' },
  '防滑地垫': { icon: '🟫', bg: 'rgba(121, 85, 72, 0.08)' },
  '户外通道': { icon: '🌿', bg: 'rgba(139, 195, 74, 0.12)' },
  '加厚睡床': { icon: '🛏️', bg: 'rgba(255, 152, 0, 0.15)' },
  '每日遛弯x3': { icon: '🐕', bg: 'rgba(76, 175, 80, 0.12)' },
  '专用食盆': { icon: '🥣', bg: 'rgba(255, 193, 7, 0.1)' }
};

const services = [
  { icon: '🍖', title: '每日三餐喂食', desc: '根据宠物体重和年龄科学配餐' },
  { icon: '🚶', title: '定时遛弯', desc: '大型犬每天3次，每次30分钟' },
  { icon: '🛁', title: '基础清洁', desc: '每日梳理毛发、清洁眼部耳部' },
  { icon: '📸', title: '每日拍照', desc: '每天至少3张照片实时反馈' },
  { icon: '💊', title: '用药管理', desc: '按时按量喂药并记录效果' },
  { icon: '🏥', title: '健康监测', desc: '每日体温、精神状态检查' }
];

const notices = [
  '入住时请携带宠物疫苗本，确保狂犬疫苗及联苗有效期内',
  '入住前请提前进行体外驱虫，建议入住前24小时完成',
  '如有特殊饮食需求，请自备足够的口粮并标注喂食说明',
  '建议携带宠物熟悉的被褥或玩具，帮助适应新环境',
  '如需接送服务，请提前24小时预约确认时间地点',
  '寄养期间如需用药，请提供药品并书面说明用量用法'
];

const RoomDetailPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.params.id;
  const setSelectedRoom = useOrderStore((state) => state.setSelectedRoom);

  const room = useMemo(() => rooms.find((r) => r.id === roomId) || rooms[0], [roomId]);

  const [fav, setFav] = useState(false);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleBook = () => {
    setSelectedRoom(room.id);
    Taro.switchTab({
      url: '/pages/booking/index'
    });
  };

  return (
    <View className={styles.page}>
      {/* 图片横幅 */}
      <View className={styles.banner}>
        <Image className={styles.bannerImg} src={room.image} mode="aspectFill" />
        <View className={styles.bannerBack} onClick={handleBack}>
          <Text className={styles.bannerBackIcon}>‹</Text>
        </View>
        <View className={styles.bannerFav} onClick={() => setFav(!fav)}>
          <Text className={styles.bannerFavIcon}>{fav ? '❤️' : '🤍'}</Text>
        </View>
        <View className={styles.bannerTag}>
          <Tag type="primary" size="sm">
            {room.size} · 可住{room.capacity}只
          </Tag>
        </View>
      </View>

      <ScrollView scrollY>
        <View className={styles.container}>
          {/* 基本信息 */}
          <View className={styles.infoCard}>
            <View className={styles.infoHeader}>
              <View className={styles.infoName}>
                <View className={styles.nameRow}>
                  <Text className={styles.nameText}>{room.name}</Text>
                  {room.type === 'vip' && <Tag type="primary" size="sm">VIP</Tag>}
                  {room.isAvailable && <Tag type="success" size="sm">可预订</Tag>}
                </View>
                <View className={styles.tagsRow}>
                  {room.tags.map((tag, i) => (
                    <Tag key={i} type="info" size="sm" outline>
                      {tag}
                    </Tag>
                  ))}
                </View>
              </View>
              <View className={styles.priceBox}>
                <Text className={styles.priceLabel}>每晚价格</Text>
                <View>
                  <Text className={styles.priceValue}>¥{room.price}</Text>
                  <Text className={styles.priceUnit}>/晚</Text>
                </View>
                {room.originalPrice && room.originalPrice > room.price && (
                  <Text className={styles.originalPrice}>¥{room.originalPrice}</Text>
                )}
              </View>
            </View>
            <View className={styles.infoDesc}>{room.description}</View>
            <View className={styles.ratingRow}>
              <Text className={styles.ratingStars}>⭐ {room.rating}</Text>
              <Text className={styles.reviewCount}>{room.reviewCount}条评价</Text>
            </View>
          </View>

          {/* 房间设施 */}
          <View className={styles.sectionCard}>
            <View className={styles.sectionTitle}>
              <Text>🏠</Text>
              <Text>房间设施</Text>
            </View>
            <View className={styles.facilitiesGrid}>
              {room.facilities.map((facility, i) => {
                const f = facilityIcons[facility] || { icon: '✅', bg: 'rgba(0,0,0,0.04)' };
                return (
                  <View key={i} className={styles.facilityItem}>
                    <View
                      className={styles.facilityIcon}
                      style={{ backgroundColor: f.bg }}
                    >
                      <Text className={styles.facilityIconText}>{f.icon}</Text>
                    </View>
                    <Text className={styles.facilityName}>{facility}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 服务包含 */}
          <View className={styles.sectionCard}>
            <View className={styles.sectionTitle}>
              <Text>✅</Text>
              <Text>服务包含</Text>
            </View>
            <View className={styles.serviceList}>
              {services.map((s, i) => (
                <View key={i} className={styles.serviceItem}>
                  <View className={styles.serviceIcon}>
                    <Text>{s.icon}</Text>
                  </View>
                  <View className={styles.serviceContent}>
                    <Text className={styles.serviceTitle}>{s.title}</Text>
                    <Text className={styles.serviceDesc}>{s.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 入住须知 */}
          <View className={styles.sectionCard}>
            <View className={styles.sectionTitle}>
              <Text>📋</Text>
              <Text>入住须知</Text>
            </View>
            <View className={styles.noticeList}>
              {notices.map((notice, i) => (
                <View key={i} className={styles.noticeItem}>
                  <View className={styles.noticeNum}>{i + 1}</View>
                  <Text className={styles.noticeContent}>{notice}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 可住宠物信息 */}
          <View className={styles.sectionCard}>
            <View className={styles.sectionTitle}>
              <Text>🐾</Text>
              <Text>可住宠物</Text>
            </View>
            <View className={styles.capacityBox}>
              <View className={styles.capacityItem}>
                <Text className={styles.capacityIcon}>🐕</Text>
                <Text className={styles.capacityText}>小型犬/中型犬</Text>
              </View>
              <View className={styles.capacityItem}>
                <Text className={styles.capacityIcon}>🐈</Text>
                <Text className={styles.capacityText}>猫咪</Text>
              </View>
              <View className={styles.capacityItem}>
                <Text className={styles.capacityNumber}>{room.capacity}</Text>
                <Text className={styles.capacityText}>最多{room.capacity}只</Text>
              </View>
            </View>
            <View className={styles.sizeRow}>
              <Text className={styles.sizeLabel}>房间面积</Text>
              <Text className={styles.sizeValue}>{room.size}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.footer}>
        <View className={styles.footerInfo}>
          <View>
            <Text className={styles.footerPrice}>¥{room.price}</Text>
            <Text className={styles.footerPriceUnit}>/晚起</Text>
          </View>
          <Text className={styles.footerDesc}>可住 {room.capacity} 只宠物</Text>
        </View>
        <Button className={styles.footerBtn} onClick={handleBook}>
          立即预约
        </Button>
      </View>
    </View>
  );
};

export default RoomDetailPage;

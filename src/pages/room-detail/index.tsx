import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { rooms } from '@/data/rooms';

const facilityIcons: Record<string, { icon: string; bg: string }> = {
  '空调': { icon: '❄️', bg: 'rgba(66, 165, 245, 0.1)' },
  '地暖': { icon: '🔥', bg: 'rgba(244, 67, 54, 0.1)' },
  '新风': { icon: '💨', bg: 'rgba(76, 175, 80, 0.1)' },
  '监控': { icon: '📹', bg: 'rgba(156, 39, 176, 0.1)' },
  '软垫': { icon: '🛏️', bg: 'rgba(255, 152, 0, 0.1)' },
  '玩具': { icon: '🎾', bg: 'rgba(255, 193, 7, 0.1)' },
  '食盆': { icon: '🍽️', bg: 'rgba(0, 188, 212, 0.1)' },
  '水盆': { icon: '💧', bg: 'rgba(33, 150, 243, 0.1)' },
  '猫爬架': { icon: '🏔️', bg: 'rgba(121, 85, 72, 0.1)' },
  '猫砂盆': { icon: '📦', bg: 'rgba(158, 158, 158, 0.1)' },
  '围栏': { icon: '🚧', bg: 'rgba(255, 87, 34, 0.1)' },
  '草坪': { icon: '🌿', bg: 'rgba(139, 195, 74, 0.1)' }
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

  const room = useMemo(() => rooms.find((r) => r.id === roomId) || rooms[0], [roomId]);

  const [fav, setFav] = useState(false);
  const [imgIndex] = useState(1);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleBook = () => {
    Taro.switchTab({
      url: '/pages/booking/index',
      success: () => {
        Taro.showToast({ title: '请选择此房型', icon: 'none' });
      }
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
        <View className={styles.bannerIndicator}>
          {imgIndex}/{room.images.length}
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
                  {room.hot && <Tag type="warning" size="sm">热门</Tag>}
                  {room.type === 'vip' && <Tag type="primary" size="sm">VIP</Tag>}
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
              </View>
            </View>
            <View className={styles.infoDesc}>{room.description}</View>
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
                      {f.icon}
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
                  <View className={styles.serviceIcon}>{s.icon}</View>
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
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.footer}>
        <View className={styles.footerInfo}>
          <View>
            <Text className={styles.footerPrice}>¥{room.price}</Text>
            <Text className={styles.footerPriceUnit}>/晚起</Text>
          </View>
          <Text className={styles.footerDesc}>可住 {room.maxPets} 只宠物</Text>
        </View>
        <Button className={styles.footerBtn} onClick={handleBook}>
          立即预约
        </Button>
      </View>
    </View>
  );
};

export default RoomDetailPage;

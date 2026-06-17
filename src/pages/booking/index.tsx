import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import PetCard from '@/components/PetCard';
import Tag from '@/components/Tag';
import { rooms } from '@/data/rooms';
import { pets as allPets } from '@/data/pets';
import { addonServices } from '@/data/orders';
import { useOrderStore } from '@/store/useOrderStore';
import type { Pet } from '@/types/pet';
import type { AddonService } from '@/types/order';
import dayjs from 'dayjs';

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const BookingPage: React.FC = () => {
  const {
    selectedRoomId,
    checkinDate,
    checkoutDate,
    selectedPetIds,
    selectedAddonIds,
    specialNotes,
    setSelectedRoom,
    setDates,
    togglePet,
    toggleAddon,
    setSpecialNotes,
    getSelectedRoom,
    getSelectedPets,
    getSelectedAddons,
    calculateTotal,
    calculateNights
  } = useOrderStore();

  const [notes, setNotes] = useState(specialNotes);

  const selectedRoom = getSelectedRoom();
  const selectedPets = getSelectedPets();
  const selectedAddons = getSelectedAddons();
  const nights = calculateNights();
  const totalPrice = calculateTotal();

  const checkinWeek = weekDays[dayjs(checkinDate).day()];
  const checkoutWeek = weekDays[dayjs(checkoutDate).day()];

  const addonIconMap: Record<string, { icon: string; className: string }> = {
    grooming: { icon: '🛁', className: styles.iconGrooming },
    transport: { icon: '🚗', className: styles.iconTransport },
    medical: { icon: '💊', className: styles.iconMedical },
    other: { icon: '✨', className: styles.iconOther }
  };

  const roomFee = useMemo(() => {
    return selectedRoom ? selectedRoom.price * nights : 0;
  }, [selectedRoom, nights]);

  const addonFee = useMemo(() => {
    return selectedAddons.reduce((sum, a) => sum + a.price, 0);
  }, [selectedAddons]);

  const handleSelectCheckin = async () => {
    try {
      const res = await Taro.chooseDate({
        type: 'date',
        current: checkinDate,
        start: dayjs().format('YYYY-MM-DD')
      });
      const newCheckin = res.value;
      if (dayjs(newCheckin).isAfter(dayjs(checkoutDate).subtract(1, 'day'))) {
        const newCheckout = dayjs(newCheckin).add(nights, 'day').format('YYYY-MM-DD');
        setDates(newCheckin, newCheckout);
      } else {
        setDates(newCheckin, checkoutDate);
      }
    } catch (e) {
      console.error('[Booking] 选择入住日期失败', e);
    }
  };

  const handleSelectCheckout = async () => {
    try {
      const res = await Taro.chooseDate({
        type: 'date',
        current: checkoutDate,
        start: dayjs(checkinDate).add(1, 'day').format('YYYY-MM-DD')
      });
      if (dayjs(res.value).isAfter(checkinDate)) {
        setDates(checkinDate, res.value);
      } else {
        Taro.showToast({ title: '离店日期需晚于入住日期', icon: 'none' });
      }
    } catch (e) {
      console.error('[Booking] 选择离店日期失败', e);
    }
  };

  const handleAddPet = () => {
    Taro.showToast({ title: '添加宠物功能开发中', icon: 'none' });
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoom(selectedRoomId === roomId ? null : roomId);
  };

  const handleToggleAddon = (addonId: string) => {
    toggleAddon(addonId);
  };

  const handleNotesChange = (e: any) => {
    const value = e.detail.value;
    setNotes(value);
    setSpecialNotes(value);
  };

  const handleSubmit = () => {
    if (!selectedRoomId) {
      Taro.showToast({ title: '请选择房型', icon: 'none' });
      return;
    }
    if (selectedPetIds.length === 0) {
      Taro.showToast({ title: '请选择宠物', icon: 'none' });
      return;
    }
    Taro.navigateTo({ url: '/pages/order-confirm/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        {/* 日期选择 */}
        <View className={styles.dateCard}>
          <Text className={styles.dateCardTitle}>
            📅 选择入住时间
          </Text>
          <View className={styles.dateRow}>
            <View className={styles.dateBlock} onClick={handleSelectCheckin}>
              <Text className={styles.dateLabel}>入住日期</Text>
              <Text className={styles.dateValue}>{checkinDate.slice(5)}</Text>
              <Text className={styles.dateWeek}>{checkinWeek}</Text>
            </View>
            <View className={styles.dateArrow}>→</View>
            <View className={styles.dateBlock} onClick={handleSelectCheckout}>
              <Text className={styles.dateLabel}>离店日期</Text>
              <Text className={styles.dateValue}>{checkoutDate.slice(5)}</Text>
              <Text className={styles.dateWeek}>{checkoutWeek}</Text>
            </View>
          </View>
          <View className={styles.nightsBadge}>
            🏨 共 {nights} 晚
          </View>
        </View>

        {/* 房型选择 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.required}>*</Text>
              选择房型
            </Text>
            <Text className={styles.sectionTip}>共 {rooms.length} 种房型</Text>
          </View>
          <ScrollView
            className={styles.roomsScroll}
            scrollX
            enhanced
            showScrollbar={false}
          >
            <View className={styles.roomsRow}>
              {rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <View
                    key={room.id}
                    className={classnames(styles.roomOption, isSelected && styles.roomOptionSelected)}
                    onClick={() => handleSelectRoom(room.id)}
                  >
                    <Image
                      className={styles.roomImage}
                      src={room.image}
                      mode="aspectFill"
                    />
                    <View className={styles.roomOptionContent}>
                      <View className={styles.roomOptionHeader}>
                        <Text className={styles.roomOptionName}>{room.name}</Text>
                        <View
                          className={classnames(
                            styles.roomSelectBox,
                            isSelected && styles.roomSelectedBox
                          )}
                        >
                          {isSelected && <Text className={styles.roomCheckIcon}>✓</Text>}
                        </View>
                      </View>
                      <View className={styles.roomOptionMeta}>
                        <Text>{room.size}</Text>
                        <Text>·</Text>
                        <Text>可住{room.capacity}只</Text>
                        <Text>·</Text>
                        <Text>⭐ {room.rating}</Text>
                      </View>
                      <View className={styles.roomOptionPrice}>
                        <Text className={styles.roomPriceValue}>¥{room.price}</Text>
                        <Text className={styles.roomPriceUnit}>/晚</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* 宠物选择 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.required}>*</Text>
              选择宠物
            </Text>
            <Text className={styles.sectionTip}>
              已选 {selectedPetIds.length} 只
              {selectedPetIds.length > 1 && `（多宠每只加收¥30/晚）`}
            </Text>
          </View>
          <View className={styles.petsList}>
            {allPets.length === 0 ? (
              <View className={styles.emptyTip}>
                <Text className={styles.emptyTipText}>还没有添加宠物档案哦~</Text>
              </View>
            ) : (
              allPets.map((pet: Pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  selectable
                  selected={selectedPetIds.includes(pet.id)}
                  onSelect={() => togglePet(pet.id)}
                />
              ))
            )}
            <View className={styles.addPetCard} onClick={handleAddPet}>
              <Text className={styles.addPetIcon}>+</Text>
              <Text className={styles.addPetText}>添加新宠物档案</Text>
            </View>
          </View>
        </View>

        {/* 附加服务 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>附加服务</Text>
            <Text className={styles.sectionTip}>已选 {selectedAddons.length} 项</Text>
          </View>
          <View className={styles.addonList}>
            {addonServices.map((service: AddonService) => {
              const isSelected = selectedAddonIds.includes(service.id);
              const iconInfo = addonIconMap[service.type] || addonIconMap.other;
              return (
                <View
                  key={service.id}
                  className={classnames(styles.addonItem, isSelected && styles.addonSelected)}
                  onClick={() => handleToggleAddon(service.id)}
                >
                  <View className={classnames(styles.addonIcon, iconInfo.className)}>
                    {iconInfo.icon}
                  </View>
                  <View className={styles.addonInfo}>
                    <Text className={styles.addonName}>{service.name}</Text>
                    <Text className={styles.addonDesc}>{service.description}</Text>
                  </View>
                  <Text className={styles.addonPrice}>¥{service.price}</Text>
                  <View
                    className={classnames(
                      styles.addonCheckbox,
                      isSelected && styles.addonCheckboxSelected
                    )}
                  >
                    {isSelected && <Text className={styles.addonCheckIcon}>✓</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 特殊备注 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>特殊备注</Text>
          </View>
          <View className={styles.notesCard}>
            <Textarea
              className={styles.notesTextarea}
              placeholder="请填写宠物的饮食习惯、性格特点、健康状况等特殊要求，方便护理人员更好地照顾您的爱宠~"
              value={notes}
              onInput={handleNotesChange}
              maxlength={500}
              autoHeight
            />
            <Text className={styles.notesCount}>{notes?.length || 0}/500</Text>
          </View>
        </View>
      </View>

      {/* 底部提交栏 */}
      <View className={styles.submitBar}>
        <View className={styles.priceSummary}>
          <View className={styles.priceRow}>
            <Text className={styles.totalLabel}>合计</Text>
            <Text className={styles.totalPrice}>¥{totalPrice}</Text>
          </View>
          <Text className={styles.priceDetail}>
            房费¥{roomFee} + 服务¥{addonFee}
            {selectedPets.length > 1 && ` + 多宠¥${(selectedPets.length - 1) * 30 * nights}`}
          </Text>
        </View>
        <Button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!selectedRoomId || selectedPetIds.length === 0}
        >
          提交预约
        </Button>
      </View>
    </ScrollView>
  );
};

export default BookingPage;

import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionPath?: string;
  showMarker?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  actionPath,
  showMarker = true,
  className
}) => {
  const handleAction = () => {
    if (actionPath) {
      Taro.navigateTo({ url: actionPath });
    }
  };

  return (
    <View className={classnames(styles.header, className)}>
      <View className={styles.left}>
        {showMarker && <View className={styles.marker}></View>}
        <View>
          <Text className={styles.title}>{title}</Text>
          {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {(actionText || actionPath) && (
        <View className={styles.right} onClick={handleAction}>
          <Text className={styles.actionText}>{actionText || '查看全部'}</Text>
          <Text className={styles.actionArrow}>›</Text>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;

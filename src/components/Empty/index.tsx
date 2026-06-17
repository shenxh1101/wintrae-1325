import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface EmptyProps {
  icon?: string;
  title?: string;
  desc?: string;
  buttonText?: string;
  buttonPath?: string;
  onButtonClick?: () => void;
}

const Empty: React.FC<EmptyProps> = ({
  icon = '📭',
  title = '暂无数据',
  desc = '',
  buttonText,
  buttonPath,
  onButtonClick
}) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonPath) {
      Taro.navigateTo({ url: buttonPath });
    }
  };

  return (
    <View className={styles.empty}>
      <Text className={styles.icon}>{icon}</Text>
      <Text className={styles.title}>{title}</Text>
      {desc && <Text className={styles.desc}>{desc}</Text>}
      {(buttonText || onButtonClick) && (
        <Button className={styles.button} onClick={handleClick}>
          {buttonText}
        </Button>
      )}
    </View>
  );
};

export default Empty;

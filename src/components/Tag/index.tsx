import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export type TagType = 'primary' | 'success' | 'info' | 'warning' | 'error' | 'default' | 'outline' | 'outline-primary';
export type TagSize = 'small' | 'medium' | 'large';

interface TagProps {
  type?: TagType;
  size?: TagSize;
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ type = 'primary', size = 'medium', children, className }) => {
  const typeClass = {
    primary: styles.tagPrimary,
    success: styles.tagSuccess,
    info: styles.tagInfo,
    warning: styles.tagWarning,
    error: styles.tagError,
    default: styles.tagDefault,
    outline: styles.tagOutline,
    'outline-primary': styles.tagOutlinePrimary
  };

  const sizeClass = {
    small: styles.small,
    medium: '',
    large: styles.large
  };

  return (
    <View className={classnames(styles.tag, typeClass[type], sizeClass[size], className)}>
      <Text>{children}</Text>
    </View>
  );
};

export default Tag;

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/theme';

interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({
  confidence,
}: ConfidenceBadgeProps) {
  const getStatus = () => {
    if (confidence >= 80) {
      return {
        label: 'High confidence',
        backgroundColor: Colors.primarySoft,
        color: Colors.primaryDark,
      };
    }

    if (confidence >= 60) {
      return {
        label: 'Possible match',
        backgroundColor: Colors.warningBackground,
        color: Colors.warningText,
      };
    }

    return {
      label: 'Low confidence',
      backgroundColor: Colors.errorBackground,
      color: Colors.errorText,
    };
  };

  const status = getStatus();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: status.backgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: status.color,
          },
        ]}
      />

      <Text
        style={[
          styles.text,
          {
            color: status.color,
          },
        ]}
      >
        {status.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
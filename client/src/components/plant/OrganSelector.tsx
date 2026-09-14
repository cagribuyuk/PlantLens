import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PlantOrgan } from '../../types/plant';

import {
  Colors,
  Radius,
  Spacing,
} from '../../constants/theme';

interface OrganOption {
  label: string;
  value: PlantOrgan;
  emoji: string;
}

const options: OrganOption[] = [
  {
    label: 'Auto',
    value: 'auto',
    emoji: '✨',
  },
  {
    label: 'Leaf',
    value: 'leaf',
    emoji: '🍃',
  },
  {
    label: 'Flower',
    value: 'flower',
    emoji: '🌸',
  },
  {
    label: 'Fruit',
    value: 'fruit',
    emoji: '🍎',
  },
  {
    label: 'Bark',
    value: 'bark',
    emoji: '🌳',
  },
];

interface OrganSelectorProps {
  value: PlantOrgan;
  onChange: (organ: PlantOrgan) => void;
}

export function OrganSelector({
  value,
  onChange,
}: OrganSelectorProps) {
  return (
    <View style={styles.container}>
      {options.map(option => {
        const selected =
          value === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            style={[
              styles.option,
              selected && styles.optionSelected,
            ]}
            onPress={() =>
              onChange(option.value)
            }
          >
            <Text style={styles.emoji}>
              {option.emoji}
            </Text>

            <Text
              style={[
                styles.label,
                selected &&
                  styles.labelSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,

    borderRadius: 999,

    backgroundColor: Colors.surface,

    borderWidth: 1,
    borderColor: Colors.border,
  },

  optionSelected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },

  emoji: {
    fontSize: 17,
    marginRight: 7,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  labelSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
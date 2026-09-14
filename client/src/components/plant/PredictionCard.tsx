import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PlantPrediction } from '../../types/plant';

import {
  Colors,
  Radius,
  Spacing,
} from '../../constants/theme';

interface PredictionCardProps {
  prediction: PlantPrediction;
}

export function PredictionCard({
  prediction,
}: PredictionCardProps) {
  const confidence = Math.round(
    prediction.score * 100,
  );

  const commonName =
    prediction.species.commonNames?.[0];

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {commonName ??
            prediction.species
              .scientificNameWithoutAuthor}
        </Text>

        {commonName && (
          <Text
            style={styles.scientificName}
            numberOfLines={1}
          >
            {
              prediction.species
                .scientificNameWithoutAuthor
            }
          </Text>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.score}>
          {confidence}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: Spacing.md,

    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  content: {
    flex: 1,
    paddingRight: Spacing.md,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginTop: 4,
  },

  scoreContainer: {
    backgroundColor: Colors.primarySoft,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: Radius.medium,
  },

  score: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
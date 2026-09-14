import { router } from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { AppButton } from '../components/buttons/AppButton';

import {
  Colors,
  Radius,
  Spacing,
} from '../constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>
                🌿
              </Text>
            </View>

            <Text style={styles.brand}>
              PlantLens
            </Text>
          </View>

          <Text style={styles.title}>
            Know what grows around you.
          </Text>

          <Text style={styles.description}>
            Take a photo of any plant and let AI help identify its species in seconds.
          </Text>

          <View style={styles.featureRow}>
            <Feature
              icon="⚡"
              title="Fast"
              description="AI-powered identification"
            />

            <Feature
              icon="🎯"
              title="Accurate"
              description="Confidence-based results"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardVisual}>
            <Text style={styles.cardEmoji}>
              🌱
            </Text>
          </View>

          <Text style={styles.cardTitle}>
            Identify a plant
          </Text>

          <Text style={styles.cardDescription}>
            Photograph a leaf, flower, fruit or bark for the best identification result.
          </Text>

          <AppButton
            title="Start Identification"
            onPress={() =>
              router.push('/identify')
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureIcon}>
        {icon}
      </Text>

      <View>
        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text style={styles.featureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',

    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoCircle: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: Colors.primarySoft,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  logoEmoji: {
    fontSize: 20,
  },

  brand: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },

  title: {
    marginTop: Spacing.xl,

    fontSize: 42,
    lineHeight: 48,

    fontWeight: '800',

    color: Colors.textPrimary,

    maxWidth: 350,
  },

  description: {
    marginTop: Spacing.md,

    fontSize: 17,
    lineHeight: 25,

    color: Colors.textSecondary,

    maxWidth: 340,
  },

  featureRow: {
    marginTop: Spacing.xl,
    gap: 12,
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureIcon: {
    fontSize: 21,
    width: 34,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  featureDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  card: {
    backgroundColor: Colors.surface,

    borderRadius: Radius.xl,

    padding: Spacing.lg,

    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 3,
  },

  cardVisual: {
    width: 64,
    height: 64,

    borderRadius: 22,

    backgroundColor: Colors.primarySoft,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: Spacing.md,
  },

  cardEmoji: {
    fontSize: 32,
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  cardDescription: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,

    fontSize: 15,
    lineHeight: 22,

    color: Colors.textSecondary,
  },
});
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';

import {
  useEffect,
  useRef,
} from 'react';

import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { PlantImagePreview } from '../components/images/PlantImagePreview';
import { ConfidenceBadge } from '../components/plant/ConfidenceBadge';
import { PredictionCard } from '../components/plant/PredictionCard';
import { AppButton } from '../components/buttons/AppButton';

import { usePlantIdentification } from '../hooks/usePlantIdentification';

import { useIdentification } from '../context/IdentificationContext';

import {
  Colors,
  Radius,
  Spacing,
} from '../constants/theme';

export default function ResultScreen() {
  const {
    image,
    organ,
    clearIdentification,
  } = useIdentification();

  const {
    mutate,
    data,
    isPending,
    isError,
    error,
  } = usePlantIdentification();

  const requestStarted =
    useRef(false);

  useEffect(() => {
    if (
      requestStarted.current ||
      !image?.base64
    ) {
      return;
    }

    requestStarted.current = true;

    mutate({
      image,
      organ,
    });
  }, [
    mutate,
    image,
    organ,
  ]);

  if (!image) {
    return (
      <View style={styles.fullScreen}>
        <Text
          style={styles.emptyTitle}
        >
          No image selected
        </Text>

        <Text
          style={styles.emptyDescription}
        >
          Select a plant photo before
          starting identification.
        </Text>

        <View
          style={
            styles.emptyButton
          }
        >
          <AppButton
            title="Select Photo"
            onPress={() =>
              router.replace(
                '/identify',
              )
            }
          />
        </View>
      </View>
    );
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <View style={styles.fullScreen}>
        <ErrorState
          error={error}
          onRetry={() => {
            clearIdentification();

            router.replace(
              '/identify',
            );
          }}
        />
      </View>
    );
  }

  if (
    !data ||
    !data.results?.length
  ) {
    return (
      <View style={styles.fullScreen}>
        <Text
          style={styles.emptyTitle}
        >
          No identification result
        </Text>

        <Text
          style={styles.emptyDescription}
        >
          We couldn't find a matching
          plant for this photo.
        </Text>

        <View
          style={
            styles.emptyButton
          }
        >
          <AppButton
            title="Try Another Photo"
            onPress={() => {
              clearIdentification();

              router.replace(
                '/identify',
              );
            }}
          />
        </View>
      </View>
    );
  }

  const bestPrediction =
    data.results[0];

  const alternatives =
    data.results.slice(1);

  const confidence =
    Math.round(
      bestPrediction.score *
        100,
    );

  const commonName =
    bestPrediction.species
      .commonNames?.[0];

  const displayName =
    commonName ??
    bestPrediction.species
      .scientificNameWithoutAuthor;

  const previewUri =
    image.base64
      ? `data:${
          image.mimeType ??
          'image/jpeg'
        };base64,${
          image.base64
        }`
      : image.uri;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <PlantImagePreview
        uri={previewUri}
      />

      <View
        style={styles.mainResult}
      >
        <Text
          style={styles.bestMatch}
        >
          BEST MATCH
        </Text>

        <Text
          style={styles.plantName}
        >
          {displayName}
        </Text>

        <Text
          style={
            styles.scientificName
          }
        >
          {
            bestPrediction.species
              .scientificNameWithoutAuthor
          }
        </Text>

        <View
          style={
            styles.badgeContainer
          }
        >
          <ConfidenceBadge
            confidence={
              confidence
            }
          />
        </View>
      </View>

      <View
        style={
          styles.confidenceCard
        }
      >
        <Text
          style={styles.cardLabel}
        >
          Identification confidence
        </Text>

        <View
          style={
            styles.confidenceRow
          }
        >
          <Text
            style={
              styles.confidenceValue
            }
          >
            {confidence}%
          </Text>

          <View
            style={
              styles.progressTrack
            }
          >
            <View
              style={[
                styles.progressValue,

                {
                  width:
                    `${confidence}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text
          style={styles.cardTitle}
        >
          Taxonomy
        </Text>

        <InfoRow
          label="Family"
          value={
            bestPrediction.species
              .family
              .scientificNameWithoutAuthor
          }
        />

        <InfoRow
          label="Genus"
          value={
            bestPrediction.species
              .genus
              .scientificNameWithoutAuthor
          }
        />
      </View>

      {alternatives.length >
        0 && (
        <View style={styles.card}>
          <Text
            style={
              styles.cardTitle
            }
          >
            Other possibilities
          </Text>

          <Text
            style={
              styles.cardDescription
            }
          >
            AI identification is
            probabilistic. These
            species were also
            considered.
          </Text>

          <View
            style={
              styles.predictions
            }
          >
            {alternatives.map(
              prediction => (
                <PredictionCard
                  key={
                    prediction
                      .species
                      .scientificName
                  }
                  prediction={
                    prediction
                  }
                />
              ),
            )}
          </View>
        </View>
      )}

      {confidence < 60 && (
        <View
          style={
            styles.warningCard
          }
        >
          <Text
            style={
              styles.warningTitle
            }
          >
            We're not completely
            sure
          </Text>

          <Text
            style={
              styles.warningText
            }
          >
            Try another photo with
            better lighting or
            photograph a clear leaf
            or flower.
          </Text>
        </View>
      )}

      <View
        style={
          styles.buttonContainer
        }
      >
        <AppButton
          title="Identify Another Plant"
          onPress={() => {
            clearIdentification();

            router.replace(
              '/identify',
            );
          }}
        />
      </View>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text
        style={styles.infoLabel}
      >
        {label}
      </Text>

      <Text
        style={styles.infoValue}
      >
        {value}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        Colors.background,
    },

    fullScreen: {
      flex: 1,

      backgroundColor:
        Colors.background,

      justifyContent:
        'center',

      alignItems: 'center',

      paddingHorizontal:
        Spacing.xl,
    },

    content: {
      padding:
        Spacing.lg,

      paddingBottom:
        Spacing.xxl,
    },

    mainResult: {
      marginTop:
        Spacing.lg,
    },

    bestMatch: {
      fontSize: 12,

      fontWeight: '800',

      letterSpacing: 1.5,

      color:
        Colors.primary,
    },

    plantName: {
      marginTop: 7,

      fontSize: 32,
      lineHeight: 38,

      fontWeight: '800',

      color:
        Colors.textPrimary,
    },

    scientificName: {
      marginTop: 5,

      fontSize: 15,

      fontStyle: 'italic',

      color:
        Colors.textSecondary,
    },

    badgeContainer: {
      marginTop:
        Spacing.md,
    },

    confidenceCard: {
      marginTop:
        Spacing.lg,

      padding:
        Spacing.lg,

      borderRadius:
        Radius.large,

      backgroundColor:
        Colors.surface,
    },

    cardLabel: {
      fontSize: 13,

      color:
        Colors.textSecondary,

      fontWeight: '600',
    },

    confidenceRow: {
      marginTop:
        Spacing.sm,
    },

    confidenceValue: {
      fontSize: 32,

      fontWeight: '800',

      color:
        Colors.textPrimary,
    },

    progressTrack: {
      marginTop:
        Spacing.md,

      width: '100%',

      height: 8,

      backgroundColor:
        '#E8ECE6',

      borderRadius: 999,

      overflow: 'hidden',
    },

    progressValue: {
      height: '100%',

      backgroundColor:
        Colors.primary,

      borderRadius: 999,
    },

    card: {
      marginTop:
        Spacing.md,

      padding:
        Spacing.lg,

      borderRadius:
        Radius.large,

      backgroundColor:
        Colors.surface,
    },

    cardTitle: {
      fontSize: 19,

      fontWeight: '800',

      color:
        Colors.textPrimary,
    },

    cardDescription: {
      marginTop: 5,

      fontSize: 13,
      lineHeight: 19,

      color:
        Colors.textSecondary,
    },

    infoRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      paddingVertical: 12,

      borderBottomWidth: 1,

      borderBottomColor:
        Colors.border,
    },

    infoLabel: {
      fontSize: 14,

      color:
        Colors.textSecondary,
    },

    infoValue: {
      fontSize: 14,

      fontWeight: '700',

      color:
        Colors.textPrimary,
    },

    predictions: {
      marginTop:
        Spacing.sm,
    },

    warningCard: {
      marginTop:
        Spacing.md,

      padding:
        Spacing.lg,

      borderRadius:
        Radius.large,

      backgroundColor:
        Colors.warningBackground,
    },

    warningTitle: {
      fontSize: 17,

      fontWeight: '800',

      color:
        Colors.warningText,
    },

    warningText: {
      marginTop: 7,

      fontSize: 14,
      lineHeight: 21,

      color:
        Colors.warningText,
    },

    buttonContainer: {
      marginTop:
        Spacing.xl,
    },

    emptyTitle: {
      fontSize: 22,

      fontWeight: '800',

      color:
        Colors.textPrimary,

      textAlign: 'center',
    },

    emptyDescription: {
      marginTop:
        Spacing.sm,

      fontSize: 15,
      lineHeight: 22,

      color:
        Colors.textSecondary,

      textAlign: 'center',
    },

    emptyButton: {
      width: '100%',

      marginTop:
        Spacing.lg,
    },
  });
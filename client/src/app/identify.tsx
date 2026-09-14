import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useEffect } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import { AppButton } from '../components/buttons/AppButton';
import { PlantImagePreview } from '../components/images/PlantImagePreview';
import { OrganSelector } from '../components/plant/OrganSelector';

import {
  Colors,
  Radius,
  Spacing,
} from '../constants/theme';

import { useIdentification } from '../context/IdentificationContext';

export default function IdentifyScreen() {
  const {
    image,
    organ,
    setImage,
    setOrgan,
  } = useIdentification();

  useEffect(() => {
    recoverPendingCameraResult();
  }, []);

  const recoverPendingCameraResult =
    async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        const result =
          await ImagePicker.getPendingResultAsync();

        if (
          !result ||
          result.canceled ||
          !result.assets?.[0]
        ) {
          return;
        }

        const asset =
          result.assets[0];

        setImage({
          uri: asset.uri,

          fileName:
            asset.fileName ??
            `plant-${Date.now()}.jpg`,

          mimeType:
            asset.mimeType ??
            'image/jpeg',

          base64:
            asset.base64,
        });
      } catch (error) {
        console.warn(
          '[IMAGE RECOVERY ERROR]',
          error,
        );
      }
    };

  const chooseFromGallery =
    async () => {
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Photo access required',
            'Please allow photo library access to select a plant image.',
          );

          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync(
            {
              mediaTypes: ['images'],

              allowsEditing: false,

              quality: 0.75,

              base64: true,
            },
          );

        if (
          result.canceled ||
          !result.assets?.[0]
        ) {
          return;
        }

        const asset =
          result.assets[0];

        setImage({
          uri: asset.uri,

          fileName:
            asset.fileName ??
            `plant-${Date.now()}.jpg`,

          mimeType:
            asset.mimeType ??
            'image/jpeg',

          base64:
            asset.base64,
        });
      } catch (error) {
        console.error(
          '[GALLERY ERROR]',
          error,
        );

        Alert.alert(
          'Unable to open gallery',
          'Something went wrong while opening your photo library.',
        );
      }
    };

  const takePhoto =
    async () => {
      try {
        if (Platform.OS === 'web') {
          Alert.alert(
            'Camera preview',
            'Camera behavior is limited in the web preview. Please test this feature on Android.',
          );

          return;
        }

        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Camera access required',
            'Please allow camera access to photograph a plant.',
          );

          return;
        }

        const result =
          await ImagePicker.launchCameraAsync(
            {
              mediaTypes: ['images'],

              allowsEditing: false,

              quality: 0.75,

              base64: true,
            },
          );

        if (
          result.canceled ||
          !result.assets?.[0]
        ) {
          return;
        }

        const asset =
          result.assets[0];

        setImage({
          uri: asset.uri,

          fileName:
            asset.fileName ??
            `plant-${Date.now()}.jpg`,

          mimeType:
            asset.mimeType ??
            'image/jpeg',

          base64:
            asset.base64,
        });
      } catch (error) {
        console.error(
          '[CAMERA ERROR]',
          error,
        );

        Alert.alert(
          'Camera unavailable',
          'We could not open your camera. Please try again or choose a photo from your gallery.',
        );
      }
    };

  const analyzePlant = () => {
    if (!image?.uri) {
      Alert.alert(
        'Photo required',
        'Select or take a plant photo before continuing.',
      );

      return;
    }

    if (!image.base64) {
      Alert.alert(
        'Image processing failed',
        'The selected image could not be prepared for identification. Please select it again.',
      );

      return;
    }

    router.push('/result');
  };

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
      <View style={styles.header}>
        <Text style={styles.title}>
          Show us your plant
        </Text>

        <Text
          style={styles.description}
        >
          Use a clear, well-lit photo.
          A close-up of the leaf or
          flower usually gives the best
          result.
        </Text>
      </View>

      {image ? (
        <>
          <PlantImagePreview
            uri={image.uri}
          />

          <Text
            style={styles.imageHint}
          >
            Photo ready for
            identification
          </Text>
        </>
      ) : (
        <View
          style={styles.placeholder}
        >
          <View
            style={
              styles.placeholderIcon
            }
          >
            <Text
              style={
                styles.placeholderEmoji
              }
            >
              🌱
            </Text>
          </View>

          <Text
            style={
              styles.placeholderTitle
            }
          >
            Add a plant photo
          </Text>

          <Text
            style={
              styles.placeholderDescription
            }
          >
            Choose an existing image
            or photograph a plant.
          </Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <View
          style={styles.actionButton}
        >
          <AppButton
            title="Take Photo"
            onPress={takePhoto}
          />
        </View>

        <View
          style={styles.actionButton}
        >
          <AppButton
            title="Gallery"
            onPress={chooseFromGallery}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
        >
          What are we looking at?
        </Text>

        <Text
          style={
            styles.sectionDescription
          }
        >
          Tell the AI which part of
          the plant is visible, or
          choose Auto.
        </Text>

        <View style={styles.selector}>
          <OrganSelector
            value={organ}
            onChange={setOrgan}
          />
        </View>
      </View>

      <View style={styles.tipCard}>
        <Text
          style={styles.tipTitle}
        >
          Tips for better results
        </Text>

        <Text style={styles.tipText}>
          • Keep the plant in focus
          {'\n'}
          • Avoid dark or blurry images
          {'\n'}
          • Try to keep other plants
          out of the frame
        </Text>
      </View>

      <View
        style={
          styles.analyzeContainer
        }
      >
        <AppButton
          title="Analyze Plant"
          disabled={!image}
          onPress={analyzePlant}
        />
      </View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    content: {
      padding: Spacing.lg,
      paddingBottom:
        Spacing.xxl,
    },

    header: {
      marginBottom:
        Spacing.lg,
    },

    title: {
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '800',
      color:
        Colors.textPrimary,
    },

    description: {
      marginTop:
        Spacing.sm,

      fontSize: 15,
      lineHeight: 23,

      color:
        Colors.textSecondary,
    },

    placeholder: {
      width: '100%',
      aspectRatio: 4 / 3,

      borderRadius:
        Radius.large,

      backgroundColor:
        '#E9EEE7',

      alignItems: 'center',
      justifyContent:
        'center',

      padding:
        Spacing.lg,
    },

    placeholderIcon: {
      width: 72,
      height: 72,

      borderRadius: 36,

      backgroundColor:
        Colors.surface,

      alignItems: 'center',
      justifyContent:
        'center',
    },

    placeholderEmoji: {
      fontSize: 36,
    },

    placeholderTitle: {
      marginTop:
        Spacing.md,

      fontSize: 19,
      fontWeight: '700',

      color:
        Colors.textPrimary,
    },

    placeholderDescription: {
      marginTop: 6,

      fontSize: 14,
      lineHeight: 20,

      color:
        Colors.textSecondary,

      textAlign: 'center',
    },

    imageHint: {
      marginTop:
        Spacing.sm,

      fontSize: 13,

      color:
        Colors.textSecondary,

      textAlign: 'center',
    },

    actionRow: {
      flexDirection: 'row',

      gap: 12,

      marginTop:
        Spacing.md,
    },

    actionButton: {
      flex: 1,
    },

    section: {
      marginTop:
        Spacing.xl,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',

      color:
        Colors.textPrimary,
    },

    sectionDescription: {
      marginTop: 6,

      fontSize: 14,
      lineHeight: 20,

      color:
        Colors.textSecondary,
    },

    selector: {
      marginTop:
        Spacing.md,
    },

    tipCard: {
      marginTop:
        Spacing.xl,

      padding:
        Spacing.md,

      borderRadius:
        Radius.large,

      backgroundColor:
        Colors.surface,

      borderWidth: 1,

      borderColor:
        Colors.border,
    },

    tipTitle: {
      fontSize: 15,
      fontWeight: '700',

      color:
        Colors.textPrimary,
    },

    tipText: {
      marginTop:
        Spacing.sm,

      fontSize: 14,
      lineHeight: 23,

      color:
        Colors.textSecondary,
    },

    analyzeContainer: {
      marginTop:
        Spacing.xl,
    },
  });
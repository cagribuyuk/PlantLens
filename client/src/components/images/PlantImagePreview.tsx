import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import {
  Colors,
  Radius,
} from '../../constants/theme';

interface PlantImagePreviewProps {
  uri?: string;
}

export function PlantImagePreview({
  uri,
}: PlantImagePreviewProps) {
  if (!uri) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
        onError={event => {
          console.error(
            '[IMAGE PREVIEW ERROR]',
            event.nativeEvent.error,
          );
        }}
        onLoad={() => {
          console.log(
            '[IMAGE PREVIEW LOADED]',
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 3,

    borderRadius: Radius.large,
    overflow: 'hidden',

    backgroundColor: Colors.primarySoft,
  },

  image: {
    width: '100%',
    height: '100%',
  },
});
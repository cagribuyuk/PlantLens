import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppError } from '../../errors/AppError';

interface ErrorStateProps {
  error: AppError;
  onRetry: () => void;
}

export function ErrorState({
  error,
  onRetry,
}: ErrorStateProps) {
  const title =
    error.code === 'NETWORK_ERROR'
      ? 'No connection'
      : error.code === 'NO_RESULT'
        ? 'Plant not recognized'
        : error.code === 'RATE_LIMIT'
          ? 'Please slow down'
          : 'Something went wrong';

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {error.message}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1EAE4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7D4938',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#17231A',
    marginTop: 20,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#687269',
    textAlign: 'center',
    marginTop: 8,
  },

  button: {
    marginTop: 24,
    backgroundColor: '#2E6845',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 32,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
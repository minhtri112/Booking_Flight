import Toast from 'react-native-toast-message';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export const showSuccess = (message: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    position: 'top',
    visibilityTime: 2500,
    topOffset: 60,
    autoHide: true,
    swipeable: true,
  });
};


export const showError = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'top',
    visibilityTime: 3000,
    topOffset: 60,
    autoHide: true,
    swipeable: true,
  });
};


export const toastConfig = {
  success: ({ text1 }: any) => (
    <View style={[styles.toastContainer, styles.success]}>
      <View style={styles.iconContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.iconText}>✓</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        {text1 ? <Text style={styles.message}>{text1}</Text> : null}
      </View>
    </View>
  ),
  error: ({ text1 }: any) => (
    <View style={[styles.toastContainer, styles.error]}>
      <View style={styles.iconContainer}>
        <View style={styles.errorIcon}>
          <Text style={styles.iconText}>✕</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        {text1 ? <Text style={styles.message}>{text1}</Text> : null}
      </View>
    </View>
  ),
};


const styles = StyleSheet.create({
  toastContainer: {
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    marginRight: 10,
  },
  successIcon: {
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    lineHeight: 20,
  },
  success: {
    backgroundColor: '#10B981',
  },
  error: {
    backgroundColor: '#EF4444',
  },
});

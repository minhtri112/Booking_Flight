import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogIn, Plane, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { TypeNavigationProp } from '../types/types';

import FetchApi from "../services/fetchAPI";
import ItemHistory from '../components/ItemHistory';


export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation<TypeNavigationProp>();
  const [activeTab, setActiveTab] = useState<'account' | 'history'>('account');
  const [user, setUser] = useState<any>();
  const [orders, setOrders] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const login = async () => {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const req = await FetchApi.get(`accounts/${token}`);
          if (req.data) {
            setUser(req.data);
            setIsLoggedIn(true);
            const orderReq = await FetchApi.get(`accounts/orders/${req.data._id}`);
            if (orderReq.data) {
              setOrders(orderReq.data);
            }
          }
        }
      };
      login();
    }, [])
  );

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {isLoggedIn ? (
        <>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'account' && styles.activeTab]}
              onPress={() => setActiveTab('account')}>
              <User size={20} color={activeTab === 'account' ? '#2563eb' : '#64748b'} />
              <Text style={[styles.tabText, activeTab === 'account' && styles.activeTabText]}>
                Thông Tin Tài Khoản
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.activeTab]}
              onPress={() => setActiveTab('history')}>
              <Plane size={20} color={activeTab === 'history' ? '#2563eb' : '#64748b'} />
              <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                Lịch Sử Đặt Chuyến
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nội dung có scroll */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {activeTab === 'account' ? (
              <>
                <View style={styles.accountContent}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <User size={48} color="#fff" />
                    </View>
                    <Text style={styles.userName}>{user.user}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>

                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Thông Tin Cá Nhân</Text>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Họ và Tên</Text>
                      <Text style={styles.infoValue}>{user.user}</Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoValue}>{user.email}</Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Số Điện Thoại</Text>
                      <Text style={styles.infoValue}>+84 123 456 789</Text>
                    </View>
                  </View>
                </View>

                {/* Đưa nút Đăng Xuất vào trong ScrollView */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.historyContent}>
                {
                  orders.length > 0 ? (
                    <>
                      {orders.map((item) => (
                        <ItemHistory key={item._id} item={item} />
                      ))}
                    </>
                ) : (
                <Text style={{ textAlign: 'center', color: '#64748b' }}>
                  Chưa có lịch sử đặt chuyến.
                </Text>
                )
                }

              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <View style={styles.loginPrompt}>
          <View style={styles.loginIcon}>
            <User size={50} color="#cbd5e1" />
          </View>
          <Text style={styles.loginTitle}>Chưa Đăng Nhập</Text>
          <Text style={styles.loginSubtitle}>
            Vui lòng đăng nhập để xem thông tin tài khoản và lịch sử đặt chuyến bay
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <LogIn size={20} color="#fff" />
            <Text style={styles.loginButtonText}>Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  iconButton: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#2563eb' },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  accountContent: { padding: 20 },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  userEmail: { fontSize: 12, color: '#64748b' },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 20 },
  infoItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: { fontSize: 10, color: '#64748b', marginBottom: 6, fontWeight: '500' },
  infoValue: { fontSize: 13, color: '#0f172a', fontWeight: '600' },
  historyContent: { flex: 1, padding: 20 },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  logoutButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  loginPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loginIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loginTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  loginSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  loginButtonText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});

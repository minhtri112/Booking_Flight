import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react-native';
import { TypeNavigationProp } from '../types/types';

import * as SecureStore from 'expo-secure-store';
import FetchApi from "../services/fetchAPI";
import { showSuccess, showError } from "../components/Alter";

export default function LoginScreen() {
  const navigation = useNavigation<TypeNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      showError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }
    setLoading(true);
    try {
      const req = await FetchApi.post("accounts/login", { email, password });

      if (req.data) {
        await SecureStore.setItemAsync("token", req.data.token);
        showSuccess("Đăng nhập thành công");
        navigation.goBack();
      } else {
        showError("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("Lỗi kết nối server");
    } finally {
      setLoading(false); 
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Plane size={48} color="#2563eb" />
          </View>
          <Text style={styles.appTitle}>AirBook</Text>
          <Text style={styles.appSubtitle}>Đặt vé bay dễ dàng</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Đăng Nhập</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="nguyenvana@email.com"
                placeholderTextColor="#cbd5e1"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật Khẩu</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#cbd5e1"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={!password}>
                {showPassword ? (
                  <EyeOff size={18} color="#64748b" />
                ) : (
                  <Eye size={18} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={[
              styles.loginButton,
              loading && styles.loginButtonDisabled,
            ]}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Đăng Nhập</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotLink}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Đăng Ký Ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    fontSize: 12,
    color: '#991b1b',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#0f172a',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  forgotLink: {
    alignItems: 'center',
    marginTop: 12,
  },
  forgotText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94a3b8',
    marginHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
  registerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
});

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Plane,
} from 'lucide-react-native';

import { TypeNavigationProp } from '../types/types';
import { showError , showSuccess} from '../components/Alter';
import FetchApi from '../services/fetchAPI';

export default function RegisterScreen() {
  const navigation = useNavigation<TypeNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleRegister = () => {
    if(email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Vui lòng nhập email hợp lệ');
      return;
    }
    if(password !== confirmPassword){
        showError('Mật khẩu xác nhận không khớp');
        return;
    }
    const register = async () => {
      const req = await FetchApi.post('accounts/register', {
        name: fullName,
        email: email,
        password: password,
      });
      if (req.data) {
        showSuccess('Đăng ký thành công');
        navigation.navigate('Login');
      } else {
        showError('Đăng ký thất bại');
      }
    };
    register();
  };



  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Plane size={40} color="#2563eb" />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Tạo Tài Khoản Mới</Text>
          <Text style={styles.formSubtitle}>
            Điền thông tin để bắt đầu đặt vé bay
          </Text>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và Tên</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#cbd5e1"
                value={fullName}
                onChangeText={setFullName}
  
              />
            </View>
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác Nhận Mật Khẩu</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#cbd5e1"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!confirmPassword}>
                {showConfirmPassword ? (
                  <EyeOff size={18} color="#64748b" />
                ) : (
                  <Eye size={18} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Đăng Ký</Text>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Đăng Nhập</Text>
            </TouchableOpacity>
          </View>
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
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 11,
    color: '#64748b',
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
    fontSize: 11,
    color: '#991b1b',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#0f172a',
  },
  registerButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginPromptText: {
    fontSize: 11,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
});

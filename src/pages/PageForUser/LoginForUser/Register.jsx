import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import { AuthContext } from "../../../components/auth/AuthProvider";
import { registerUser, verifyAccount } from "../../../api/authApi";
import TermsAndConditions from '../../../components/Provision';
import '../../../styles/Login.css'; // Reuse login styles
import { 
  UserOutlined, 
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  GoogleOutlined, 
  FacebookOutlined, 
  LinkedinOutlined,
} from '@ant-design/icons';

const Register = () => {
  const navigate = useNavigate();
  const { pendingVerification, savePendingRegistration, clearPendingRegistration } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState("register");
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [termsVisible, setTermsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const GOOGLE_AUTH_URL = `https://localhost:8080/oauth2/authorization/google`;
  const FACEBOOK_AUTH_URL = `http://localhost:8080/oauth2/authorization/facebook`;
  const LINKEDIN_AUTH_URL = `http://localhost:8080/oauth2/authorization/linkedin`;

  useEffect(() => {
    let timer;
    if (currentStep === 'verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, countdown]);

  useEffect(() => {
    if (pendingVerification) {
      setEmail(pendingVerification.email);
      setCurrentStep("verify");
      message.info('Bạn có một đăng ký chưa hoàn thành xác thực. Vui lòng nhập mã OTP để hoàn tất.');
    }
  }, [pendingVerification]);

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };
  
  const handleFacebookLogin = () => {
    window.location.href = FACEBOOK_AUTH_URL;
  };

  const handleLinkedinLogin = () => {
    window.location.href = LINKEDIN_AUTH_URL;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const userEmail = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!firstName || !lastName || !phone || !userEmail || !password || !confirmPassword) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    if (password !== confirmPassword) {
      message.error("Mật khẩu không khớp!");
      return;
    }
    
    if (!agreeTerms) {
      message.error("Bạn phải đồng ý với điều khoản để tiếp tục!");
      return;
    }

    try {
      setLoading(true);
      
      const userDTO = {
        fullName: `${firstName} ${lastName}`.trim(),
        email: userEmail.trim(),
        password: password,
        confirmPassword: password,
        phone: phone.trim()
      };

      await registerUser(userDTO);
      message.success("Đăng ký thành công! Hãy nhập mã xác thực.");
      setEmail(userEmail);
      savePendingRegistration(userEmail);
      setCurrentStep("verify");
      setCountdown(120);
      setIsResendDisabled(true);
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error?.message || "Đã xảy ra lỗi khi đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!verificationCode || verificationCode.length !== 6) {
        message.error('Vui lòng nhập mã xác thực 6 số!');
        return;
      }

      setLoading(true);

      if (!email) {
        message.error('Không tìm thấy thông tin email!');
        return;
      }

      await verifyAccount(email, verificationCode);
      message.success('Xác thực thành công!');
      clearPendingRegistration();
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('Lỗi xác thực:', error);
      
      if (error.status === 400) {
        setCountdown(0);
        setIsResendDisabled(false);
      }
      
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      // Assuming resendOtp function is available
      // await resendOtp(email);
      message.success('Đã gửi lại mã xác thực!');
      setCountdown(120);
      setIsResendDisabled(true);
    } catch (error) {
      message.error('Không thể gửi lại mã xác thực. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep("register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-container">
      {/* Left panel with form */}
      <div className="login-form-panel">
        <div className="login-content">
          {currentStep === "register" ? (
            <>
              <h2 className="welcome-text">Đăng ký tài khoản</h2>
              <p className="welcome-description">Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng</p>
              
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-row">
                  <div className="form-group form-group-half">
                    <label htmlFor="firstName" className="form-label">Họ</label>
                    <div className="input-with-icon">
                      <UserOutlined className="input-icon" />
                      <input 
                        type="text" 
                        id="firstName" 
                        className="form-input"
                        placeholder="Nhập họ"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group form-group-half">
                    <label htmlFor="lastName" className="form-label">Tên</label>
                    <div className="input-with-icon">
                      <UserOutlined className="input-icon" />
                      <input 
                        type="text" 
                        id="lastName" 
                        className="form-input"
                        placeholder="Nhập tên"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Số điện thoại</label>
                  <div className="input-with-icon">
                    <PhoneOutlined className="input-icon" />
                    <input 
                      type="tel" 
                      id="phone" 
                      className="form-input"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-with-icon">
                    <MailOutlined className="input-icon" />
                    <input 
                      type="email" 
                      id="email" 
                      className="form-input"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Mật khẩu</label>
                  <div className="input-with-icon password-input-container">
                    <LockOutlined className="input-icon" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      id="password" 
                      className="form-input"
                      placeholder="Nhập mật khẩu"
                    />
                    <span 
                      className="password-toggle" 
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu</label>
                  <div className="input-with-icon password-input-container">
                    <LockOutlined className="input-icon" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword" 
                      className="form-input"
                      placeholder="Nhập lại mật khẩu"
                    />
                    <span 
                      className="password-toggle" 
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </span>
                  </div>
                </div>

                <div className="form-group terms-checkbox">
                  <input 
                    type="checkbox" 
                    id="agreeTerms" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <label htmlFor="agreeTerms">
                    Tôi đồng ý với{' '}
                    <a 
                      onClick={(e) => {
                        e.preventDefault();
                        setTermsVisible(true);
                      }}
                    >
                      điều khoản sử dụng
                    </a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
              </form>
              
              <div className="auth-divider">Hoặc đăng ký bằng</div>
              
              <div className="social-buttons">
                <button 
                  className="social-btn btn-google"
                  onClick={handleGoogleLogin}
                >
                  <GoogleOutlined className="icon" /> Google
                </button>
                
                <button 
                  className="social-btn btn-facebook"
                  onClick={handleFacebookLogin}
                >
                  <FacebookOutlined className="icon" /> Facebook
                </button>
                
                <button 
                  className="social-btn btn-linkedin"
                  onClick={handleLinkedinLogin}
                >
                  <LinkedinOutlined className="icon" /> LinkedIn
                </button>
              </div>
              
              <div className="register-link">
                Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
              </div>
            </>
          ) : (
            // Verification step
            <>
              <h2 className="welcome-text">Xác thực tài khoản</h2>
              <p className="welcome-description">
                Mã xác thực đã được gửi đến email của bạn. Vui lòng nhập mã gồm 6 số
                để hoàn tất đăng ký.
              </p>
              
              <div className="verification-countdown">
                Mã xác thực còn hiệu lực trong: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </div>
              
              <form onSubmit={handleVerificationSubmit}>
                <div className="form-group">
                  <label htmlFor="verificationCode" className="form-label">Mã xác thực</label>
                  <input 
                    type="text" 
                    id="verificationCode" 
                    className="form-input verification-input"
                    placeholder="Nhập mã xác thực 6 số"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 6) {
                        setVerificationCode(value);
                      }
                    }}
                    maxLength={6}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Xác thực'}
                </button>
                
                <button 
                  type="button" 
                  className="btn-link"
                  onClick={handleResendCode}
                  disabled={isResendDisabled}
                >
                  {isResendDisabled ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã xác thực'}
                </button>
                
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleBack}
                >
                  Quay lại
                </button>
              </form>
            </>
          )}
          
          <div className="help-text">
            Bạn gặp khó khăn khi tạo tài khoản?<br />
            Vui lòng gọi tới số <a href="tel:02468805588">(024) 6680 5588</a> (giờ hành chính).
          </div>
          
          <div className="login-footer">
            © 2016. All Rights Reserved. TopCV Vietnam JSC.
          </div>
        </div>
      </div>
      
      {/* Right panel with branding */}
      <div className="login-brand-panel">
        <div className="brand-pattern"></div>
        <div className="brand-content">
          <img 
            src="src/assets/logos/logo.png" 
            alt="CVHub Logo" 
            className="brand-logo" 
          />
          <h1 className="brand-tagline">Tiếp lợi thế<br />Nối thành công</h1>
          <p className="brand-description">
            TopCV - Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt Nam
          </p>
        </div>
      </div>
      
      {/* Terms and Conditions Modal */}
      <TermsAndConditions 
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
      />
    </div>
  );
};

export default Register;
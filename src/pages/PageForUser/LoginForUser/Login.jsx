import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import { AuthContext } from '../../../components/auth/AuthProvider';
import { login } from '../../../api/authApi'; 
import '../../../styles/Login.css';
import { 
  GoogleOutlined, 
  FacebookOutlined, 
  LinkedinOutlined,
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const GOOGLE_AUTH_URL = `http://localhost:8080/oauth2/authorization/google`;
  const GITHUB_AUTH_URL = `http://localhost:8080/oauth2/authorization/github`;
  const FACEBOOK_AUTH_URL = `http://localhost:8080/oauth2/authorization/facebook`;
  const LINKEDIN_AUTH_URL = `http://localhost:8080/oauth2/authorization/linkedin`;

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };
  
  const handleFacebookLogin = () => {
    window.location.href = FACEBOOK_AUTH_URL;
  };

  const handleLinkedinLogin = () => {
    window.location.href = LINKEDIN_AUTH_URL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      const accountType = 'user';
      const responseData = await login(accountType, { email, password });

      const userData = {
        email: responseData.email || email,
        data: {
          token: responseData.token,
          message: responseData.message
        }
      };

      await setAuth(userData, responseData.token, 'user');
      message.success('Đăng nhập thành công!');
      navigate('/');

    } catch (error) {
      console.error('Login error details:', error);
      message.error(
        error.response?.data?.message || 
        error.message || 
        'Đăng nhập thất bại!'
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Left panel with form */}
      <div className="login-form-panel">
        <div className="login-content">
          <h2 className="welcome-text">Chào mừng bạn đã quay trở lại</h2>
          <p className="welcome-description">Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng</p>
          
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon password-input-container">
                <LockOutlined className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  className="form-input"
                  placeholder="Nhập mật khẩu của bạn"
                />
                <span 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
              <div className="forgot-password">
                <a href="/forgot-password">Quên mật khẩu?</a>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
          
          <div className="auth-divider">Hoặc đăng nhập bằng</div>
          
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
            Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>
          
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
    </div>
  );
};

export default Login;
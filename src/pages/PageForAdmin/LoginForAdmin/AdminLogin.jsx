import React, { useContext } from "react";
import { Button, Form, Input, Typography, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../components/auth/AuthProvider";
import { login } from '../../../api/authApi';
import styles from "../../../styles/AdminLogin.module.css";

const { Title } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth } = useContext(AuthContext);

  const handleLogin = async (values) => {
    try {
      const accountType = 'admin';
      const response = await login(accountType, values);
      
      console.log('Raw response:', response); // Debug log

      if (!response || !response.token) {
        throw new Error('Token không hợp lệ');
      }

      const userData = {
        email: response.email || values.email,
        fullName: 'Admin',
        token: response.token
      };

      localStorage.setItem('admin_token', response.token);
      
      await setAuth(userData, response.token, 'admin');
      
      message.success('Đăng nhập thành công!');
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div 
      className={styles["login-container"]} 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        padding: '20px'
      }}
    >
      <Card 
        className={`${styles["login-card"]}`} 
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <Title level={2} style={{ color: "rgb(0, 128, 0)", textAlign: 'center', marginBottom: '20px' }}>
            Đăng nhập Admin
          </Title>
          <p style={{ color: "rgba(0, 0, 0, 0.6)", textAlign: 'center', fontSize: '16px' }}>
            Xin Chào Quản Trị Viên! Vui lòng đăng nhập tài khoản
          </p>
        </div>
        <Form 
          name="admin_login" 
          onFinish={handleLogin} 
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "text", message: "Định dạng Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ marginRight: '8px' }} />}
              placeholder="Email"
              style={{ borderRadius: 8, height: '45px', fontSize: '16px' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ marginRight: '8px' }} />}
              placeholder="Password"
              style={{ borderRadius: 8, height: '45px', fontSize: '16px' }}
            />
          </Form.Item>
          <Form.Item style={{ marginTop: 30 }}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.btn}
              style={{
                width: "100%",
                borderRadius: 8,
                background: "rgb(0, 128, 0)",
                border: "none",
                height: '45px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
import React from 'react';
import SearchBar from './SearchBar';
import { Typography, Space, Carousel, Tag, Row, Col, Button } from 'antd';
import { 
  FireOutlined, 
  JavaOutlined,
  WindowsOutlined,
  BugOutlined,
  CodeOutlined,
  FundOutlined,
  NodeIndexOutlined,
  CrownOutlined,
  ApartmentOutlined,
  CloudOutlined,
  ApiOutlined,
  DatabaseOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  DotChartOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const trends = [
  // Slide 1
  [
    { name: 'Java', icon: <JavaOutlined />, color: '#ff6b6b' },
    { name: 'ReactJS', icon: <ApartmentOutlined />, color: '#4ecdc4' },
    { name: '.NET', icon: <WindowsOutlined />, color: '#45b7d1' },
    { name: 'Tester', icon: <BugOutlined />, color: '#96ceb4' },
    { name: 'PHP', icon: <CodeOutlined />, color: '#ff7f50' },
    { name: 'Business Analyst', icon: <FundOutlined />, color: '#4fb0c6' },
    { name: 'NodeJS', icon: <NodeIndexOutlined />, color: '#2ecc71' },
    { name: 'Manager', icon: <CrownOutlined />, color: '#f1c40f' },
    { name: 'NextJS', icon: <NodeIndexOutlined />, color: '#2ecc71' },
    { name: 'Python', icon: <NodeIndexOutlined />, color: '#2ecc71' },
  ],
  // Slide 2
  [
    { name: 'AWS Cloud', icon: <CloudOutlined />, color: '#ff9f43' },
    { name: 'API Developer', icon: <ApiOutlined />, color: '#ee5253' },
    { name: 'SQL Database', icon: <DatabaseOutlined />, color: '#0abde3' },
    { name: 'AI Engineer', icon: <RobotOutlined />, color: '#8e44ad' },
    { name: 'Security Expert', icon: <SafetyCertificateOutlined />, color: '#27ae60' },
    { name: 'Mobile Dev', icon: <MobileOutlined />, color: '#d35400' },
    { name: 'Data Science', icon: <DotChartOutlined />, color: '#3498db' },
    { name: 'DevOps', icon: <CloudOutlined />, color: '#e056fd' }
  ]
];

const Hero = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #004d40 0%, #00a651 100%)',
        padding: '50px 0 70px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        zIndex: 1
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title
            level={1}
            style={{
              color: '#fff',
              fontSize: '3.8rem',
              lineHeight: '1.2',
              fontWeight: '800',
              margin: 0,
              textShadow: '0 2px 15px rgba(0,0,0,0.3)',
              background: 'linear-gradient(to right, #ffffff, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'titleAnimation 1.5s ease-out'
            }}
          >
            Tìm việc làm mơ ước của bạn
          </Title>
          
          <div style={{
            display: 'inline-block',
            margin: '15px auto 0',
            backgroundColor: 'rgba(0, 40, 20, 0.7)',
            padding: '5px 20px',
            borderRadius: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.15)',
            animation: 'fadeInUp 1s ease-out 0.5s both'
          }}>
          </div>
        </div>

        {/* Search Bar Section */}
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto 50px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
          borderRadius: '12px',
          animation: 'fadeIn 1s ease-out 0.8s both',
          transform: 'translateY(-5px)'
        }}>
          <SearchBar />
        </div>

        {/* Main Content Section */}
        <Row gutter={[40, 40]} align="middle">
          {/* Info Column */}
          <Col xs={24} lg={10}>
            <div style={{ animation: 'slideInLeft 1s ease-out both' }}>
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.15)',
                padding: '30px',
                borderRadius: '15px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <Text style={{
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  color: '#fff',
                  display: 'block',
                  marginBottom: '25px',
                  textShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  lineHeight: 1.4
                }}>
                  Hơn <span style={{ 
                    color: '#ffd700', 
                    fontWeight: '700',
                    fontSize: '2rem'
                  }}>10,000</span> việc làm đang chờ đợi bạn
                </Text>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  <Tag style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <CheckCircleOutlined style={{ 
                      color: '#ffd700', 
                      marginRight: '12px',
                      fontSize: '20px' 
                    }} />
                    <span style={{ fontWeight: '500' }}>Việc làm chất lượng cao</span>
                  </Tag>
                  <Tag style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <SafetyOutlined style={{ 
                      color: '#ffd700', 
                      marginRight: '12px',
                      fontSize: '20px' 
                    }} />
                    <span style={{ fontWeight: '500' }}>Uy tín & Bảo mật thông tin</span>
                  </Tag>
                  <Tag style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <ThunderboltOutlined style={{ 
                      color: '#ffd700', 
                      marginRight: '12px',
                      fontSize: '20px' 
                    }} />
                    <span style={{ fontWeight: '500' }}>Tốc độ phản hồi nhanh chóng</span>
                  </Tag>
                </div>
              </div>
            </div>
          </Col>

          {/* Banner Image */}
          <Col xs={24} lg={14}>
            <div style={{ 
              animation: 'slideInRight 1s ease-out both',
              position: 'relative',
              height: '350px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              {/* Main Image */}
              <img 
                src="https://asset.cloudinary.com/dfoogsgjf/a2daf6433762a8e9bac7c37fe5da7324" 
                alt="Job Opportunities" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.5s ease-in-out',
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              
              {/* Overlay Gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
                zIndex: 2
              }} />
              
              {/* Optional: Badge or Action Button */}
              <div style={{
                position: 'absolute',
                bottom: '25px',
                right: '25px',
                zIndex: 3
              }}>
                <Button
                  size="large"
                  style={{
                    backgroundColor: '#ffd700',
                    color: '#004d40',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '0 25px',
                    height: '44px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  Ứng tuyển ngay
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Xu hướng tuyển dụng */}
        <div style={{ 
          marginTop: '60px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
          animation: 'fadeInUp 1s ease-out 1.2s both'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '25px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '15px'
          }}>
            <FireOutlined style={{ 
              fontSize: '28px', 
              color: '#ffd700'
            }} />
            <Text style={{
              fontSize: '22px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#fff',
              letterSpacing: '1px',
              margin: 0
            }}>
              Xu hướng tuyển dụng nổi bật
            </Text>
          </div>

          <Carousel 
            autoplay 
            autoplaySpeed={2000}
            dots={true}
            dotPosition="bottom"
            style={{ marginBottom: '10px' }}
            effect="fade"
          >
            {trends.map((slideItems, slideIndex) => (
              <div key={slideIndex}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '15px',
                  padding: '15px 0'
                }}>
                  {slideItems.map((trend) => (
                    <div
                      key={trend.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 25px',
                        background: `linear-gradient(135deg, ${trend.color}60 0%, ${trend.color}30 100%)`,
                        borderRadius: '30px',
                        border: `1px solid ${trend.color}90`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = `0 8px 20px ${trend.color}50`;
                        e.currentTarget.style.background = `linear-gradient(135deg, ${trend.color}70 0%, ${trend.color}40 100%)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
                        e.currentTarget.style.background = `linear-gradient(135deg, ${trend.color}60 0%, ${trend.color}30 100%)`;
                      }}
                    >
                      <span style={{ 
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        {trend.icon}
                        {trend.name}
                      </span>
                      
                      {/* Hiệu ứng shine */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shine 3s infinite linear',
                        zIndex: 1
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          .ant-carousel .slick-dots li button {
            background: rgba(255, 255, 255, 0.3);
            height: 8px;
            width: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .ant-carousel .slick-dots li.slick-active button {
            background: #ffd700;
            width: 24px;
            border-radius: 4px;
          }

          @keyframes shine {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(100%);
            }
          }

          @keyframes titleAnimation {
            0% {
              opacity: 0;
              transform: translateY(-20px);
              letter-spacing: -5px;
            }
            100% {
              opacity: 1;
              transform: translateY(0);
              letter-spacing: normal;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Hero;
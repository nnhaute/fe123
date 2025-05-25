import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { List, Typography, Space, Breadcrumb, Select, Pagination, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { getCandidateProfileByEmail, getSavedJobs, unsaveJob, saveJob } from '../../../api/candidateApi';
import { AuthContext } from '../../../components/auth/AuthProvider';

const { Text } = Typography;
const { Option } = Select;

const ListJobs = ({ jobs, loading, totalJobs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('Mới nhất');
  const pageSize = 10;
  const [provinces, setProvinces] = useState([]);
  const [sortedJobs, setSortedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    let sorted = [...jobs];
    switch (sortOption) {
      case 'Mới nhất':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'Nổi bật nhất':
        sorted.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'Lương cao nhất':
        sorted.sort((a, b) => b.salary - a.salary);
        break;
      default:
        sorted = [...jobs];
    }
    setSortedJobs(sorted);
  }, [jobs, sortOption]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.email) {
        try {
          const data = await getCandidateProfileByEmail(user.email);
          setProfile(data);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin profile:', error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (profile?.id) {
        try {
          const data = await getSavedJobs(profile.id);
          setSavedJobs(data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách việc làm đã lưu:', error);
        }
      }
    };
    fetchSavedJobs();
  }, [profile]);

  const getLocationName = (locationCode) => {
    const province = provinces.find(p => String(p.code) === String(locationCode));
    return province ? province.name : locationCode;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
  };

  const handleSaveJob = async (job) => {
    if (!user || !profile) {
      message.warning('Vui lòng đăng nhập để lưu công việc');
      navigate('/login');
      return;
    }

    try {
      if (!isJobSaved(job.id)) {
        await saveJob(profile.id, job.id);
        setSavedJobs([...savedJobs, job]);
        message.success('Đã lưu công việc thành công');
      } else {
        await unsaveJob(profile.id, job.id);
        setSavedJobs(savedJobs.filter(savedJob => savedJob.id !== job.id));
        message.success('Đã hủy lưu công việc');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thực hiện thao tác');
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(savedJob => savedJob.id === jobId);
  };

  const paginatedJobs = sortedJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const calculateDaysPosted = (createdDate) => {
    const now = new Date();
    const created = new Date(createdDate);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    return `${diffDays} ngày trước`;
  };

  // CSS cho background gradient phù hợp với website
  const titleBackgroundStyle = {
    background: 'linear-gradient(to right, #006400, #00a000)',
    borderRadius: '8px',
    padding: '20px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 128, 0, 0.1)'
  };

  // CSS cho họa tiết trang trí
  const patternStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    opacity: 0.15,
    pointerEvents: 'none'
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Title với background gradient phù hợp với website */}
      <div style={titleBackgroundStyle}>
        {/* Pattern trang trí */}
        <div style={patternStyle}>
          {/* Họa tiết tương tự như trên website */}
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '5%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '3px dotted rgba(255, 255, 255, 0.5)'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '15%',
            width: '300px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.4)',
            transform: 'rotate(45deg)'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            width: '250px',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
            transform: 'rotate(45deg)'
          }}></div>
          {/* Dots pattern */}
          {Array(30).fill().map((_, i) => (
            <div 
              key={i} 
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                right: `${Math.random() * 50}%`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.5)'
              }}
            ></div>
          ))}
        </div>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#ffffff', fontWeight: '500', textDecoration: 'none' }}>
            Trang Chủ
          </Link>
          <span style={{ margin: '0 8px', color: 'rgba(255, 255, 255, 0.7)' }}>/</span>
          <span style={{ color: '#ffffff', fontWeight: '500' }}>
            Tuyển dụng
          </span>
        </div>
        
        {/* Tiêu đề */}
        <h2 style={{ margin: '10px 0 0', fontWeight: 'bold', color: 'white', position: 'relative', zIndex: 2 }}>
          Tuyển dụng <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{totalJobs}</span> việc làm mới nhất
          năm <span style={{ color: '#ffffff', fontWeight: 'bold' }}>2025</span>
        </h2>
      </div>

      {/* Sắp xếp và số lượng việc làm */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{jobs.length}</span> việc làm
        </div>
        <div>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            style={{ width: 200 }}
            size="large"
          >
            <Option value="Mới nhất">Mới nhất</Option>
            <Option value="Nổi bật nhất">Nổi bật nhất</Option>
            <Option value="Lương cao nhất">Lương cao nhất</Option>
          </Select>
        </div>
      </div>

      {/* Job List */}
      <List
        dataSource={paginatedJobs}
        renderItem={(job) => (
          <Link
            to={`/jobDetail/${job.id}`}
            style={{
              textDecoration: 'none',
              display: 'block',
              marginBottom: '15px',
            }}
          >
            <Card
              hoverable
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Job Thumbnail */}
                <img
                  src={job.companyLogo}
                  alt={job.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '5px',
                    objectFit: 'cover',
                    marginRight: '15px',
                  }}
                />
                {/* Job Info */}
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#333', textAlign: 'left' }}>
                    {job.title}
                  </h3>
                  <h4 style={{ 
                    margin: '5px 0', 
                    color: '#666', 
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    {job.companyName}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    {/* Salary & Location */}
                    <Space size="small">
                      <Text style={{ color: '#008000', fontWeight: 'bold' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary)}
                      </Text>
                      <Text type="secondary">|</Text>
                      <Text type="secondary">
                        {getLocationName(job.location)}
                      </Text>
                      <Text type="secondary">|</Text>
                      <Text type="secondary">
                        {calculateDaysPosted(job.createdDate)}
                      </Text>
                    </Space>
                    {/* Save Button */}
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#008000', cursor: 'pointer' }} 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveJob(job);
                      }}
                    >
                      <i className={isJobSaved(job.id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                      <span>{isJobSaved(job.id) ? "Hủy lưu" : "Lưu"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}
      />

      {/* Pagination - Chỉ hiện khi có nhiều hơn 10 jobs */}
      {sortedJobs.length > pageSize && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={jobs.length}
          onChange={handlePageChange}
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} việc làm`}
          style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            alignItems: 'center', 
            justifyContent: 'end'
          }}
        />
      )}
    </div>
  );
};

export default ListJobs;
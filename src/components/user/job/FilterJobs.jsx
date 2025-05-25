import React, { useState, useEffect } from 'react';
import { Select, Button, Typography, Popconfirm, Space, Input, Row, Col, Card, Divider, Badge, Tag } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  BookOutlined,
  FilterOutlined,
  CalendarOutlined,
  ToolOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import { getAllIndustries } from '../../../api/industryApi';
import { getAllProfessions } from '../../../api/professionApi';
import PropTypes from 'prop-types';

const { Option } = Select;
const { Title } = Typography;

const FilterJobs = ({ onFiltersChange }) => {
  const location = useLocation();
  const selectedLocation = location.state?.selectedLocation;
  
  const [filters, setFilters] = useState({
    searchText: '',
    industry: undefined,
    profession: undefined,
    level: undefined,
    experience: undefined,
    salary: undefined,
    education: undefined,
    jobType: undefined,
    postedDate: undefined,
    location: selectedLocation || undefined,
  });

  const [provinces, setProvinces] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const activeFilterCount = Object.values(filters).filter(value => value !== undefined && value !== '').length;

  useEffect(() => {
    if (selectedLocation) {
      setFilters(prev => ({
        ...prev,
        location: selectedLocation
      }));
    }
  }, [selectedLocation]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [provincesData, industriesData, professionsData] = await Promise.all([
          axios.get('https://provinces.open-api.vn/api/p/'),
          getAllIndustries(),
          getAllProfessions()
        ]);
        
        setProvinces(provincesData.data);
        setIndustries(industriesData);
        setProfessions(professionsData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetAllFilters = () => {
    setFilters({
      searchText: '',
      industry: undefined,
      profession: undefined,
      level: undefined,
      experience: undefined,
      salary: undefined,
      education: undefined,
      jobType: undefined,
      postedDate: undefined,
      location: undefined,
    });
  };

  useEffect(() => {
    if (typeof onFiltersChange === 'function') {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const levelOptions = [
    { value: 'INTERN', label: 'Thực tập sinh' },
    { value: 'JUNIOR', label: 'Nhân viên' },
    { value: 'SENIOR', label: 'Trưởng phòng' },
    { value: 'MANAGER', label: 'Quản lý' },
    { value: 'DIRECTOR', label: 'Giám đốc' }
  ];

  const experienceOptions = [
    { value: 'LESS_THAN_1_YEAR', label: 'Dưới 1 năm' },
    { value: 'ONE_TO_THREE_YEARS', label: '1-3 năm' },
    { value: 'THREE_TO_FIVE_YEARS', label: '3-5 năm' },
    { value: 'FIVE_TO_TEN_YEARS', label: '5-10 năm' },
    { value: 'MORE_THAN_10_YEARS', label: 'Trên 10 năm' }
  ];

  const salaryOptions = [
    { value: 5000000, label: 'Dưới 5 triệu' },
    { value: 10000000, label: '5-10 triệu' },
    { value: 20000000, label: '10-20 triệu' },
    { value: 50000000, label: 'Trên 20 triệu' }
  ];

  const educationOptions = [
    { value: 'HIGH_SCHOOL', label: 'THPT' },
    { value: 'COLLEGE', label: 'Cao đẳng' },
    { value: 'UNIVERSITY', label: 'Đại học' },
    { value: 'MASTER', label: 'Thạc sĩ' },
    { value: 'DOCTOR', label: 'Tiến sĩ' }
  ];

  const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Toàn thời gian' },
    { value: 'PART_TIME', label: 'Bán thời gian' },
    { value: 'SEASONAL', label: 'Thời vụ' }
  ];

  const postedDateOptions = [
    { value: 'today', label: 'Hôm nay' },
    { value: '3days', label: '3 ngày' },
    { value: '1week', label: '1 tuần' },
    { value: '2weeks', label: '2 tuần' },
    { value: '1month', label: '1 tháng' }
  ];

  const mintGreenBackground = '#e6f7e9';
  const greenPrimaryColor = '#008000';
  
  // Updated inputStyle with smaller font size
  const inputStyle = {
    height: 35,
    borderRadius: 8,
    fontSize: 14, // Reduced font size for input and select elements
  };

  // Custom styles for placeholders to reduce font size
  const placeholderStyle = {
    fontSize: 16, // Reduced font size for placeholders
    color: '#999',
  };

  // Custom styles for the button text
  const buttonTextStyle = {
    fontSize: 16, // Reduced font size for button text
  };

  return (
    <div style={{ 
      background: greenPrimaryColor,
      padding: '25px 20px',
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Card
        style={{
          borderRadius: 14,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          background: '#e6f7e9',
          border: 'none',
        }}
        bodyStyle={{ padding: '20px 20px' }}
      >
        <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 16 }}>
          <Col xs={24} md={24} lg={8}>
            <Input
              placeholder="Tìm kiếm cơ hội việc làm"
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              prefix={<SearchOutlined style={{ color: greenPrimaryColor }} />}
              style={{
                ...inputStyle,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }}
              size="large"
              className="custom-input" // Add a class for custom styling
            />
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Select
              placeholder={<span style={placeholderStyle}><AppstoreOutlined /> Nghề nghiệp</span>}
              value={filters.profession}
              onChange={(value) => handleFilterChange('profession', value)}
              style={{ width: '100%', ...inputStyle }}
              loading={loading}
              allowClear
              size="large"
              dropdownStyle={{ borderRadius: 8 }}
            >
              {professions.map((profession) => (
                <Option key={profession.id} value={profession.name}>
                  {profession.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Select
              placeholder={<span style={placeholderStyle}><EnvironmentOutlined /> Địa điểm</span>}
              value={filters.location}
              onChange={(value) => handleFilterChange('location', value)}
              style={{ width: '100%', ...inputStyle }}
              loading={loading}
              allowClear
              size="large"
              dropdownStyle={{ borderRadius: 8 }}
            >
              {provinces.map((province) => (
                <Option key={province.code} value={province.name}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Badge count={activeFilterCount > 0 ? activeFilterCount : 0} offset={[-10, 0]}>
              <Button 
                type="primary" 
                style={{ 
                  width: '100%', 
                  ...inputStyle, 
                  backgroundColor: greenPrimaryColor,
                  borderColor: greenPrimaryColor,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...buttonTextStyle, // Apply smaller font size to button text
                }}
                size="large"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                icon={showAdvancedFilters ? <CaretUpOutlined /> : <CaretDownOutlined />}
              >
                {showAdvancedFilters ? "Ẩn bộ lọc" : "Bộ lọc nâng cao"}
              </Button>
            </Badge>
          </Col>
        </Row>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Space wrap size="small">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'searchText') return null;
                
                let displayText = value;
                let options;
                
                switch (key) {
                  case 'level':
                    options = levelOptions;
                    break;
                  case 'experience':
                    options = experienceOptions;
                    break;
                  case 'salary':
                    options = salaryOptions;
                    break;
                  case 'education':
                    options = educationOptions;
                    break;
                  case 'jobType':
                    options = jobTypeOptions;
                    break;
                  case 'postedDate':
                    options = postedDateOptions;
                    break;
                  default:
                    options = null;
                }
                
                if (options) {
                  const option = options.find(opt => opt.value === value);
                  if (option) displayText = option.label;
                }
                
                return (
                  <Tag 
                    key={key}
                    closable
                    onClose={() => handleFilterChange(key, undefined)}
                    style={{ 
                      borderRadius: 16, 
                      padding: '4px 12px',
                      backgroundColor: '#f0f8f0',
                      borderColor: '#d0e8d0',
                      color: '#006600',
                      fontSize: 12, // Smaller font size for tags
                    }}
                  >
                    {displayText}
                  </Tag>
                );
              })}
              
              {activeFilterCount > 0 && (
                <Button 
                  type="link" 
                  size="small" 
                  onClick={resetAllFilters}
                  style={{ color: '#ff4d4f', fontSize: 12 }} // Smaller font size for reset button
                >
                  Xóa tất cả
                </Button>
              )}
            </Space>
          </div>
        )}

        {/* Advanced Filters Section */}
        {showAdvancedFilters && (
          <>
            <Divider style={{ margin: '16px 0', borderColor: '#eaeaea' }} />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <AppstoreOutlined /> Ngành nghề
                </div>
                <Select
                  value={filters.industry}
                  onChange={(value) => handleFilterChange('industry', value)}
                  style={{ width: '100%', fontSize: 14 }} // Smaller font size
                  loading={loading}
                  allowClear
                  placeholder="Chọn ngành nghề"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {industries.map((industry) => (
                    <Option key={industry.id} value={industry.name}>
                      {industry.name}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <ToolOutlined /> Cấp bậc
                </div>
                <Select
                  value={filters.level}
                  onChange={(value) => handleFilterChange('level', value)}
                  style={{ width: '100%', fontSize: 14 }}
                  allowClear
                  placeholder="Chọn cấp bậc"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {levelOptions.map((level) => (
                    <Option key={level.value} value={level.value}>
                      {level.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <ClockCircleOutlined /> Kinh nghiệm
                </div>
                <Select
                  value={filters.experience}
                  onChange={(value) => handleFilterChange('experience', value)}
                  style={{ width: '100%', fontSize: 14 }}
                  allowClear
                  placeholder="Chọn kinh nghiệm"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {experienceOptions.map((exp) => (
                    <Option key={exp.value} value={exp.value}>
                      {exp.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <DollarOutlined /> Mức lương
                </div>
                <Select
                  value={filters.salary}
                  onChange={(value) => handleFilterChange('salary', value)}
                  style={{ width: '100%', fontSize: 14 }}
                  allowClear
                  placeholder="Chọn mức lương"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {salaryOptions.map((salary) => (
                    <Option key={salary.value} value={salary.value}>
                      {salary.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <BookOutlined /> Học vấn
                </div>
                <Select
                  value={filters.education}
                  onChange={(value) => handleFilterChange('education', value)}
                  style={{ width: '100%', fontSize: 14 }}
                  allowClear
                  placeholder="Chọn học vấn"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {educationOptions.map((edu) => (
                    <Option key={edu.value} value={edu.value}>
                      {edu.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <FilterOutlined /> Loại công việc
                </div>
                <Select
                  value={filters.jobType}
                  onChange={(value) => handleFilterChange('jobType', value)}
                  style={{ width: '100%', fontSize: 14 }}
                  allowClear
                  placeholder="Chọn loại việc làm"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {jobTypeOptions.map((type) => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <CalendarOutlined /> Đăng trong
                </div>
                <Select
                  value={filters.postedDate}
                  onChange={(value) => handleFilterChange('postedDate', value)}
                  style={{ width: '100%', fontSize: 14 }}
                  allowClear
                  placeholder="Chọn thời gian"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {postedDateOptions.map((date) => (
                    <Option key={date.value} value={date.value}>
                      {date.label}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={4}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <CloseCircleOutlined /> Đặt lại
                </div>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa tất cả bộ lọc không?"
                  onConfirm={resetAllFilters}
                  okText="Có"
                  cancelText="Không"
                  okButtonProps={{ style: { backgroundColor: greenPrimaryColor, borderColor: greenPrimaryColor } }}
                >
                  <Button
                    danger
                    style={{ width: '100%', borderRadius: 6, fontSize: 14 }} // Smaller font size for reset button
                  >
                    Xóa bộ lọc
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </div>
  );
};

FilterJobs.propTypes = {
  onFiltersChange: PropTypes.func.isRequired
};

export default FilterJobs;
import React, { useEffect, useState } from 'react';
import { Select, Button, Input, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const SearchBar = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleSearch = () => {
    navigate('/jobs', { 
      state: { selectedLocation, searchTerm } 
    });
  };

  const handleAdvancedFilter = () => {
    // Sử dụng lại đường dẫn '/jobs' như trong mã gốc
    navigate('/jobs', { 
      state: { selectedLocation, searchTerm, isAdvanced: true } 
    });
  };

  const buttonStyle = {
    height: '45px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    transition: 'all 0.3s ease',
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #f9f9f9, #ffffff)',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        maxWidth: '1200px',
        margin: '20px auto',
      }}
    >
      <Row gutter={[16, 16]} justify="space-between" align="middle" wrap={false}>
        {/* Ô tìm kiếm */}
        <Col flex="1 1 200px">
          <Input
            size="large"
            placeholder="Tìm kiếm việc làm, vị trí, công ty..."
            prefix={<SearchOutlined style={{ color: '#008000' }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{
              borderRadius: '8px',
              height: '45px',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          />
        </Col>

        {/* Lọc theo tỉnh thành */}
        <Col flex="0 0 200px">
          <Select
            size="large"
            placeholder="Chọn địa điểm"
            value={selectedLocation}
            onChange={(value) => setSelectedLocation(value)}
            style={{
              width: '100%',
              height: '45px',
            }}
            loading={loading}
            allowClear
            suffixIcon={<EnvironmentOutlined style={{ color: '#008000' }} />}
            dropdownStyle={{ borderRadius: '8px' }}
          >
            {provinces.map((province) => (
              <Option 
                key={province.code} 
                value={province.name}
                style={{ padding: '8px 12px' }}
              >
                {province.name}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Nút tìm kiếm */}
        <Col flex="0 0 120px">
          <Button
            type="primary"
            onClick={handleSearch}
            size="large"
            icon={<SearchOutlined />}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #008000 0%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 128, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 128, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 128, 0, 0.2)';
            }}
          >
            Tìm kiếm
          </Button>
        </Col>

        {/* Nút lọc nâng cao - ĐÃ SỬA */}
        <Col flex="0 0 150px">
          <Button
            onClick={handleAdvancedFilter}
            size="large"
            icon={<FilterOutlined />}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #008000 0%)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 128, 0, 0.2)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 128, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 128, 0, 0.2)';
            }}
          >
            Lọc nâng cao
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchBar;
import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const CVFilter = ({ onFilter }) => {
  const [filters, setFilters] = React.useState({
    searchText: '',
    status: 'all'
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newFilters = {
      ...filters,
      searchText: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleStatusChange = (value) => {
    const newFilters = {
      ...filters,
      status: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Space size="middle" style={{ marginBottom: 16 }}>
      <Input
        placeholder="Tìm kiếm theo tên ứng viên"
        allowClear
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        style={{ width: 300 }}
        value={filters.searchText}
        onChange={handleSearchChange}
      />
    </Space>
  );
};

export default CVFilter; 
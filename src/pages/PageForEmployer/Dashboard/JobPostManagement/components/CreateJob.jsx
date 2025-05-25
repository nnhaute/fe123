import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button, 
  message, 
  Modal,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  Switch,
  Statistic,
  Space,
  Radio
} from 'antd';
import { 
  PushpinOutlined,
  FileAddOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { createJob, getJobLimits } from '../../../../../api/jobApi';
import { getAllIndustries } from '../../../../../api/industryApi';
import { getAllProfessions } from '../../../../../api/professionApi';
import { getEmployerByEmail } from "../../../../../api/employerApi";
import JobSkillForm from './JobSkillForm';
import dayjs from 'dayjs';
import { createJobQuestion, createJobAnswer } from '../../../../../api/jobQuestionApi';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const PROVINCE_API_URL = 'https://provinces.open-api.vn/api';

const CreateJob = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdJobId, setCreatedJobId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [jobLimits, setJobLimits] = useState({
    normalJobRemaining: 0,
    featuredJobRemaining: 0
  });
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    title: '',
    options: [''],
    correctAnswer: 0
  });

  useEffect(() => {
    const fetchJobLimits = async () => {
      try {
        const employerUser = JSON.parse(localStorage.getItem("employer_user"));
        if (employerUser) {
          const limits = await getJobLimits(employerUser.id);
          setJobLimits(limits);
        }
      } catch (error) {
        console.error('Error fetching job limits:', error);
      }
    };
    fetchJobLimits();
  }, []);

  // Load danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${PROVINCE_API_URL}/p/`);
        const data = await response.json();
        const formattedData = data.map(province => ({
          id: province.code,
          name: province.name,
          code: province.code
        }));
        setProvinces(formattedData);
      } catch (error) {
        message.error('Lỗi khi tải danh sách tỉnh/thành phố');
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await getAllIndustries();
        setIndustries(data);
      } catch (error) {
        message.error('Lỗi khi tải danh sách ngành nghề');
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchProfessions = async () => {
      if (!selectedIndustryId) {
        setProfessions([]);
        return;
      }
      try {
        const data = await getAllProfessions();
        const selectedIndustry = industries.find(ind => ind.id === selectedIndustryId);
        
        const filteredProfessions = data.filter(
          profession => profession.industryName === selectedIndustry?.name
        );
        setProfessions(filteredProfessions);
      } catch (error) {
        console.error('Error fetching professions:', error);
        message.error('Lỗi khi tải danh sách chuyên ngành');
      }
    };
    fetchProfessions();
  }, [selectedIndustryId, industries]);

  const handleIndustryChange = (value) => {
    console.log('Selected Industry ID changed to:', value);
    setSelectedIndustryId(value);
    form.setFieldValue('professionId', undefined);
  };

  const handlePinChange = (checked) => {
    if (checked && jobLimits.featuredJobRemaining <= 0) {
      message.error('Bạn đã hết lượt ghim tin tuyển dụng ! Vui lòng đăng ký hoặc gia hạn Gói dịch vụ');
      return;
    }
    setIsPinned(checked);
    form.setFieldValue('isPinned', checked);
  };

  const handleSubmit = async (values) => {
    if (jobLimits.normalJobRemaining <= 0) {
      message.error('Bạn đã hết lượt đăng tin tuyển dụng ! Vui lòng đăng ký hoặc gia hạn Gói dịch vụ');
      return;
    }

    try {
      setLoading(true);
      const employerUser = localStorage.getItem("employer_user");
      if (!employerUser) {
        message.error("Vui lòng đăng nhập lại");
        return;
      }

      const userData = JSON.parse(employerUser);
      const employerData = await getEmployerByEmail(userData.email);
      
      if (!employerData?.id) {
        message.error("Không tìm thấy thông tin nhà tuyển dụng");
        return;
      }

      const formattedValues = {
        ...values,
        expiryDate: dayjs(values.expiryDate).format('YYYY-MM-DD'),
        employerId: employerData.id,
        isFeatured: values.isPinned || false
      };

      // Tạo job
      const response = await createJob(formattedValues);
      const jobId = response.id;

      // Nếu có câu hỏi, tạo các câu hỏi và câu trả lời
      if (testQuestions.length > 0) {
        for (const question of testQuestions) {
          // Tạo câu hỏi
          const questionResponse = await createJobQuestion({
            jobCode: jobId,
            questionText: question.title
          });

          // Tạo các câu trả lời cho câu hỏi
          for (let i = 0; i < question.options.length; i++) {
            await createJobAnswer({
              questionId: questionResponse.id,
              answerText: question.options[i],
              isCorrect: i === question.correctAnswer
            });
          }
        }
      }

      message.success('Tạo tin tuyển dụng và bài kiểm tra thành công');
      setCreatedJobId(jobId);
      setCurrentStep(1);
      
      // Cập nhật lại job limits
      const newLimits = await getJobLimits(employerData.id);
      setJobLimits(newLimits);
    } catch (error) {
      console.error('Error details:', error);
      message.error('Lỗi khi tạo tin tuyển dụng: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi thêm thành công
  const handleSkillsSuccess = () => {
    form.resetFields();
    setCreatedJobId(null);
    setCurrentStep(0);
    onSuccess?.();
    onClose();
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  };

  const parseCurrency = (value) => {
    return value.replace(/\$\s?|(,*)/g, '').replace(' VNĐ', '');
  };

  // Thêm câu hỏi mới
  const addQuestion = () => {
    if (!currentQuestion.title.trim()) {
      message.warning('Vui lòng nhập câu hỏi');
      return;
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      message.warning('Vui lòng điền đầy đủ các lựa chọn');
      return;
    }

    setTestQuestions([...testQuestions, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      title: '',
      options: [''],
      correctAnswer: 0
    });
  };

  // Xóa câu hỏi
  const deleteQuestion = (id) => {
    setTestQuestions(testQuestions.filter(q => q.id !== id));
  };

  // Thêm lựa chọn mới
  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  // Cập nhật lựa chọn
  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  // Xóa lựa chọn
  const removeOption = (index) => {
    if (currentQuestion.options.length <= 1) {
      message.warning('Cần ít nhất một lựa chọn');
      return;
    }
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
      correctAnswer: Math.min(currentQuestion.correctAnswer, newOptions.length - 1)
    });
  };

  // Lưu bài kiểm tra
  const handleTestSave = async () => {
    if (testQuestions.length === 0) {
      message.warning('Vui lòng thêm ít nhất một câu hỏi');
      return;
    }

    try {
      // Chuyển đổi dữ liệu theo format của backend
      const formattedQuestions = testQuestions.map(question => ({
        jobCode: createdJobId,
        questionText: question.title,
        answers: question.options.map((option, index) => ({
          answerText: option,
          isCorrect: index === question.correctAnswer
        }))
      }));

      // Gọi API lưu bài kiểm tra
      for (const question of formattedQuestions) {
        await createJobQuestion(question);
      }
      
      setIsTestModalVisible(false);
      message.success('Đã lưu bài kiểm tra');
    } catch (error) {
      console.error('Error saving test:', error);
      message.error('Lỗi khi lưu bài kiểm tra: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Tạo tin tuyển dụng mới
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <Card title="Số lượt còn lại" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Đăng tin tuyển dụng"
              value={jobLimits.normalJobRemaining}
              prefix={<FileAddOutlined />}
              valueStyle={{ 
                color: jobLimits.normalJobRemaining > 0 ? '#3f8600' : '#cf1322'
              }}
              // formatter={(value) => (value === 9999 ? 'Unlimited' : value)}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Ghim tin tuyển dụng"
              value={jobLimits.featuredJobRemaining}
              prefix={<PushpinOutlined />}
              valueStyle={{ 
                color: jobLimits.featuredJobRemaining > 0 ? '#3f8600' : '#cf1322'
              }}
              // formatter={(value) => (value === 9999 ? 'Unlimited' : value)}
            />
          </Col>
        </Row>
      </Card>

      {currentStep === 0 ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
          initialValues={{
            isPinned: false,
          }}
        >
          <Card bordered={false}>
            <Title level={4}>Thông tin cơ bản</Title>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                  <Input 
                    placeholder="VD: Tuyển Senior React Developer" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Mô tả công việc"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                  <TextArea 
                    rows={6} 
                    placeholder="Mô tả chi tiết về công việc, yêu cầu và quyền lợi..." 
                    showCount
                    maxLength={2000}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <Title level={4}>Yêu cầu công việc</Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Địa điểm làm việc"
                  rules={[{ required: true, message: 'Vui lòng chọn địa điểm' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn tỉnh/thành phố"
                    size="large"
                    optionFilterProp="children"
                  >
                    {provinces.map(province => (
                      <Option key={province.code} value={province.name}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="salary"
                  label="Mức lương"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mức lương' },
                    { 
                      pattern: /^[0-9,]*$/,
                      message: 'Chỉ được nhập số'
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    formatter={formatCurrency}
                    parser={parseCurrency}
                    min={0}
                    step={1000000}
                    placeholder="VD: 15,000,000"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="requiredJobType"
                  label="Loại công việc"
                  rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
                >
                  <Select size="large" placeholder="Chọn loại công việc">
                    <Option value="FULL_TIME">Toàn thời gian</Option>
                    <Option value="PART_TIME">Bán thời gian</Option>
                    <Option value="SEASONAL">Thời vụ</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="expiryDate"
                  label="Ngày hết hạn"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    size="large"
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày hết hạn"
                    disabledDate={(current) => {
                      return current && current < dayjs().endOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <Title level={4}>Yêu cầu ứng viên</Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="requiredJobLevel"
                  label="Cấp bậc"
                  rules={[{ required: true, message: 'Vui lòng chọn cấp bậc' }]}
                >
                  <Select size="large" placeholder="Chọn cấp bậc">
                    <Option value="INTERN">Thực tập sinh</Option>
                    <Option value="FRESHER">Fresher</Option>
                    <Option value="JUNIOR">Junior</Option>
                    <Option value="MIDDLE">Middle</Option>
                    <Option value="SENIOR">Senior</Option>
                    <Option value="LEAD">Lead</Option>
                    <Option value="MANAGER">Manager</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="requiredExperienceLevel"
                  label="Kinh nghiệm"
                  rules={[{ required: true, message: 'Vui lòng chọn yêu cầu kinh nghiệm' }]}
                >
                  <Select size="large" placeholder="Chọn yêu cầu kinh nghiệm">
                    <Option value="NO_EXPERIENCE">Không yêu cầu kinh nghiệm</Option>
                    <Option value="LESS_THAN_1_YEAR">Dưới 1 năm</Option>
                    <Option value="ONE_TO_THREE_YEARS">1-3 năm</Option>
                    <Option value="THREE_TO_FIVE_YEARS">3-5 năm</Option>
                    <Option value="FIVE_TO_TEN_YEARS">5-10 năm</Option>
                    <Option value="MORE_THAN_TEN_YEARS">Trên 10 năm</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="requiredEducationLevel"
                  label="Trình độ học vấn"
                  rules={[{ required: true, message: 'Vui lòng chọn trình độ học vấn' }]}
                >
                  <Select size="large" placeholder="Chọn trình độ học vấn">
                    <Option value="HIGH_SCHOOL">Tốt nghiệp THPT</Option>
                    <Option value="COLLEGE">Cao đẳng</Option>
                    <Option value="UNIVERSITY">Đại học</Option>
                    <Option value="POSTGRADUATE">Thạc sĩ</Option>
                    <Option value="DOCTORATE">Tiến sĩ</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="industryId"
                  label="Ngành nghề"
                  rules={[{ required: true, message: 'Vui lòng chọn ngành nghề' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn ngành nghề"
                    onChange={handleIndustryChange}
                    loading={!industries.length}
                    size="large"
                    optionFilterProp="children"
                  >
                    {industries.map(industry => (
                      <Option key={industry.id} value={industry.id}>
                        {industry.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="professionId"
                  label="Chuyên ngành"
                  rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành' }]}
                >
                  <Select
                    showSearch
                    placeholder={selectedIndustryId ? "Chọn chuyên ngành" : "Vui lòng chọn ngành nghề trước"}
                    disabled={!selectedIndustryId}
                    loading={selectedIndustryId && !professions.length}
                    size="large"
                    optionFilterProp="children"
                  >
                    {professions.map(profession => (
                      <Option key={profession.id} value={profession.id}>
                        {profession.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span>
                  <FileAddOutlined /> Tạo bài kiểm tra
                </span>
              }
              tooltip="Tạo bài kiểm tra cho ứng viên khi ứng tuyển"
            >
              <Button 
                type="primary" 
                onClick={() => setIsTestModalVisible(true)}
                style={{ 
                  background: "linear-gradient(to right, #008000)",
                  border: "none"
                }}
              >
                Tạo bài kiểm tra
              </Button>
            </Form.Item>

            <Form.Item
              label={
                <span>
                  <PushpinOutlined /> Ghim tin tuyển dụng
                </span>
              }
              name="isPinned"
              valuePropName="checked"
              tooltip="Tin tuyển dụng được ghim sẽ xuất hiện ở vị trí nổi bật"
            >
              <Switch
                checkedChildren="Bật"
                unCheckedChildren="Tắt"
                checked={isPinned}
                onChange={handlePinChange}
                disabled={jobLimits.featuredJobRemaining <= 0}
              />
            </Form.Item>

            <Form.Item className="text-right">
              <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tiếp tục
              </Button>
            </Form.Item>
          </Card>
        </Form>
      ) : (
        <JobSkillForm jobId={createdJobId} onSuccess={handleSkillsSuccess} />
      )}

      {/* Modal tạo bài kiểm tra */}
      <Modal
        title={
          <div style={{ 
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px',
            marginLeft: -24,
            marginRight: -24,
            marginTop: -16,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FileAddOutlined style={{ fontSize: '24px', color: '#008000' }} />
            <Title level={3} style={{ margin: 0, color: '#008000' }}>
              Tạo bài kiểm tra
            </Title>
          </div>
        }
        open={isTestModalVisible}
        onCancel={() => setIsTestModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
        styles={{ body: { padding: '24px' } }}
      >
        <div className="p-4">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <Title level={4} style={{ margin: 0 }}>Tạo bài kiểm tra</Title>
            <div style={{ 
              background: '#f6ffed', 
              padding: '8px 16px', 
              borderRadius: '16px',
              border: '1px solid #b7eb8f'
            }}>
              <span style={{ color: '#008000' }}>
                Đã thêm {testQuestions.length} câu hỏi
              </span>
            </div>
          </div>
          
          {/* Form thêm câu hỏi mới */}
          <Card 
            className="mb-4"
            style={{ 
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span style={{ color: '#008000' }}>•</span> Câu hỏi
                </label>
                <TextArea
                  value={currentQuestion.title}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, title: e.target.value })}
                  placeholder="Nhập câu hỏi..."
                  rows={3}
                  style={{ 
                    borderRadius: '8px',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span style={{ color: '#008000' }}>•</span> Các lựa chọn
                </label>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Radio
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                        style={{ color: '#008000' }}
                      />
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Lựa chọn ${index + 1}`}
                        style={{ 
                          flex: 1,
                          borderRadius: '8px'
                        }}
                      />
                      <Button
                        type="text"
                        danger
                        onClick={() => removeOption(index)}
                        icon={<DeleteOutlined />}
                      />
                    </div>
                  ))}
                </Space>
                <Button
                  type="dashed"
                  onClick={addOption}
                  className="mt-2"
                  icon={<PlusOutlined />}
                  style={{ 
                    width: '100%',
                    borderRadius: '8px',
                    borderColor: '#008000',
                    color: '#008000'
                  }}
                >
                  Thêm lựa chọn
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  type="primary"
                  onClick={addQuestion}
                  icon={<PlusOutlined />}
                  style={{ 
                    background: "linear-gradient(to right, #008000)",
                    border: "none",
                    borderRadius: '8px',
                    padding: '0 24px',
                    height: '40px'
                  }}
                >
                  Thêm câu hỏi
                </Button>
              </div>
            </div>
          </Card>

          {/* Danh sách câu hỏi đã thêm */}
          {testQuestions.map((question, index) => (
            <Card 
              key={question.id} 
              className="mb-4"
              style={{ 
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ 
                      background: '#008000',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium" style={{ margin: 0 }}>
                      {question.title}
                    </h3>
                  </div>
                  <Radio.Group value={question.correctAnswer} disabled>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {question.options.map((option, i) => (
                        <div key={i} style={{ 
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: i === question.correctAnswer ? '#f6ffed' : 'transparent',
                          border: i === question.correctAnswer ? '1px solid #b7eb8f' : '1px solid #f0f0f0'
                        }}>
                          <Radio value={i} style={{ color: '#008000' }}>
                            {option}
                          </Radio>
                        </div>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>
                <Button
                  type="text"
                  danger
                  onClick={() => deleteQuestion(question.id)}
                  icon={<DeleteOutlined />}
                  style={{ marginLeft: '16px' }}
                />
              </div>
            </Card>
          ))}

          {/* Nút lưu bài kiểm tra */}
          {testQuestions.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                onClick={handleTestSave}
                icon={<SaveOutlined />}
                style={{ 
                  background: "linear-gradient(to right, #008000)",
                  border: "none",
                  borderRadius: '8px',
                  padding: '0 32px',
                  height: '40px'
                }}
              >
                Lưu bài kiểm tra
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </Modal>
  );
};

export default CreateJob;
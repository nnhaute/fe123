import axios from 'axios';
import { API_URL } from '../utils/config'

// Tạo câu hỏi cho job
export const createJobQuestion = async (questionDTO) => {
  try {
    const response = await axios.post(`${API_URL}/job-questions`, questionDTO);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tạo câu trả lời cho câu hỏi
export const createJobAnswer = async (answerDTO) => {
  try {
    const response = await axios.post(`${API_URL}/job-questions/answers`, answerDTO);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách câu hỏi của job
export const getJobQuestions = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/job-questions/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const classcred = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/classcred`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const lesson = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/lesson`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const lessonlist = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/lessonlist`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteLesson = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/lesson/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const userdata = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/register`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const authService = {
    register,
    login,
    classcred,
    lesson,
    lessonlist,
    deleteLesson, // Added deleteLesson function
    userdata,
};

export default authService;

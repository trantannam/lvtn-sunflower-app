import axios from "axios";

const request = axios.create({
    baseURL: 'http://192.168.1.9:8001/',
});

export default request;
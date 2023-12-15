import axios from "axios";

const request = axios.create({
    baseURL: 'http://172.20.10.14:8001/',
});

export default request;
import axios, { AxiosInstance } from "axios";
import { time } from "console";

export class RestClient {
    private client: AxiosInstance;

    constructor(url: string, timeout: number) {
        this.client = axios.create({
            baseURL: url,
            timeout,
        })
    }

    async request(method: string, path: string, params?: Record<string,string>, data?: any) {
        const response = await this.client.request({
            method,
            url: path,
            params: params ? params : null,
            data: data ? data : null
        })

        if (response.status > 204) {
            throw new Error('Response error performing request')
        }

        return response.data
    }
}
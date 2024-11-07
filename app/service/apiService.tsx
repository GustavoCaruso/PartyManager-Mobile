import axios from 'axios';

const baseURL = "http://ggustac-002-site2.htempurl.com/api";

// Instância global do axios com a baseURL
export const httpClient = axios.create({
    baseURL: baseURL
});

class ApiService {
    apiurl: string;

    constructor(apiurl: string) {
        this.apiurl = apiurl;
    }

    // Método POST para enviar dados
    post(url: string, objeto: any) {
        return httpClient.post(`${this.apiurl}${url}`, objeto);
    }

    // Método PUT para atualizar dados
    put(url: string, objeto: any) {
        return httpClient.put(`${this.apiurl}${url}`, objeto);
    }

    // Método DELETE para excluir dados
    delete(url: string) {
        return httpClient.delete(`${this.apiurl}${url}`);
    }

    // Método GET para obter dados
    get(url: string) {
        return httpClient.get(`${this.apiurl}${url}`);
    }
}

export default ApiService;


/*import axios from 'axios';

const baseURL = 'http://localhost:8080';
const httpClient = axios.create({
    baseURL: baseURL
});

const ApiService = () => {
   

    const post = (url, objeto) => {
        const requestUrl = `${url}`;
        return httpClient.post(requestUrl, objeto);
    };

    const put = (url, objeto) => {
        const requestUrl = `${url}`;
        return httpClient.put(requestUrl, objeto);
    };

    const del = (url) => {
        const requestUrl = `${url}`;
        return httpClient.delete(requestUrl);
    };

    const get = (url) => {
        const requestUrl = `${url}`;
        return httpClient.get(requestUrl);
    };

    return { post, put, del, get };
};

export default ApiService;*/
import ApiService from "./apiService"; 

class SegurancaService extends ApiService {
    constructor() {
        super('/Seguranca');  
    }

    // Método de login
    login(credenciais: { email: string, senha: string }) {
        return this.post('/login', credenciais); 
    }

    // Método de logout
    logout() {
        return this.post('/logout', {});  
    }
}

export default SegurancaService;

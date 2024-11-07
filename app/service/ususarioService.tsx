import ApiService from "./apiService";  // Certifique-se de que o caminho está correto

class UsuarioService extends ApiService {
    constructor() {
        super('/Usuario');  // Caminho base para operações de usuário
    }

    // Cadastrar novo usuário
    salvar(usuario: any) {
        return this.post('', usuario);
    }

    // Buscar todos os usuários
    buscarTodos() {
        return this.get('');
    }

    // Buscar usuário por ID
    buscarPorId(id: number) {
        return this.get(`/${id}`);
    }

    // Atualizar um usuário por ID
    atualizar(id: number, usuario: any) {
        return this.put(`/${id}`, usuario);
    }

    // Excluir um usuário por ID
    excluir(id: number) {
        return this.delete(`/${id}`);
    }
}

export default UsuarioService;

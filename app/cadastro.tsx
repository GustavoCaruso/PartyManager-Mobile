import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Modal, Button } from "react-native";
import { useRouter } from "expo-router";  
import UsuarioService from "./service/ususarioService"; 
import { useUser } from "./context/userContext";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const usuario_service = new UsuarioService();
  const router = useRouter();
  const { setUser } = useUser();

  const showModal = (message: string, type: "success" | "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const cadastrar = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
        showModal("Todos os campos são obrigatórios.", "error");
        return;
    }

    if (senha !== confirmarSenha) {
        showModal("As senhas não coincidem.", "error");
        return;
    }

    const novoUsuario = { nome, email, senha };

    try {
        const response = await usuario_service.salvar(novoUsuario);

        if (response && response.status >= 200 && response.status < 300) {
            showModal("Conta criada com sucesso!", "success");
            setUser({ nomeUsuario: nome, email: email, logado: true });
            router.push('/'); // Redireciona para a tela de login
        } else {
            showModal("Não foi possível criar a conta.", "error");
        }
    } catch (error: any) {
        if (error.response && error.response.status === 400 && error.response.data) {
            showModal(error.response.data, "error");
        } else if (error.response && error.response.status === 409) {
            showModal("Já existe um usuário com este email.", "error");
        } else {
            showModal("Erro ao se conectar à API.", "error");
        }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/party-manager-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Crie sua conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        secureTextEntry={true}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />
      <TouchableOpacity style={styles.registerButton} onPress={cadastrar}>
        <Text style={styles.registerButtonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backButtonText}>Voltar ao login</Text>
      </TouchableOpacity>

      {/* Modal para mensagens */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalMessage, modalType === "success" ? styles.successText : styles.errorText]}>
              {modalMessage}
            </Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  backButton: {
    backgroundColor: '#007BFF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  successText: {
    color: "#4CAF50",
  },
  errorText: {
    color: "#F44336",
  }
});

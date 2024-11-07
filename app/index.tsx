import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Modal, Button } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "./context/userContext";
import SegurancaService from "./service/segurancaService";

export default function Index() {
  const { setUser } = useUser();  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const seguranca_service = new SegurancaService();
  const router = useRouter();

  const showModal = (message: string, type: "success" | "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  // Função de login
  const login = async () => {
    try {
      const response = await seguranca_service.login({ email, senha });

      if (response.status === 200) {
        const { token, nomeUsuario, id } = response.data;

        setUser({
          nomeUsuario: nomeUsuario || "N/A",
          email: email || "N/A", 
          logado: true,
          id: id || 0,
          token: token || "",
        });

        showModal("Login bem-sucedido!", "success");
        setTimeout(() => {
          setModalVisible(false);
          router.push('/(tabs)/eventos');
        }, 1500);
      } else {
        showModal("Email ou senha incorretos.", "error");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        showModal("Já existe um usuário com este email.", "error");
      } else {
        console.log("Erro no login:", error.response?.data || error.message);
        showModal("Não foi possível fazer login. Verifique suas credenciais.", "error");
      }
    }
  };

  const cadastro = () => {
    router.push('/cadastro');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/party-manager-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Acesse sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.loginButton} onPress={login}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>ou</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={cadastro}>
        <Text style={styles.registerButtonText}>Cadastrar-se</Text>
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
  loginButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#007BFF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
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

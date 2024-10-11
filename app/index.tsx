import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import axios from 'axios';
import { useUser } from "./context/userContext";

export default function Index() {
  const { setUser } = useUser(); // Pegar a função setUser para salvar os dados do usuário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função de login sem validação de frontend
  const login = async () => {
    try {
      const response = await axios.post('http://ggustac-002-site2.htempurl.com/api/Seguranca/login', {
        email,
        senha
      });

      if (response.status === 200) {
        const { token, nomeUsuario, id } = response.data;

        // Atualiza o estado do usuário com as informações retornadas
        setUser({
          nomeUsuario: nomeUsuario || "N/A",
          email: email || "N/A",  // Armazena o email para usar em outras partes do app
          logado: true,
          id: id || 0,
          token: token || "",
        });

        Alert.alert("Login bem-sucedido!");
        router.push('/(tabs)/perfil');  // Redireciona para a tela de perfil
      } else {
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          // Email já existe
          Alert.alert("Erro", "Já existe um usuário com este email.");
        } else {
          console.log("Erro no login:", error.response?.data || error.message);
          Alert.alert("Erro", "Não foi possível fazer login. Verifique suas credenciais.");
        }
      } else {
        console.log("Erro desconhecido:", error);
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    }
  };

  // Função para redirecionar para a tela de cadastro
  const cadastro = () => {
    router.push('/cadastro');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/party-manager-logo.png')} style={styles.logo} />

      <Text style={styles.title}>Acesse sua conta</Text>

      {/* Campo de email */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
        autoCapitalize="none"
      />

      {/* Botão de Login */}
      <TouchableOpacity style={styles.loginButton} onPress={login}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Separador */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>ou</Text>
        <View style={styles.divider} />
      </View>

      {/* Botão de Cadastro */}
      <TouchableOpacity style={styles.registerButton} onPress={cadastro}>
        <Text style={styles.registerButtonText}>Cadastra-se</Text>
      </TouchableOpacity>
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
  }
});

import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import axios from 'axios';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Função para cadastrar um novo usuário
  const cadastrar = async () => {
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    // Bloco try/catch atualizado
    try {
      const response = await axios.post('http://ggustac-002-site2.htempurl.com/api/Usuario', {
        nome,
        email,
        senha
      });

      // Verifique se o status da resposta está entre 200 e 299
      if (response.status >= 200 && response.status < 300) {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        router.push('/'); // Redireciona para a tela de login
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Caso o erro seja do axios, podemos acessar suas propriedades
        if (error.response && error.response.status === 409) {
          Alert.alert("Erro", "Já existe um usuário com este email.");
        } else {
          Alert.alert("Erro", "Erro ao se conectar à API.");
        }
      } else {
        // Tratamento de erro genérico
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/party-manager-logo.png')} style={styles.logo} />

      <Text style={styles.title}>Crie sua conta</Text>

      {/* Campo de nome */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo de email */}
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
      />

      {/* Campo de confirmação de senha */}
      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        secureTextEntry={true}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {/* Botão de Cadastro */}
      <TouchableOpacity style={styles.registerButton} onPress={cadastrar}>
        <Text style={styles.registerButtonText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Botão para voltar ao login */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backButtonText}>Voltar ao login</Text>
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
  }
});

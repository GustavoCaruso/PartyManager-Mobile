import { Pressable, Text, View, StyleSheet, TextInput, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons'; // Ícone de olho

export default function Perfil() {
    const { user, setUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false); // Controlar a exibição da senha

    const carregarDadosUsuario = async () => {
        if (user?.id && user?.token) {
            try {
                const response = await fetch(`http://ggustac-002-site2.htempurl.com/api/usuario/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'accept': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setNomeUsuario(data.nome);
                    setEmail(data.email);
                    setSenha(data.senha);
                } else {
                    Alert.alert("Erro", "Erro ao carregar dados do usuário.");
                }
            } catch (error) {
                console.error("Erro ao carregar os dados do usuário: ", error);
            }
        } else {
            Alert.alert("Erro", "Erro: usuário não encontrado.");
        }
    };

    useEffect(() => {
        carregarDadosUsuario();
    }, []);

    const sair = () => {
        Alert.alert(
            "Tem certeza?",
            "Você realmente deseja sair do Party Manager?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim, sair",
                    onPress: () => {
                        setUser({
                            nomeUsuario: "",
                            email: "",
                            senha: "",
                            logado: false,
                            id: 0,
                            token: "",
                        });
                        router.push("/"); // Redireciona para a página inicial
                    },
                }
            ]
        );
    };

    const deletarConta = () => {
        Alert.alert(
            "Tem certeza?",
            "Sua conta será deletada permanentemente.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim, deletar",
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://ggustac-002-site2.htempurl.com/api/usuario/${user.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${user.token}`,
                                },
                            });
                            if (response.ok) {
                                Alert.alert("Conta deletada", "Sua conta foi deletada com sucesso!");
                                sair(); // Sai da conta e redireciona para a página inicial
                            } else {
                                Alert.alert("Erro", "Erro ao deletar conta.");
                            }
                        } catch (error) {
                            console.error("Erro ao deletar conta: ", error);
                        }
                    },
                }
            ]
        );
    };

    const salvarEdicao = async () => {
        if (user?.id && user?.token) {
            try {
                const response = await fetch(`http://ggustac-002-site2.htempurl.com/api/usuario/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', // Corrigir o tipo de conteúdo
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        id: user.id, // Certifique-se de que o ID está sendo passado corretamente
                        nome: nomeUsuario, // Verifique se o backend espera 'nome' ou 'Nome'
                        email: email, // Verifique se o backend espera 'email'
                        senha: senha // Verifique se o backend espera 'senha'
                    }),
                });
                
                if (response.ok) {
                    const updatedUser = await response.json();
                    setUser(updatedUser);
                    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
                    setIsEditing(false); // Voltar ao modo visualização
                } else if (response.status === 409) {
                    Alert.alert("Erro", "Este email já está em uso por outro usuário.");
                } else {
                    const errorMessage = await response.text();
                    console.error("Erro ao salvar: ", errorMessage);
                    Alert.alert("Erro", "Erro ao salvar alterações.");
                }
            } catch (error) {
                console.error("Erro ao atualizar perfil: ", error);
            }
        } else {
            Alert.alert("Erro", "Erro: usuário não encontrado.");
        }
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <Text style={styles.subTitle}>Bem-vindo</Text>

            {/* Nome de usuário */}
            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome de Usuário:</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={nomeUsuario}
                        onChangeText={setNomeUsuario}
                    />
                ) : (
                    <Text style={styles.infoValue}>{nomeUsuario || "N/A"}</Text>
                )}
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email:</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                ) : (
                    <Text style={styles.infoValue}>{email || "N/A"}</Text>
                )}
            </View>

            {/* Senha */}
            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Senha:</Text>
                <View style={styles.senhaContainer}>
                    <TextInput
                        style={styles.inputSenha}
                        value={senha}
                        secureTextEntry={!mostrarSenha}
                        editable={isEditing}
                        onChangeText={setSenha}
                    />
                    <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                        <Ionicons
                            name={mostrarSenha ? "eye-off" : "eye"}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {isEditing ? (
                <Pressable style={styles.btnPrimary} onPress={salvarEdicao}>
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                </Pressable>
            ) : (
                <Pressable style={styles.btnSecondary} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </Pressable>
            )}

            {/* Botão para sair */}
            <Pressable style={styles.btnDanger} onPress={sair}>
                <Text style={styles.buttonText}>Sair</Text>
            </Pressable>

            {/* Botão para deletar conta */}
            <Pressable style={styles.btnDanger} onPress={deletarConta}>
                <Text style={styles.buttonText}>Deletar Conta</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 15,
    },
    formLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#6c757d',
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
    },
    inputSenha: {
        backgroundColor: '#fff',
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        flex: 1,
    },
    senhaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoValue: {
        fontSize: 16,
        color: '#495057',
    },
    btnPrimary: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 4,
        marginBottom: 15,
        alignItems: 'center',
    },
    btnSecondary: {
        backgroundColor: '#6c757d',
        padding: 15,
        borderRadius: 4,
        marginBottom: 15,
        alignItems: 'center',
    },
    btnDanger: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 4,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
});

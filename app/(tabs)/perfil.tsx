import React, { useState, useEffect } from "react";
import { Pressable, Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, Modal, Button } from "react-native";
import { useUser } from "../context/userContext";
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Perfil() {
    const { user, setUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isSaveModalVisible, setIsSaveModalVisible] = useState(false); // Novo estado para confirmação de salvamento

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
        setIsModalVisible(true);
    };

    const deletarConta = () => {
        setIsDeleteModalVisible(true);
    };

    const confirmarSaida = () => {
        setIsModalVisible(false);
        setUser({
            nomeUsuario: "",
            email: "",
            senha: "",
            logado: false,
            id: 0,
            token: "",
        });
        router.push("/"); // Redireciona para a página inicial
    };

    const confirmarDeletarConta = async () => {
        try {
            const response = await fetch(`http://ggustac-002-site2.htempurl.com/api/usuario/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                Alert.alert("Conta deletada", "Sua conta foi deletada com sucesso!");
                confirmarSaida(); // 
            } else {
                Alert.alert("Erro", "Erro ao deletar conta.");
            }
        } catch (error) {
            console.error("Erro ao deletar conta: ", error);
        }
        setIsDeleteModalVisible(false); 
    };

    const salvarEdicao = async () => {
        if (user?.id && user?.token) {
            try {
                const response = await fetch(`http://ggustac-002-site2.htempurl.com/api/usuario/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        id: user.id,
                        nome: nomeUsuario,
                        email: email,
                        senha: senha
                    }),
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    // Mantenha o campo logado como true
                    setUser({ ...updatedUser, logado: true, token: user.token });
                    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
                    setIsEditing(false);
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

    // Aqui eu inclui a model para exibir a mensagem.
    const confirmarSalvarAlteracoes = () => {
        setIsSaveModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <Text style={styles.subTitle}>Bem-vindo</Text>

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
                <Pressable style={styles.btnPrimary} onPress={confirmarSalvarAlteracoes}>
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                </Pressable>
            ) : (
                <Pressable style={styles.btnSecondary} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </Pressable>
            )}

            <Pressable style={styles.btnDanger} onPress={sair}>
                <Text style={styles.buttonText}>Sair</Text>
            </Pressable>

            <Pressable style={styles.btnDanger} onPress={deletarConta}>
                <Text style={styles.buttonText}>Deletar Conta</Text>
            </Pressable>

    
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tem certeza que deseja sair?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
                            <Button title="Sim, sair" onPress={confirmarSaida} color="#dc3545" />
                        </View>
                    </View>
                </View>
            </Modal>

           {/* Mensagem da model está aqui vou replicar para os outros */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tem certeza que deseja deletar sua conta?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setIsDeleteModalVisible(false)} />
                            <Button title="Sim, deletar" onPress={confirmarDeletarConta} color="#dc3545" />
                        </View>
                    </View>
                </View>
            </Modal>

           
            <Modal
                visible={isSaveModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsSaveModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Deseja salvar as alterações?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setIsSaveModalVisible(false)} />
                            <Button title="Salvar" onPress={() => { setIsSaveModalVisible(false); salvarEdicao(); }} color="#007bff" />
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});

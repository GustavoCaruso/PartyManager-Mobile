import React, { useState, useEffect, useCallback } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUser } from "../context/userContext";
import { useRouter, useFocusEffect } from "expo-router";

interface Evento {
  id: number;
  nome: string;
  data: string;
  localidade: string;
  numeroAdultos: number;
  numeroCriancas: number;
  idTipoEvento: number;
  tipoEvento: string;
}

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [eventoParaExcluir, setEventoParaExcluir] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const fetchEventos = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await axios.get(`http://ggustac-002-site2.htempurl.com/api/evento/usuario/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Accept': 'application/json'
          }
        });
        setEventos(response.data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Erro: usuário não está logado.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchEventos(); 
    }, [])
  );

  const confirmarExclusao = (id: number) => {
    setEventoParaExcluir(id);
    setIsModalVisible(true);
  };

  const excluirEvento = async () => {
    if (eventoParaExcluir) {
      try {
        await axios.delete(`http://ggustac-002-site2.htempurl.com/api/evento/${eventoParaExcluir}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        });
        setEventos(prevEventos => prevEventos.filter(evento => evento.id !== eventoParaExcluir));
        console.log("Evento excluído com sucesso.");
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
      } finally {
        setIsModalVisible(false);
        setEventoParaExcluir(null);
      }
    }
  };

  const visualizarEvento = (id: number) => {
    router.push(`/visualizarEvento?id=${id}`);
  };

  const renderEvento = ({ item }: { item: Evento }) => (
    <View style={styles.eventoContainer}>
      <Text style={styles.eventoNome}>Nome: {item.nome}</Text>
      <Text style={styles.eventoData}>Data: {new Date(item.data).toLocaleDateString()}</Text>
      <Text style={styles.eventoLocal}>Local: {item.localidade}</Text>
      <Text style={styles.eventoPessoas}>Adultos: {item.numeroAdultos} - Crianças: {item.numeroCriancas}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => visualizarEvento(item.id)}>
          <Icon name="eye" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push(`/edicaoEvento?id=${item.id}&idTipoEvento=${item.idTipoEvento}`)}>
          <Icon name="pencil" size={24} color="#FFC107" style={styles.iconButton} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => confirmarExclusao(item.id)}>
          <Icon name="trash" size={24} color="#F44336" style={styles.iconButton} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos do Usuário</Text>

      {eventos.length === 0 ? (
        <Text style={styles.noEventos}>Nenhum evento encontrado.</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvento}
          contentContainerStyle={styles.eventosList}
        />
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text>Você tem certeza que deseja excluir este evento?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
              <Button title="Excluir" onPress={excluirEvento} color="#F44336" />
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/criarEventos")}>
        <Text style={styles.buttonText}>Criar Novo Evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  eventosList: {
    paddingBottom: 20,
  },
  eventoContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
  },
  eventoNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventoData: {
    fontSize: 16,
    color: '#666',
  },
  eventoLocal: {
    fontSize: 16,
    color: '#333',
  },
  eventoPessoas: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '40%',
  },
  iconButton: {
    marginLeft: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  loadingContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventos: { 
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
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

import React, { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';

// Definir interface para o tipo de evento
interface Evento {
  id: number;
  nome: string;
  data: string;
  localidade: string;
  numeroAdultos: number;
  numeroCriancas: number;
}

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const idUsuario = 1; // Substitua pelo idUsuario real, possivelmente recuperado do login

  // Função para buscar os eventos do usuário logado
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get(`http://ggustac-002-site2.htempurl.com/api/evento/usuario/${idUsuario}`);
        setEventos(response.data); // Salva os eventos retornados no estado
        setLoading(false);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os eventos.");
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  // Função para renderizar cada item da lista de eventos
  const renderEvento = ({ item }: { item: Evento }) => (
    <View style={styles.eventoContainer}>
      <Text style={styles.eventoNome}>Nome: {item.nome}</Text>
      <Text style={styles.eventoData}>Data: {new Date(item.data).toLocaleDateString()}</Text>
      <Text style={styles.eventoLocal}>Local: {item.localidade}</Text>
      <Text style={styles.eventoPessoas}>Adultos: {item.numeroAdultos} - Crianças: {item.numeroCriancas}</Text>

      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => console.log('Visualizar evento', item.id)}>
          <Icon name="eye" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Editar evento', item.id)}>
          <Icon name="pencil" size={24} color="#FFC107" style={styles.iconButton} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Excluir evento', item.id)}>
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

      <TouchableOpacity style={styles.button} onPress={() => console.log('Criar novo evento')}>
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
});

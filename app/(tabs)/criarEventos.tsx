import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function CriarEventos() {
  const [nome, setNome] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [numeroAdultos, setNumeroAdultos] = useState('');
  const [numeroCriancas, setNumeroCriancas] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [tiposEvento, setTiposEvento] = useState([]);
  const [itensEvento, setItensEvento] = useState([]);
  const [resumoEvento, setResumoEvento] = useState(null); // Armazena o resumo do evento
  const [loadingTiposEvento, setLoadingTiposEvento] = useState(true);
  const [loading, setLoading] = useState(false);
  const idUsuario = 1; // Substitua com o idUsuario correto

  // Função para buscar os tipos de evento
  useEffect(() => {
    const fetchTiposEvento = async () => {
      try {
        const response = await axios.get('http://ggustac-002-site2.htempurl.com/api/tipoevento');
        setTiposEvento(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os tipos de evento.');
      } finally {
        setLoadingTiposEvento(false);
      }
    };

    fetchTiposEvento();
  }, []);

  // Função para buscar os itens de um tipo de evento após a seleção
  const fetchItensPorTipoEvento = async (idTipoEvento) => {
    try {
      const response = await axios.get(`http://ggustac-002-site2.htempurl.com/api/evento/${idTipoEvento}/itens`);
      setItensEvento(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os itens deste tipo de evento.');
    }
  };

  // Função chamada ao selecionar um tipo de evento
  const handleTipoEventoChange = (itemValue) => {
    setTipoEvento(itemValue);
    fetchItensPorTipoEvento(itemValue); // Busca os itens ao selecionar um tipo de evento
  };

  // Função para criar o evento e exibir o resumo
  const handleCreateEvento = async () => {
    if (!nome || !localidade || !numeroAdultos || !numeroCriancas || !tipoEvento) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const eventoData = {
      nome,
      localidade,
      numeroAdultos: parseInt(numeroAdultos, 10),
      numeroCriancas: parseInt(numeroCriancas, 10),
      idTipoEvento: tipoEvento,
      idUsuario,
      data: new Date().toISOString() // Data atual
    };

    try {
      setLoading(true);
      await axios.post('http://ggustac-002-site2.htempurl.com/api/evento', eventoData);
      
      // Calcular a quantidade total de itens (adultos + crianças)
      const totalPessoas = parseInt(numeroAdultos, 10) + parseInt(numeroCriancas, 10);
      const resumo = {
        nomeEvento: nome,
        localidade: localidade,
        numeroAdultos: numeroAdultos,
        numeroCriancas: numeroCriancas,
        tipoEvento: tiposEvento.find((tipo) => tipo.id === tipoEvento)?.nome || 'Evento',
        itens: itensEvento.map(item => ({
          nome: item.nome,
          quantidadeTotal: (item.quantidadePorPessoa * totalPessoas).toFixed(2)
        }))
      };

      setResumoEvento(resumo); // Armazena o resumo do evento
      setLoading(false);
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o evento.');
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Novo Evento</Text>

      {/* Nome do evento */}
      <TextInput
        style={styles.input}
        placeholder="Nome do evento"
        value={nome}
        onChangeText={setNome}
      />

      {/* Localidade */}
      <TextInput
        style={styles.input}
        placeholder="Localidade"
        value={localidade}
        onChangeText={setLocalidade}
      />

      {/* Número de adultos */}
      <TextInput
        style={styles.input}
        placeholder="Número de adultos"
        keyboardType="numeric"
        value={numeroAdultos}
        onChangeText={setNumeroAdultos}
      />

      {/* Número de crianças */}
      <TextInput
        style={styles.input}
        placeholder="Número de crianças"
        keyboardType="numeric"
        value={numeroCriancas}
        onChangeText={setNumeroCriancas}
      />

      {/* Tipo de evento */}
      <View style={styles.pickerContainer}>
        {loadingTiposEvento ? (
          <Text>Carregando tipos de evento...</Text>
        ) : (
          <Picker
            selectedValue={tipoEvento}
            onValueChange={handleTipoEventoChange} // Chama a função para buscar os itens ao selecionar um tipo de evento
            style={styles.picker}
          >
            <Picker.Item label="Selecione o tipo de evento" value="" />
            {tiposEvento.map((tipo) => (
              <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
            ))}
          </Picker>
        )}
      </View>

      {/* Botão de criar evento */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateEvento}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar Evento'}</Text>
      </TouchableOpacity>

      {/* Exibir resumo do evento */}
      {resumoEvento && (
        <View style={styles.resumoContainer}>
          <Text style={styles.resumoTitle}>{resumoEvento.nomeEvento}</Text>
          <Text>Localidade: {resumoEvento.localidade}</Text>
          <Text>Adultos: {resumoEvento.numeroAdultos}</Text>
          <Text>Crianças: {resumoEvento.numeroCriancas}</Text>
          <Text>Tipo de Evento: {resumoEvento.tipoEvento}</Text>
          <Text style={styles.resumoSubTitle}>Itens do Evento:</Text>
          {resumoEvento.itens.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.nome} - {item.quantidadeTotal}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 50,
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
  resumoContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  resumoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resumoSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

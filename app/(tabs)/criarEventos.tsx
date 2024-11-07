import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Platform, Modal, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { useRouter } from "expo-router";
import { useUser } from "../context/userContext";

const BASE_URL = "http://ggustac-002-site2.htempurl.com/api";

interface TipoEvento {
  id: number;
  nome: string;
}

interface ItemCalculado {
  itemNome: string;
  quantidade: number;
}

export default function CriarEvento() {
  const { user } = useUser();
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [data, setData] = useState(new Date());
  const [numeroAdultos, setNumeroAdultos] = useState('');
  const [numeroCriancas, setNumeroCriancas] = useState('');
  const [tipoEvento, setTipoEvento] = useState<number | string>('');
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [itensCalculados, setItensCalculados] = useState<ItemCalculado[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const idUsuario = user?.id || null;

  useEffect(() => {
    const fetchTiposEvento = async () => {
      try {
        const response = await axios.get<TipoEvento[]>(`${BASE_URL}/TipoEvento`);
        setTiposEvento(response.data);
      } catch (error) {
        showAlertModal("Não foi possível carregar os tipos de evento.");
      }
    };

    fetchTiposEvento();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setData(selectedDate);
    }
  };

  const showAlertModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCreateEvento = async () => {
    if (!nome || !localidade || !numeroAdultos || !numeroCriancas || !tipoEvento || !idUsuario) {
      showAlertModal("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formattedData = data.toISOString();

    const eventoData = {
      id: 0,
      nome,
      localidade,
      data: formattedData,
      numeroAdultos: parseInt(numeroAdultos, 10),
      numeroCriancas: parseInt(numeroCriancas, 10),
      idTipoEvento: parseInt(tipoEvento as string, 10),
      idUsuario,
    };

    try {
      const response = await axios.post(`${BASE_URL}/Evento`, eventoData);
      setItensCalculados(response.data.itensCalculados);
      Alert.alert("Sucesso", "Evento criado com sucesso!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showAlertModal(`Não foi possível criar o evento: ${JSON.stringify(error.response.data)}`);
      } else {
        showAlertModal("Ocorreu um erro inesperado ao tentar criar o evento.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Novo Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do evento"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Localidade"
        value={localidade}
        onChangeText={setLocalidade}
      />

      {Platform.OS === 'web' ? (
        <input
          style={{ ...styles.input, height: 40 }}
          type="date"
          value={data.toISOString().split('T')[0]}
          onChange={(e) => setData(new Date(e.target.value))}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{data.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Número de adultos"
        keyboardType="numeric"
        value={numeroAdultos}
        onChangeText={setNumeroAdultos}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de crianças"
        keyboardType="numeric"
        value={numeroCriancas}
        onChangeText={setNumeroCriancas}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoEvento}
          onValueChange={setTipoEvento}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o tipo de evento" value="" />
          {tiposEvento.map((tipo) => (
            <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCreateEvento}>
        <Text style={styles.buttonText}>Criar Evento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/eventos')}>
        <Text style={styles.buttonText}>Voltar para Eventos</Text>
      </TouchableOpacity>

      {/* Modal de Alerta */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {itensCalculados.length > 0 && (
        <View style={styles.resumoContainer}>
          <Text style={styles.resumoTitle}>Itens Calculados</Text>
          {itensCalculados.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.itemNome} - {item.quantidade}
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
    color: "#333",
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
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

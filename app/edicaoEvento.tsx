import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useUser } from "./context/userContext";

interface Evento {
  id: number;
  nome: string;
  data: string;
  localidade: string;
  numeroAdultos: number;
  numeroCriancas: number;
  idTipoEvento: number;
  idUsuario: number;
}

interface TipoEvento {
  id: number;
  nome: string;
}

interface ItemCalculado {
  itemNome: string;
  quantidade: number;
}

export default function EdicaoEvento() {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [numeroAdultos, setNumeroAdultos] = useState("");
  const [numeroCriancas, setNumeroCriancas] = useState("");
  const [idTipoEvento, setIdTipoEvento] = useState<number | null>(null);
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [itensCalculados, setItensCalculados] = useState<ItemCalculado[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUser();
  const { id } = route.params as { id: number };

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await axios.get(`http://ggustac-002-site2.htempurl.com/api/evento/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Accept': 'application/json'
          }
        });
        const eventoData = response.data;
        setEvento(eventoData);
        setNome(eventoData.nome);
        setData(eventoData.data);
        setLocalidade(eventoData.localidade);
        setNumeroAdultos(eventoData.numeroAdultos.toString());
        setNumeroCriancas(eventoData.numeroCriancas.toString());
        setIdTipoEvento(eventoData.idTipoEvento);
        setItensCalculados(eventoData.itensCalculados);
      } catch (error) {
        console.error("Erro ao carregar o evento:", error);
      }
    };

    const fetchTiposEvento = async () => {
      try {
        const response = await axios.get(`http://ggustac-002-site2.htempurl.com/api/tipoevento`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Accept': 'application/json'
          }
        });
        setTiposEvento(response.data);
      } catch (error) {
        console.error("Erro ao carregar os tipos de evento:", error);
      }
    };

    fetchEvento();
    fetchTiposEvento();
  }, [id, user.token]);

  const confirmarAtualizacao = () => {
    setIsModalVisible(true);
  };

  const atualizarEvento = async () => {
    setIsModalVisible(false);
    if (idTipoEvento === null) {
      Alert.alert("Erro", "Por favor, selecione o tipo de evento.");
      return;
    }

    try {
      const response = await axios.put(`http://ggustac-002-site2.htempurl.com/api/evento/${id}`, {
        id,
        nome,
        data,
        localidade,
        numeroAdultos: parseInt(numeroAdultos, 10),
        numeroCriancas: parseInt(numeroCriancas, 10),
        idTipoEvento,
        idUsuario: user.id,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Accept': 'application/json'
        }
      });

      Alert.alert("Sucesso", "Evento atualizado com sucesso!");
      setItensCalculados(response.data.itensCalculados);
    } catch (error) {
      console.error("Erro ao atualizar o evento:", error);
      Alert.alert("Erro", "Não foi possível atualizar o evento.");
    }
  };

  if (!evento) {
    return <Text>Carregando evento para edição...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Evento</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Data:</Text>
      <TextInput style={styles.input} value={data} onChangeText={setData} placeholder="AAAA-MM-DD" />

      <Text style={styles.label}>Localidade:</Text>
      <TextInput style={styles.input} value={localidade} onChangeText={setLocalidade} />

      <Text style={styles.label}>Número de Adultos:</Text>
      <TextInput style={styles.input} value={numeroAdultos} keyboardType="numeric" onChangeText={setNumeroAdultos} />

      <Text style={styles.label}>Número de Crianças:</Text>
      <TextInput style={styles.input} value={numeroCriancas} keyboardType="numeric" onChangeText={setNumeroCriancas} />

      <Text style={styles.label}>Tipo de Evento:</Text>
      <Picker selectedValue={idTipoEvento} onValueChange={(itemValue) => setIdTipoEvento(itemValue as number)} style={styles.picker}>
        <Picker.Item label="Selecione o tipo de evento" value={null} />
        {tiposEvento.map((tipo) => (
          <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
        ))}
      </Picker>

      <Button title="Salvar Alterações" onPress={confirmarAtualizacao} />

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja realmente salvar as alterações?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={atualizarEvento}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {itensCalculados.length > 0 && (
        <View style={styles.itensCalculadosContainer}>
          <Text style={styles.subtitle}>Itens Calculados:</Text>
          {itensCalculados.map((item, index) => (
            <View key={index} style={styles.itemCalculado}>
              <Text style={styles.itemNome}>{item.itemNome}</Text>
              <Text style={styles.itemQuantidade}>Quantidade: {item.quantidade}</Text>
            </View>
          ))}
        </View>
      )}

<TouchableOpacity
  style={styles.backButton}
  onPress={() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("/(tabs)/eventos" as never); // Substitua "Eventos" pelo nome exato da sua tela
    }
  }}
>
  <Text style={styles.backButtonText}>Voltar para Eventos</Text>
</TouchableOpacity>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5 },
  itensCalculadosContainer: { marginTop: 20, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  itemCalculado: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  itemNome: { fontSize: 16 },
  itemQuantidade: { fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  modalText: { fontSize: 18, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, padding: 10, alignItems: 'center' },
  cancelButtonText: { color: '#F44336', fontSize: 16 },
  confirmButtonText: { color: '#4CAF50', fontSize: 16 },
  backButton: { marginTop: 15, padding: 10, alignItems: 'center' },
  backButtonText: { color: '#007BFF', fontSize: 16 }
});

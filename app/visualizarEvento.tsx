import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Share, Alert } from "react-native";
import { useRoute, useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { useUser } from "./context/userContext";

// Define os tipos para as rotas e parâmetros esperados
type RootStackParamList = {
  visualizarEvento: { id: number };
  edicaoEvento: { id: number; idTipoEvento: number };
};

// Especifica o tipo para a rota 'visualizarEvento'
type VisualizarEventoRouteProp = RouteProp<RootStackParamList, 'visualizarEvento'>;
type EdicaoEventoNavigationProp = NavigationProp<RootStackParamList, 'edicaoEvento'>;

interface ItemCalculado {
  itemNome: string;
  quantidade: number;
}

interface Evento {
  id: number;
  nome: string;
  data: string;
  localidade: string;
  numeroAdultos: number;
  numeroCriancas: number;
  idTipoEvento: number;
  tipoEvento: string;
  itensCalculados: ItemCalculado[];
}

export default function VisualizarEvento() {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [nomeTipoEvento, setNomeTipoEvento] = useState<string>("");

  const route = useRoute<VisualizarEventoRouteProp>();
  const navigation = useNavigation<EdicaoEventoNavigationProp>();
  const { user } = useUser();

  const { id } = route.params;

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await axios.get(`http://ggustac-002-site2.htempurl.com/api/evento/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Accept': 'application/json'
          }
        });
        setEvento(response.data);

        if (response.data.idTipoEvento) {
          const tipoEventoResponse = await axios.get(`http://ggustac-002-site2.htempurl.com/api/tipoevento/${response.data.idTipoEvento}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Accept': 'application/json'
            }
          });
          setNomeTipoEvento(tipoEventoResponse.data.nome);
        }
      } catch (error) {
        console.error("Erro ao carregar o evento:", error);
      }
    };

    fetchEvento();
  }, [id, user.token]);

  const compartilharEvento = async () => {
    if (evento) {
      const itensTexto = evento.itensCalculados
        .map(item => `- ${item.itemNome}: ${item.quantidade}`)
        .join("\n");

      const mensagem = `
        Detalhes do Evento:
        Nome: ${evento.nome}
        Tipo de Evento: ${nomeTipoEvento || evento.tipoEvento}
        Data: ${new Date(evento.data).toLocaleDateString()}
        Local: ${evento.localidade}
        Adultos: ${evento.numeroAdultos}
        Crianças: ${evento.numeroCriancas}

        Itens Calculados:
        ${itensTexto}
      `;

      try {
        await Share.share({ message: mensagem });
      } catch (error) {
        Alert.alert("Erro", "Não foi possível compartilhar o evento.");
      }
    }
  };

  if (!evento) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando detalhes do evento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.title}>Detalhes do Evento</Text>
        <Text style={styles.detail}>Nome: {evento.nome}</Text>
        <Text style={styles.detail}>Tipo de Evento: {nomeTipoEvento || evento.tipoEvento}</Text>
        <Text style={styles.detail}>Data: {new Date(evento.data).toLocaleDateString()}</Text>
        <Text style={styles.detail}>Local: {evento.localidade}</Text>
        <Text style={styles.detail}>Adultos: {evento.numeroAdultos}</Text>
        <Text style={styles.detail}>Crianças: {evento.numeroCriancas}</Text>

        <Text style={styles.subTitle}>Itens Calculados</Text>
        {evento.itensCalculados.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.itemNome}</Text>
            <Text style={styles.itemText}>Quantidade: {item.quantidade}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
        <Button 
          title="Editar" 
          onPress={() => navigation.navigate("edicaoEvento", { id: evento.id, idTipoEvento: evento.idTipoEvento })}
        />
        <Button title="Compartilhar" onPress={compartilharEvento} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
});

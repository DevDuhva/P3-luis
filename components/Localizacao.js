import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Estilos, { Cores } from "../styles/Estilos";

export default function Localizacao({ voltar }) {
  const [permissao, setPermissao] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [dataLocalizacao, setDataLocalizacao] = useState(null);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const autorizado = status === "granted";
      setPermissao(autorizado);

      if (autorizado) {
        const posicao = await Location.getCurrentPositionAsync({});
        definirPosicao(posicao);
      }
    }
    obterLocalizacao();
  }, []);

  function definirPosicao(posicao) {
    setLatitude(posicao.coords.latitude);
    setLongitude(posicao.coords.longitude);
    setDataLocalizacao(new Date().toISOString());
  }

  async function atualizar() {
    if (!permissao) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const autorizado = status === "granted";
      setPermissao(autorizado);

      if (!autorizado) {
        Alert.alert("Localização", "Permissão de localização negada.");
        return;
      }
    }

    setAtualizando(true);
    try {
      const posicao = await Location.getCurrentPositionAsync({});
      definirPosicao(posicao);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível obter a localização.");
    } finally {
      setAtualizando(false);
    }
  }

  return (
    <View style={Estilos.container}>
      <Text style={Estilos.tituloTela}>Localização</Text>
      <Text style={Estilos.subtitulo}>Local onde a medição foi realizada</Text>

      <View style={Estilos.cardInfo}>
        <Ionicons name="location" size={48} color={Cores.primaria} />

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Latitude</Text>
          <Text style={Estilos.valorInfo}>
            {latitude != null ? latitude.toFixed(6) : "—"}
          </Text>
        </View>

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Longitude</Text>
          <Text style={Estilos.valorInfo}>
            {longitude != null ? longitude.toFixed(6) : "—"}
          </Text>
        </View>

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Atualizada em</Text>
          <Text style={Estilos.valorInfo}>
            {dataLocalizacao
              ? new Date(dataLocalizacao).toLocaleString("pt-BR")
              : "—"}
          </Text>
        </View>
      </View>

      {permissao === false && (
        <Text style={Estilos.statusPermissao}>
          Permissão de localização negada.
        </Text>
      )}

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoPrimario]}
        onPress={atualizar}
      >
        <Ionicons name="refresh" size={22} color={Cores.fundo} />
        <Text style={[Estilos.textoBotao, Estilos.textoBotaoPrimario]}>
          {atualizando ? "Atualizando..." : "Atualizar localização"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={Estilos.botaoVoltar} onPress={voltar}>
        <Text style={Estilos.textoVoltar}>← Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
}
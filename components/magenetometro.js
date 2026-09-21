import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Magnetometer } from "expo-sensors";
import Estilos, { Cores } from "../styles/Estilos";

function magnitudeCampo({ x, y, z }) {
  return Math.sqrt(x * x + y * y + z * z);
}

export default function Magnetometro({ voltar }) {
  const [disponivel, setDisponivel] = useState(null);
  const [leitura, setLeitura] = useState(null);
  const [dataLeitura, setDataLeitura] = useState(null);
  const [atualizando, setAtualizando] = useState(false);
  const inscricao = useRef(null);

  function removerInscricao() {
    if (inscricao.current) {
      inscricao.current.remove();
      inscricao.current = null;
    }
  }

  function definirLeitura(dados) {
    setLeitura({ ...dados, magnitude: magnitudeCampo(dados) });
    setDataLeitura(new Date().toISOString());
  }

  function assinar() {
    removerInscricao();
    Magnetometer.setUpdateInterval(500);
    inscricao.current = Magnetometer.addListener(definirLeitura);
  }

  useEffect(() => {
    async function iniciar() {
      try {
        const ok = await Magnetometer.isAvailableAsync();
        setDisponivel(ok);
        if (ok) {
          assinar();
        }
      } catch (erro) {
        setDisponivel(false);
      }
    }
    iniciar();

    return () => removerInscricao();
  }, []);

  async function atualizar() {
    setAtualizando(true);
    try {
      const ok = await Magnetometer.isAvailableAsync();
      setDisponivel(ok);
      if (!ok) {
        Alert.alert(
          "Magnetômetro",
          "Sensor magnetômetro indisponível neste dispositivo."
        );
        return;
      }
      assinar();
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível obter a leitura.");
    } finally {
      setAtualizando(false);
    }
  }

  return (
    <View style={Estilos.container}>
      <Text style={Estilos.tituloTela}>Campo Magnético</Text>
      <Text style={Estilos.subtitulo}>Leitura do magnetômetro em tempo real (µT)</Text>

      <View style={Estilos.cardInfo}>
        <Ionicons name="compass" size={48} color={Cores.primaria} />

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Eixo X</Text>
          <Text style={Estilos.valorInfo}>
            {leitura != null ? `${leitura.x.toFixed(2)} µT` : "—"}
          </Text>
        </View>

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Eixo Y</Text>
          <Text style={Estilos.valorInfo}>
            {leitura != null ? `${leitura.y.toFixed(2)} µT` : "—"}
          </Text>
        </View>

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Eixo Z</Text>
          <Text style={Estilos.valorInfo}>
            {leitura != null ? `${leitura.z.toFixed(2)} µT` : "—"}
          </Text>
        </View>

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Intensidade total</Text>
          <Text style={Estilos.valorInfo}>
            {leitura != null ? `${leitura.magnitude.toFixed(2)} µT` : "—"}
          </Text>
        </View>

        <View style={Estilos.linhaInfo}>
          <Text style={Estilos.labelInfo}>Atualizada em</Text>
          <Text style={Estilos.valorInfo}>
            {dataLeitura
              ? new Date(dataLeitura).toLocaleString("pt-BR")
              : "—"}
          </Text>
        </View>
      </View>

      {disponivel === false && (
        <Text style={Estilos.statusPermissao}>
          Magnetômetro indisponível neste dispositivo.
        </Text>
      )}

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoPrimario]}
        onPress={atualizar}
      >
        <Ionicons name="refresh" size={22} color={Cores.fundo} />
        <Text style={[Estilos.textoBotao, Estilos.textoBotaoPrimario]}>
          {atualizando ? "Atualizando..." : "Atualizar leitura"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={Estilos.botaoVoltar} onPress={voltar}>
        <Text style={Estilos.textoVoltar}>← Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
}

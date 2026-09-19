import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import * as Location from "expo-location";
import Estilos, { Cores } from "../styles/Estilos";

function nivelDoSom(metering) {
  if (metering <= -30) {
    return "Baixo";
  }
  if (metering <= -15) {
    return "Médio";
  }
  return "Alto";
}

const detalhesNivel = {
  Baixo: { cor: Cores.verde, icone: "volume-low" },
  Médio: { cor: Cores.primaria, icone: "volume-medium" },
  Alto: { cor: Cores.vermelho, icone: "volume-high" },
};

export default function Som({ voltar, salvar }) {
  const [permissao, setPermissao] = useState(null);
  const [medindo, setMedindo] = useState(false);
  const [nivel, setNivel] = useState(null);

  const recorder = useAudioRecorder({
    ...RecordingPresets.LOW_QUALITY,
    isMeteringEnabled: true,
  });

  useEffect(() => {
    async function configurar() {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      const resultado = await requestRecordingPermissionsAsync();
      setPermissao(resultado.granted);
    }
    configurar();
  }, []);

  useEffect(() => {
    if (!medindo) {
      return;
    }

    const intervalo = setInterval(async () => {
      try {
        const status = await recorder.getStatus();
        if (status && status.metering != null) {
          setNivel(nivelDoSom(status.metering));
        }
      } catch (erro) {}
    }, 300);

    return () => clearInterval(intervalo);
  }, [medindo, recorder]);

  async function iniciar() {
    if (!permissao) {
      const resultado = await requestRecordingPermissionsAsync();
      setPermissao(resultado.granted);
      if (!resultado.granted) {
        Alert.alert("Microfone", "Permissão para usar o microfone foi negada.");
        return;
      }
    }

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setMedindo(true);
      setNivel(null);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível iniciar a medição.");
    }
  }

  async function parar() {
    try {
      await recorder.stop();
    } catch (erro) {}
    setMedindo(false);
  }

  async function salvarMedicao() {
    let latitude = null;
    let longitude = null;

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const posicao = await Location.getCurrentPositionAsync({});
        latitude = posicao.coords.latitude;
        longitude = posicao.coords.longitude;
      }
    } catch (erro) {}

    salvar({
      nivel: nivel || "Sem medição",
      latitude: latitude,
      longitude: longitude,
      data: new Date().toISOString(),
    });

    Alert.alert("Salvo", "Medição salva no histórico.");
  }

  const detalhe = nivel ? detalhesNivel[nivel] : null;
  const corNivel = detalhe ? detalhe.cor : Cores.textoSuave;
  const iconeNivel = detalhe ? detalhe.icone : "volume-mute";
  const podeSalvar = nivel != null;

  return (
    <View style={Estilos.container}>
      <Text style={Estilos.tituloTela}>Medição de Som</Text>
      <Text style={Estilos.subtitulo}>Intensidade do som pelo microfone</Text>

      <View style={Estilos.cardStatus}>
        <Ionicons name={iconeNivel} size={40} color={corNivel} />
        <View style={[Estilos.indicador, { backgroundColor: corNivel }]} />
        <Text style={Estilos.labelStatus}>Nível do som</Text>
        <Text style={[Estilos.textoMovimento, { color: corNivel }]}>
          {nivel || "—"}
        </Text>
        <Text style={Estilos.aviso}>
          {medindo
            ? "Medindo..."
            : nivel
            ? "Valor aproximado. O microfone não é calibrado."
            : "Aguardando início da medição"}
        </Text>
      </View>

      {permissao === false && (
        <Text style={Estilos.statusPermissao}>
          Permissão para usar o microfone negada.
        </Text>
      )}

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoPrimario]}
        onPress={medindo ? parar : iniciar}
      >
        <Ionicons
          name={medindo ? "stop-circle" : "mic"}
          size={22}
          color={Cores.fundo}
        />
        <Text style={[Estilos.textoBotao, Estilos.textoBotaoPrimario]}>
          {medindo ? "Parar medição" : "Iniciar medição"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          Estilos.botao,
          Estilos.botaoSecundario,
          !podeSalvar && Estilos.botaoDesabilitado,
        ]}
        disabled={!podeSalvar}
        onPress={salvarMedicao}
      >
        <Ionicons name="save" size={22} color={Cores.texto} />
        <Text style={Estilos.textoBotao}>Salvar medição</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Estilos.botaoVoltar} onPress={voltar}>
        <Text style={Estilos.textoVoltar}>← Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
}
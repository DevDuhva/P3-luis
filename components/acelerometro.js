import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";
import Estilos, { Cores } from "../styles/Estilos";

function magnitudeAceleracao({ x, y, z }) {
  return Math.sqrt(x * x + y * y + z * z);
}

function nivelDoMovimento(magnitude) {
  if (magnitude <= 1.15) {
    return "Baixo";
  }
  if (magnitude <= 1.6) {
    return "Médio";
  }
  return "Alto";
}

const detalhesNivel = {
  Baixo: { cor: Cores.verde, icone: "pause-circle" },
  Médio: { cor: Cores.primaria, icone: "walk" },
  Alto: { cor: Cores.vermelho, icone: "flash" },
};

export default function Acelerometro({ voltar, salvar }) {
  const [disponivel, setDisponivel] = useState(null);
  const [medindo, setMedindo] = useState(false);
  const [nivel, setNivel] = useState(null);
  const [leitura, setLeitura] = useState(null);
  const inscricao = useRef(null);

  function removerInscricao() {
    if (inscricao.current) {
      inscricao.current.remove();
      inscricao.current = null;
    }
  }

  useEffect(() => {
    Accelerometer.isAvailableAsync()
      .then((ok) => setDisponivel(ok))
      .catch(() => setDisponivel(false));

    return () => removerInscricao();
  }, []);

  async function iniciar() {
    try {
      const ok = await Accelerometer.isAvailableAsync();
      setDisponivel(ok);
      if (!ok) {
        Alert.alert(
          "Acelerômetro",
          "Sensor acelerômetro indisponível neste dispositivo."
        );
        return;
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível verificar o acelerômetro.");
      return;
    }

    try {
      removerInscricao();
      Accelerometer.setUpdateInterval(300);
      inscricao.current = Accelerometer.addListener((dados) => {
        const magnitude = magnitudeAceleracao(dados);
        setLeitura({ ...dados, magnitude });
        setNivel(nivelDoMovimento(magnitude));
      });
      setMedindo(true);
      setNivel(null);
      setLeitura(null);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível iniciar a medição.");
    }
  }

  function parar() {
    removerInscricao();
    setMedindo(false);
  }

  function salvarMedicao() {
    salvar({
      nivel: nivel || "Sem medição",
      magnitude: leitura ? leitura.magnitude : null,
      x: leitura ? leitura.x : null,
      y: leitura ? leitura.y : null,
      z: leitura ? leitura.z : null,
      data: new Date().toISOString(),
    });

    Alert.alert("Salvo", "Medição salva no histórico.");
  }

  const detalhe = nivel ? detalhesNivel[nivel] : null;
  const corNivel = detalhe ? detalhe.cor : Cores.textoSuave;
  const iconeNivel = detalhe ? detalhe.icone : "pause-circle";
  const podeSalvar = nivel != null && leitura != null;

  return (
    <View style={Estilos.container}>
      <Text style={Estilos.tituloTela}>Movimento</Text>
      <Text style={Estilos.subtitulo}>Intensidade do movimento pelo acelerômetro</Text>

      <View style={Estilos.cardStatus}>
        <Ionicons name={iconeNivel} size={40} color={corNivel} />
        <View style={[Estilos.indicador, { backgroundColor: corNivel }]} />
        <Text style={Estilos.labelStatus}>Nível de movimento</Text>
        <Text style={[Estilos.textoMovimento, { color: corNivel }]}>
          {nivel || "—"}
        </Text>
        <Text style={Estilos.aviso}>
          {leitura
            ? `${leitura.magnitude.toFixed(3)} g · x ${leitura.x.toFixed(2)} · y ${leitura.y.toFixed(2)} · z ${leitura.z.toFixed(2)}`
            : medindo
            ? "Medindo..."
            : "Aguardando início da medição"}
        </Text>
      </View>

      {disponivel === false && (
        <Text style={Estilos.statusPermissao}>
          Acelerômetro indisponível neste dispositivo.
        </Text>
      )}

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoPrimario]}
        onPress={medindo ? parar : iniciar}
      >
        <Ionicons
          name={medindo ? "stop-circle" : "move"}
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

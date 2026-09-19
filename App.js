import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Inicio from "./components/Inicio";
import Som from "./components/Som";
import Localizacao from "./components/Localizacao";
import Historico from "./components/Historico";

export default function App() {
  const [tela, setTela] = useState("Inicio");
  const [medicoes, setMedicoes] = useState([]);

  function salvarMedicao(medicao) {
    setMedicoes((anteriores) => [medicao, ...anteriores]);
  }

  function renderizarTela() {
    switch (tela) {
      case "Som":
        return <Som voltar={() => setTela("Inicio")} salvar={salvarMedicao} />;
      case "Localizacao":
        return <Localizacao voltar={() => setTela("Inicio")} />;
      case "Historico":
        return <Historico voltar={() => setTela("Inicio")} medicoes={medicoes} />;
      default:
        return <Inicio irPara={setTela} />;
    }
  }

  return (
    <>
      <StatusBar style="light" />
      {renderizarTela()}
    </>
  );
}
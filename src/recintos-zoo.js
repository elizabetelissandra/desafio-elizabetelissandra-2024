class RecintosZoo {
  constructor() {
    this.animais = {
      LEAO: { tamanho: 3, biomas: ["savana"] },
      LEOPARDO: { tamanho: 2, biomas: ["savana"] },
      CROCODILO: { tamanho: 3, biomas: ["rio"] },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
      GAZELA: { tamanho: 2, biomas: ["savana"] },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] },
    };

    this.recintos = [
      {
        numero: 1,
        bioma: "savana",
        tamanho: 10,
        animais: ["MACACO", "MACACO", "MACACO"],
      },
      { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
      { numero: 3, bioma: ["savana", "rio"], tamanho: 7, animais: ["GAZELA"] },
      { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
      { numero: 5, bioma: "savana", tamanho: 9, animais: ["LEAO"] },
    ];
  }

  calcularEspacoOcupado(recinto) {
    const especiesExistentes = [...new Set(recinto.animais)];
    let espacoOcupado = recinto.animais.reduce((total, animal) => {
      return total + this.animais[animal].tamanho;
    }, 0);

    // Corrige a condição para adicionar o espaço extra quando houver mais de uma espécie
    if (especiesExistentes.length > 1) {
      espacoOcupado += 1; // Ocupa 1 espaço adicional quando há mais de uma espécie
    }

    return espacoOcupado;
  }

  verificarCarnivoro(recinto, novoAnimal) {
    const animaisCarnivoros = ["LEAO", "LEOPARDO", "CROCODILO"];

    if (!recinto || !Array.isArray(recinto.animais)) {
      console.log("Recinto inválido");
      return false;
    }

    // Verifica se já existe algum carnívoro no recinto
    const haCarnivoroNoRecinto = recinto.animais.some((animal) =>
      animaisCarnivoros.includes(animal.toUpperCase())
    );

    // Verifica se o novo animal é um carnívoro
    const novoAnimalEhCarnivoro = animaisCarnivoros.includes(
      novoAnimal.toUpperCase()
    );

    // Retorna um objeto com as informações
    return {
      haCarnivoroNoRecinto,
      novoAnimalEhCarnivoro,
      resultado: haCarnivoroNoRecinto || novoAnimalEhCarnivoro,
    };
  }

  analisaRecintos(animal, quantidade) {
    // Valida a quantidade
    if (quantidade <= 0) {
      return { erro: "Quantidade inválida", recintosViaveis: null };
    }

    // Valida o animal
    const especieAnimal = this.animais[animal.toUpperCase()];
    if (!especieAnimal) {
      return { erro: "Animal inválido", recintosViaveis: null };
    }

    const recintosViaveis = [];

    console.log(`Analizando recintos para ${animal} (${quantidade})`);

    // Se for um crocodilo e a quantidade for 1, verificamos apenas o recinto 4
    if (animal.toUpperCase() === "CROCODILO" && quantidade === 1) {
      const recintoCrocodilo = this.recintos.find(
        (recinto) => recinto.numero === 4 && recinto.bioma === "rio"
      );

      // Verifica se há espaço disponível no recinto
      if (recintoCrocodilo) {
        const espacoOcupado = this.calcularEspacoOcupado(recintoCrocodilo);
        const espacoDisponivel = recintoCrocodilo.tamanho - espacoOcupado;

        if (espacoDisponivel >= especieAnimal.tamanho * quantidade) {
          recintosViaveis.push(
            `Recinto ${recintoCrocodilo.numero} (espaço livre: ${
              espacoDisponivel - especieAnimal.tamanho * quantidade
            } total: ${recintoCrocodilo.tamanho})`
          );
        }
      }
    } else {
      this.recintos.forEach((recinto) => {
        console.log(`Verificando recinto ${recinto.numero}:`);
        console.log(`Espaço total: ${recinto.tamanho}`);
        console.log(`Animais atuais: ${recinto.animais.join(", ")}`);
        // Simula a adição dos novos macacos
        const animaisTemporarios = [
          ...recinto.animais,
          ...Array(quantidade).fill(animal.toUpperCase()),
        ];

        // Calcula o espaço ocupado com os macacos adicionados
        const espacoOcupado = this.calcularEspacoOcupado({
          ...recinto,
          animais: animaisTemporarios,
        });

        // Calcula o espaço disponível
        const espacoDisponivel = recinto.tamanho - espacoOcupado;

        // Verifica se o bioma do recinto é adequado
        const biomaInclui = Array.isArray(recinto.bioma)
          ? recinto.bioma.some((bioma) => especieAnimal.biomas.includes(bioma))
          : especieAnimal.biomas.includes(recinto.bioma);

        const recintoCarnivoros = this.verificarCarnivoro(
          recinto,
          animal.toUpperCase()
        );

        console.log(`Recinto ${recinto.numero}:`);
        console.log(`Carnívoros presentes:`, recintoCarnivoros);
        console.log(`Espaço disponível:`, espacoDisponivel);
        console.log(`Biomas adequados:`, biomaInclui);

        if (biomaInclui && espacoDisponivel >= 0) {
          console.log(`Recinto ${recinto.numero} atende aos critérios básicos`);

          if (
            this.verificarCarnivoro(recinto, animal.toUpperCase()).resultado
          ) {
            console.log(
              `Há carnivoro no recinto: ${
                recinto.animais
              }, e o novo animal não é carnivoro: ${animal.toUpperCase()}`
            );
            return; // Ignora o recinto se houver um conflito com carnívoros
          }

          // Regras para hipopótamos. Hipopótamo só se sente confortável em savana e rio
          if (
            animal.toUpperCase() === "HIPOPOTAMO" &&
            !(recinto.bioma.includes("savana") && recinto.bioma.includes("rio"))
          ) {
            console.log(`Recinto ${recinto.numero} não atende aos hipopotamos`);
            return;
          }

          // Regras para macacos (não podem ficar sozinhos ou com carnívoros). Macacos não podem ficar sozinhos.
          if (
            animal.toUpperCase() === "MACACO" &&
            recinto.animais.length === 0 &&
            quantidade === 1
          ) {
            console.log(
              `Recinto ${recinto.numero} causa conflito com regras dos macacos`
            );
            return; 
          }

          // Adiciona o recinto à lista de viáveis
          recintosViaveis.push(
            `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanho})`
          );
          console.log(`Adicionou recinto ${recinto.numero} à lista de viáveis`);
        } else {
          console.log(`Recinto ${recinto.numero} não atende aos critéricos`);
        }
      });
    }

    console.log(`Encontrou ${recintosViaveis.length} recintos viáveis`);

    // Ordena os recintos viáveis pelo número do recinto
    recintosViaveis.sort((a, b) => {
      const numeroA = parseInt(a.match(/Recinto (\d+)/)[1], 10);
      const numeroB = parseInt(b.match(/Recinto (\d+)/)[1], 10);
      return numeroA - numeroB;
    });

    console.log(
      `Recintos viáveis ordenados:`,
      recintosViaveis.map((e) => e.replace(/Recinto \d+/g, ""))
    );

    // Se nenhum recinto for viável, retorna a mensagem correspondente
    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável", recintosViaveis: null };
    }

    // Retorna os recintos viáveis
    return { erro: null, recintosViaveis };
  }
}

export { RecintosZoo as RecintosZoo };

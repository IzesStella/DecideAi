import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('decideai.db');

export function initDatabase() {
  try {
    db.withTransactionSync(() => {
      // Tabela de roletas
      db.execSync(
        `CREATE TABLE IF NOT EXISTS roletas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          preset INTEGER DEFAULT 0
        );`
      );
      // Tabela de opções
      db.execSync(
        `CREATE TABLE IF NOT EXISTS opcoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          texto TEXT NOT NULL,
          r_id INTEGER,
          FOREIGN KEY (r_id) REFERENCES roletas(id)
        );`
      );
      // Tabela de resultados
      db.execSync(
        `CREATE TABLE IF NOT EXISTS resultados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          datahora TEXT,
          favorito INTEGER,
          r_id INTEGER,
          opc_id INTEGER,
          FOREIGN KEY (r_id) REFERENCES roletas(id),
          FOREIGN KEY (opc_id) REFERENCES opcoes(id)
        );`
      );
      // Tabela de sessão temporária para opções em criação
      db.execSync(
        `CREATE TABLE IF NOT EXISTS sessao_temporaria (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          opcao TEXT NOT NULL
        );`
      );

      // Inserir alguns temas pré-salvos se não existirem
      const existingPresets = db.getAllSync(`SELECT id FROM roletas WHERE id >= 1 AND id <= 6`); // ✅ Verificar por ID em vez de preset
      
      if (existingPresets.length === 0) {
        // Tema 1: Filmes de Romance
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, ["Filmes de Romance"]); // ❌ Era preset = 1, agora é 0
        const roletaId1 = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        const filmes = ["Titanic", "Diário de uma Paixão", "Como Eu Era Antes de Você", "A Escolha", "Querido John"];
        filmes.forEach(filme => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [filme, roletaId1]);
        });

        // Tema 2: Comidas para Jantar
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, ["Comidas para Jantar"]); // ❌ Era preset = 1, agora é 0
        const roletaId2 = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        const comidas = ["Pizza", "Hambúrguer", "Lasanha", "Sushi", "Macarrão", "Salada"];
        comidas.forEach(comida => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [comida, roletaId2]);
        });

        // Tema 3: Atividades de Fim de Semana
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, ["Atividades de Fim de Semana"]); // ❌ Era preset = 1, agora é 0
        const roletaId3 = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        const atividades = ["Cinema", "Parque", "Shopping", "Praia", "Trilha", "Museu", "Restaurante"];
        atividades.forEach(atividade => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [atividade, roletaId3]);
        });

        // Tema 4: Séries para Assistir
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, ["Séries para Assistir"]); // ❌ Era preset = 1, agora é 0
        const roletaId4 = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        const series = ["Breaking Bad", "Stranger Things", "The Office", "Friends", "Game of Thrones", "La Casa de Papel"];
        series.forEach(serie => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [serie, roletaId4]);
        });

        // Tema 5: Livros para Ler
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, ["Livros para Ler"]); // ❌ Era preset = 1, agora é 0
        const roletaId5 = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        const livros = ["1984", "Dom Casmurro", "O Senhor dos Anéis", "A Revolução dos Bichos", "Harry Potter"];
        livros.forEach(livro => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [livro, roletaId5]);
        });

        // tema 6: Sobremesas 
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, ["Sobremesas"]); // ❌ Era preset = 1, agora é 0
        const roletaId6 = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        const sobremesas = ["Brigadeiro", "Pudim", "Sorvete", "Torta de Chocolate", "Beijinho", "Mousse"];
        sobremesas.forEach(sobremesa => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [sobremesa, roletaId6]);
        });

        // Inserir um resultado de teste para aparecer no histórico
        const opcaoTeste = db.getFirstSync(`SELECT id FROM opcoes WHERE r_id = ? LIMIT 1`, [roletaId1]);
        if (opcaoTeste) {
          db.runSync(
            `INSERT INTO resultados (datahora, favorito, r_id, opc_id) VALUES (?, 0, ?, ?)`,
            [new Date().toISOString(), roletaId1, opcaoTeste.id]
          );
        }
      } else {
        // Se os presets já existem, verificar se há pelo menos um resultado para teste
        const existingResults = db.getAllSync(`SELECT id FROM resultados LIMIT 1`);
        if (existingResults.length === 0) {
          const opcaoTeste = db.getFirstSync(`SELECT id FROM opcoes WHERE r_id = 1 LIMIT 1`);
          if (opcaoTeste) {
            db.runSync(
              `INSERT INTO resultados (datahora, favorito, r_id, opc_id) VALUES (?, 0, ?, ?)`,
              [new Date().toISOString(), 1, opcaoTeste.id]
            );
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
}

// Funções síncronas para usar no app
export function getHistorySync() {
  try {
    const result = db.getAllSync(`
      SELECT r.id, r.datahora, ro.nome as roleta_nome, o.texto as opcao_sorteada, ro.preset, ro.id as roleta_id
      FROM resultados r
      JOIN roletas ro ON r.r_id = ro.id
      JOIN opcoes o ON r.opc_id = o.id
      ORDER BY r.datahora DESC
      LIMIT 30
    `);
    return result;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
}

export function getPresetsSync() {
  try {
    const result = db.getAllSync(`
      SELECT id, nome, preset FROM roletas WHERE preset = 1
    `);
    console.log('getPresetsSync result:', result);
    return result;
  } catch (error) {
    console.error('Erro ao buscar presets:', error);
    return [];
  }
}

export function getPresetOptionsSync(roletaId) {
  try {
    const result = db.getAllSync(`
      SELECT texto FROM opcoes WHERE r_id = ?
    `, [roletaId]);
    return result.map(row => row.texto);
  } catch (error) {
    console.error('Erro ao buscar opções:', error);
    return [];
  }
}

export function saveResultSync(roletaId, opcaoTexto) {
  try {
    console.log('=== SALVANDO RESULTADO ===');
    console.log('RoletaId:', roletaId);
    console.log('Opção:', opcaoTexto);
    
    db.withTransactionSync(() => {
      // Buscar o ID da opção pelo texto e roleta
      const opcao = db.getFirstSync(
        `SELECT id FROM opcoes WHERE r_id = ? AND texto = ?`,
        [roletaId, opcaoTexto]
      );
      
      console.log('Opção encontrada:', opcao);
      
      if (opcao) {
        const dataHora = new Date().toISOString();
        db.runSync(
          `INSERT INTO resultados (datahora, favorito, r_id, opc_id) VALUES (?, ?, ?, ?)`,
          [dataHora, 0, roletaId, opcao.id]
        );
        console.log('Resultado salvo com sucesso!');
        
        // Verificar se foi salvo
        const ultimoResultado = db.getFirstSync(`SELECT * FROM resultados ORDER BY id DESC LIMIT 1`);
        console.log('Último resultado salvo:', ultimoResultado);
      } else {
        console.error('ERRO: Opção não encontrada no banco');
        // Verificar opções disponíveis
        const opcoesDisponiveis = db.getAllSync(`SELECT * FROM opcoes WHERE r_id = ?`, [roletaId]);
        console.log('Opções disponíveis para roleta', roletaId, ':', opcoesDisponiveis);
      }
    });
    console.log('=========================');
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
  }
}

export function saveCustomRoletaSync(nome, opcoes) {
  try {
    console.log('=== SALVANDO ROLETA CUSTOMIZADA ===');
    console.log('Nome:', nome);
    console.log('Opções:', opcoes);
    let roletaId;
    db.withTransactionSync(() => {
      // Inserir roleta (preset = 0 inicialmente)
      db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, [nome]);
      roletaId = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
      
      // Inserir opções
      opcoes.forEach(opcao => {
        db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [opcao, roletaId]);
      });
    });
    console.log('Roleta salva com sucesso, ID:', roletaId);
    console.log('====================================');
    return roletaId;
  } catch (error) {
    console.error('Erro ao salvar roleta customizada:', error);
    return null;
  }
}

// Funções para gerenciar sessão temporária de opções
export function getCurrentSessionOptionsSync() {
  try {
    const result = db.getAllSync(`SELECT opcao FROM sessao_temporaria ORDER BY id`);
    return result.map(row => row.opcao);
  } catch (error) {
    console.error('Erro ao buscar opções da sessão:', error);
    return [];
  }
}

export function saveSessionOptionSync(opcao) {
  try {
    db.runSync(`INSERT INTO sessao_temporaria (opcao) VALUES (?)`, [opcao]);
  } catch (error) {
    console.error('Erro ao salvar opção na sessão:', error);
  }
}

export function removeSessionOptionSync(opcao) {
  try {
    db.runSync(`DELETE FROM sessao_temporaria WHERE opcao = ? AND id = (
      SELECT id FROM sessao_temporaria WHERE opcao = ? LIMIT 1
    )`, [opcao, opcao]);
  } catch (error) {
    console.error('Erro ao remover opção da sessão:', error);
  }
}

export function clearCurrentSessionSync() {
  try {
    db.runSync(`DELETE FROM sessao_temporaria`);
  } catch (error) {
    console.error('Erro ao limpar sessão:', error);
  }
}

// Função para favoritar uma roleta (transformar em preset)
export function favoriteRoletaSync(roletaId) {
  try {
    console.log('=== FAVORITANDO ROLETA ===');
    console.log('ID da roleta:', roletaId);
    
    // Verificar se a roleta existe antes
    const roletaExiste = db.getFirstSync(`SELECT * FROM roletas WHERE id = ?`, [roletaId]);
    console.log('Roleta antes da atualização:', roletaExiste);
    
    db.runSync(`UPDATE roletas SET preset = 1 WHERE id = ?`, [roletaId]);
    
    // Verificar se foi atualizada
    const roletaAtualizada = db.getFirstSync(`SELECT * FROM roletas WHERE id = ?`, [roletaId]);
    console.log('Roleta após atualização:', roletaAtualizada);
    
    console.log('Roleta favoritada com sucesso!');
    console.log('==========================');
    return true;
  } catch (error) {
    console.error('Erro ao favoritar roleta:', error);
    return false;
  }
}

// Função para desfavoritar uma roleta (remover dos presets)
export function unfavoriteRoletaSync(roletaId) {
  try {
    db.runSync(`UPDATE roletas SET preset = 0 WHERE id = ?`, [roletaId]);
    console.log('Roleta desfavoritada:', roletaId);
    return true;
  } catch (error) {
    console.error('Erro ao desfavoritar roleta:', error);
    return false;
  }
}

// Função para atualizar opções de um preset
export function updatePresetOptionsSync(roletaId, novasOpcoes) {
  try {
    db.withTransactionSync(() => {
      // Remover opções antigas
      db.runSync(`DELETE FROM opcoes WHERE r_id = ?`, [roletaId]);
      
      // Inserir novas opções
      novasOpcoes.forEach(opcao => {
        db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [opcao, roletaId]);
      });
    });
    console.log('Opções do preset atualizadas:', roletaId);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar opções do preset:', error);
    return false;
  }
}

// Função para atualizar nome e opções de um preset
export function updatePresetSync(roletaId, novoNome, novasOpcoes) {
  try {
    db.withTransactionSync(() => {
      // Atualizar nome
      db.runSync(`UPDATE roletas SET nome = ? WHERE id = ?`, [novoNome, roletaId]);
      
      // Remover opções antigas
      db.runSync(`DELETE FROM opcoes WHERE r_id = ?`, [roletaId]);
      
      // Inserir novas opções
      novasOpcoes.forEach(opcao => {
        db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [opcao, roletaId]);
      });
    });
    console.log('Preset atualizado:', roletaId, novoNome);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar preset:', error);
    return false;
  }
}

// Função para buscar todas as roletas (para usar no FavoritesScreen)
export function getAllRoletasSync() {
  try {
    const result = db.getAllSync(`
      SELECT id, nome, preset FROM roletas ORDER BY id
    `);
    console.log('getAllRoletasSync result:', result);
    return result;
  } catch (error) {
    console.error('Erro ao buscar todas as roletas:', error);
    return [];
  }
}

// Função para resetar o banco de dados (apagar todas as tabelas e dados)
export function resetDatabase() {
  try {
    console.log('🔥 RESETANDO BANCO...');
    db.withTransactionSync(() => {
      db.execSync(`DROP TABLE IF EXISTS resultados`);
      db.execSync(`DROP TABLE IF EXISTS opcoes`);
      db.execSync(`DROP TABLE IF EXISTS roletas`);
      db.execSync(`DROP TABLE IF EXISTS sessao_temporaria`);
    });
    console.log('✅ Banco resetado!');
  } catch (error) {
    console.error('❌ Erro ao resetar:', error);
  }
}
//lembrar de tirar em cima
export default db;

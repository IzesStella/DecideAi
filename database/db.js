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
      const existingPresets = db.getAllSync(`SELECT id FROM roletas WHERE preset = 1`);
      
      if (existingPresets.length === 0) {
        // Inserir tema "Filmes de Romance"
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 1)`, ["Filmes de Romance"]);
        const roletaId = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        
        const filmes = ["Titanic", "Diário de uma Paixão", "Como Eu Era Antes de Você", "A Escolha", "Querido John"];
        filmes.forEach(filme => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [filme, roletaId]);
        });

        // Inserir tema "Comidas para Jantar"
        db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 1)`, ["Comidas para Jantar"]);
        const roletaId2 = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
        
        const comidas = ["Pizza", "Hambúrguer", "Lasanha", "Sushi", "Macarrão", "Salada"];
        comidas.forEach(comida => {
          db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [comida, roletaId2]);
        });

        // Inserir um resultado de teste para aparecer no histórico
        const opcaoTeste = db.getFirstSync(`SELECT id FROM opcoes WHERE r_id = ? LIMIT 1`, [roletaId]);
        if (opcaoTeste) {
          db.runSync(
            `INSERT INTO resultados (datahora, favorito, r_id, opc_id) VALUES (?, 0, ?, ?)`,
            [new Date().toISOString(), roletaId, opcaoTeste.id]
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
      SELECT id, nome FROM roletas WHERE preset = 1
    `);
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
      // Inserir a roleta
      db.runSync(`INSERT INTO roletas (nome, preset) VALUES (?, 0)`, [nome]);
      roletaId = db.getFirstSync(`SELECT last_insert_rowid() as id`).id;
      console.log('Roleta criada com ID:', roletaId);
      
      // Inserir as opções
      opcoes.forEach((opcao, index) => {
        db.runSync(`INSERT INTO opcoes (texto, r_id) VALUES (?, ?)`, [opcao, roletaId]);
        console.log(`Opção ${index + 1} inserida:`, opcao);
      });

      // Limpar sessão temporária após salvar
      db.runSync(`DELETE FROM sessao_temporaria`);
      console.log('Sessão temporária limpa');
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
    db.runSync(`UPDATE roletas SET preset = 1 WHERE id = ?`, [roletaId]);
    console.log('Roleta favoritada:', roletaId);
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

export default db;

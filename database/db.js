import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('decideai.db');

export function initDatabase() {
  db.transaction(tx => {
    // Tabela de roletas
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS roletas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preset INTEGER DEFAULT 0
      );`
    );
    // Tabela de opções
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS opcoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT NOT NULL,
        r_id INTEGER,
        FOREIGN KEY (r_id) REFERENCES roletas(id)
      );`
    );
    // Tabela de resultados
    tx.executeSql(
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
  });
}

export default db;

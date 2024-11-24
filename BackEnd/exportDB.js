const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function runMongoExport(exportCommand) {
  return new Promise((resolve, reject) => {
    exec(exportCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Errore durante l'export: ${error}`);
        return;
      }
      if (stderr) {
        //reject(`stderr: ${stderr}`);
        //return;
      }
      resolve(stdout);
    });
  });
}

(async () => {
  try {
    const DB_NAME = 'OasiTN';
    const OUTPUT_DIR = './exported_data';
    const MONGOSH_FILE = path.join(OUTPUT_DIR, 'populate_mongosh.txt');
    const MONGOIMPORT_FILE = path.join(OUTPUT_DIR, 'populate_mongoimport.txt');

    // Connetti a MongoDB
    await mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`);
    console.log('Connessione a MongoDB riuscita!');

    const db = mongoose.connection.db;

    // Crea la cartella per l'output se non esiste
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    // File per i comandi di mongosh e mongoimport
    const mongoshFileStream = fs.createWriteStream(MONGOSH_FILE);
    const mongoimportFileStream = fs.createWriteStream(MONGOIMPORT_FILE);

    mongoshFileStream.write(`# Comandi per popolare il database ${DB_NAME} con mongosh\n`);
    mongoshFileStream.write(`use ${DB_NAME}\n\n`);

    mongoimportFileStream.write(`# Comandi per popolare il database ${DB_NAME} con mongoimport\n\n`);

    // Ottieni tutte le collezioni
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Esportando la collezione: ${collectionName}`);

      // Identifica se la collezione è una time series
      const isTimeSeries = collectionName.startsWith('system.buckets.');
      const actualCollectionName = isTimeSeries
        ? collectionName.replace('system.buckets.', '')
        : collectionName;

      // Ottieni lo schema di validazione o timeSeries options
      const schemaInfo = await db.command({
        listCollections: 1,
        filter: { name: actualCollectionName },
      });

      const collectionOptions = schemaInfo.cursor.firstBatch[0]?.options || {};
      const timeSeriesOptions = collectionOptions.timeSeries || null;
      const validator = collectionOptions.validator || null;

      // Salva il comando per creare la collezione
      const createCollectionCommand = {
        create: actualCollectionName,
        ...(timeSeriesOptions && { timeSeries: timeSeriesOptions }),
        ...(validator && { validator }),
      };

      const createFilePath = path.join(OUTPUT_DIR, `${actualCollectionName}_create.json`);
      fs.writeFileSync(createFilePath, JSON.stringify(createCollectionCommand, null, 2));

      console.log(`Comando di creazione salvato per ${actualCollectionName}`);
      mongoshFileStream.write(
        `db.createCollection("${actualCollectionName}", ${JSON.stringify(createCollectionCommand, null, 2)});\n`
      );

      // Esporta i dati dalla collezione (non dai bucket) se non è una collezione time series
      if (!isTimeSeries) {
        const dataFilePath = path.join(OUTPUT_DIR, `${actualCollectionName}_data.json`);

        // Esegui mongoexport per esportare i dati della collezione
        const exportCommand = `mongoexport --db ${DB_NAME} --collection ${actualCollectionName} --out ${dataFilePath} --jsonArray`;
        
        try {
          // Aspetta che l'export sia completato
          await runMongoExport(exportCommand);
          console.log(`Dati esportati con successo per la collezione ${actualCollectionName}`);
          // scrivi il comando per mongoimport solo se sono stati esportati dati (non vuoti).
          //considera che file vuoti contengono solo [] e non sono vuoti
          if(fs.readFileSync(dataFilePath).toString().length > 3){
            mongoimportFileStream.write(`mongoimport --db ${DB_NAME} --collection ${actualCollectionName} --file ${dataFilePath} --jsonArray\n`);
          }  
          // Scrivi il comando per mongoimport
        } catch (err) {
          console.error(`Errore durante l'esportazione dei dati per ${actualCollectionName}:`, err);
        }

      } else {
        console.log(`Skipping data export for time series collection: ${actualCollectionName}`);
        mongoshFileStream.write(
          `# Nota: i dati per la collezione ${actualCollectionName} non sono stati esportati (time series).\n`
        );
      }
    }

    mongoshFileStream.end();
    mongoimportFileStream.end();
    console.log(`File comandi generato: ${MONGOSH_FILE}`);
    console.log(`File comandi generato: ${MONGOIMPORT_FILE}`);

    console.log('Esportazione completata!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Errore:', error);
  }
})();

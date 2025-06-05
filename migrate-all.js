require('dotenv').config();
const { MongoClient } = require('mongodb');

const localURI = process.env.LOCAL_URI;
const atlasURI = process.env.ATLAS_URI;

async function migrateCollection(collectionName) {
  const localClient = new MongoClient(localURI);
  const atlasClient = new MongoClient(atlasURI);

  try {
    await localClient.connect();
    await atlasClient.connect();

    const localDB = localClient.db('polisync');
    const atlasDB = atlasClient.db('polisync');

    const localCollection = localDB.collection(collectionName);
    const atlasCollection = atlasDB.collection(collectionName);

    const docs = await localCollection.find({}).toArray();
    if (docs.length === 0) {
      console.log(`⚠️ No documents found in '${collectionName}', skipping.`);
      return;
    }

    await atlasCollection.insertMany(docs);
    console.log(`✅ Migrated ${docs.length} documents to '${collectionName}' collection.`);
  } catch (err) {
    console.error(`❌ Error migrating '${collectionName}':`, err);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

async function migrateAll() {
  await migrateCollection('firs');
  await migrateCollection('complaints');
  await migrateCollection('users');
}

migrateAll();

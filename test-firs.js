// test-firs.js
const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://22wh1a12b3:22wh1a12b3@polisynccluster.3l4gtds.mongodb.net/polisync?retryWrites=true&w=majority&appName=PolisyncCluster"

const FIRSchema = new mongoose.Schema({}, { collection: 'firs', strict: false });
const FIR = mongoose.model('FIR', FIRSchema);

async function testDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const firs = await FIR.find({});
    console.log(`Found ${firs.length} FIR(s):`);
    firs.forEach((fir, i) => {
      console.log(`FIR #${i + 1}:`, fir);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDB();

const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(['1.1.1.1','8.8.8.8']);
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não encontrada no arquivo .env");
    }

    await mongoose.connect(
          process.env.MONGO_URI
        );
        console.log(mongoose.connection.host);
    
        console.log("MongoDB conectado");
    
      } catch (error) {
    
        console.error(
          "Erro ao conectar ao MongoDB:",
          error.message
        );
    
        process.exit(1);
      }
    };
module.exports = connectDB;

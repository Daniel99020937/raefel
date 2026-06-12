const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
{
    nome:{
        type:String,
        required:true
    },

    descricao:{
        type:String,
        default:""
    },

    preco:{
        type:Number,
        required:true
    },

    imagem:{
        type:String,
        required:true
    },

    categoria:{
        type:String,
        default:"Geral"
    },

    estoque:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Product", ProductSchema);
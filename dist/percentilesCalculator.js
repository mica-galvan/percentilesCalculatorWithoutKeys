"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//percentilesCalculator.ts
// Importar el módulo fs y path
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const admin = __importStar(require("firebase-admin"));
// Obtener la ruta absoluta del archivo "scoreData.json"
const scoreDataPath = path.join(__dirname, "scoreData.json");
// Leer el contenido del archivo "scoreData.json"
const scoreData = JSON.parse(fs.readFileSync(scoreDataPath, "utf8"));
// Función para calcular el percentil dado una lista de datos y un percentil deseado
function calculatePercentile(data, percentile) {
    if (data.length === 0)
        return 0;
    // Ordenar los datos de forma ascendente
    const sortedData = data.sort((a, b) => a - b);
    // Calcular el índice correspondiente al percentil
    const index = Math.ceil((percentile / 100) * sortedData.length) - 1;
    // Obtener el valor del percentil
    return sortedData[index];
}
// Obtener la lista de puntuaciones (scores) del archivo JSON
const scores = scoreData.map((entry) => entry.score);
// Calcular los percentiles 10, 50 y 90
const percentiles = {
    percentile10: calculatePercentile(scores, 10),
    percentile50: calculatePercentile(scores, 50),
    percentile90: calculatePercentile(scores, 90),
};
// Mostrar los resultados en la consola
console.log("Scores:", scores);
console.log("Percentiles:", percentiles);
// Ruta al archivo de credenciales de Firebase
const serviceAccount = require("./services/");
// Inicializar la aplicación de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://climatesciense.firebaseio.com"
});
// Función para obtener documentos desde Firestore de forma paralela
function getDocumentsFromFirestoreParallel() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.firestore();
        const collectionRef = db.collection("climatesciense");
        // Realizar una consulta para obtener todos los documentos
        const querySnapshot = yield collectionRef.get();
        // Crear un array para almacenar los datos de los documentos
        const documentsData = [];
        // Recorrer el resultado de la consulta y obtener los datos de cada documento
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            documentsData.push(data);
        });
        return documentsData;
    });
}
// Llamar a la función para obtener los documentos de Firestore
getDocumentsFromFirestoreParallel().then((documentsData) => {
    console.log("Documentos obtenidos desde Firestore:", documentsData);
});

//percentilesCalculator.ts
// Importar el módulo fs y path
import * as fs from "fs";
import * as path from "path";
import * as admin from "firebase-admin";


// Obtener la ruta absoluta del archivo "scoreData.json"
const scoreDataPath = path.join(__dirname, "scoreData.json");

// Leer el contenido del archivo "scoreData.json"
const scoreData = JSON.parse(fs.readFileSync(scoreDataPath, "utf8"));

// Función para calcular el percentil dado una lista de datos y un percentil deseado
function calculatePercentile(data: number[], percentile: number): number {
  if (data.length === 0) return 0;

  // Ordenar los datos de forma ascendente
  const sortedData = data.sort((a, b) => a - b);

  // Calcular el índice correspondiente al percentil
  const index = Math.ceil((percentile / 100) * sortedData.length) - 1;

  // Obtener el valor del percentil
  return sortedData[index];
}

// Obtener la lista de puntuaciones (scores) del archivo JSON
const scores = scoreData.map((entry: any) => entry.score);

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
async function getDocumentsFromFirestoreParallel(): Promise<any[]> {
  const db = admin.firestore();

  const collectionRef = db.collection("climatesciense");

  // Realizar una consulta para obtener todos los documentos
  const querySnapshot = await collectionRef.get();

  // Crear un array para almacenar los datos de los documentos
  const documentsData: any[] = [];

  // Recorrer el resultado de la consulta y obtener los datos de cada documento
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    documentsData.push(data);
  });

  return documentsData;
}

// Llamar a la función para obtener los documentos de Firestore
getDocumentsFromFirestoreParallel().then((documentsData) => {
  console.log("Documentos obtenidos desde Firestore:", documentsData);
});

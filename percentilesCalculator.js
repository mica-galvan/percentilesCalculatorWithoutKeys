"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//percentilesCalculator.ts
// Importar el módulo fs y path
var fs = require("fs");
var path = require("path");
var admin = require("firebase-admin");
// Obtener la ruta absoluta del archivo "scoreData.json"
var scoreDataPath = path.join(__dirname, "scoreData.json");
// Leer el contenido del archivo "scoreData.json"
var scoreData = JSON.parse(fs.readFileSync(scoreDataPath, "utf8"));
// Función para calcular el percentil dado una lista de datos y un percentil deseado
function calculatePercentile(data, percentile) {
    if (data.length === 0)
        return 0;
    // Ordenar los datos de forma ascendente
    var sortedData = data.sort(function (a, b) { return a - b; });
    // Calcular el índice correspondiente al percentil
    var index = Math.ceil((percentile / 100) * sortedData.length) - 1;
    // Obtener el valor del percentil
    return sortedData[index];
}
// Obtener la lista de puntuaciones (scores) del archivo JSON
var scores = scoreData.map(function (entry) { return entry.score; });
// Calcular los percentiles 10, 50 y 90
var percentiles = {
    percentile10: calculatePercentile(scores, 10),
    percentile50: calculatePercentile(scores, 50),
    percentile90: calculatePercentile(scores, 90),
};
// Mostrar los resultados en la consola
console.log("Scores:", scores);
console.log("Percentiles:", percentiles);
// Ruta al archivo de credenciales de Firebase
var serviceAccount = require("./services/climatesciense-firebase-adminsdk-o0f1s-5fcece2f6e.json");
// Inicializar la aplicación de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://climatesciense.firebaseio.com"
});
// Función para obtener documentos desde Firestore de forma paralela
function getDocumentsFromFirestoreParallel() {
    return __awaiter(this, void 0, void 0, function () {
        var db, collectionRef, querySnapshot, documentsData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = admin.firestore();
                    collectionRef = db.collection("climatesciense");
                    return [4 /*yield*/, collectionRef.get()];
                case 1:
                    querySnapshot = _a.sent();
                    documentsData = [];
                    // Recorrer el resultado de la consulta y obtener los datos de cada documento
                    querySnapshot.forEach(function (doc) {
                        var data = doc.data();
                        documentsData.push(data);
                    });
                    return [2 /*return*/, documentsData];
            }
        });
    });
}
// Llamar a la función para obtener los documentos de Firestore
getDocumentsFromFirestoreParallel().then(function (documentsData) {
    console.log("Documentos obtenidos desde Firestore:", documentsData);
});

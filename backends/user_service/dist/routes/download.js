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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
router.get('/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //    
    const filename = req.params.filename;
    console.log("filename");
    console.log("filename");
    console.log("filename");
    console.log(filename);
    const filePath = path_1.default.join('./public/apk', filename);
    console.log("filePath");
    console.log("filePath");
    console.log("filePath");
    console.log("filePath");
    console.log(filePath);
    // 
    // Vérifier si le fichier existe
    fs_1.default.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).send('File not found');
        }
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const readStream = fs_1.default.createReadStream(filePath);
        // let downloadedBytes = 0;
        // readStream.on('data', (chunk) => {
        //     downloadedBytes += chunk.length;
        //     const progress = (downloadedBytes / stats.size) * 100;
        //     console.log(`Download progress: ${progress.toFixed(2)}%`);
        // });
        readStream.on('error', (error) => {
            console.error('Stream error', error);
            res.status(500).send('Error downloading file: ' + error.message);
        });
        readStream.on('end', () => {
            console.log('Download complete');
            res.status(200).end(); // Envoi de la réponse 200 pour indiquer que le téléchargement est terminé
        });
        readStream.pipe(res).on('error', (error) => {
            console.error('Response error', error);
            res.status(500).send('Error sending file: ' + error.message);
        });
        //   
    });
    // 
}));
exports.default = router;

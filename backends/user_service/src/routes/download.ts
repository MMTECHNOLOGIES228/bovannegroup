
import { Router, Request, Response } from 'express';
const router = Router();
import path from 'path';
import fs from 'fs';
import { pipeline, finished } from 'stream';

router.get('/:filename', async (req: Request, res: Response) => {
    //    

    const filename = req.params.filename;
    console.log("filename");
    console.log("filename");
    console.log("filename");
    console.log(filename);
    const filePath = path.join('./public/apk', filename);
    console.log("filePath");
    console.log("filePath");
    console.log("filePath");
    console.log("filePath");
    console.log(filePath);

    // 
    // Vérifier si le fichier existe
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).send('File not found');
        }

        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const readStream = fs.createReadStream(filePath);
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
});


export default router;

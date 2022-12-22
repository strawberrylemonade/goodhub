import { Router } from 'express';
import multer from 'multer';
import { WorkingFolder } from '../helpers/temp';
import { MissingParameterError } from '../../../shared';
import { processAndUploadImage, ProcessedImage } from '../services/image-service';
import { verifyAuthentication } from '../helpers/auth';

// This is a slightly special use of
// working folder that makes it synchronous
const path = WorkingFolder.makeTempFolderSync();
const dir = new WorkingFolder(path)

const upload = multer({ dest: dir.path });
const router = Router()

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const [token] = await verifyAuthentication(req.headers);
    const alt = req.body.alt;
    if (!alt || !req.file) throw new MissingParameterError('alt', 'image');

    const image: ProcessedImage = {
      location: {
        path: req.file.path
      },
      alt,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype
    }

    const manifest = await processAndUploadImage(image, token.personId);
    res.status(201);
    res.json(manifest);
  } catch (e) {
    res.status(e.code);
    res.json(e.toJSON());
  }
});

router.post('/graphic', async (req, res) => {
  try {
    const [token] = await verifyAuthentication(req.headers);
    const alt = req.body.alt;
    try {
      res.status(201);
      res.json({});
    } catch (e) {
      console.log(e);
    }

  } catch (e) {
    res.status(e.code);
    res.json(e.toJSON?.());
  }
})

export default router;
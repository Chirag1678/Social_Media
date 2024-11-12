import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.contoller.js";

const router = Router();

router.route('/').get(healthcheck); //route to check the health of the server

export default router;
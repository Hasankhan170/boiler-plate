import express from 'express';
import { applyLoan } from '../controllers/loan.controllers.js';

const  router = express.Router();

router.post("/loan",applyLoan)

export default router;
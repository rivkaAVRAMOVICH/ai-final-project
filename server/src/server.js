import express from 'express';
import cors from 'cors';
import studyRoutes from './routes/study.routes.js';


const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api/study', studyRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

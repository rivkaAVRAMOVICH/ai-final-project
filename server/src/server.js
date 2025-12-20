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
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
app.use('/api/study', studyRoutes);


export default app;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running at http://0.0.0.0:${PORT}`);
// });
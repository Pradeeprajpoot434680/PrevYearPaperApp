import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routes/userRouter.js';
import paperRouter from './routes/paperRouter.js';
import adminRouter from './routes/adminRoute.js';
import uploadRouter from './routes/uploadRoute.js';
import { generalLimiter } from './utils/rateLimit.js';
dotenv.config();
const app = express();


const port = process.env.PORT || 3000;
const allowedOrigins = [
  'https://prev-year-paper-app.vercel.app',
  "https://prevpaper.pdeep.store",
   "http://localhost:5173"
];


app.use(helmet());

app.use((req, res, next) => {
  console.log('Incoming Origin:', req.headers.origin);
  next();
});

app.set('trust proxy', 1);



app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow server-to-server, curl, Postman
      const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed));
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Very important for preflight handling




// Limit body size to 5 MB for JSON and URL-encoded data

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(cookieParser());

app.use("/api", generalLimiter);

app.use('/api/auth', authRouter);
app.use('/api/user', paperRouter);


app.use('/api/admin', adminRouter);
app.use('/api', uploadRouter);


app.get('/check', (req, res) => {
  res.send('Check route is working');
});

const BACKEND_URL = "https://myprevyearpaperapp.onrender.com"
app.listen(port, () => {
  console.log(`Example app listening at ${BACKEND_URL}`);
});


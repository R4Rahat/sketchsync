import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';


const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const startServer = async () => {
    await connectDB();
    const server = app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`)
    })

    server.on('error', (error) => {
        console.error(`Server error ${error.message}
            ${error.cause}`)

        process.exit(1)
    })
}

startServer()
import { Router } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

const router = Router();
const routesPath = join(__dirname, 'routes');

// Automatically load all route files in the `routes/` folder
readdirSync(routesPath).forEach((file) => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const route = require(join(routesPath, file)).default; // Import the route
    const routeName = file.split('.')[0]; // Use the filename as the route prefix
    router.use(`/${routeName}`, route);
  }
});

export default router;

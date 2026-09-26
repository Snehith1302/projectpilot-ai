import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';
import { getVersion } from '../controllers/version.controller';
import { getProviders, getModels } from '../controllers/provider.controller';
import { generateProjects } from '../controllers/generate.controller';
import { validateBody } from '../middleware/validation';
import { generateRateLimiter } from '../middleware/rateLimiter';
import { ProjectGenerationInputSchema } from 'shared';

const router = Router();

// Routes definitions
router.get('/health', getHealth);
router.get('/version', getVersion);
router.get('/providers', getProviders);
router.get('/models', getModels);
router.post('/generate', generateRateLimiter, validateBody(ProjectGenerationInputSchema), generateProjects);

export const apiRouter = router;
export default apiRouter;

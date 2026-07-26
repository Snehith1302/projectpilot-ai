"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const version_controller_1 = require("../controllers/version.controller");
const provider_controller_1 = require("../controllers/provider.controller");
const generate_controller_1 = require("../controllers/generate.controller");
const validation_1 = require("../middleware/validation");
const shared_1 = require("shared");
const router = (0, express_1.Router)();
// Routes definitions
router.get('/health', health_controller_1.getHealth);
router.get('/version', version_controller_1.getVersion);
router.get('/providers', provider_controller_1.getProviders);
router.get('/models', provider_controller_1.getModels);
router.post('/generate', (0, validation_1.validateBody)(shared_1.ProjectGenerationInputSchema), generate_controller_1.generateProjects);
exports.apiRouter = router;
exports.default = exports.apiRouter;

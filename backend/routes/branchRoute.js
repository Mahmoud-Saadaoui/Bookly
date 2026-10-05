const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const branchRules = require('../validators/branchValidator');
const {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch
} = require('../controllers/branchController');

// Public routes (authentication required)
router.get('/', auth.check, getBranches);
router.get('/:id', auth.check, getBranchById);

// Admin/fleet_manager routes
router.post(
  '/',
  auth.check,
  authorize('admin', 'fleet_manager'),
  branchRules.create,
  validate,
  createBranch
);

router.patch(
  '/:id',
  auth.check,
  authorize('admin', 'fleet_manager'),
  branchRules.update,
  validate,
  updateBranch
);

// Delete: admin only
router.delete(
  '/:id',
  auth.check,
  authorize('admin'),
  deleteBranch
);

module.exports = router;

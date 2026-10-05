const Branch = require('../models/branch');
const { asyncHandler } = require('../middlewares/asyncHandler');
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  badRequestResponse,
  paginatedResponse
} = require('../utils/apiResponse');
const { parsePagination, getPaginationMeta } = require('../utils/pagination');

/**
 * Create a new branch
 * POST /api/branches
 */
const createBranch = asyncHandler(async (req, res) => {
  const { name, code, address, phone, email } = req.body;

  // Check code uniqueness
  const existing = await Branch.findOne({ code: code.toUpperCase() });
  if (existing) {
    return badRequestResponse(res, `Branch code "${code}" already exists`);
  }

  const branch = await Branch.create({
    name,
    code: code.toUpperCase(),
    address,
    phone,
    email
  });

  return createdResponse(res, branch, 'Branch created successfully');
});

/**
 * Paginated list of branches
 * GET /api/branches
 */
const getBranches = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  // Optional filter by city or active status
  const filter = {};
  if (req.query.city) filter['address.city'] = new RegExp(req.query.city, 'i');
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const [branches, total] = await Promise.all([
    Branch.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Branch.countDocuments(filter)
  ]);

  return paginatedResponse(res, branches, getPaginationMeta(page, limit, total), 'Branches retrieved successfully');
});

/**
 * Get branch details by ID
 * GET /api/branches/:id
 */
const getBranchById = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id).lean();
  if (!branch) {
    return notFoundResponse(res, 'Branch');
  }
  return successResponse(res, branch, 'Branch retrieved successfully');
});

/**
 * Update a branch
 * PATCH /api/branches/:id
 */
const updateBranch = asyncHandler(async (req, res) => {
  const { name, code, address, phone, email, isActive } = req.body;

  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    return notFoundResponse(res, 'Branch');
  }

  // Check code uniqueness if changed
  if (code && code.toUpperCase() !== branch.code) {
    const existing = await Branch.findOne({ code: code.toUpperCase() });
    if (existing) {
      return badRequestResponse(res, `Branch code "${code}" already exists`);
    }
    branch.code = code.toUpperCase();
  }

  // Update provided fields
  if (name !== undefined) branch.name = name;
  if (address !== undefined) branch.address = { ...branch.address, ...address };
  if (phone !== undefined) branch.phone = phone;
  if (email !== undefined) branch.email = email;
  if (isActive !== undefined) branch.isActive = isActive;

  await branch.save();
  return successResponse(res, branch, 'Branch updated successfully');
});

/**
 * Delete a branch (soft delete)
 * DELETE /api/branches/:id
 */
const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    return notFoundResponse(res, 'Branch');
  }

  // Soft delete: deactivate instead of removing
  branch.isActive = false;
  await branch.save();

  return successResponse(res, null, 'Branch deleted successfully');
});

module.exports = {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch
};

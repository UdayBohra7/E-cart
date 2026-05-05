import { PrismaClient, Category } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody: any): Promise<Category> => {
  return prisma.category.create({
    data: categoryBody,
  });
};

/**
 * Query for categories
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<any>}
 */
const queryCategories = async (filter: any, options: any) => {
  const { limit = 10, page = 1 } = options;
  const skip = (page - 1) * limit;

  const [categories, totalResults] = await Promise.all([
    prisma.category.findMany({
      where: filter,
      skip: Number(skip),
      take: Number(limit),
    }),
    prisma.category.count({ where: filter }),
  ]);

  return {
    results: categories,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
  };
};

/**
 * Get category by id
 * @param {number} id
 * @returns {Promise<Category | null>}
 */
const getCategoryById = async (id: number): Promise<Category | null> => {
  return prisma.category.findUnique({ where: { id } });
};

/**
 * Update category by id
 * @param {number} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId: number, updateBody: any): Promise<Category> => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return prisma.category.update({
    where: { id: categoryId },
    data: updateBody,
  });
};

/**
 * Delete category by id
 * @param {number} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId: number): Promise<Category> => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return prisma.category.delete({ where: { id: categoryId } });
};

export default {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};

import { PrismaClient, Product } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody: any): Promise<Product> => {
  return prisma.product.create({
    data: productBody,
  });
};

/**
 * Query for products
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<any>}
 */
const queryProducts = async (filter: any, options: any) => {
  const { limit = 10, page = 1, sortBy } = options;
  const skip = (page - 1) * limit;

  const [products, totalResults] = await Promise.all([
    prisma.product.findMany({
      where: filter,
      skip: Number(skip),
      take: Number(limit),
      include: {
        category: true,
      },
    }),
    prisma.product.count({ where: filter }),
  ]);

  return {
    results: products,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
  };
};

/**
 * Get product by id
 * @param {number} id
 * @returns {Promise<Product | null>}
 */
const getProductById = async (id: number): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

/**
 * Update product by id
 * @param {number} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId: number, updateBody: any): Promise<Product> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return prisma.product.update({
    where: { id: productId },
    data: updateBody,
  });
};

/**
 * Delete product by id
 * @param {number} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId: number): Promise<Product> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return prisma.product.delete({ where: { id: productId } });
};

export default {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};

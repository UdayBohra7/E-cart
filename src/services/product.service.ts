import { PrismaClient, Product } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

const createProduct = async (productBody: any): Promise<Product> => {
  return prisma.product.create({
    data: productBody,
  });
};

const queryProducts = async (filter: any, options: any) => {
  const products = await prisma.product.findMany({
    where: filter,
    skip: options.skip,
    take: options.take,
    include: { category: true },
  });
  return products;
};

const getProductById = async (id: number): Promise<Product | null> => {
  return prisma.product.findUnique({ where: { id }, include: { category: true } });
};

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

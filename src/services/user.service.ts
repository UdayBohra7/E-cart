import { PrismaClient, User, Role } from '@prisma/client';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: any): Promise<User> => {
  if (await prisma.user.findUnique({ where: { email: userBody.email } })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  return prisma.user.create({
    data: {
      ...userBody,
      password: hashedPassword,
    },
  });
};

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter: any, options: any) => {
  const users = await prisma.user.findMany({
    where: filter,
    skip: options.skip,
    take: options.take,
  });
  return users;
};

/**
 * Get user by id
 * @param {number} id
 * @returns {Promise<User | null>}
 */
const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: number, updateBody: any): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await prisma.user.findUnique({ where: { email: updateBody.email }, rejectOnNotFound: false } as any))) {
      // Need to handle email uniqueness check separately if changing email
      const existingUser = await getUserByEmail(updateBody.email);
      if(existingUser && existingUser.id !== userId) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
      }
  }
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }
  return prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });
};

/**
 * Delete user by id
 * @param {number} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: number): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return prisma.user.delete({ where: { id: userId } });
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

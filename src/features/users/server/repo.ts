import { prisma } from '@/db/prisma';
import { Prisma, User } from '@prisma/client';

async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
  });
}

async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return await prisma.user.create({
    data,
  });
}

async function updateEmailVerifiedDate(id: string, date: Date): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data: { emailVerified: date },
  });
}

async function updatePassword(id: string, password: string): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data: { password },
  });
}

export const userRepo = {
  getUserByEmail,
  getUserById,
  createUser,
  updateEmailVerifiedDate,
  updatePassword,
};

import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario administrador
  const adminPassword = await hash('superadmin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cima.com' },
    update: {},
    create: {
      email: 'admin@cima.com',
      name: 'Administrador',
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  })

  // Crear usuario cliente
  const userPassword = await hash('admin123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'admin@client.com' },
    update: {},
    create: {
      email: 'admin@client.com',
      name: 'Administrador Cliente',
      password: userPassword,
      role: Role.CLIENT,
    },
  })

  // Crear cliente asociado al usuario
  const client = await prisma.client.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: 'Cliente Demo',
      userId: user.id,
    },
  })

  // Crear token de Repsly
  await prisma.serviceToken.upsert({
    where: { service: 'repsly' },
    update: {},
    create: {
      service: 'repsly',
      token: process.env.REPSLY_TOKEN || 'your-token-here',
      fingerprint: process.env.REPSLY_FINGERPRINT || 'your-fingerprint-here',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    },
  })

  console.log({ admin, user, client })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

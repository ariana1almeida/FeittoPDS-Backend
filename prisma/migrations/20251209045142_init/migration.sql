-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CLIENT', 'PROVIDER');

-- CreateEnum
CREATE TYPE "City" AS ENUM ('CAPAO_DA_CANOA', 'XANGRI_LA', 'TRAMANDAI', 'IMBE', 'CURUMIM');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('RS');

-- CreateEnum
CREATE TYPE "Profession" AS ENUM ('ELECTRICIAN', 'PLUMBER', 'CARPENTER', 'PAINTER', 'MASON', 'OTHERS');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "picture" TEXT,
    "userType" "UserType" NOT NULL,
    "city" "City" NOT NULL,
    "state" "State" NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "totalRating" INTEGER NOT NULL DEFAULT 0,
    "numberOfRatings" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientData" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ClientData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderData" (
    "id" SERIAL NOT NULL,
    "professions" "Profession"[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProviderData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "picture" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'OPEN',
    "category" "Profession" NOT NULL,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "estimatedPrice" DOUBLE PRECISION NOT NULL,
    "estimatedDays" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ratings" (
    "id" SERIAL NOT NULL,
    "ratedById" INTEGER NOT NULL,
    "ratedUserId" INTEGER NOT NULL,
    "serviceId" INTEGER,
    "score" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebaseUid_key" ON "Usuario"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "ClientData_userId_key" ON "ClientData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderData_userId_key" ON "ProviderData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_ratedById_ratedUserId_key" ON "Ratings"("ratedById", "ratedUserId");

-- AddForeignKey
ALTER TABLE "ClientData" ADD CONSTRAINT "ClientData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderData" ADD CONSTRAINT "ProviderData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_ratedById_fkey" FOREIGN KEY ("ratedById") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_ratedUserId_fkey" FOREIGN KEY ("ratedUserId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

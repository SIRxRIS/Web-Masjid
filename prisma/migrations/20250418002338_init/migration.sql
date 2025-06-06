-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donatur" (
    "id" SERIAL NOT NULL,
    "no" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jan" INTEGER NOT NULL DEFAULT 0,
    "feb" INTEGER NOT NULL DEFAULT 0,
    "mar" INTEGER NOT NULL DEFAULT 0,
    "apr" INTEGER NOT NULL DEFAULT 0,
    "mei" INTEGER NOT NULL DEFAULT 0,
    "jun" INTEGER NOT NULL DEFAULT 0,
    "jul" INTEGER NOT NULL DEFAULT 0,
    "aug" INTEGER NOT NULL DEFAULT 0,
    "sep" INTEGER NOT NULL DEFAULT 0,
    "okt" INTEGER NOT NULL DEFAULT 0,
    "nov" INTEGER NOT NULL DEFAULT 0,
    "des" INTEGER NOT NULL DEFAULT 0,
    "infaq" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donatur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

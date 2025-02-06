-- CreateTable
CREATE TABLE "Build" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "itemsBoardSlots" JSONB,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

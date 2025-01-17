-- CreateTable
CREATE TABLE "Synergy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "Synergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SynergyToTitan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SynergyToTitan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SynergyToTitan_B_index" ON "_SynergyToTitan"("B");

-- AddForeignKey
ALTER TABLE "_SynergyToTitan" ADD CONSTRAINT "_SynergyToTitan_A_fkey" FOREIGN KEY ("A") REFERENCES "Synergy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SynergyToTitan" ADD CONSTRAINT "_SynergyToTitan_B_fkey" FOREIGN KEY ("B") REFERENCES "Titan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

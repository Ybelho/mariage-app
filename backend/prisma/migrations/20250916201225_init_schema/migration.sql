/*
  Warnings:

  - You are about to drop the `RSVP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RSVP";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Passenger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "trajetId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Passenger_trajetId_fkey" FOREIGN KEY ("trajetId") REFERENCES "Trajet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Passenger" ("id", "nom", "prenom", "trajetId") SELECT "id", "nom", "prenom", "trajetId" FROM "Passenger";
DROP TABLE "Passenger";
ALTER TABLE "new_Passenger" RENAME TO "Passenger";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

import mysql from "mysql2/promise";
export const db=mysql.createPool(
   {
     host:"localhost",
    user: "root",
    password: "gunnseth01",
    database: "art_gallery"
   }
);
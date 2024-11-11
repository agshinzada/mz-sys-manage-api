const { poolSYS } = require("../../database");
const sql = require("mssql");

const getUsers = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS.request().query(`SELECT*FROM SYS_USERS`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const loginUser = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("username", sql.VarChar, data.username)
      .input("pass", sql.VarChar, data.password)
      .query(
        `SELECT TOP 1 ID,USERNAME,REF,ROLE FROM SYS_USERS WHERE USERNAME=@username AND HASH_PASSWORD=@pass`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const registerUser = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("ref", sql.Int, data.logoRef)
      .input("username", sql.VarChar, data.username)
      .input("pass", sql.VarChar, data.password)
      .input("role", sql.VarChar, data.role)
      .query(
        `INSERT INTO SYS_USERS (REF,USERNAME,HASH_PASSWORD,ROLE) VALUES (@ref,@username,@pass,@role)`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
};

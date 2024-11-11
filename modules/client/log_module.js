const { poolSYS } = require("../../database");
const sql = require("mssql");

const getLogs = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS.request()
      .query(`SELECT TOP (100) CL.ID,CL.USER_ID,CL.LOGICALREF,CL.CODE,CL.OLD_DEFINITION_,CL.NEW_DEFINITION_,CL.OLD_TAXNR,CL.NEW_TAXNR,CL.DATE,U.NAME USERNAME FROM CLIENT_LOGS CL
        LEFT JOIN maindb..L_CAPIUSER U ON CL.USER_ID=U.NR
        ORDER BY DATE DESC`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};
const getLogsBySearch = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("code", sql.VarChar, `%${data}%`)
      .query(
        `SELECT TOP (100) CL.ID,CL.USER_ID,CL.LOGICALREF,CL.CODE,CL.OLD_DEFINITION_,CL.NEW_DEFINITION_,CL.OLD_TAXNR,CL.NEW_TAXNR,CL.DATE,U.NAME USERNAME FROM CLIENT_LOGS CL
        LEFT JOIN maindb..L_CAPIUSER U ON CL.USER_ID=U.NR
        WHERE CODE LIKE @code ORDER BY DATE DESC`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

module.exports = {
  getLogs,
  getLogsBySearch,
};

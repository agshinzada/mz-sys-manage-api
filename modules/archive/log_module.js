const { poolArchive } = require("../../database");
const sql = require("mssql");

const getLogs = async () => {
  try {
    await poolArchive.connect();
    const result = await poolArchive
      .request()
      .query(
        `SELECT*FROM ${process.env.ARCHIVE_LOGS_TABLE} ORDER BY INSERT_DATE DESC`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolArchive.release();
  }
};
const getLogsBySearch = async (data) => {
  try {
    await poolArchive.connect();
    const result = await poolArchive
      .request()
      .input("code", sql.VarChar, `%${data}%`)
      .query(
        `SELECT*FROM ${process.env.ARCHIVE_LOGS_TABLE} WHERE EXTRACTED_FICHENO LIKE @code ORDER BY INSERT_DATE DESC`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolArchive.release();
  }
};

module.exports = {
  getLogs,
  getLogsBySearch,
};

const { poolSYS } = require("../../database");
const sql = require("mssql");

const getCategory = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM ${process.env.CLIENT_GROUPTYPE_TABLE}`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getCategoryBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(
        `SELECT*FROM ${process.env.CLIENT_GROUPTYPE_TABLE} WHERE NAME LIKE @name`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const postCategory = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, data.name)
      .input("code", sql.VarChar, data.code)
      .input("abbr", sql.VarChar, data.abbr)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO ${process.env.CLIENT_GROUPTYPE_TABLE} (NAME,CODE,ABBR,STATUS) VALUES (@name,@code,@abbr,@status)
        END TRY
            BEGIN CATCH
            SELECT
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_STATE() AS ErrorState,
            ERROR_SEVERITY() AS ErrorSeverity,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE() AS ErrorLine,
            ERROR_MESSAGE() AS ErrorMessage;
            END CATCH
        `);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const putCategory = async (data, id) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, data.name)
      .input("code", sql.VarChar, data.code)
      .input("abbr", sql.VarChar, data.abbr)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE ${process.env.CLIENT_GROUPTYPE_TABLE} SET NAME=@name, CODE=@code, ABBR=@abbr, STATUS=@status WHERE ID=@id
        END TRY
            BEGIN CATCH
            SELECT
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_STATE() AS ErrorState,
            ERROR_SEVERITY() AS ErrorSeverity,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE() AS ErrorLine,
            ERROR_MESSAGE() AS ErrorMessage;
            END CATCH
        `);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

module.exports = {
  getCategory,
  getCategoryBySearch,
  postCategory,
  putCategory,
};

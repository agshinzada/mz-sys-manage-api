const { poolSYS } = require("../../database");
const sql = require("mssql");

const getRegions = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM ${process.env.REGION_TABLE}`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const postRegion = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, data.name)
      .input("rootId", sql.Int, data.rootId)
      .input("codeId", sql.Int, data.codeId)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO ${process.env.REGION_TABLE} (NAME,ROOT_ID,CODE_ID,STATUS) VALUES (@name,@rootId,@codeId,@status)
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

const putRegion = async (data, id) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, data.name)
      .input("rootId", sql.Int, data.rootId)
      .input("codeId", sql.Int, data.codeId)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE ${process.env.REGION_TABLE} SET NAME=@name, ROOT_ID=@rootId, CODE_ID=@codeId, STATUS=@status WHERE ID=@id
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
  getRegions,
  postRegion,
  putRegion,
};

const { poolSYS } = require("../../database");
const sql = require("mssql");

const getDelivery = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS.request().query(`SELECT*FROM CLIENT_DELIVERY`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getDeliveryBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(
        `SELECT*FROM CLIENT_DELIVERY WHERE NAME LIKE @name OR CODE LIKE @name`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const postDelivery = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("code", sql.VarChar, data.code)
      .input("name", sql.VarChar, data.name)
      .input("regionId", sql.Int, data.regionId)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO CLIENT_DELIVERY (CODE,NAME,REGION_ID,STATUS) VALUES (@code,@name,@regionId,@status)
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

const putDelivery = async (data, id) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("code", sql.VarChar, data.code)
      .input("name", sql.VarChar, data.name)
      .input("regionId", sql.Int, data.regionId)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE CLIENT_DELIVERY SET CODE=@code, NAME=@name, REGION_ID=@regionId, STATUS=@status WHERE ID=@id
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
  getDelivery,
  getDeliveryBySearch,
  putDelivery,
  postDelivery,
};

const { poolSYS } = require("../../database");
const sql = require("mssql");

const getBrands = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM CLIENT_BRAND_DETAIL`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getBrandBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(`SELECT*FROM CLIENT_BRAND_DETAIL WHERE NAME LIKE @name`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const postBrand = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, data.name)
      .input("type", sql.VarChar, data.type)
      .input("code", sql.VarChar, data.code)
      .input("nr", sql.Int, data.nr)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO CLIENT_BRAND_DETAIL (NAME,TYPE,CODE,NR,STATUS) VALUES (@name,@type,@code,@nr,@status)
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

const putBrand = async (data, id) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, data.name)
      .input("type", sql.VarChar, data.type)
      .input("code", sql.VarChar, data.code)
      .input("nr", sql.Int, data.nr)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE CLIENT_BRAND_DETAIL SET NAME=@name, TYPE=@type, CODE=@code, NR=@nr, STATUS=@status WHERE ID=@id
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
  getBrands,
  getBrandBySearch,
  postBrand,
  putBrand,
};

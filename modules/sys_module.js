const { poolSYS, poolMazarina } = require("../database");
const sql = require("mssql");

const getStatusCodes = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM ${process.env.ORDERSTATUS_TABLE}`);

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};
const getOrderkindCodes = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM ${process.env.ORDERKIND_TABLE}`);

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};
const getBrands = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM ${process.env.BRAND_TABLE}`);

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getBrandsBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(`SELECT*FROM ${process.env.BRAND_TABLE} WHERE NAME LIKE @name`);
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
        INSERT INTO ${process.env.BRAND_TABLE} (NAME,BRAND_TYPE,BRAND_CODE,SYS_ID,STATUS) VALUES (@name,@type,@code,@nr,@status)
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
        UPDATE ${process.env.BRAND_TABLE} SET NAME=@name, BRAND_TYPE=@type, BRAND_CODE=@code, SYS_ID=@nr, STATUS=@status WHERE ID=@id
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
      .input("sysId", sql.Int, data.sysId)
      .input("codeId", sql.Int, data.codeId)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO ${process.env.REGION_TABLE} (NAME,SYS_ID,CODE_ID,STATUS) VALUES (@name,@sysId,@codeId,@status)
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
      .input("sysId", sql.Int, data.sysId)
      .input("codeId", sql.Int, data.codeId)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE ${process.env.REGION_TABLE} SET NAME=@name, SYS_ID=@sysId, CODE_ID=@codeId, STATUS=@status WHERE ID=@id
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

const getStatusCodesBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("value", sql.NVarChar, `%${value}%`)
      .query(
        `SELECT*FROM ${process.env.ORDERSTATUS_TABLE} WHERE NAME LIKE @value`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};
const getOrderkindCodesBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("value", sql.NVarChar, `%${value}%`)
      .query(
        `SELECT*FROM ${process.env.ORDERKIND_TABLE} WHERE NAME LIKE @value`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getClientsBySearch = async (code) => {
  try {
    await poolMazarina.connect();
    const result = await poolMazarina
      .request()
      .input("code", sql.Char, `%${code}%`)
      .query(
        `SELECT TOP 50 *FROM ${process.env.CLCARD_TABLE} WHERE (CODE LIKE @code OR DEFINITION_ LIKE @code) AND (CARDTYPE=3 OR CARDTYPE=4)
     `
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};

const getClientById = async (id) => {
  try {
    await poolMazarina.connect();
    const result = await poolMazarina
      .request()
      .input("id", sql.VarChar, id)
      .query(
        `SELECT *FROM ${process.env.CLCARD_TABLE} WHERE LOGICALREF=@id AND (CARDTYPE=3 OR CARDTYPE=4)
     `
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};

const postStatus = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("statusId", sql.Int, data.statusId)
      .input("name", sql.NVarChar, data.name)
      .input("color", sql.VarChar, data.color)
      .input("status", sql.Int, data.status)
      .query(
        `INSERT INTO ${process.env.ORDERSTATUS_TABLE} (STATUS_ID,NAME,COLOR,STATUS) VALUES (@statusId,@name,@color,@status)`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};
const postOrderkind = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("statusId", sql.Int, data.statusId)
      .input("name", sql.NVarChar, data.name)
      .input("color", sql.VarChar, data.color)
      .input("status", sql.Int, data.status)
      .query(
        `INSERT INTO ${process.env.ORDERKIND_TABLE} (STATUS_ID,NAME,COLOR,STATUS) VALUES (@statusId,@name,@color,@status)`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};
const putStatus = async (id, data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("id", sql.Int, id)
      .input("statusId", sql.Int, data.statusId)
      .input("name", sql.NVarChar, data.name)
      .input("color", sql.VarChar, data.color)
      .input("status", sql.Int, data.status)
      .query(
        `UPDATE ${process.env.ORDERSTATUS_TABLE} SET STATUS_ID=@statusId,NAME=@name,COLOR=@color,STATUS=@status WHERE ID=@id`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};
const putOrderkind = async (id, data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("id", sql.Int, id)
      .input("statusId", sql.Int, data.statusId)
      .input("name", sql.NVarChar, data.name)
      .input("color", sql.VarChar, data.color)
      .input("status", sql.Int, data.status)
      .query(
        `UPDATE ${process.env.ORDERKIND_TABLE} SET STATUS_ID=@statusId,NAME=@name,COLOR=@color,STATUS=@status WHERE ID=@id`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

module.exports = {
  getStatusCodes,
  getStatusCodesBySearch,
  postStatus,
  putStatus,
  getBrands,
  getRegions,
  postRegion,
  putRegion,
  getBrandsBySearch,
  postBrand,
  putBrand,
  getOrderkindCodes,
  getOrderkindCodesBySearch,
  postOrderkind,
  putOrderkind,
  getClientsBySearch,
  getClientById,
};

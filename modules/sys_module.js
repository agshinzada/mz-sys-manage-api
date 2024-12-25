const { poolSYS, poolMobimV2 } = require("../database");
const sql = require("mssql");

const getStatusCodes = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM SYS_STATUS_CODES`);

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
      .query(`SELECT*FROM SYS_ORDERKIND_CODES`);

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
    const result = await poolSYS.request().query(`SELECT*FROM SYS_BRANDS`);

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
      .query(`SELECT*FROM SYS_BRANDS WHERE NAME LIKE @name`);
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
        INSERT INTO SYS_BRANDS (NAME,BRAND_TYPE,BRAND_CODE,SYS_ID,STATUS) VALUES (@name,@type,@code,@nr,@status)
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
        UPDATE SYS_BRANDS SET NAME=@name, BRAND_TYPE=@type, BRAND_CODE=@code, SYS_ID=@nr, STATUS=@status WHERE ID=@id
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
    const result = await poolSYS.request().query(`SELECT*FROM SYS_REGIONS`);

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
        INSERT INTO SYS_REGIONS (NAME,SYS_ID,CODE_ID,STATUS) VALUES (@name,@sysId,@codeId,@status)
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
        UPDATE SYS_REGIONS SET NAME=@name, SYS_ID=@sysId, CODE_ID=@codeId, STATUS=@status WHERE ID=@id
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
      .query(`SELECT*FROM SYS_STATUS_CODES WHERE NAME LIKE @value`);

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
      .query(`SELECT*FROM SYS_ORDERKIND_CODES WHERE NAME LIKE @value`);

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
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
        `INSERT INTO SYS_STATUS_CODES (STATUS_ID,NAME,COLOR,STATUS) VALUES (@statusId,@name,@color,@status)`
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
        `INSERT INTO SYS_ORDERKIND_CODES (STATUS_ID,NAME,COLOR,STATUS) VALUES (@statusId,@name,@color,@status)`
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
        `UPDATE SYS_STATUS_CODES SET STATUS_ID=@statusId,NAME=@name,COLOR=@color,STATUS=@status WHERE ID=@id`
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
        `UPDATE SYS_ORDERKIND_CODES SET STATUS_ID=@statusId,NAME=@name,COLOR=@color,STATUS=@status WHERE ID=@id`
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
};

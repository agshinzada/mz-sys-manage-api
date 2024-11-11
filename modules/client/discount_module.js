const { poolSYS } = require("../../database");
const sql = require("mssql");

const getDiscounts = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM CLIENT_DISCOUNTS`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getDiscountsBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(`SELECT*FROM CLIENT_DISCOUNTS WHERE VALUE LIKE @name`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const postDiscount = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("value", sql.VarChar, data.value)
      .input("label", sql.VarChar, data.label)
      .input("brandId", sql.Int, data.brand)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO CLIENT_DISCOUNTS (VALUE,LABEL,BRAND_ID,STATUS) VALUES (@value,@label,@brandId,@status)
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

const putDiscount = async (data, id) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("value", sql.VarChar, data.value)
      .input("label", sql.VarChar, data.label)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE CLIENT_DISCOUNTS SET VALUE=@value, LABEL=@label, STATUS=@status WHERE ID=@id
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
  getDiscounts,
  getDiscountsBySearch,
  putDiscount,
  postDiscount,
};

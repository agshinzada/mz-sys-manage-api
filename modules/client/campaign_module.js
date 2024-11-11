const { poolSYS } = require("../../database");
const sql = require("mssql");

const getCampaign = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS.request().query(`SELECT*FROM CLIENT_CAMPAIGN`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getCampaignBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(`SELECT*FROM CLIENT_CAMPAIGN WHERE CODE LIKE @name`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const postCampaign = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("code", sql.VarChar, data.code)
      .input("value", sql.VarChar, data.value)
      .input("explanation", sql.VarChar, data.explanation)
      .input("type", sql.Int, data.type)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO CLIENT_CAMPAIGN (CODE,VALUE,EXPLANATION,TYPE_,STATUS) VALUES (@code,@value,@explanation,@type,@status)
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

const putCampaign = async (data, id) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("code", sql.VarChar, data.code)
      .input("value", sql.VarChar, data.value)
      .input("explanation", sql.VarChar, data.explanation)
      .input("type", sql.Int, data.type)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE CLIENT_CAMPAIGN SET CODE=@code, VALUE=@value, EXPLANATION=@explanation, TYPE_=@type, STATUS=@status WHERE ID=@id
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
  getCampaign,
  getCampaignBySearch,
  postCampaign,
  putCampaign,
};

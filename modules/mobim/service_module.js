const { poolMobim } = require("../../database");
const sql = require("mssql");

const getServices = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .query(`SELECT*FROM riInstances_test WITH (NOLOCK)`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};
const getServiceTasks = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request()
      .query(`SELECT RT.id, RT.date_,RT.begTime,RT.endTime,RT.branch,RT.department,RT.active,RT.task1,
        RT.task2,RT.task3,RT.task4,RT.task5,RG.NAME REGION_NAME,BR.NAME BRAND_NAME 
        FROM riTasks_test RT WITH (NOLOCK)
        LEFT JOIN WEB_APP_MANAGE_DB..SYS_REGIONS RG WITH (NOLOCK) ON RG.SYS_ID=RT.branch
        LEFT JOIN WEB_APP_MANAGE_DB..SYS_BRANDS BR WITH (NOLOCK) ON BR.SYS_ID=RT.department 
        ORDER BY RT.active DESC
`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getServiceTasksBySearch = async (value) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(`SELECT RT.id, RT.date_,RT.begTime,RT.endTime,RT.branch,RT.department,
        RT.active,RT.task1,RT.task2,RT.task3,RT.task4,RT.task5,RG.NAME REGION_NAME,BR.NAME BRAND_NAME 
        FROM riTasks_test RT WITH (NOLOCK)
        LEFT JOIN WEB_APP_MANAGE_DB..SYS_REGIONS RG WITH (NOLOCK) ON RG.SYS_ID=RT.branch
        LEFT JOIN WEB_APP_MANAGE_DB..SYS_BRANDS BR WITH (NOLOCK) ON BR.SYS_ID=RT.department 
        WHERE RG.NAME LIKE @name OR BR.NAME LIKE @name`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const changeAllTaskDate = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("code", sql.Int, data.status)
      .input("id", sql.Int, data.recordId).query(`
        BEGIN TRY
        update order_head set status = @code where record_id = @id
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
    poolMobim.release();
  }
};

const changeTaskDate = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("code", sql.Int, data.status)
      .input("id", sql.Int, data.recordId).query(`
        BEGIN TRY
        update order_head set status = @code where record_id = @id
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
    poolMobim.release();
  }
};

module.exports = {
  getServices,
  getServiceTasks,
  getServiceTasksBySearch,
  changeAllTaskDate,
  changeTaskDate,
};

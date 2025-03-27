const { poolMobim } = require("../../database");
const sql = require("mssql");

const getServices = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .query(`SELECT*FROM ${process.env.SERVICES_TABLE} WITH (NOLOCK)`);
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
        FROM ${process.env.TASKS_TABLE} RT WITH (NOLOCK)
        LEFT JOIN ${process.env.DB_SYS}..${process.env.REGION_TABLE} RG WITH (NOLOCK) ON RG.SYS_ID=RT.branch
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} BR WITH (NOLOCK) ON BR.SYS_ID=RT.department 
        WHERE BR.NAME <> 'HUMANA' AND BR.NAME <> 'MERCH'
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
    const result = await poolMobim.request().input("value", `%${value}%`)
      .query(`SELECT RT.id, RT.date_,RT.begTime,RT.endTime,RT.branch,RT.department,RT.active,RT.task1,
        RT.task2,RT.task3,RT.task4,RT.task5,RG.NAME REGION_NAME,BR.NAME BRAND_NAME 
        FROM ${process.env.TASKS_TABLE} RT WITH (NOLOCK)
        LEFT JOIN ${process.env.DB_SYS}..${process.env.REGION_TABLE} RG WITH (NOLOCK) ON RG.SYS_ID=RT.branch
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} BR WITH (NOLOCK) ON BR.SYS_ID=RT.department 
        WHERE (RG.NAME LIKE @value OR BR.NAME LIKE @value) AND BR.NAME <> 'HUMANA'
        ORDER BY RT.active DESC
`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const putServiceStatus = async (id) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().input("id", id).query(` 
      BEGIN TRY
        update ${process.env.SERVICES_TABLE} set active = 0 where id = @id
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

const putTaskStatus = async (id) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().input("id", id).query(` 
      BEGIN TRY
        update ${process.env.TASKS_TABLE} set active = 0 where id = @id
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

const putBulkTaskStatus = async (data = []) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().query(` 
      BEGIN TRY
                update ${
                  process.env.TASKS_TABLE
                } set active = 0  where id in (${data.toString()})
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

const putTasksDate = async (id) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().input("id", id).query(` 
      BEGIN TRY
        update ${process.env.TASKS_TABLE} set date_ = (SELECT CAST(GETDATE() AS DATE) AS TodayDate) where active=0
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

const putService = async (id, data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", id)
      .input("name", data.name)
      .input("branches", data.branches)
      .input("departments", data.departments)
      .input("active", data.active).query(` 
      BEGIN TRY
       update ${process.env.SERVICES_TABLE} set name=@name, branches=@branches, departments=@departments, active=@active where id=@id
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
  putServiceStatus,
  putService,
  putTaskStatus,
  putTasksDate,
  putBulkTaskStatus,
};

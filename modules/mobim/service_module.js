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
        ORDER BY RT.active DESC
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
};

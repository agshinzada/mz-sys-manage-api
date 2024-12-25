const { poolMobim } = require("../../database");
const sql = require("mssql");

const getServices = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .query(`SELECT*FROM riInstances WITH (NOLOCK)`);
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
        FROM riTasks RT WITH (NOLOCK)
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

module.exports = {
  getServices,
  getServiceTasks,
};

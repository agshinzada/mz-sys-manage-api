const { poolMobim } = require("../../database");
const sql = require("mssql");

const getMobimUsers = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().query(
      `SELECT rec_id,username,[password],connections,u_whouses,u_brend,u_cat,u_region,u_virtualwh,u_divisionno,departments,c_id,c_conn_name 
        FROM ${process.env.MOBIM_USER_TABLE} US
        LEFT JOIN ${process.env.CONNECTION_TABLE} LC ON US.connections=LC.c_id`
    );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

module.exports = {
  getMobimUsers,
};

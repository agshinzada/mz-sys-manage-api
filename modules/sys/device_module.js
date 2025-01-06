const { poolMobim } = require("../../database");
const sql = require("mssql");

const getDeviceDetailById = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        `select top 1 Brends,Device,RegionalCode,RootNo,SecCode,SyncHTTP from ${process.env.DEVICE_TABLE} WITH (NOLOCK) where Device=@id`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

module.exports = {
  getDeviceDetailById,
};

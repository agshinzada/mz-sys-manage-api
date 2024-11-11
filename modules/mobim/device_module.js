const { poolMobim } = require("../../database");
const sql = require("mssql");

const getDevices = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .query(`SELECT*FROM Device_Root_test WITH (NOLOCK)`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getDevicesBySearch = async (value) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(
        `SELECT*FROM Device_Root_test WITH (NOLOCK) WHERE RootNo LIKE @name OR Device LIKE @name OR SyncHTTP LIKE @name`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

// const postDevice = async (data) => {
//   try {
//     await poolSYS.connect();
//     const result = await poolSYS
//       .request()
//       .input("name", sql.VarChar, data.name)
//       .input("type", sql.VarChar, data.type)
//       .input("code", sql.VarChar, data.code)
//       .input("nr", sql.Int, data.nr)
//       .input("status", sql.Int, data.status).query(`
//         BEGIN TRY
//         INSERT INTO CLIENT_BRAND_DETAIL (NAME,TYPE,CODE,NR,STATUS) VALUES (@name,@type,@code,@nr,@status)
//         END TRY
//             BEGIN CATCH
//             SELECT
//             ERROR_NUMBER() AS ErrorNumber,
//             ERROR_STATE() AS ErrorState,
//             ERROR_SEVERITY() AS ErrorSeverity,
//             ERROR_PROCEDURE() AS ErrorProcedure,
//             ERROR_LINE() AS ErrorLine,
//             ERROR_MESSAGE() AS ErrorMessage;
//             END CATCH
//         `);
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   } finally {
//     poolSYS.release();
//   }
// };

// const putDevice = async (data, id) => {
//   try {
//     await poolSYS.connect();
//     const result = await poolSYS
//       .request()
//       .input("name", sql.VarChar, data.name)
//       .input("type", sql.VarChar, data.type)
//       .input("code", sql.VarChar, data.code)
//       .input("nr", sql.Int, data.nr)
//       .input("status", sql.Int, data.status)
//       .input("id", sql.Int, id).query(`
//         BEGIN TRY
//         UPDATE CLIENT_BRAND_DETAIL SET NAME=@name, TYPE=@type, CODE=@code, NR=@nr, STATUS=@status WHERE ID=@id
//         END TRY
//             BEGIN CATCH
//             SELECT
//             ERROR_NUMBER() AS ErrorNumber,
//             ERROR_STATE() AS ErrorState,
//             ERROR_SEVERITY() AS ErrorSeverity,
//             ERROR_PROCEDURE() AS ErrorProcedure,
//             ERROR_LINE() AS ErrorLine,
//             ERROR_MESSAGE() AS ErrorMessage;
//             END CATCH
//         `);
//     return result.recordset;
//   } catch (err) {
//     throw err;
//   } finally {
//     poolSYS.release();
//   }
// };

module.exports = {
  getDevices,
  getDevicesBySearch,
  //   postBrand,
  //   putBrand,
};

const { poolMobim } = require("../../database");
const sql = require("mssql");

const getDevices = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .query(`SELECT*FROM Device_Root WITH (NOLOCK)`);
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
        `SELECT*FROM Device_Root WITH (NOLOCK) WHERE RootNo LIKE @name OR Device LIKE @name OR SyncHTTP LIKE @name`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const postDevice = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("name", sql.VarChar, data.name)
      .input("brands", sql.VarChar, data.brands)
      .input("deviceId", sql.VarChar, data.deviceId)
      .input("route", sql.VarChar, data.route)
      .input("routeType", sql.VarChar, data.routeType)
      .input("regionType", sql.VarChar, data.regionType)
      .input("server", sql.VarChar, data.server)
      .input("database", sql.VarChar, data.database)
      .input("firmNo", sql.VarChar, data.firmNo)
      .input("periodNo", sql.VarChar, data.periodNo)
      .input("regionCode", sql.VarChar, data.regionCode)
      .input("brandCode", sql.VarChar, data.brandCode)
      .input("deviceReg", sql.VarChar, data.deviceReg)
      .input("deviceParent", sql.VarChar, data.deviceParent)
      .input("username", sql.VarChar, data.username)
      .input("password", sql.VarChar, data.password)
      .input("warehouse", sql.VarChar, data.warehouse)
      .input("virtualWare", sql.VarChar, data.virtualWare)
      .input("bozukWare", sql.VarChar, data.bozukWare).query(`
        BEGIN TRY
        INSERT INTO Device_Root (SyncHTTP, Brends, Device, RootNo, 
        RootType, SecCode, ServerName, DatabaseName,FirmNo, PeriodNo, RegionalCode, FirmBrend,
        DeviceReg, ParentDevice, UserName, Password, MainWh, VirtualWH, BozukWh) 
        VALUES (@name,@brands,@deviceId,@route,@routeType,@regionType,@server,@database,
        @firmNo,@periodNo,@regionCode,@brandCode,@deviceReg,@deviceParent,@username,@password,
        @warehouse,@virtualWare,@bozukWare)
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

const putDevice = async (data, id) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("name", sql.VarChar, data.name)
      .input("brands", sql.VarChar, data.brands)
      .input("deviceId", sql.VarChar, data.deviceId)
      .input("route", sql.VarChar, data.route)
      .input("routeType", sql.VarChar, data.routeType)
      .input("regionType", sql.VarChar, data.regionType)
      .input("server", sql.VarChar, data.server)
      .input("database", sql.VarChar, data.database)
      .input("firmNo", sql.VarChar, data.firmNo)
      .input("periodNo", sql.VarChar, data.periodNo)
      .input("regionCode", sql.VarChar, data.regionCode)
      .input("brandCode", sql.VarChar, data.brandCode)
      .input("deviceReg", sql.VarChar, data.deviceReg)
      .input("deviceParent", sql.VarChar, data.deviceParent)
      .input("username", sql.VarChar, data.username)
      .input("password", sql.VarChar, data.password)
      .input("warehouse", sql.VarChar, data.warehouse)
      .input("virtualWare", sql.VarChar, data.virtualWare)
      .input("bozukWare", sql.VarChar, data.bozukWare)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE Device_Root 
        SET SyncHTTP=@name, Brends=@brands, Device=@deviceId, RootNo=@route, 
        RootType=@routeType, SecCode=@regionType, ServerName=@server, DatabaseName=@database,
        FirmNo=@firmNo, PeriodNo=@periodNo, RegionalCode=@regionCode, FirmBrend=@brandCode,
        DeviceReg=@deviceReg, ParentDevice=@deviceParent, UserName=@username, Password=@password,
        MainWh=@warehouse, VirtualWH=@virtualWare, BozukWh=@bozukWare
        WHERE rec_id=@id
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

const deleteDevice = async (id) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().input("id", sql.Int, id).query(`
        BEGIN TRY
        DELETE FROM Device_Root
        WHERE rec_id=@id
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
  getDevices,
  getDevicesBySearch,
  postDevice,
  putDevice,
  deleteDevice,
};

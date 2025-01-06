const { poolMobim } = require("../../database");
const sql = require("mssql");

const getConnections = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .query(`SELECT*FROM ${process.env.CONNECTION_TABLE} WITH (NOLOCK)`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getConnectionsBySearch = async (value) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(
        `SELECT*FROM ${process.env.CONNECTION_TABLE} WITH (NOLOCK) WHERE c_conn_name LIKE @name`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const postConnection = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("name", sql.VarChar, data.name)
      .input("server", sql.VarChar, data.server)
      .input("database", sql.VarChar, data.database)
      .input("username", sql.VarChar, data.username)
      .input("password", sql.VarChar, data.password)
      .input("firmNo", sql.VarChar, data.firmNo)
      .input("period", sql.VarChar, data.period)
      .input("brand", sql.VarChar, data.brand).query(`
        BEGIN TRY
        INSERT INTO ${process.env.CONNECTION_TABLE} (c_conn_name, c_server, c_database, c_username, 
        c_password, c_firmno, c_period, c_brend) 
        VALUES (@name,@server,@database,@username,@password,@firmNo,@period,@brand)
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

const putConnection = async (data, id) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("name", sql.VarChar, data.name)
      .input("server", sql.VarChar, data.server)
      .input("database", sql.VarChar, data.database)
      .input("username", sql.VarChar, data.username)
      .input("password", sql.VarChar, data.password)
      .input("firmNo", sql.VarChar, data.firmNo)
      .input("period", sql.VarChar, data.period)
      .input("brand", sql.VarChar, data.brand)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE ${process.env.CONNECTION_TABLE} 
        SET c_conn_name=@name, c_server=@server, c_database=@database, c_username=@username, 
        c_password=@password, c_firmno=@firmNo, c_period=@period, c_brend=@brand
        WHERE c_id=@id
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

const deleteConnection = async (id) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().input("id", sql.Int, id).query(`
        BEGIN TRY
        DELETE FROM ${process.env.CONNECTION_TABLE}
        WHERE c_id=@id
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
  getConnections,
  getConnectionsBySearch,
  postConnection,
  putConnection,
  deleteConnection,
};

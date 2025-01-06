const { poolArchive } = require("../../database");
const sql = require("mssql");

const getUsers = async () => {
  try {
    await poolArchive.connect();
    const result = await poolArchive
      .request()
      .query(`SELECT*FROM ${process.env.ARCHIVE_USERS_TABLE}`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolArchive.release();
  }
};

const getUserBySearch = async (value) => {
  try {
    await poolArchive.connect();
    const result = await poolArchive
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(
        `SELECT*FROM ${process.env.ARCHIVE_USERS_TABLE} WHERE NAME LIKE @name`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolArchive.release();
  }
};

const postUser = async (data) => {
  try {
    await poolArchive.connect();
    const result = await poolArchive
      .request()
      .input("username", sql.VarChar, data.username)
      .input("password", sql.VarChar, data.password)
      .input("name", sql.NVarChar, data.name)
      .input("surname", sql.NVarChar, data.surname)
      .input("role", sql.VarChar, data.role)
      .input("status", sql.Int, data.status).query(`
        BEGIN TRY
        INSERT INTO ${process.env.ARCHIVE_USERS_TABLE} (USERNAME,HASH_PASSWORD,NAME,SURNAME,ROLE,STATUS) VALUES (@username,@password,@name,@surname,@role,@status)
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
    poolArchive.release();
  }
};

const putUser = async (data, id) => {
  try {
    await poolArchive.connect();
    const result = await poolArchive
      .request()
      .input("username", sql.VarChar, data.username)
      .input("name", sql.NVarChar, data.name)
      .input("surname", sql.NVarChar, data.surname)
      .input("role", sql.VarChar, data.role)
      .input("status", sql.Int, data.status)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE ${process.env.ARCHIVE_USERS_TABLE} SET USERNAME=@username, NAME=@name, SURNAME=@surname, ROLE=@role, STATUS=@status WHERE ID=@id
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
    poolArchive.release();
  }
};

const putUserPassword = async (data, id) => {
  try {
    await poolArchive.connect();
    const result = await poolArchive
      .request()
      .input("password", sql.VarChar, data.password)
      .input("id", sql.Int, id).query(`
        BEGIN TRY
        UPDATE ${process.env.ARCHIVE_USERS_TABLE} SET HASH_PASSWORD=@password WHERE ID=@id
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
    poolArchive.release();
  }
};

module.exports = {
  getUsers,
  getUserBySearch,
  postUser,
  putUser,
  putUserPassword,
};

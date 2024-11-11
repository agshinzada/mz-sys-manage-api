const { poolMobim, poolMazarina } = require("../../database");
const sql = require("mssql");

const getOrders = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .query(
        `Select * from order_head WITH (NOLOCK) where status = 0 order by inserteddate desc`
      );
    return result.recordset;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    poolMobim.release();
  }
};

const updateOrderStatus = async (data) => {
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

const getOrdersByClientCode = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("client", sql.VarChar, data)
      .query(
        "Select top 50 * from order_head WITH (NOLOCK) where clientcode like @client order by InsertedDate desc"
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getLogoOrdersByFilter = async (data) => {
  try {
    await poolMazarina.connect();
    const result = await poolMazarina
      .request()
      .input("status", sql.VarChar, data.status)
      .input("from", sql.VarChar, data.from)
      .input("to", sql.VarChar, data.to)
      .query(
        `SELECT TOP (100) ORF.DATE_,FICHENO,DOCODE,CLC.CODE,CLC.DEFINITION_,SLS.CODE RUT,ORF.SOURCEINDEX DELIVERY,ROUND(NETTOTAL,2) NETTOTAL 
FROM LG_013_01_ORFICHE ORF WITH (NOLOCK)
LEFT JOIN LG_013_CLCARD CLC WITH (NOLOCK) ON ORF.CLIENTREF=CLC.LOGICALREF
LEFT JOIN maindb..LG_SLSMAN SLS WITH (NOLOCK) ON SLS.LOGICALREF=ORF.SALESMANREF AND FIRMNR=13
WHERE DOCODE= @status AND CONVERT(DATE,DATE_) BETWEEN @from AND @to ORDER BY DATE_ DESC`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};

const getLogoOrdersBySearch = async (data) => {
  try {
    await poolMazarina.connect();
    const result = await poolMazarina
      .request()
      .input("code", sql.VarChar, data)
      .query(
        `SELECT TOP (20) ORF.DATE_,FICHENO,DOCODE,CLC.CODE,CLC.DEFINITION_,SLS.CODE RUT,ORF.SOURCEINDEX DELIVERY,ROUND(NETTOTAL,2) NETTOTAL 
FROM LG_013_01_ORFICHE ORF WITH (NOLOCK)
LEFT JOIN LG_013_CLCARD CLC WITH (NOLOCK) ON ORF.CLIENTREF=CLC.LOGICALREF
LEFT JOIN maindb..LG_SLSMAN SLS WITH (NOLOCK) ON SLS.LOGICALREF=ORF.SALESMANREF AND FIRMNR=13
WHERE CLC.CODE=@code ORDER BY DATE_ DESC`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};
const getOrdersByOrderId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        "Select * from order_head WITH (NOLOCK) where order_id=@id order by InsertedDate desc"
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};
const getOrdersByDeviceId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        "Select top 50 * from order_head WITH (NOLOCK) where device_id=@id order by InsertedDate desc"
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};
const getOrdersByRecordId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        "Select top 50 * from order_head WITH (NOLOCK) where record_id=@id order by InsertedDate desc"
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};
const getOrdersByStatus = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        "Select top 50 * from order_head WITH (NOLOCK) where status=@id order by InsertedDate desc"
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getOrderLinesByOrderId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        `select*from order_lines ol WITH (NOLOCK)
        left join mazarina2024..LG_013_ITEMS IT on ol.productref=IT.LOGICALREF
        where ol.order_id = @id`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

module.exports = {
  getOrders,
  getOrdersByClientCode,
  getOrdersByOrderId,
  getOrdersByDeviceId,
  getOrdersByRecordId,
  getOrdersByStatus,
  getOrderLinesByOrderId,
  updateOrderStatus,
  getLogoOrdersByFilter,
  getLogoOrdersBySearch,
};

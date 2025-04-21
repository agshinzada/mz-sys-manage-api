const { poolMobim, poolMazarina } = require("../../database");
const sql = require("mssql");

const getOrders = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().query(
      `
      SELECT OH.brend_id,OH.clientcode,OH.clorderno,clc.SPECODE,clc.DEFINITION_,OH.device_id,OH.InsertedDate,OH.order_id,OH.orderkind,
        OH.promostatus,OH.record_id,OH.RouteType,OH.specode,OH.status,SC.COLOR ORDERKIND_COLOR,SC.NAME ORDERKIND_NAME, 
        SC2.COLOR STATUS_COLOR, SC2.NAME STATUS_NAME,SB.NAME BRAND_NAME FROM ${process.env.ORDER_HEAD_TABLE} OH
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERKIND_TABLE} SC ON SC.STATUS_ID=OH.orderkind
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = OH.clientcode collate Cyrillic_General_CI_AI
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC2 ON SC2.STATUS_ID=OH.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=OH.brend_id
        WHERE OH.status=0
        ORDER BY OH.InsertedDate DESC
      `
    );
    return result.recordset;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getDelayedOrders = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().query(
      `SELECT OH.brend_id,OH.clientcode,OH.clorderno,clc.SPECODE,clc.DEFINITION_,OH.device_id,OH.InsertedDate,OH.order_id,OH.orderkind,
        OH.promostatus,OH.record_id,OH.RouteType,OH.specode,OH.status,SC.COLOR ORDERKIND_COLOR,SC.NAME ORDERKIND_NAME, 
        SC2.COLOR STATUS_COLOR, SC2.NAME STATUS_NAME,SB.NAME BRAND_NAME FROM ${process.env.ORDER_HEAD_TABLE} OH
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERKIND_TABLE} SC ON SC.STATUS_ID=OH.orderkind
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = OH.clientcode collate Cyrillic_General_CI_AI
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC2 ON SC2.STATUS_ID=OH.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=OH.brend_id
      WHERE OH.STATUS=0 AND DATEDIFF(MINUTE, OH.InsertedDate, GETDATE()) >= 6`
    );
    return result.recordset;
  } catch (err) {
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
        update ${process.env.ORDER_HEAD_TABLE} set status = @code where record_id = @id
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

const getLogoOrdersByFilter = async (data) => {
  try {
    await poolMazarina.connect();
    const result = await poolMazarina
      .request()
      .input("status", sql.VarChar, data.status)
      .input("from", sql.VarChar, data.from)
      .input("to", sql.VarChar, data.to)
      .query(
        `SELECT TOP 100 ORF.DATE_,FICHENO,DOCODE,CLC.CODE,CLC.DEFINITION_,SLS.CODE RUT,ORF.SOURCEINDEX DELIVERY,ROUND(NETTOTAL,2) NETTOTAL 
        FROM ${process.env.ORFICHE_TABLE} ORF WITH (NOLOCK)
        LEFT JOIN ${process.env.CLCARD_TABLE} CLC WITH (NOLOCK) ON ORF.CLIENTREF=CLC.LOGICALREF
        LEFT JOIN ${process.env.DB_MAIN}..${process.env.SLSMAN_TABLE} SLS WITH (NOLOCK) ON SLS.LOGICALREF=ORF.SALESMANREF AND FIRMNR=${process.env.DB_FIRMNR}
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
        `SELECT TOP 20 ORF.DATE_,FICHENO,DOCODE,CLC.CODE,CLC.DEFINITION_,SLS.CODE RUT,ORF.SOURCEINDEX DELIVERY,ROUND(NETTOTAL,2) NETTOTAL 
        FROM ${process.env.ORFICHE_TABLE} ORF WITH (NOLOCK)
        LEFT JOIN ${process.env.CLCARD_TABLE} CLC WITH (NOLOCK) ON ORF.CLIENTREF=CLC.LOGICALREF
        LEFT JOIN ${process.env.DB_MAIN}..${process.env.SLSMAN_TABLE} SLS WITH (NOLOCK) ON SLS.LOGICALREF=ORF.SALESMANREF AND FIRMNR=${process.env.DB_FIRMNR}
        WHERE CLC.CODE=@code ORDER BY DATE_ DESC`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};

const getOrdersByClientCode = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("client", sql.VarChar, data)
      .query(
        `
        SELECT TOP 200 OH.brend_id,OH.clientcode,OH.clorderno,clc.SPECODE,CLC.DEFINITION_,OH.device_id,OH.InsertedDate,OH.order_id,OH.orderkind,
        OH.promostatus,OH.record_id,OH.RouteType,OH.specode,OH.status,SC.COLOR ORDERKIND_COLOR,SC.NAME ORDERKIND_NAME, 
        SC2.COLOR STATUS_COLOR, SC2.NAME STATUS_NAME,SB.NAME BRAND_NAME FROM ${process.env.ORDER_HEAD_TABLE} OH
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERKIND_TABLE} SC ON SC.STATUS_ID=OH.orderkind
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = OH.clientcode collate Cyrillic_General_CI_AI
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC2 ON SC2.STATUS_ID=OH.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=OH.brend_id
        WHERE OH.clientcode like @client
        ORDER BY OH.InsertedDate DESC
        `
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getOrdersByOrderId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        `SELECT TOP 200 OH.brend_id,OH.clientcode,OH.clorderno,clc.SPECODE,CLC.DEFINITION_,OH.device_id,OH.InsertedDate,OH.order_id,OH.orderkind,
        OH.promostatus,OH.record_id,OH.RouteType,OH.specode,OH.status,SC.COLOR ORDERKIND_COLOR,SC.NAME ORDERKIND_NAME, 
        SC2.COLOR STATUS_COLOR, SC2.NAME STATUS_NAME,SB.NAME BRAND_NAME FROM ${process.env.ORDER_HEAD_TABLE} OH
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERKIND_TABLE} SC ON SC.STATUS_ID=OH.orderkind
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = OH.clientcode collate Cyrillic_General_CI_AI
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC2 ON SC2.STATUS_ID=OH.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=OH.brend_id
        WHERE OH.order_id=@id
        ORDER BY OH.InsertedDate DESC`
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
        `SELECT TOP 200 OH.brend_id,OH.clientcode,OH.clorderno,clc.SPECODE,CLC.DEFINITION_,OH.device_id,OH.InsertedDate,OH.order_id,OH.orderkind,
        OH.promostatus,OH.record_id,OH.RouteType,OH.specode,OH.status,SC.COLOR ORDERKIND_COLOR,SC.NAME ORDERKIND_NAME, 
        SC2.COLOR STATUS_COLOR, SC2.NAME STATUS_NAME,SB.NAME BRAND_NAME FROM ${process.env.ORDER_HEAD_TABLE} OH
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERKIND_TABLE} SC ON SC.STATUS_ID=OH.orderkind
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = OH.clientcode collate Cyrillic_General_CI_AI
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC2 ON SC2.STATUS_ID=OH.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=OH.brend_id
        WHERE OH.device_id=@id
        ORDER BY OH.InsertedDate DESC
        `
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
        `
        SELECT TOP 200 OH.brend_id,OH.clientcode,OH.clorderno,clc.SPECODE,CLC.DEFINITION_,OH.device_id,OH.InsertedDate,OH.order_id,OH.orderkind,
        OH.promostatus,OH.record_id,OH.RouteType,OH.specode,OH.status,SC.COLOR ORDERKIND_COLOR,SC.NAME ORDERKIND_NAME, 
        SC2.COLOR STATUS_COLOR, SC2.NAME STATUS_NAME,SB.NAME BRAND_NAME FROM ${process.env.ORDER_HEAD_TABLE} OH
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERKIND_TABLE} SC ON SC.STATUS_ID=OH.orderkind
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = OH.clientcode collate Cyrillic_General_CI_AI
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC2 ON SC2.STATUS_ID=OH.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=OH.brend_id
        WHERE OH.record_id=@id
        ORDER BY OH.InsertedDate DESC
        `
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
        `
       SELECT TOP 200 OH.brend_id,OH.clientcode,OH.clorderno,clc.SPECODE,CLC.DEFINITION_,OH.device_id,OH.InsertedDate,OH.order_id,OH.orderkind,
        OH.promostatus,OH.record_id,OH.RouteType,OH.specode,OH.status,SC.COLOR ORDERKIND_COLOR,SC.NAME ORDERKIND_NAME, 
        SC2.COLOR STATUS_COLOR, SC2.NAME STATUS_NAME,SB.NAME BRAND_NAME FROM ${process.env.ORDER_HEAD_TABLE} OH
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERKIND_TABLE} SC ON SC.STATUS_ID=OH.orderkind
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = OH.clientcode collate Cyrillic_General_CI_AI
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC2 ON SC2.STATUS_ID=OH.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=OH.brend_id
        WHERE OH.status=@id
        ORDER BY OH.InsertedDate DESC
        `
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
        `select*from ${process.env.ORDER_LINES_TABLE} ol WITH (NOLOCK)
        left join ${process.env.DB_MAZARINA}..${process.env.ITEMS_TABLE} IT on ol.productref=IT.LOGICALREF
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
  getDelayedOrders,
};

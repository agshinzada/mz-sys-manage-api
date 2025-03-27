const { poolMobim, poolMazarina, poolSYS } = require("../../database");
const sql = require("mssql");

const getPayments = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().query(
      `
      Select PL.amount,PL.brend_id,PL.clientcode,CLC.SPECODE,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = PL.clientcode collate Cyrillic_General_CI_AI
        where PL.status = 0 
        order by PL.InsertedDate desc
      `
    );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getDelayedPayments = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().query(
      `Select PL.amount,PL.brend_id,PL.clientcode,CLC.SPECODE,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = PL.clientcode collate Cyrillic_General_CI_AI 
         where PL.status = 0 and DATEDIFF(MINUTE, PL.InsertedDate, GETDATE()) >= 6`
    );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getPaymentsByClientCode = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("client", sql.VarChar, data)
      .query(
        `
        Select TOP 200 PL.amount,PL.brend_id,PL.clientcode,CLC.SPECODE,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = PL.clientcode collate Cyrillic_General_CI_AI
        where PL.clientcode like @client
        order by PL.InsertedDate desc`
      );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};
const getPaymentsByOrderId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        `
       Select TOP 200 PL.amount,PL.brend_id,PL.clientcode,CLC.SPECODE,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = PL.clientcode collate Cyrillic_General_CI_AI
        where PL.order_id=@id
        order by PL.InsertedDate desc`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};
const getPaymentsByDeviceId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        `
         Select TOP 200 PL.amount,PL.brend_id,PL.clientcode,CLC.SPECODE,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = PL.clientcode collate Cyrillic_General_CI_AI
        where PL.device_id=@id
        order by PL.InsertedDate desc`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};
const getPaymentsByRecordId = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("id", sql.VarChar, data)
      .query(
        `
        Select TOP 200 PL.amount,PL.brend_id,PL.clientcode,CLC.SPECODE,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = PL.clientcode collate Cyrillic_General_CI_AI
        where PL.rec_id=@id
        order by PL.InsertedDate desc`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getPaymentsByStatus = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("value", sql.VarChar, data)
      .query(
        `
        Select TOP 200 PL.amount,PL.brend_id,PL.clientcode,CLC.SPECODE,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        LEFT JOIN ${process.env.DB_MAZARINA}..${process.env.CLCARD_TABLE} CLC ON CLC.CODE = PL.clientcode collate Cyrillic_General_CI_AI
        where PL.status=@value
        order by PL.InsertedDate desc`
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMobim.release();
  }
};

const getPaymentRemain = async (data) => {
  try {
    console.log(data);
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("to", sql.VarChar, data.date)
      .input("region", sql.VarChar, data.region)
      .query(
        `
       SELECT*FROM KASSA_QALIQ
        `
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const updatePaymentStatus = async (data) => {
  try {
    await poolMobim.connect();
    const result = await poolMobim
      .request()
      .input("code", sql.Int, data.status)
      .input("id", sql.Int, data.recordId).query(`
        BEGIN TRY
        update ${process.env.PAYMENT_LINES_TABLE} set status = @code where rec_i = @id
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
  getPayments,
  getPaymentsByClientCode,
  getPaymentsByDeviceId,
  getPaymentsByOrderId,
  getPaymentsByRecordId,
  getPaymentRemain,
  getDelayedPayments,
  getPaymentsByStatus,
  updatePaymentStatus,
};

const { poolMobim, poolMazarina } = require("../../database");
const sql = require("mssql");

const getPayments = async () => {
  try {
    await poolMobim.connect();
    const result = await poolMobim.request().query(
      `Select PL.amount,PL.brend_id,PL.clientcode,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
        where PL.status = 0 
        order by PL.InsertedDate desc`
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
      `Select PL.amount,PL.brend_id,PL.clientcode,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SB.NAME BRAND_NAME
         from ${process.env.PAYMENT_LINES_TABLE} PL
         LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id 
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
        Select top 50 PL.amount,PL.brend_id,PL.clientcode,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
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
        Select PL.amount,PL.brend_id,PL.clientcode,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
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
         Select top 50 PL.amount,PL.brend_id,PL.clientcode,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
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
        Select PL.amount,PL.brend_id,PL.clientcode,PL.device_id,PL.ficheref,PL.InsertedDate,PL.payment_id,
        PL.rec_i,PL.sign,PL.status,PL.trcode,SC.COLOR STATUS_COLOR,SC.NAME STATUS_NAME,SB.NAME BRAND_NAME
        from ${process.env.PAYMENT_LINES_TABLE} PL
        LEFT JOIN ${process.env.DB_SYS}..${process.env.ORDERSTATUS_TABLE} SC ON SC.STATUS_ID=PL.status
        LEFT JOIN ${process.env.DB_SYS}..${process.env.BRAND_TABLE} SB ON SB.SYS_ID=PL.brend_id
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

const getPaymentRemain = async (data) => {
  try {
    await poolMazarina.connect();
    const result = await poolMazarina
      .request()
      .input("to", sql.VarChar, data.date)
      .input("region", sql.VarChar, data.region)
      .query(
        `
        with cte 
as
(
SELECT sls.CODE,SLS.DEFINITION_,CPD.NAME bolge,DATE_,
(ISNULL((SELECT AMOUNT FROM LG_013_01_KSLINES WHERE LOGICALREF = KSL.LOGICALREF AND SIGN = 0 and TRCODE = '11' and ksl.LINEEXP not like '711.%'),0) ) AS PRIXOD,
(ISNULL((SELECT AMOUNT FROM LG_013_01_KSLINES  WHERE LOGICALREF = KSL.LOGICALREF AND SIGN = 1 and TRCODE = '74' and ksl.DOCODE not like '711.%' ),0) ) AS RASXOD --- Aciqlama 711 xaric ele
FROM MAZARINA2024..LG_013_KSCARD ks 
left join maindb..LG_SLSMAN sls on sls.CODE = ks.CODE and sls.FIRMNR = 13 AND SLS.ACTIVE = 0
left JOIN LG_013_01_KSLINES KSL ON KSL.CARDREF = KS.LOGICALREF 
left JOIN MAINDB..L_CAPIDIV CPD ON CPD.NR = SLS.SPECODE AND CPD.FIRMNR = 13
WHERE KS.ACTIVE = 0 and ksl.DATE_ BETWEEN '2024-01-01' AND @to AND CPD.NAME = @region
GROUP BY sls.CODE,SLS.DEFINITION_,CPD.NAME,ksl.DATE_,ksl.SIGN,ksl.TRCODE,KS.LOGICALREF,KSL.LOGICALREF,ksl.LINEEXP,ksl.SPECODE,ksl.DOCODE
)
 
select code AS RUT,DEFINITION_ AS ACIQLAMA,bolge AS BOLGE,
ROUND((SUM(PRIXOD) - SUM(RASXOD)),3) AS QALIQ from cte
GROUP BY code,DEFINITION_,bolge
having ROUND((SUM(PRIXOD) - SUM(RASXOD)),3) <> 0
and CODE not in ('0','15','16','17','18','19','20','31','909')
        `
      );
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
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
};

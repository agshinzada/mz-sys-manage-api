const { poolMain, poolMazarina } = require("../../database");
const sql = require("mssql");

const getRoutes = async () => {
  try {
    await poolMain.connect();
    const result = await poolMain.request()
      .query(`SELECT CODE value,DEFINITION_ label FROM ${process.env.SLSMAN_TABLE} WITH (NOLOCK) 
      WHERE FIRMNR=${process.env.DB_FIRMNR}`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMain.release();
  }
};

const createCodes = async (data) => {
  try {
    await poolMazarina.connect();
    let result;
    let codes = [];
    for (let index = 0; index < data.stickers.length; index++) {
      result = await poolMazarina
        .request()
        .input("brandCode", sql.VarChar, data.brandCode)
        .input("routeCode", sql.VarChar, data.routeCode)
        .input("brandId", sql.VarChar, data.brandId.toString()).query(`
        BEGIN TRY
        declare @brand varchar(10)
        declare @route varchar(10)
        declare @cyphcode varchar(10)
        set @brand = @brandCode
        set @route = @routeCode
        set @cyphcode = @brandId
        
        SELECT LOGICALREF, PARENTCLREF,CODE,DEFINITION_ AS NAME,LOWLEVELCODES1,LOWLEVELCODES2,LOWLEVELCODES3,
        TAXNR,ADDR1,CITY,CITYCODE,TELNRS1,TELNRS2,TRADINGGRP,TOWN,TOWNCODE,COUNTRYCODE, 
        SUBSTRING(CODE,1,4) REGION,
        SUBSTRING(CODE,10,2) CATEGORY,
        SUBSTRING(CODE,13,4) STICKER,
        @brand as BRAND,
        @route as ROUTE,
        @cyphcode as CYPHCODE
 
        FROM
        (
        SELECT 
        CL.LOGICALREF, CL.PARENTCLREF, DEFINITION_,
        (SELECT TOP 1 C.CODE FROM ${process.env.CLCARD_TABLE} C WHERE  C.PARENTCLREF=CL.LOGICALREF AND C.CODE LIKE '211%' AND C.ACTIVE=0) CODE,
        (SELECT MAX(C.LOWLEVELCODES1) FROM ${process.env.CLCARD_TABLE} C WHERE  C.PARENTCLREF=CL.LOGICALREF ) LOWLEVELCODES1,
        (SELECT MAX(C.LOWLEVELCODES2) FROM ${process.env.CLCARD_TABLE} C WHERE  C.PARENTCLREF=CL.LOGICALREF ) LOWLEVELCODES2,
        (SELECT MAX(C.LOWLEVELCODES3) FROM ${process.env.CLCARD_TABLE} C WHERE  C.PARENTCLREF=CL.LOGICALREF ) LOWLEVELCODES3,
        CL.TAXNR,CL.ADDR1,CL.CITY,CL.CITYCODE,CL.TELNRS1,CL.TELNRS2,CL.TRADINGGRP,CL.TOWN,CL.TOWNCODE,CL.COUNTRYCODE        
        FROM  ${process.env.CLCARD_TABLE} CL
        WHERE CL.CODE IN ('${data.stickers[index]}') AND ACTIVE=0
        ) X
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
      let temp;
      if (result.recordset.length > 0) {
        temp = result.recordset[0];
        temp.CODE = `${temp.REGION}.${temp.BRAND}.${temp.CATEGORY}.${temp.STICKER}`;
        codes.push(temp);
      }
    }
    return codes;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};
const checkClientCode = async (data) => {
  try {
    await poolMazarina.connect();
    let result;
    let obj = [];
    for (const iterator of data.codes) {
      result = await poolMazarina.request().input("code", sql.VarChar, iterator)
        .query(`
        BEGIN TRY
        SELECT 
(SELECT CODE FROM ${process.env.CLCARD_TABLE} WHERE LOGICALREF=B.PARENTCLREF) STICKER
,CODE FROM ${process.env.CLCARD_TABLE} B
          WHERE CODE = @code
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
      if (result.recordset.length > 0) {
        obj.push(result.recordset[0]);
      }
    }
    return obj;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};
const insertBulkClients = async (obj) => {
  try {
    await poolMazarina.connect();
    let bulkQuery = [];
    let query;
    for (const iterator of obj.data) {
      if (iterator.PARENTCLREF === 0) {
        iterator.LOWLEVELCODES2 += 1;
      } else {
        iterator.LOWLEVELCODES3 += 1;
      }
      bulkQuery.push(
        ` (   0,    3,    '${iterator.CODE}',    '${iterator.NAME}',    '${iterator.ROUTE}',    '${iterator.CYPHCODE}',    '${iterator.ADDR1}',    '',    '${iterator.CITY}',    'Azerbaijan',    '',    '${iterator.TELNRS1}',    '${iterator.TELNRS2}',    '',    '${iterator.TAXNR}',    '',    '',    0,    0,    0,   '',    '',    0,    '',    '',    0,    '',    0,    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    0,    0,    0,    1,    0,    '',    '${iterator.TRADINGGRP}',    ${obj.userRef},    GETDATE(),    DATEPART(HOUR,getdate()),    DATEPART(mi,getdate()),    DATEPART(ss,getdate()),    0,    NULL,    0,    0,    0,    0,    0,    0,    '',    0,    '',    '${iterator.TOWNCODE}',    '${iterator.TOWN}',    '',    '',    '${iterator.CITYCODE}',    'AZ',    0,    '',    '',    0,    '',    '',    0,    '',    '',    0,    '',    '',    0,    0,    0,    0,    0,    0,    0,    '',    1,    0,    '',    0,    '',    '',    0,    1,    0,    0,    0,    0,    0,    0,    0,    '',    '',    0,    0,    '',    0,    '',    '',    0,    ${iterator.LOGICALREF},    ${iterator.LOWLEVELCODES1},   ${iterator.LOWLEVELCODES2},    ${iterator.LOWLEVELCODES3},    0,    0,    0,    0,    0,    0,    0,    '',    '',    '',    1,    1,    1,    1,    1,    '',    0,    0,    0,    0,    0,    0,    0,    '',    '',    '',    '',    0,    '',    '',    0,    0,    0,    '',    '',    '',    '',    '',    '',    '',    0,    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    0,    0,    '',    '',    0,    '',    '',    '',    '',    '',    '',    '',    0,    0,    '',    '',    '',    '',    0,    0,    0,    0,    0,    '',    2,    '',    '',    '',    '',    '',    '',    '',    0,    0,    0,    134217752,    0,    0,    288817176,    0,    0,    0,    '',    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    0,    '',    '',    '',    '',    '',    '',    '',    '',    '',    '',    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    '',    '',    '',    0,    0,    0,    0,    '',    '',    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    '',    0,    '',    0,    '',    0,    '',    0,    0,    0,    '',    '',    '',    1,    0,    0,    0,    0,    0,    0,    0,    0,    0,    1,    0,    0,    0,    0,    0,    0,    '',    '',    0,    0,    0    )`
      );
    }
    query = ` INSERT INTO ${process.env.CLCARD_TABLE}
  (    ACTIVE,    CARDTYPE,    CODE,    DEFINITION_,    SPECODE,    CYPHCODE,    ADDR1,    ADDR2,    CITY,    COUNTRY,    POSTCODE,    TELNRS1,    TELNRS2,    FAXNR,    TAXNR,    TAXOFFICE,    INCHARGE,    DISCRATE,    EXTENREF,    PAYMENTREF,    EMAILADDR,    WEBADDR,    WARNMETHOD,    WARNEMAILADDR,    WARNFAXNR,    CLANGUAGE,    VATNR,    BLOCKED,    BANKBRANCHS1,    BANKBRANCHS2,    BANKBRANCHS3,    BANKBRANCHS4,    BANKBRANCHS5,    BANKBRANCHS6,    BANKBRANCHS7,    BANKACCOUNTS1,    BANKACCOUNTS2,    BANKACCOUNTS3,    BANKACCOUNTS4,    BANKACCOUNTS5,    BANKACCOUNTS6,    BANKACCOUNTS7,    DELIVERYMETHOD,    DELIVERYFIRM,    CCURRENCY,    TEXTINC,    SITEID,    RECSTATUS,    ORGLOGICREF,    EDINO,    TRADINGGRP,    CAPIBLOCK_CREATEDBY,    CAPIBLOCK_CREADEDDATE,    CAPIBLOCK_CREATEDHOUR,    CAPIBLOCK_CREATEDMIN,    CAPIBLOCK_CREATEDSEC,    CAPIBLOCK_MODIFIEDBY,    CAPIBLOCK_MODIFIEDDATE,    CAPIBLOCK_MODIFIEDHOUR,    CAPIBLOCK_MODIFIEDMIN,    CAPIBLOCK_MODIFIEDSEC,    PAYMENTPROC,    CRATEDIFFPROC,    WFSTATUS,    PPGROUPCODE,    PPGROUPREF,    TAXOFFCODE,    TOWNCODE,    TOWN,    DISTRICTCODE,    DISTRICT,    CITYCODE,    COUNTRYCODE,    ORDSENDMETHOD,    ORDSENDEMAILADDR,    ORDSENDFAXNR,    DSPSENDMETHOD,    DSPSENDEMAILADDR,    DSPSENDFAXNR,    INVSENDMETHOD,    INVSENDEMAILADDR,    INVSENDFAXNR,    SUBSCRIBERSTAT,    SUBSCRIBEREXT,    AUTOPAIDBANK,    PAYMENTTYPE,    LASTSENDREMLEV,    EXTACCESSFLAGS,    ORDSENDFORMAT,    DSPSENDFORMAT,    INVSENDFORMAT,    REMSENDFORMAT,    STORECREDITCARDNO,    CLORDFREQ,    ORDDAY,    LOGOID,    LIDCONFIRMED,    EXPREGNO,    EXPDOCNO,    EXPBUSTYPREF,    INVPRINTCNT,    PIECEORDINFLICT,    COLLECTINVOICING,    EBUSDATASENDTYPE,    INISTATUSFLAGS,    SLSORDERSTATUS,    SLSORDERPRICE,    LTRSENDMETHOD,    LTRSENDEMAILADDR,    LTRSENDFAXNR,    LTRSENDFORMAT,    IMAGEINC,    CELLPHONE,    SAMEITEMCODEUSE,    STATECODE,    STATENAME,    WFLOWCRDREF,    PARENTCLREF,    LOWLEVELCODES1,    LOWLEVELCODES2,    LOWLEVELCODES3,    LOWLEVELCODES4,    LOWLEVELCODES5,    LOWLEVELCODES6,    LOWLEVELCODES7,    LOWLEVELCODES8,    LOWLEVELCODES9,    LOWLEVELCODES10,    TELCODES1,    TELCODES2,    FAXCODE,    PURCHBRWS,    SALESBRWS,    IMPBRWS,    EXPBRWS,    FINBRWS,    ORGLOGOID,    ADDTOREFLIST,    TEXTREFTR,    TEXTREFEN,    ARPQUOTEINC,    CLCRM,    GRPFIRMNR,    CONSCODEREF,    SPECODE2,    SPECODE3,    SPECODE4,    SPECODE5,    OFFSENDMETHOD,    OFFSENDEMAILADDR,    OFFSENDFAXNR,    OFFSENDFORMAT,    EBANKNO,    LOANGRPCTRL,    BANKNAMES1,    BANKNAMES2,    BANKNAMES3,    BANKNAMES4,    BANKNAMES5,    BANKNAMES6,    BANKNAMES7,    LDXFIRMNR,    MAPID,    LONGITUDE,    LATITUTE,    CITYID,    TOWNID,    BANKIBANS1,    BANKIBANS2,    BANKIBANS3,    BANKIBANS4,    BANKIBANS5,    BANKIBANS6,    BANKIBANS7,    TCKNO,    ISPERSCOMP,    EXTSENDMETHOD,    EXTSENDEMAILADDR,    EXTSENDFAXNR,    EXTSENDFORMAT,    BANKBICS1,    BANKBICS2,    BANKBICS3,    BANKBICS4,    BANKBICS5,    BANKBICS6,    BANKBICS7,    CASHREF,    USEDINPERIODS,    INCHARGE2,    INCHARGE3,    EMAILADDR2,    EMAILADDR3,    RSKLIMCR,    RSKDUEDATECR,    RSKAGINGCR,    RSKAGINGDAY,    ACCEPTEINV,    EINVOICEID,    PROFILEID,    BANKBCURRENCY1,    BANKBCURRENCY2,    BANKBCURRENCY3,    BANKBCURRENCY4,    BANKBCURRENCY5,    BANKBCURRENCY6,    BANKBCURRENCY7,    PURCORDERSTATUS,    PURCORDERPRICE,    ISFOREIGN,    SHIPBEGTIME1,    SHIPBEGTIME2,    SHIPBEGTIME3,    SHIPENDTIME1,    SHIPENDTIME2,    SHIPENDTIME3,    DBSLIMIT1,    DBSLIMIT2,    DBSLIMIT3,    DBSLIMIT4,    DBSLIMIT5,    DBSLIMIT6,    DBSLIMIT7,    DBSTOTAL1,    DBSTOTAL2,    DBSTOTAL3,    DBSTOTAL4,    DBSTOTAL5,    DBSTOTAL6,    DBSTOTAL7,    DBSBANKNO1,    DBSBANKNO2,    DBSBANKNO3,    DBSBANKNO4,    DBSBANKNO5,    DBSBANKNO6,    DBSBANKNO7,    DBSRISKCNTRL1,    DBSRISKCNTRL2,    DBSRISKCNTRL3,    DBSRISKCNTRL4,    DBSRISKCNTRL5,    DBSRISKCNTRL6,    DBSRISKCNTRL7,    DBSBANKCURRENCY1,    DBSBANKCURRENCY2,    DBSBANKCURRENCY3,    DBSBANKCURRENCY4,    DBSBANKCURRENCY5,    DBSBANKCURRENCY6,    DBSBANKCURRENCY7,    BANKCORRPACC1,    BANKCORRPACC2,    BANKCORRPACC3,    BANKCORRPACC4,    BANKCORRPACC5,    BANKCORRPACC6,    BANKCORRPACC7,    BANKVOEN1,    BANKVOEN2,    BANKVOEN3,    BANKVOEN4,    BANKVOEN5,    BANKVOEN6,    BANKVOEN7,    EINVOICETYPE,    DEFINITION2,    TELEXTNUMS1,    TELEXTNUMS2,    FAXEXTNUM,    FACEBOOKURL,    TWITTERURL,    APPLEID,    SKYPEID,    GLOBALID,    GUID,    DUEDATECOUNT,    DUEDATELIMIT,    DUEDATETRACK,    DUEDATECONTROL1,    DUEDATECONTROL2,    DUEDATECONTROL3,    DUEDATECONTROL4,    DUEDATECONTROL5,    DUEDATECONTROL6,    DUEDATECONTROL7,    DUEDATECONTROL8,    DUEDATECONTROL9,    DUEDATECONTROL10,    DUEDATECONTROL11,    DUEDATECONTROL12,    DUEDATECONTROL13,    DUEDATECONTROL14,    DUEDATECONTROL15,    ADRESSNO,    POSTLABELCODE,    SENDERLABELCODE,    CLOSEDATECOUNT,    CLOSEDATETRACK,    DEGACTIVE,    DEGCURR,    NAME,    SURNAME,    LABELINFO,    DEFBNACCREF,    PROJECTREF,    DISCTYPE,    SENDMOD,    ISPERCURR,    CURRATETYPE,    INSTEADOFDESP,    EINVOICETYP,    FBSSENDMETHOD,    FBSSENDEMAILADDR,    FBSSENDFORMAT,    FBSSENDFAXNR,    FBASENDMETHOD,    FBASENDEMAILADDR,    FBASENDFORMAT,    FBASENDFAXNR,    SECTORMAINREF,    SECTORSUBREF,    PERSONELCOSTS,    EARCEMAILADDR1,    EARCEMAILADDR2,    EARCEMAILADDR3,    FACTORYDIVNR,    FACTORYNR,    ININVENNR,    OUTINVENNR,    QTYDEPDURATION,    QTYINDEPDURATION,    OVERLAPTYPE,    OVERLAPAMNT,    OVERLAPPERC,    BROKERCOMP,    CREATEWHFICHE,    EINVCUSTOM,    SUBCONT,    ORDPRIORITY,    ACCEPTEDESP,    PROFILEIDDESP,    LABELINFODESP,    POSTLABELCODEDESP,    SENDERLABELCODEDESP,    ACCEPTEINVPUBLIC,    PUBLICBNACCREF,    PAYMENTPROCBRANCH    )
  VALUES ${bulkQuery.toString()}`;

    const result = await poolMazarina.request().query(`
        BEGIN TRY
        ${query}
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
    result.recordset;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    poolMazarina.release();
  }
};

module.exports = {
  getRoutes,
  createCodes,
  checkClientCode,
  insertBulkClients,
};

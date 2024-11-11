const { poolMazarina } = require("../database");
const sql = require("mssql");

const getReportRetrification = async () => {
  try {
    await poolMazarina.connect();
    const result = await poolMazarina.request().query(
      `WITH DUZELIS AS (
    SELECT 
        CL.TRCODE,
        CF.TRANNO,
        CF.DATE_,
        CL.BRANCH,
        CL.DEPARTMENT,
        CL.SPECCODE,
        (SELECT TOP 1 SPECODE FROM maindb..LG_SLSMAN SL WHERE SL.CODE = CL.SPECCODE ORDER BY CAPIBLOCK_MODIFIEDDATE DESC) AS REGION_R,
        (SELECT TOP 1 CYPHCODE FROM LV_013_01_CLCARD CLC WHERE CLC.CODE = CF.CODE) AS BREND_R,
        (SELECT TOP 1 CODE FROM maindb..LG_SLSMAN SL WHERE SL.CODE = CL.SPECCODE ORDER BY CAPIBLOCK_MODIFIEDDATE DESC) AS REGION_CODE
    FROM 
        LV_013_01_CLFLINE CF
    JOIN 
        LG_013_01_CLFICHE CL ON CF.SOURCEFREF = CL.LOGICALREF
    WHERE 
        CF.TRCODE IN ('3', '4') AND CL.SPECCODE != '909'
),
cte2
as
(
 
SELECT 
    TRCODE FICHE_TYPE,
    TRANNO FICHENO,
    DATE_,
    CASE
        WHEN BRANCH = REGION_R THEN 0
        ELSE 1
    END AS REGION_STATUS,
    CASE
        WHEN DEPARTMENT = BREND_R THEN 0
        ELSE 1
    END AS BRAND_STATUS,
    CASE
        WHEN SPECCODE = REGION_CODE THEN 0
        ELSE 1
    END AS CODE_STATUS
 
FROM 
    DUZELIS
    
    )
 
 SELECT * FROM cte2 WHERE REGION_STATUS<>0 OR BRAND_STATUS<>0 OR CODE_STATUS<>0
 GROUP BY FICHE_TYPE,FICHENO,DATE_,REGION_STATUS,BRAND_STATUS,CODE_STATUS`
    );

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolMazarina.release();
  }
};

module.exports = {
  getReportRetrification,
};

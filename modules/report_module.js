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
        CAST(CL.BRANCH AS NVARCHAR(MAX)) AS BRANCH,  -- Ensure consistent type
        CAST(CL.DEPARTMENT AS NVARCHAR(MAX)) AS DEPARTMENT,  -- Ensure consistent type
        CAST(CL.SPECCODE AS NVARCHAR(MAX)) AS SPECCODE,  -- Ensure consistent type
        (SELECT TOP 1 SPECODE FROM maindb..LG_SLSMAN SL WHERE SL.CODE = CL.SPECCODE ORDER BY CAPIBLOCK_MODIFIEDDATE DESC) AS REGION_R,
        (SELECT TOP 1 CYPHCODE FROM LV_013_01_CLCARD CLC WHERE CLC.CODE = CF.CODE) AS BREND_R,
        (SELECT TOP 1 CODE FROM maindb..LG_SLSMAN SL WHERE SL.CODE = CL.SPECCODE ORDER BY CAPIBLOCK_MODIFIEDDATE DESC) AS REGION_CODE
    FROM 
        LV_013_01_CLFLINE CF
    JOIN 
        LG_013_01_CLFICHE CL ON CF.SOURCEFREF = CL.LOGICALREF
    WHERE 
        CF.TRCODE IN ('3', '4') AND CL.SPECCODE != '909' AND CF.TRANNO != '00005322' 
 
), 
cte2 AS (
    SELECT 
        TRCODE AS FICHE_TYPE,
        TRANNO AS FICHENO,
        DATE_,
        BRANCH, 
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
SELECT 
    BRANCH,
    FICHE_TYPE,
    FICHENO,
    DATE_,
    REGION_STATUS,
    BRAND_STATUS,
    CODE_STATUS
FROM 
    cte2 
WHERE 
    REGION_STATUS <> 0 OR BRAND_STATUS <> 0 OR CODE_STATUS <> 0
GROUP BY 
    FICHE_TYPE, FICHENO, DATE_, BRANCH, REGION_STATUS, BRAND_STATUS, CODE_STATUS;`
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

const { ClickHouse } = require('clickhouse');
const clickhouse = new ClickHouse({
    basicAuth: {
        username: 'default',
        password: 'dupadupa',
    },
    url: 'http://localhost',
    port: 8123
});
const { promisify } = require('util');
const {
    sample,
    random
} = require('lodash');
//const client = druid.Client

const teamIds = [
    2,
    9720,
    5058,
    819,
    2027,
    337,
    1610,
    16274,
    38,
    1390,
    339,
    5606,
    3615,
    611,
    745,
    43,
    5480,
    394,
    19381,
    3875,
    8161,
    3800,
    142,
    445,
    1257,
    155,
    681,
    5082,
    8623,
    5538,
    4612,
    1077,
    13198,
    7513,
    2945,
    975,
    18,
    121,
    2121,
    2360,
    7047,
    5034,
    447,
    2118,
    12860,
    14340,
    2002,
    10966,
    3525,
    10960,
    2221,
    412,
    6851,
    1410,
    7236,
    1532,
    8136,
    3779,
    2080,
    6026,
    3422,
    333,
    1792,
    4429,
    8129,
    1321,
    1354,
    2188,
    7895,
    7737,
    11522,
    9077,
    4470,
    2655,
    6634,
    2645,
    10815,
    11893,
    14353,
    1407,
    5780,
    6935,
    2992,
    10259,
    3861,
    7328,
    4,
    1934,
    17133,
    3097,
    454,
    6315,
    11811,
    1889,
    8128,
    8200,
    10529,
    11635,
    3,
    10017,
    872,
    456,
    769,
    2286,
    7565,
    10227,
    1268,
    1603,
    5654,
    1442,
    7884,
    1560,
    14310,
    818,
    2509,
    6694,
    12605,
    14203,
    5172,
    16109,
    11797,
    3499,
    4860,
    5944,
    13127,
    2077,
    2624,
    16689,
    3708,
    19286,
    7425,
    11948,
    13828,
    364,
    6800
];

const getQueryString = (teamId, startDate,endDate)=>{
    return `
        SELECT
          toDate(creationDateUnix) AS "__timestamp",
          sum(timeSpent) AS "timeSpent"
        FROM "statOptNew"
        WHERE 
           teamId = ${teamId}
          AND toDate(creationDateUnix) >= '${startDate}'
          AND toDate(creationDateUnix) <=  '${endDate}'
        GROUP BY toDate(creationDateUnix)
        ORDER BY 1 desc
        `
}
const makeQuery =  () => {

    const teamId = sample(teamIds);

    const startDate = Date.UTC(random(2019,2022), random(0,11), random(0,28));
    const endDate = startDate + 31536000000;


    const startDateStr = (new Date(startDate).toISOString()).slice(0,10);
    const endDateStr = (new Date(endDate).toISOString()).slice(0,10);
    const qs = getQueryString(teamId, startDateStr, endDateStr);
    console.log(startDateStr, endDateStr);

    const start = Date.now();
    const promise =  clickhouse.query(qs).toPromise().then(data=>{
        console.log(Date.now() - start, data.length);
    });


    return promise;
}


const startG = Date.now();
Promise.all([
    makeQuery(),
    makeQuery(),
    makeQuery(),
    makeQuery(),
    makeQuery()
]).then(d => {
    console.log('Global time')
    console.log(Date.now() - startG);
})



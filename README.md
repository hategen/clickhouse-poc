# clickhouse-poc

Conect to  CH using client
``clickhouse-client --host 'server' --user 'default' --password 'dupadupa'``

Basic script for loading  data  from Parquet 
Table structure must be created in advance
``` 
clickhouse-client --password="dupadupa" --query="TRUNCATE TABLE default.statOptJSONstr"
for FILENAME in /data/dataImport/statOptJSONstr/*.parquet; do
cat $FILENAME \
| clickhouse-client --password="dupadupa" \
--query="INSERT INTO statOptJSONstr FORMAT Parquet"
done
```

exporting to parquet  snippet
````
clickhouse-client --password="dupadupa" --query="SELECT statId, binDeviceId, binUserId, binSessionId, initial, containerId, stepId, creationDate, creationDateUnix, logged, toString(deviceType) deviceType, screenResolutionId, deviceMakeId, platformId, browserId, toString(actionType) actionType, languageId, statsUriId, referrerDomainId, referrerPathId, toString(statsDisplayType) statsDisplayType, folderId, groupId, countryId, timeSpent, guideLanguageId, knowledgeBaseId, toString(browserType) browserType, toString(platformType) platformType, isBillableGuideView, COALESCE(actionDetailStr,'{}'), teamId FROM statOptJSONstr FORMAT Parquet" > /data/dataImport/test.parquet
````
Small sql  for initial daa load and  handeling of nullables +  transforming  of delimited strings  to  a legitimate arrays +  added enums and delta coding for timestamps
````
DROP TABLE default.statOpt;
CREATE TABLE default.statOpt
(
    `statId` Nullable(UInt32) DEFAULT toUInt32(0),
    `followingstepid` Nullable(UInt32) DEFAULT toUInt32(0),
    `defaultLanguage` Nullable(String),
    `stepNextId` Nullable(UInt32) DEFAULT toUInt32(0),  
    `binDeviceId` Nullable(UInt32) DEFAULT toUInt32(0),
    `binUserId` Nullable(UInt32) DEFAULT toUInt32(0),
    `binSessionId` Nullable(UInt32) DEFAULT toUInt32(0),
    `initial` UInt8 DEFAULT toUInt8(0),
    `containerId` Nullable(UInt32) DEFAULT toUInt32(0),
    `stepId` Nullable(UInt32) DEFAULT toUInt32(0),
    `creationDate` UInt64 CODEC(DoubleDelta),
    `creationDateUnix` UInt64 CODEC(DoubleDelta),
    `logged` UInt8 DEFAULT toUInt8(0),
    `deviceType` Enum8('console' = 1,'embedded' = 2,'desktop' =3,'mobile' =4,'smarttv' =5,'tablet' =6,' wearable' =7) DEFAULT 'desktop',
    `screenResolutionId` Nullable(UInt32)  DEFAULT toUInt32(0),
    `deviceMakeId` Nullable(UInt32)  DEFAULT toUInt32(0),
    `platformId` Nullable(UInt32) DEFAULT toUInt32(0),
    `browserId` Nullable(UInt32) DEFAULT toUInt32(0),
    `actionType` Enum8('pageView' =1,'login' =2,'choice' =3 ,'goToNewRequest' =4,'SessionInfoRequest' =5,'openIntercom' =6,'openZendeskChat' =7,'openFrontChat' =8,'kbView' =9,'openFreshChat' =10,'openHelpshift' =11,'openLiveChat'=12,'openCrispChat'=13,'openHubspotChat'=14,'openGorgiasChat'=15,'specialStepAction'=16,'checklistItemCompleted'=17,'checklistCompleted'=18,'checklistSkipped'=19),
    `languageId` Nullable(UInt32) DEFAULT toUInt32(0),
    `statsUriId` Nullable(UInt32) DEFAULT toUInt32(0),
    `referrerDomainId` Nullable(UInt32) DEFAULT toUInt32(0),
    `referrerPathId` Nullable(UInt32) DEFAULT toUInt32(0),
    `statsDisplayType` Enum8('direct'=1,'embed'=2,'widget'=3),
    `folderId` Nullable(UInt32) DEFAULT toUInt32(0),
    `groupId` Nullable(String),
    `countryId` Nullable(UInt16) DEFAULT toUInt16(0),
    `timeSpent` Nullable(Float64) DEFAULT toFloat64(0),
    `guideLanguageId` Nullable(UInt16) DEFAULT toUInt16(0),
    `knowledgeBaseId` Nullable(UInt32) DEFAULT toUInt32(0),
    `browserType` Enum8('Chrome' =1,'Safari' =2,'Firefox' =3,'Edge' =4,'IE' =5,'Opera' =6 ,'Other' =7),
    `platformType` Enum8('Windows' =1,'Mac OS' =2,'iOS' =3,'Android' =4,'Linux' =5,'Chromium OS' =6,'Other' =7),
    `isBillableGuideView` UInt8  DEFAULT toUInt8(0),
    `teamId` Nullable(UInt32)  DEFAULT toUInt8(0)
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(toDate(creationDateUnix))
ORDER BY (creationDateUnix)
SETTINGS index_granularity = 8192;




DROP TABLE default.statOptNew;
CREATE TABLE default.statOptNew
(
    `statId` UInt32 DEFAULT toUInt32(0),
    `followingstepid` UInt32 DEFAULT toUInt32(0),
    `defaultLanguage` LowCardinality(String),
    `stepNextId` UInt32 DEFAULT toUInt32(0),  
    `binDeviceId` UInt32 DEFAULT toUInt32(0),
    `binUserId` UInt32 DEFAULT toUInt32(0),
    `binSessionId` UInt32 DEFAULT toUInt32(0),
    `initial` UInt8 DEFAULT toUInt8(0),
    `containerId` UInt32 DEFAULT toUInt32(0),
    `stepId` UInt32 DEFAULT toUInt32(0),
    `creationDate` UInt64 CODEC(DoubleDelta),
    `creationDateUnix` UInt64 CODEC(DoubleDelta),
    `logged` UInt8 DEFAULT toUInt8(0),
    `deviceType` Enum8('console' = 1,'embedded' = 2,'desktop' =3,'mobile' =4,'smarttv' =5,'tablet' =6,' wearable' =7) DEFAULT 'desktop',
    `screenResolutionId` UInt32  DEFAULT toUInt32(0),
    `deviceMakeId` UInt32  DEFAULT toUInt32(0),
    `platformId` UInt32 DEFAULT toUInt32(0),
    `browserId` UInt32 DEFAULT toUInt32(0),
    `actionType` Enum8('pageView' =1,'login' =2,'choice' =3 ,'goToNewRequest' =4,'SessionInfoRequest' =5,'openIntercom' =6,'openZendeskChat' =7,'openFrontChat' =8,'kbView' =9,'openFreshChat' =10,'openHelpshift' =11,'openLiveChat'=12,'openCrispChat'=13,'openHubspotChat'=14,'openGorgiasChat'=15,'specialStepAction'=16,'checklistItemCompleted'=17,'checklistCompleted'=18,'checklistSkipped'=19),
    `languageId` UInt32 DEFAULT toUInt32(0),
    `statsUriId` UInt32 DEFAULT toUInt32(0),
    `referrerDomainId` UInt32 DEFAULT toUInt32(0),
    `referrerPathId` UInt32 DEFAULT toUInt32(0),
    `statsDisplayType` Enum8('direct'=1,'embed'=2,'widget'=3),
    `folderId` UInt32 DEFAULT toUInt32(0),
    `groupId` Array(UInt32),
    `countryId` UInt16 DEFAULT toUInt16(0),
    `timeSpent` Float64 DEFAULT toFloat64(0),
    `guideLanguageId` UInt16 DEFAULT toUInt16(0),
    `knowledgeBaseId` UInt32 DEFAULT toUInt32(0),
    `browserType` Enum8('Chrome' =1,'Safari' =2,'Firefox' =3,'Edge' =4,'IE' =5,'Opera' =6 ,'Other' =7),
    `platformType` Enum8('Windows' =1,'Mac OS' =2,'iOS' =3,'Android' =4,'Linux' =5,'Chromium OS' =6,'Other' =7),
    `isBillableGuideView` UInt8  DEFAULT toUInt8(0),
    `teamId` UInt32  DEFAULT toUInt8(0)
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(toDate(creationDateUnix))
ORDER BY (teamId, creationDateUnix)
SETTINGS index_granularity = 8192;


truncate table statOptNew
INSERT
	INTO
	statOptNew (
	statId, 
	followingstepid,
	defaultLanguage,
	stepNextId,
	binDeviceId,
	binUserId,
	binSessionId,
	initial,
	containerId,
	stepId,
	creationDate,
	creationDateUnix,
	logged,
	deviceType,
	screenResolutionId,
	deviceMakeId,
	platformId,
	browserId,
	actionType,
	languageId,
	statsUriId,
	referrerDomainId,
	referrerPathId,
	statsDisplayType,
	folderId,
	groupId,
	countryId,
	timeSpent,
	guideLanguageId,
	knowledgeBaseId,
	browserType,
	platformType,
	isBillableGuideView,
	teamId)
select 
	statId, 
	COALESCE(followingstepid, toUInt32(0)),
	COALESCE(defaultLanguage, 'none' ),
	COALESCE(stepNextId, toUInt32(0) ),
	COALESCE(binDeviceId, toUInt32(0) ),
	COALESCE(binUserId, toUInt32(0) ),
	COALESCE(binSessionId, toUInt32(0) ),
	initial,
	COALESCE(containerId, toUInt32(0) ),
	COALESCE(stepId, toUInt32(0) ),
	creationDate,
	creationDateUnix,
	logged,
	deviceType,
	screenResolutionId,
	deviceMakeId,
	platformId,
	browserId,
	actionType,
	languageId,
	statsUriId,
	referrerDomainId,
	referrerPathId,
	statsDisplayType,
	COALESCE(folderId, toUInt32(0)),
	arrayFilter( x -> x!= 0, arrayMap(x ->  toUInt32OrZero(x) , splitByChar(',', COALESCE (groupId,'')) )) groupId,
	COALESCE(countryId, toUInt32(0) ),
	COALESCE(timeSpent, toUInt32(0) ),
	COALESCE(guideLanguageId, toUInt32(0) ),
	COALESCE(knowledgeBaseId, toUInt32(0) ),
	COALESCE(browserType, toUInt32(0) ),
	COALESCE(platformType, toUInt32(0) ),
	isBillableGuideView,
	COALESCE(teamId, toUInt32(0))
from 
	statOpt 
````

test of aggregate 

````
 CREATE table statBounceRateOptCh(
        `eventDate` date CODEC(DoubleDelta, ZSTD(1)),
    	`bounced`  UInt8 DEFAULT toUInt8(0),
    	`notBounced` UInt8 DEFAULT toUInt8(0),
    	`total` UInt32,
    	`containerId` UInt32 DEFAULT toUInt32(0),
    	`deviceType` Enum8('console' = 1,'embedded' = 2,'desktop' =3,'mobile' =4,'smarttv' =5,'tablet' =6,' wearable' =7) DEFAULT 'desktop',
    	`guideLanguageId` UInt16 DEFAULT toUInt16(0),
    	`referrerDomainId` UInt32 DEFAULT toUInt32(0),
	    `referrerPathId` UInt32 DEFAULT toUInt32(0),
	    `statsDisplayType` Enum8('direct'=1,'embed'=2,'widget'=3),
	    `groupId` Array(UInt32),
	    `folderId` UInt32 DEFAULT toUInt32(0),
	    `countryId` UInt16 DEFAULT toUInt16(0),
	    `knowledgeBaseId` UInt32 DEFAULT toUInt32(0),
	    `browserType` Enum8('Chrome' =1,'Safari' =2,'Firefox' =3,'Edge' =4,'IE' =5,'Opera' =6 ,'Other' =7),
	    `platformType` Enum8('Windows' =1,'Mac OS' =2,'iOS' =3,'Android' =4,'Linux' =5,'Chromium OS' =6,'Other' =7),
	    `teamId` UInt32  DEFAULT toUInt8(0)   
   ) ENGINE = MergeTree
	PARTITION BY toYYYYMM(eventDate)
	ORDER BY (teamId, eventDate)
	SETTINGS index_granularity = 8192
   	AS  WITH bounce_raw AS (
    SELECT
    	toDate(creationDateUnix) eventDate,
    	binUserId,
    	binSessionId ,
    	MIN(creationDateUnix),
    	COUNT(1) AS counter,
    	CASE
    		WHEN count(*) = 1 THEN 1
    		ELSE 0
    	END AS bounces,
    	containerId ,
    	deviceType ,
    	guideLanguageId,
    	referrerDomainId,
    	referrerPathId ,
    	statsDisplayType,
    	groupId,
    	folderId ,
    	countryId,
    	knowledgeBaseId,
        browserType,
        platformType,
        teamId
    FROM
    	statOptNew
    WHERE
      containerId IS NOT NULL
      AND stepId IS NOT NULL
    GROUP BY
    	toDate(creationDateUnix),
    	binUserId,
    	binSessionId,
    	containerId ,
    	deviceType ,
    	guideLanguageId,
    	referrerDomainId,
    	referrerPathId ,
    	statsDisplayType,
    	groupId,
    	folderId ,
    	countryId,
    	knowledgeBaseId,
        browserType,
        platformType,
        teamId)
    SELECT
    	eventDate,
    	COUNT(IF(bounces = 1, 1, NULL)) bounced,
    	COUNT(IF(bounces = 0, 1, NULL)) notBounced,
    	COUNT(bounces) total,
    	containerId ,
    	deviceType ,
    	guideLanguageId,
    	referrerDomainId,
    	referrerPathId ,
    	statsDisplayType,
    	groupId,
    	folderId ,
    	countryId,
    	knowledgeBaseId,
        browserType,
        platformType,
        teamId
    FROM bounce_raw
    GROUP BY
    	eventDate,
    	containerId,
    	deviceType ,
    	guideLanguageId,
    	referrerDomainId,
    	referrerPathId ,
    	statsDisplayType,
    	groupId,
    	folderId ,
    	countryId,
    	knowledgeBaseId,
        browserType,
        platformType,
        teamId
        
````

For  adding things like step titles, guide titles  and  choice titles we can use Dictionaries 
There are tons of options  one of those options is  EXTERNAL dictionary  - basically  cached representation of MySql  table.Dictionaries  might refresh   automatically 

MySql DDL
````
drop table  ch_dictionary  
truncate ch_dictionary

     CREATE TABLE ch_dictionary as 
      SELECT
        c.guideId  guideId,
        s.stepId,
 		coalesce(json_extract(st.content, concat('$.', c.options->>'$.defaultLanguage', '.title')),'Untitled')stepTitle,
        coalesce(json_extract(c.title, concat('$.', c.options->>'$.defaultLanguage', '.title')), 'Untitled') guideTitle     
      FROM
        step s
        JOIN guide c ON c.guideId = s.guideId
        JOIN stepModule st ON st.stepId = s.stepId AND st.type = 'CONTENT'
      WHERE
        1=1
        AND s.pending = 0
        AND st.deleted = 0
````

CH DDL
````
CREATE OR REPLACE DICTIONARY default.guideTitles 
(
    guideId Int64,
    stepId Int64,
    stepTitle String,
    guideTitle String
)
PRIMARY KEY stepId
LIFETIME(360)
LAYOUT(HASHED())
SOURCE(MYSQL(
    port 3306
   XX user 'XXX'
    password 'XXXX'
    replica(host 'stonly-prod-encrypted-replica-1.c4whvz8aw4y4.eu-west-3.rds.amazonaws.com' priority 1)
    db 'StonlyProd'
    table 'ch_dictionary'
    invalidate_query 'SQL_QUERY'
    fail_on_connection_loss 'true'
))
````
Usage  example 
````
select 
    dictGetOrNull('guideTitles', 'stepTitle', stepId) stepTitle,  
	so.*	
from  
	statOpt so
where 
	so.stepId > 1
````
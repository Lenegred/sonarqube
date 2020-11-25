CREATE TABLE "ISSUE_CHANGES"(
    "UUID" VARCHAR(40) NOT NULL,
    "KEE" VARCHAR(50),
    "ISSUE_KEY" VARCHAR(50) NOT NULL,
    "USER_LOGIN" VARCHAR(255),
    "CHANGE_TYPE" VARCHAR(20),
    "CHANGE_DATA" CLOB,
    "CREATED_AT" BIGINT,
    "UPDATED_AT" BIGINT,
    "ISSUE_CHANGE_CREATION_DATE" BIGINT,
    "PROJECT_UUID" VARCHAR(50)
);

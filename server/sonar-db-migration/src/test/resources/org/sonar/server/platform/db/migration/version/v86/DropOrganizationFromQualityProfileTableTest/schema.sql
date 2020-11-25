CREATE TABLE "ORG_QPROFILES"(
    "UUID" VARCHAR(255) NOT NULL,
    "ORGANIZATION_UUID" VARCHAR(40) NOT NULL,
    "RULES_PROFILE_UUID" VARCHAR(255) NOT NULL,
    "PARENT_UUID" VARCHAR(255),
    "LAST_USED" BIGINT,
    "USER_UPDATED_AT" BIGINT,
    "CREATED_AT" BIGINT NOT NULL,
    "UPDATED_AT" BIGINT NOT NULL
);
ALTER TABLE "ORG_QPROFILES" ADD CONSTRAINT "PK_ORG_QPROFILES" PRIMARY KEY("UUID");
CREATE INDEX "QPROFILES_RP_UUID" ON "ORG_QPROFILES"("RULES_PROFILE_UUID");
CREATE INDEX "ORG_QPROFILES_PARENT_UUID" ON "ORG_QPROFILES"("PARENT_UUID");

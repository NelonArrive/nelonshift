-- changeset nelonshift:001-init-schema

-- ENUM: project_status
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('ACTIVE', 'COMPLETED', 'PLANNED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- TABLE: projects
CREATE TABLE IF NOT EXISTS projects (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    status              project_status NOT NULL,
    start_date          DATE,
    end_date            DATE,
    target_shift_count  INTEGER,
    user_id             UUID NOT NULL REFERENCES users(id),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- TABLE: shifts
CREATE TABLE IF NOT EXISTS shifts (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT NOT NULL REFERENCES projects(id),
    date            DATE NOT NULL,
    start_time      TIME,
    end_time        TIME,
    hours           INTEGER NOT NULL,
    base_pay        NUMERIC(10,2),
    overtime_hours  INTEGER,
    overtime_pay    NUMERIC(10,2),
    per_diem        NUMERIC(10,2),
    compensation    NUMERIC(10,2) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- INDEXES
DO $$ BEGIN
    CREATE UNIQUE INDEX idx_users_email ON users(email);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_projects_user_id ON projects(user_id);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_projects_status ON projects(status);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_shifts_project_id ON shifts(project_id);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_shifts_date ON shifts(date);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_shifts_project_date ON shifts(project_id, date);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

// Types
import type { PreparedQueryConfig } from 'drizzle-orm/sqlite-core';
import type { SQLitePreparedQuery } from 'drizzle-orm/sqlite-core';

// Utils
import { eq, sql } from 'drizzle-orm';

// Database
import db from '$lib/server/database';
import { Team } from '$models/team'; // Renamed from Account
import { User } from '$models/user';

// SELECT * FROM teams
export const getTeams = db.query.Team.findMany(); // Renamed from Account

export const getTeamsQuery: SQLitePreparedQuery<PreparedQueryConfig> = getTeams.prepare();
export type GetTeams = Awaited<ReturnType<typeof getTeams.execute>>;

// SELECT * FROM teams WHERE id = ?
export const getTeamById = db.query.Team.findFirst({
  // Renamed from Account
  where: eq(Team.id, sql.placeholder('id'))
});

export const getTeamByIdQuery: SQLitePreparedQuery<PreparedQueryConfig> = getTeamById.prepare();
export type GetTeamById = Awaited<ReturnType<typeof getTeamById.execute>>;

// SELECT * FROM teams WHERE public_id = ?
export const getTeamByPublicId = db.query.Team.findFirst({
  // Renamed from Account
  where: eq(Team.publicId, sql.placeholder('publicId'))
});

export const getTeamByPublicIdQuery: SQLitePreparedQuery<PreparedQueryConfig> = getTeamByPublicId.prepare();
export type GetTeamByPublicId = Awaited<ReturnType<typeof getTeamByPublicId.execute>>;

// SELECT * FROM teams WHERE name = ?
const getTeamByName = db.query.Team.findFirst({
  // Renamed from Account
  where: eq(Team.name, sql.placeholder('name'))
});

export const getTeamByNameQuery: SQLitePreparedQuery<PreparedQueryConfig> = getTeamByName.prepare();
export type GetTeamByName = Awaited<ReturnType<typeof getTeamByName.execute>>;

// SELECT * FROM teams public_id = ? WITH Relations
const getTeamByPublicIdWithRelations = db.query.Team.findFirst({
  // Renamed from Account
  where: eq(Team.publicId, sql.placeholder('publicId')),
  with: {
    members: {
      // Relation name is still members as defined in TeamRelations
      with: {
        user: true
      },
      orderBy: (members, { desc }) => [desc(members.joinedAt)]
    },
    invites: true
  }
});

export const getTeamByPublicIdWithRelationsQuery: SQLitePreparedQuery<PreparedQueryConfig> =
  getTeamByPublicIdWithRelations.prepare();
export type GetTeamByPublicIdWithRelations = Awaited<ReturnType<typeof getTeamByPublicIdWithRelations.execute>>;

// SELECT teams for a given user id (previously getAccountsByUserId)
export const getTeamsByUserId = db.query.User.findFirst({
  // Querying through User to get their teams
  where: eq(User.id, sql.placeholder('id')),
  columns: {},
  with: {
    userTeams: {
      // Updated relation name from userAccounts to userTeams (will need to update in User model)
      columns: {},
      with: {
        team: {
          // Updated from account to team
          with: {
            members: {
              with: {
                user: true
              }
            },
            invites: true
          }
        }
      }
    }
  }
});

export const getTeamsByUserIdQuery: SQLitePreparedQuery<PreparedQueryConfig> = getTeamsByUserId.prepare();
export type GetTeamsByUserId = Awaited<ReturnType<typeof getTeamsByUserId.execute>>;

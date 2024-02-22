# Changelog

## 4.2

- Migrated to NextJS App router
- Updated design of /me

## 4.1.2

- Filter non playing players
- Sort years on /me

## 4.1.1

- Minor style adjustments

## 4.1

- New design for presentation mode

## 4.0.2

- Re-brand to Awards Night

## 4.0.1

- Bug fixes

## 4.0.0

- Replace Airtable with Prisma + PostgreSQL.

## 3.8.5

- Activate Typescript Strict

## 3.8.4

- Sort categories alphabetically

## 3.8.3

- Add log in link to start page
- Fix bug when adding movies without release date

## 3.8.2

Fix start page responsiveness.

## 3.8.1

Fix start page typos.

## 3.8

New start page.

## 3.7.3

- Fix bug when adding a movie by search in admin interface.

## 3.7.2

- Fix bug when a user doesn't belong to a group.

## 3.7.1

- Fix MUI props leak.

## 3.7

### Group functionality

- All users now belong to one (and only one) group.
- A user only sees the bets from other players in the same group.

## 3.6.1

Fix bug in server side rendering of MUI.

## 3.6

Update Material UI (now MUI) to version 5.

## 3.5

### Admin interface

- Now a card to search and add movies by name.

## 3.4.1

- Set category as decided when marking winners.
- Correctly mark bets as wrong when category is decided.

## 3.4

Restore admin interface for marking winners, with support for all years.

## 3.3.3

Refactoring. Upgraded to Next 11.

## 3.3.2

Bug-fix with imdb-id in Admin interface.

## 3.3.1

Admin actions now trigger deploy.

## 3.3.0

### Admin interface

- Admin HOC to restrict access
- Form for adding a movie via IMDb ID
- Form for adding nominations

## 3.2.0

### Support for different years.

Both presentation mode and user betting now has an added level, years. Betting can be done on `/me/:year`, and a list of available years can be found on `/me`. Presentation mode for the years can be found at `/:year`.

## 3.1.0

### User authentication via Auth0.

Users can now sign in via Auth0 instead of going to hashed url.

## 3.0.0

NextJS + Airtable version.

## 2.0.0

React version

## 1.0.0

Google sheets version.

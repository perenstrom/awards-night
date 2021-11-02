# Changelog

## 3.6
Update Material UI (now MUI) to version 5.

## 3.5
### Admin interface
* Now a card to search and add movies by name.

## 3.4.1
* Set category as decided when marking winners.
* Correctly mark bets as wrong when category is decided.

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
* Admin HOC to restrict access
* Form for adding a movie via IMDb ID
* Form for adding nominations

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
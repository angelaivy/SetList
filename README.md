# Proof of concept UPDATE (week 8)

I have all requirements for the final done. It's currently deployed to railway.
I will be working on the front end and final polish for my presentation.

# SetList

A REST API for tracking artists you want to see live and logging concerts you've attended, with real-time event discovery powered by the Ticketmaster API.

## Project proposal and breakdown

1. **Context / Subject Matter**: Concert Tracker & Wishlist API — a music/entertainment app that lets users track artists they want to see live and log shows they've attended.
2. **Problem It Solves**: Music fans have no centralized place to manage their concert life. They lose track of artists they want to see, forget shows they've attended, and miss out on upcoming events. This API solves that by giving users a personal concert hub — save artists to a wishlist, discover upcoming shows via Ticketmaster, and maintain an attended show log.

3.**Technical Components:**

- Framework: Express.js + MongoDB/Mongoose
- Auth: JWT-based registration and login
- External API: Ticketmaster Discovery API (free tier) — used to fetch upcoming events by artist
- Two CRUD resource sets:
  - Artists — users save artists they want to see (name, genre, notes, etc.)
  - Shows — users log shows as "wishlist" or "attended" (artist, venue, date, rating, notes)
- Indexes: unique compound index on user+artist to prevent duplicates; text index on artist name for search
- Text search: search your saved artists by name or genre
- Aggregation: stats endpoint — total shows attended, favorite venue, shows per year, average rating

4. **How I will meet the various project requirements:**

| Requirement                    | How                                                      |
| ------------------------------ | -------------------------------------------------------- |
| Express API                    | Core framework for all routes                            |
| Authentication & Authorization | JWT login; all routes protected by middleware            |
| 2 CRUD route sets              | `/artists` & `/shows`                                    |
| Indexes                        | Text index on artist name, unique index on user + artist |
| Text search/Aggregation/lookup | Artist name text search on the artists route             |
| External API                   | Ticketmaster Discovery API                               |
| 80%+ test coverage             | Jest for all routes                                      |
| Demo                           | Saved Postman collection                                 |

**Stretch goals**: show stats aggregation, simple front end

5.** Timeline**

| Week    | Phase                     | Goals                                                                                                    |
| ------- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| Week 5  | Brainstorm                | Project idea selected                                                                                    |
| Week 6  | Proposal due              | Finalize README proposal, setup Github Repo, Express boilerplate, deployment connections, start on tests |
| Week 7  | Build                     | Auth routes (register/login/JWT middleware), /artists CRUD routes + All Jest tests                       |
| Week 8  | Prototype due             | /shows CRUD routes, Ticketmaster integration, text search, indexes                                       |
| Week 9  | Polish                    | Push test coverage past 80%, build Postman collection                                                    |
| Week 10 | Submission & Presentation | Final polish, stretch goals if time, prep for presentation                                               |

As I code, deploy often and run linting/formatting often.

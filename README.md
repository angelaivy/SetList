# SetList

A REST API for tracking artists you want to see live and logging concerts you've attended, with real-time event discovery powered by the Ticketmaster API.

See the deployed site at https://setlist-production-89e3.up.railway.app/

Environment secrets sent by bitwarden link via teams message.

To run backend:
- add secrets to .env
- npm install 
- npm run dev
- testing: npm test
- test coverage: npm run cover 

To run frontend:
- cd set-list
- npm install
- npm run dev

## Project proposal and breakdown

1. **Context / Subject Matter**: Concert Tracker & Wishlist API — a music/entertainment app that lets users track artists they want to see live and log shows they've attended.
2. **Problem It Solves**: Music fans have no centralized place to manage their concert life. They lose track of artists they want to see, forget shows they've attended, and miss out on upcoming events. This API solves that by giving users a personal concert hub — save concerts to a wishlist, discover upcoming shows via Ticketmaster, and maintain an attended show log.

3.**Technical Components:**

- Framework: Express.js + MongoDB/Mongoose
- Auth: JWT-based registration and login
- External API: Ticketmaster Discovery API (free tier) — used to fetch upcoming events by artist
- Two CRUD resource sets:
  - Artists — users save artists they want to see, can mark as favorite (name, genre, notes, favorite etc.)
  - Shows — users log shows as "wishlist" or "attended" (artist, venue, date, rating, notes)
- Indexes: index on user for performance
- Text search: search your saved artists by name or genre, or show name or venue

4. **How I will meet the various project requirements:**

| Requirement                    | How                                                      |
| ------------------------------ | -------------------------------------------------------- |
| Express API                    | Core framework for all routes                            |
| Authentication & Authorization | JWT login; all routes protected by middleware            |
| 2 CRUD route sets              | `/artist` & `/show`                                      |
| Indexes                        | Performance index on userId                              |
| Text search/Aggregation/lookup | Text index on Artist name, genre / show name, venue      |
| External API                   | Ticketmaster Discovery API                               |
| 80%+ test coverage             | Jest for all routes                                      |
| Demo                           | Front End built in React                                 |

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